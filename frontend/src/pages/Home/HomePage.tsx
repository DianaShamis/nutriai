import { Link, useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import { getToken, setToken } from "../../api/client";
import { getProfileStartRoute } from "../Profile/profileStorage";

// ВАЖНО: положи изображения сюда (пути/имена можешь поменять под свои файлы):
import heroImg from "../../assets/home/hero.jpg";

import step1Img from "../../assets/home/step-1.jpg";
import step2Img from "../../assets/home/step-2.jpg";
import step3Img from "../../assets/home/step-3.jpg";

import plan1Img from "../../assets/home/plan-1.jpg";
import plan2Img from "../../assets/home/plan-2.jpg";
import plan3Img from "../../assets/home/plan-3.jpg";
import plan4Img from "../../assets/home/plan-4.jpg";

export default function HomePage() {
  const nav = useNavigate();
  const token = getToken();

  function onStart() {
    if (!token) nav("/auth");
    else nav(getProfileStartRoute());
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
        <div className={styles.logo}>
          <div className={styles.logoMark} aria-hidden="true"> </div>
          <span className={styles.logoText}>NutriAI</span>
        </div>

          <nav className={styles.nav}>
            <a href="#home">Главная</a>
            {token ? <Link to="/my-plan">План питания</Link> : <a href="#plans">План питания</a>}
            <Link to="/about">О сервисе</Link>
            <a href="#ai">Рекомендации AI</a>
          </nav>

          <div className={styles.headerRight}>
            {token ? (
              <button className={styles.logoutBtn} onClick={() => {setToken(null); nav("/");}}>
                Выйти
              </button>
            ) : (
              <Link className={styles.loginLink} to="/auth">
                Войти
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className={styles.hero}>
        <img className={styles.heroBgImg} src={heroImg} alt="" />

        <div className={styles.heroInner}>
          <div className={styles.heroCard}>
            <h1 className={styles.heroTitle}>
              Не завтра
              <br />
              Начни сегодня
            </h1>

            <p className={styles.heroText}>
              Наш AI‑помощник создаст для тебя индивидуальный рацион, учитывая цели,
              предпочтения и ограничения
            </p>

            <button className={styles.heroBtn} onClick={onStart}>
              Начать
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Как это работает</h2>

        <div className={styles.grid3}>
          <article className={styles.stepCard}>
            <img className={styles.cardImg} src={step1Img} alt="" />
            <p className={styles.stepText}>Введите данные — рост, вес, цели и т.д.</p>
          </article>

          <article className={styles.stepCard}>
            <img className={styles.cardImg} src={step2Img} alt="" />
            <p className={styles.stepText}>AI анализирует информацию</p>
          </article>

          <article className={styles.stepCard}>
            <img className={styles.cardImg} src={step3Img} alt="" />
            <p className={styles.stepText}>Получите персональный план питания</p>
          </article>
        </div>
      </section>

      {/* Menu variants */}
      <section id="plans" className={styles.section}>
        <h2 className={styles.sectionTitle}>Варианты меню</h2>

        <div className={styles.grid4}>
          <article className={styles.planCard}>
            <img className={styles.planImg} src={plan1Img} alt="" />
            <div className={styles.planBody}>
              <h3>Для занятых</h3>
              <p>Быстро, просто, полезно</p>
              <a className={styles.planLink} href="#plans">
                Выбрать план
              </a>
            </div>
          </article>

          <article className={styles.planCard}>
            <img className={styles.planImg} src={plan2Img} alt="" />
            <div className={styles.planBody}>
              <h3>Похудение</h3>
              <p>Лёгкие блюда, меньше калорий</p>
              <a className={styles.planLink} href="#plans">
                Выбрать план
              </a>
            </div>
          </article>

          <article className={styles.planCard}>
            <img className={styles.planImg} src={plan3Img} alt="" />
            <div className={styles.planBody}>
              <h3>Набор массы</h3>
              <p>Белок, энергия, рост</p>
              <a className={styles.planLink} href="#plans">
                Выбрать план
              </a>
            </div>
          </article>

          <article className={styles.planCard}>
            <img className={styles.planImg} src={plan4Img} alt="" />
            <div className={styles.planBody}>
              <h3>Вегетарианство</h3>
              <p>Без мяса, много зелени</p>
              <a className={styles.planLink} href="#plans">
                Выбрать план
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>NutriAI.</div>
          </div>

          <div className={styles.footerCol}>
            <div className={styles.footerTitle}>Ссылки</div>
            <a href="#home">Главная</a>
            <a href="#plans">Варианты меню</a>
          </div>

          <div className={styles.footerCol}>
            <div className={styles.footerTitle}>&nbsp;</div>
            <Link to="/about">О сервисе</Link>
            <a href="#ai">Рекомендации AI</a>
          </div>

          <div className={styles.footerCol}>
            <div className={styles.footerTitle}>Новости</div>
            <div className={styles.subscribeRow}>
              <input
                className={styles.subscribeInput}
                placeholder="Введите свой Email адрес"
              />
              <button className={styles.subscribeBtn}>подписаться</button>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>2026 NutriAI. Все права защищены</div>
      </footer>
    </div>
  );
}