import { useState } from "react";
import { apiPost, setToken } from "../../api/client";
import { useNavigate } from "react-router-dom";
import styles from "./form.module.css";
import { isValidEmail } from "../../utils/validators";

type TokenResponse = { access_token: string; token_type: string };

function mapLoginError(msg: string) {
  const lower = msg.toLowerCase();

  // подстрахуемся под разные формулировки
  if (lower.includes("invalid") || lower.includes("неверн")) {
    return "Неверный логин или пароль";
  }
  return msg;
}

export default function LoginForm() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [banner, setBanner] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    setEmailErr(null);
    setPassErr(null);
    setBanner(null);

    const e = email.trim();
    const p = password;

    let ok = true;

    if (!e || !p) {
      setBanner("Все поля должны быть заполнены");
      ok = false;
    }

    if (e && !isValidEmail(e)) {
      setEmailErr("Неверный формат почты");
      ok = false;
    }

    if (p && p.length < 6) {
      setPassErr("Пароль должен быть не короче 6 символов");
      ok = false;
    }

    return ok;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await apiPost<TokenResponse>("/auth/login", {
        email: email.trim(),
        password,
      });
      setToken(data.access_token);
      nav("/", { replace: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Login failed";
      setBanner(mapLoginError(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {banner && <div className={styles.bannerError}>{banner}</div>}

      <label className={styles.label}>
        Почта
        <input
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      {emailErr && <div className={styles.fieldError}>{emailErr}</div>}

      <label className={styles.label}>
        Пароль
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {passErr && <div className={styles.fieldError}>{passErr}</div>}

      <button className={styles.submit} disabled={loading}>
        {loading ? "Входим..." : "Авторизоваться"}
      </button>
    </form>
  );
}