import { Link, Navigate, useNavigate } from "react-router-dom";
import { getToken, setToken } from "../../api/client";
import { useState } from "react";
import homeStyles from "../Home/home.module.css";
import styles from "./profile.module.css";
import { getStep1Data, saveStep1Data } from "./profileStorage";

export default function ProfileStep1Page() {
  const nav = useNavigate();
  const token = getToken();
  const initial = getStep1Data();

  const [age, setAge] = useState(initial.age);
  const [height, setHeight] = useState(initial.height);
  const [weight, setWeight] = useState(initial.weight);

  if (!token) return <Navigate to="/auth" replace />;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveStep1Data({ age: age.trim(), height: height.trim(), weight: weight.trim() });
    nav("/profile/step2");
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
          <h1 className={styles.title}>Профиль · Шаг 1</h1>
          <p className={styles.subtitle}>Заполните базовые данные, чтобы сформировать персональный план.</p>

          <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.row}>
              <label className={styles.label}>
                Возраст
                <input
                  className={styles.input}
                  required
                  inputMode="numeric"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>
              <label className={styles.label}>
                Рост (см)
                <input
                  className={styles.input}
                  required
                  inputMode="decimal"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </label>
              <label className={styles.label}>
                Вес (кг)
                <input
                  className={styles.input}
                  required
                  inputMode="decimal"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </label>
            </div>

            <div className={styles.actions}>
              <Link to="/" className={styles.btnGhost}>
                На главную
              </Link>
              <button className={styles.btn} type="submit">
                Далее
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
