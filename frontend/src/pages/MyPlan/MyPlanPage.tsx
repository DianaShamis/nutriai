import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getToken, setToken } from "../../api/client";
import homeStyles from "../Home/home.module.css";
import styles from "./myPlan.module.css";
import { isStep1Completed, isStep2Completed } from "../Profile/profileStorage";
import { addWeightEntry, getWeightTrackingData, setWeightGoal } from "../../api/weight";

const mockRecommendations = [
  "Старайтесь добавлять овощи минимум в 2 приёма пищи ежедневно.",
  "Соблюдайте водный режим: 6-8 стаканов воды в течение дня.",
  "Добавьте 20-30 минут прогулки после ужина для стабильного прогресса.",
];

const mockMealPlan = [
  { day: "День 1", meals: { Завтрак: "Овсянка с ягодами", Обед: "Курица с гречкой", Ужин: "Рыба и салат" } },
  { day: "День 2", meals: { Завтрак: "Творог и фрукты", Обед: "Индейка и рис", Ужин: "Омлет и овощи" } },
  { day: "День 3", meals: { Завтрак: "Йогурт и гранола", Обед: "Суп и тост", Ужин: "Запечённая курица" } },
  { day: "День 4", meals: { Завтрак: "Сырники", Обед: "Паста с тунцом", Ужин: "Салат с киноа" } },
  { day: "День 5", meals: { Завтрак: "Яйца и цельнозерновой хлеб", Обед: "Филе рыбы и булгур", Ужин: "Тушёные овощи" } },
  { day: "День 6", meals: { Завтрак: "Смузи и орехи", Обед: "Говядина и картофель", Ужин: "Тёплый салат" } },
  { day: "День 7", meals: { Завтрак: "Панкейки с бананом", Обед: "Куриный суп", Ужин: "Лосось и брокколи" } },
];

const today = new Date().toISOString().slice(0, 10);

export default function MyPlanPage() {
  const nav = useNavigate();
  const token = getToken();
  const [activeDay, setActiveDay] = useState(0);
  const [entries, setEntries] = useState<Array<{ date: string; weight: number }>>([]);
  const [goal, setGoal] = useState<string>("");
  const [entryDate, setEntryDate] = useState(today);
  const [entryWeight, setEntryWeight] = useState("");

  useEffect(() => {
    void (async () => {
      const data = await getWeightTrackingData();
      setEntries(data.entries);
      setGoal(data.goal ? String(data.goal) : "");
    })();
  }, []);

  if (!token) return <Navigate to="/auth" replace />;
  if (!isStep1Completed()) return <Navigate to="/profile/step1" replace />;
  if (!isStep2Completed()) return <Navigate to="/profile/step2" replace />;

  async function onAddEntry(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(entryWeight);
    if (!entryDate || !Number.isFinite(parsed) || parsed <= 0) return;
    const data = await addWeightEntry({ date: entryDate, weight: parsed });
    setEntries(data.entries);
    setEntryWeight("");
  }

  async function onSaveGoal(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(goal);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    const data = await setWeightGoal(parsed);
    setEntries(data.entries);
    setGoal(data.goal ? String(data.goal) : "");
  }

  const chartData = entries.map((item) => ({
    date: item.date.slice(5),
    weight: item.weight,
  }));

  const selectedDay = mockMealPlan[activeDay];

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

      <main className={styles.content}>
        <section className={styles.card}>
          <h1 className={styles.sectionTitle}>Мой план</h1>
          <ul className={styles.recommendations}>
            {mockRecommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>План питания на 7 дней</h2>
          <div className={styles.dayTabs}>
            {mockMealPlan.map((day, index) => (
              <button
                key={day.day}
                className={`${styles.tab} ${index === activeDay ? styles.tabActive : ""}`}
                onClick={() => setActiveDay(index)}
                type="button"
              >
                {day.day}
              </button>
            ))}
          </div>

          <div className={styles.mealGrid}>
            {Object.entries(selectedDay.meals).map(([mealType, mealText]) => (
              <article key={mealType} className={styles.mealItem}>
                <h3 className={styles.mealType}>{mealType}</h3>
                <p className={styles.mealText}>{mealText}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Отслеживание веса</h2>
          <div className={styles.weightGrid}>
            <div>
              <form className={styles.form} onSubmit={onAddEntry}>
                <label className={styles.label}>
                  Дата
                  <input
                    className={styles.input}
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                  />
                </label>
                <label className={styles.label}>
                  Вес (кг)
                  <input
                    className={styles.input}
                    type="number"
                    min="1"
                    step="0.1"
                    value={entryWeight}
                    onChange={(e) => setEntryWeight(e.target.value)}
                    placeholder="Например, 67.4"
                  />
                </label>
                <button className={styles.btn} type="submit">
                  Добавить запись
                </button>
              </form>

              <form className={styles.form} onSubmit={onSaveGoal}>
                <div className={styles.goalRow}>
                  <label className={styles.label}>
                    Целевой вес (кг)
                    <input
                      className={styles.input}
                      type="number"
                      min="1"
                      step="0.1"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                    />
                  </label>
                  <button className={styles.btn} type="submit">
                    Сохранить цель
                  </button>
                </div>
              </form>
              <p className={styles.hint}>
                Данные сохраняются через API, при недоступности сервера используется localStorage.
              </p>
            </div>

            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#b08a2a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
