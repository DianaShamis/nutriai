import { useState } from "react";
import { apiPost } from "../../api/client";
import styles from "./form.module.css";
import { isValidEmail } from "../../utils/validators";

type UserPublic = { id: number; email: string };

function mapRegisterError(msg: string) {
  const lower = msg.toLowerCase();

  if (lower.includes("already exists") || lower.includes("существ")) {
    return "Пользователь с такой почтой уже существует";
  }
  return msg;
}

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [bannerErr, setBannerErr] = useState<string | null>(null);
  const [bannerOk, setBannerOk] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    setEmailErr(null);
    setPassErr(null);
    setBannerErr(null);
    setBannerOk(null);

    const e = email.trim();
    const p = password;
    let ok = true;

    if (!e || !p) {
      setBannerErr("Все поля должны быть заполнены");
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
      const user = await apiPost<UserPublic>("/auth/register", {
        email: email.trim(),
        password,
      });
      setBannerOk(`Аккаунт создан: ${user.email}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Register failed";
      setBannerErr(mapRegisterError(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {bannerErr && <div className={styles.bannerError}>{bannerErr}</div>}
      {bannerOk && <div className={styles.bannerOk}>{bannerOk}</div>}

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
        {loading ? "Создаём..." : "Создать аккаунт"}
      </button>
    </form>
  );
}