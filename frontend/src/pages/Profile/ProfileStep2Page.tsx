import { Link, Navigate, useNavigate } from "react-router-dom";
import { getToken, setToken } from "../../api/client";
import { useState } from "react";
import homeStyles from "../Home/home.module.css";
import styles from "./profile.module.css";
import { getStep2Data, isStep1Completed, saveStep2Data } from "./profileStorage";

export default function ProfileStep2Page() {
  const nav = useNavigate();
  const token = getToken();
  const initial = getStep2Data();

  const [goal, setGoal] = useState(initial.goal);
  const [activity, setActivity] = useState(initial.activity);
  const [allergies, setAllergies] = useState(initial.allergies);

  if (!token) return <Navigate to="/auth" replace />;
  if (!isStep1Completed()) return <Navigate to="/profile/step1" replace />;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveStep2Data({ goal: goal.trim(), activity: activity.trim(), allergies: allergies.trim() });
    nav("/my-plan");
  }

  return (
    <div className={homeStyles.page}>
      <header className={homeStyles.header}>
        <div className={homeStyles.headerInner}>
          <div className={homeStyles.logo}>
            <div className={homeStyles.logoMark} aria-hidden="true"></div>
            <span className={homeStyles.logoText}>NutriAI</span>
          </div>
          <nav className={homeStyles.nav}>
            <Link to="/">Главная</Link>
            <Link to="/my-plan">Мой план</Link>
            <Link to="/about">О сервисе</Link>
          </nav>
          <div className={homeStyles.headerRight}>
            <button
              className={homeStyles.logoutBtn}
              onClick={() => {
                setToken(null);
                nav("/");
              }}
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className={styles.pageWrap}>
        <section className={styles.panel}>
          <h1 className={styles.title}>Профиль · Шаг 2</h1>
          <p className={styles.subtitle}>Уточните цели и привычки питания.</p>

          <form className={styles.form} onSubmit={onSubmit}>
            <label className={styles.label}>
              Цель
              <select className={styles.select} required value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="">Выберите цель</option>
                <option value="lose">Снижение веса</option>
                <option value="maintain">Поддержание веса</option>
                <option value="gain">Набор массы</option>
              </select>
            </label>

            <label className={styles.label}>
              Уровень активности
              <select
                className={styles.select}
                required
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              >
                <option value="">Выберите активность</option>
                <option value="low">Низкая</option>
                <option value="medium">Средняя</option>
                <option value="high">Высокая</option>
              </select>
            </label>

            <label className={styles.label}>
              Ограничения / аллергии
              <textarea
                className={styles.textarea}
                placeholder="Например: без молока, без глютена"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              />
            </label>

            <div className={styles.actions}>
              <Link to="/profile/step1" className={styles.btnGhost}>
                Назад
              </Link>
              <button className={styles.btn} type="submit">
                Перейти в «Мой план»
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
