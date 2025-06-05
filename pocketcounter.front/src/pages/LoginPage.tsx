import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface ErrorResponse {
  code: string;
  message: string;
  type: number;
}

interface LoginResponse {
  result: string;
  errors: ErrorResponse[];
  timeGenerated: string;
}

const TOKEN_KEY = 'authToken';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Проверяем токен при монтировании компонента
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    setIsAuthenticated(!!token);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5067/account/login', {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        const errorCode = data.errors[0]?.code;
        switch (errorCode) {
          case 'user.not.found':
            setError('Пользователь не найден');
            break;
          case 'user.fail':
            setError('Неверный пароль');
            break;
          default:
            setError('Ошибка авторизации');
        }
        return;
      }

      // Сохраняем токен в localStorage и обновляем состояние
      localStorage.setItem(TOKEN_KEY, data.result);
      setIsAuthenticated(true);
      setEmail('');
      setPassword('');
      // Можно раскомментировать, если хотите редирект:
      navigate('/');
    } catch {
      setError('Ошибка сети или сервера');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  };

  // Если уже авторизован — показываем сообщение и кнопку "Выйти"
  if (isAuthenticated) {
    return (
      <div className="container d-flex align-items-center justify-content-center min-vh-100">
        <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="mb-4 text-center">Вы авторизовались</h2>
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>
    );
  }

  // Если не авторизован — показываем форму логина
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="mb-4 text-center">Авторизация</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Выполняется вход...' : 'Войти'}
          </button>
          
          <div className="mt-3 text-center">
            Нет аккаунта?{' '}
            <Link to="/register" className="link-primary">
              Зарегистрируйтесь
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;