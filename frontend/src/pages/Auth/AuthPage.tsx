import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "./auth.module.css";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <img
          className={styles.image}
          src="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1200&q=80"
          alt="food"
        />
      </div>

      <div className={styles.right}>
        <div className={styles.panel}>
          <div className={styles.formBox}>
            <h2 className={styles.title}>
            {mode === "login" ? "Войдите в свой аккаунт" : "Создайте аккаунт"}
            </h2>
            <p className={styles.subtitle}>
            Узнайте актуальные рекомендации для вашего питания
            </p>
            <button className={styles.googleBtn} disabled>
            Продолжить с Google
            </button>

            <div className={styles.divider}>
            <span>или {mode === "login" ? "войдите" : "зарегистрируйтесь"} через Email</span>
            </div>
            {mode === "login" ? <LoginForm /> : <RegisterForm />}
              <div className={styles.bottomText}>
              {mode === "login" ? (
                <>
                Ещё не зарегистрированы?{" "}
                <button className={styles.linkBtn} onClick={() => setMode("register")}>
                Создать аккаунт
                </button>
                </>
              ) : (
                <>
                Уже есть аккаунт?{" "}
                <button className={styles.linkBtn} onClick={() => setMode("login")}>
                  Войти
                </button>
              </>
            )}
          </div>
          </div>
        </div>
      </div>
        </div>
  );
}