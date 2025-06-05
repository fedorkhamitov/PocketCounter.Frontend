import React, { useState } from "react";

type LoginFormProps = {
  apiUrl: string; // URL вашего API, например: "https://example.com/api/login"
};

const LoginForm: React.FC<LoginFormProps> = ({ apiUrl }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Неверный email или пароль");
      }

      const data = await response.json();
      // Предполагаем, что токен приходит в поле "token"
      const token = data.token as string;
      localStorage.setItem("jwt", token);

      // Здесь можно сделать редирект или обновить состояние приложения
      alert("Успешная авторизация!");
    } catch (err: any) {
      setError(err.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "0 auto" }}>
      <h2>Вход</h2>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Пароль</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Вход..." : "Войти"}
      </button>
    </form>
  );
};

export default LoginForm;
