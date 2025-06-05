import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const TOKEN_KEY = "authToken";

export default function Header() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const closeNavbar = () => {
    const navbar = document.getElementById("navbarNav");
    if (navbar && navbar.classList.contains("show")) {
      navbar.classList.remove("show");
    }
  };

  // Проверяем наличие токена при монтировании и при изменении токена
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    setIsAuthenticated(!!token);
    // Можно добавить слушатель storage, если нужно реагировать на выход из других вкладок
  }, []);

  // Функция для выхода
  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
    navigate("/login");
  };

  // Функция для входа
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          {/* Логотип или название сайта */}
          <a className="navbar-brand" href="/">
            PocketCounter
          </a>
          {/* Кнопка для мобильного меню */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* Меню и кнопка авторизации */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/products" onClick={closeNavbar}>
                  Товары
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/orders" onClick={closeNavbar}>
                  Заказы
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/customers"
                  onClick={closeNavbar}
                >
                  Заказчики
                </Link>
              </li>
            </ul>
            <form className="d-flex">
              {isAuthenticated ? (
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  onClick={() => {
                    handleLogin();
                    closeNavbar();
                  }}
                >
                  Выйти
                </button>
              ) : (
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={handleLogin}
                >
                  Войти
                </button>
              )}
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
}
