export default function Error404() {
  return (
    <>
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center">
          <h1 className="display-1 fw-bold text-primary">404</h1>
          <p className="fs-3">
            <span className="text-danger">Упс!</span> Страница не найдена.
          </p>
          <p className="lead">
            Запрошенная страница не существует или была перемещена.
          </p>
          <a href="/" className="btn btn-primary">
            На главную
          </a>
        </div>
      </div>
    </>
  );
}
