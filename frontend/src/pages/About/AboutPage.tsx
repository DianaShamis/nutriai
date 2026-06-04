import { Link, useNavigate } from "react-router-dom";
import { getToken, setToken } from "../../api/client";
import { getProfileStartRoute } from "../Profile/profileStorage";

import homeStyles from "../Home/home.module.css"; // берем стили шапки+hero с главной
import styles from "./about.module.css";

// hero-картинку используем ту же, что и на главной
import heroImg from "../../assets/home/hero.jpg";

// картинки блока "О сервисе" (добавь эти файлы в assets/about)
import aboutUserImg from "../../assets/about/about-user.jpg";
import aboutAiImg from "../../assets/about/about-ai.jpg";

export default function AboutPage() {
  const nav = useNavigate();
  const token = getToken();

  function onStart() {
    if (!token) nav("/auth");
    else nav(getProfileStartRoute());
  }

  return (
    <div className={homeStyles.page}>
      {/* Header (такой же как на главной) */}
      <header className={homeStyles.header}>
        <div className={homeStyles.headerInner}>
          <div className={homeStyles.logo}>
            <div className={homeStyles.logoMark} aria-hidden="true"></div>
            <span className={homeStyles.logoText}>NutriAI</span>
          </div>

          {/* ВАЖНО: тут ссылки уже на страницы */}
          <nav className={homeStyles.nav}>
            <Link to="/">Главная</Link>
            <a href="#plans">План питания</a>
            <Link to="/about">О сервисе</Link>
            <a href="#ai">Рекомендации AI</a>
          </nav>

          <div className={homeStyles.headerRight}>
            {token ? (
              <button
                className={homeStyles.logoutBtn}
                onClick={() => {
                  setToken(null);
                  nav("/");
                }}
              >
                Выйти
              </button>
            ) : (
              <Link className={homeStyles.loginLink} to="/auth">
                Войти
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero (такой же как на главной) */}
      <section className={homeStyles.hero}>
        <img className={homeStyles.heroBgImg} src={heroImg} alt="" />

        <div className={homeStyles.heroInner}>
          <div className={homeStyles.heroCard}>
            <h1 className={homeStyles.heroTitle}>
              Не завтра
              <br />
              Начни сегодня
            </h1>

            <p className={homeStyles.heroText}>
              Наш AI‑помощник создаст для тебя индивидуальный рацион, учитывая цели,
              предпочтения и ограничения
            </p>

            <button className={homeStyles.heroBtn} onClick={onStart}>
              Начать
            </button>
          </div>
        </div>
      </section>

      {/* Контент "О сервисе" */}
      <section className={styles.aboutSection}>
        <h2 className={styles.title}>О СЕРВИСЕ</h2>

        <div className={styles.columns}>
          <div className={styles.col}>
            <h3 className={styles.colTitle}>ДЛЯ ПОЛЬЗОВАТЕЛЕЙ</h3>
            <p className={styles.text}>
              NutriAI — это интеллектуальный сервис, который помогает сформировать
              персональный план питания с учётом индивидуальных параметров пользователя.
              Система анализирует возраст, рост, вес, уровень активности и цели, чтобы
              предложить оптимальный рацион на каждый день.
            </p>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>НА ОСНОВЕ ИСКУССТВЕННОГО ИНТЕЛЛЕКТА</h3>
            <p className={styles.text}>
              В основе NutriAI лежат алгоритмы искусственного интеллекта, которые
              адаптируют рекомендации под каждого пользователя. Система учитывает
              предпочтения в еде, ограничения по продуктам и динамику изменений, чтобы
              постоянно улучшать предлагаемые планы питания.
            </p>
          </div>
        </div>

        <div className={styles.imagesRow}>
          <img className={styles.aboutImg} src={aboutUserImg} alt="" />
          <img className={styles.aboutImg} src={aboutAiImg} alt="" />
        </div>
      </section>

      {/* Footer (можно позже вынести в общий компонент, пока копируем как есть) */}
      <footer className={homeStyles.footer}>
        <div className={homeStyles.footerInner}>
          <div className={homeStyles.footerBrand}>
            <div className={homeStyles.footerLogo}>NutriAI.</div>
          </div>

          <div className={homeStyles.footerCol}>
            <div className={homeStyles.footerTitle}>Ссылки</div>
            <Link to="/">Главная</Link>
            <a href="#plans">Варианты меню</a>
          </div>

          <div className={homeStyles.footerCol}>
            <div className={homeStyles.footerTitle}>&nbsp;</div>
            <Link to="/about">О сервисе</Link>
            <a href="#ai">Рекомендации AI</a>
          </div>

          <div className={homeStyles.footerCol}>
            <div className={homeStyles.footerTitle}>Новости</div>
            <div className={homeStyles.subscribeRow}>
              <input
                className={homeStyles.subscribeInput}
                placeholder="Введите свой Email адрес"
              />
              <button className={homeStyles.subscribeBtn}>подписаться</button>
            </div>
          </div>
        </div>

        <div className={homeStyles.footerBottom}>
          2026 NutriAI. Все права защищены
        </div>
      </footer>
    </div>
  );
}