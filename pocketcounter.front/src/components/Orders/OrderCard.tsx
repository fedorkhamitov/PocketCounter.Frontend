import type { Order, Product, Customer } from "../../types";

interface OrderCardProps {
  order: Order;
  products: Product[];
  customer: Customer | undefined;
  onBack: () => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const statusLabels: Record<string, string> = {
  CreatedOnly: "Новый",
  Completed: "Собран и готов к отправке",
  PartiallyCompleted: "На доукомплектации",
  Deferred: "Отправка отложена",
  Shipped: "Отправлен",
};

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return (
    date.toLocaleDateString("ru-RU") + " " + date.toLocaleTimeString("ru-RU")
  );
};

const formatAddress = (address: Order["address"]) => {
  const hasMainFields =
    address.city || address.streetName || address.streetNumber || address.apartment;
  if (hasMainFields) {
    return [
      address.zipCode,
      address.country,
      address.state,
      address.city,
      address.streetName,
      address.streetNumber,
      address.apartment ? `кв. ${address.apartment}` : undefined,
    ]
      .filter(Boolean)
      .join(", ");
  } else {
    return address.specialAddressString;
  }
};

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  products,
  customer,
  onBack,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="container mt-4">
      <button className="btn btn-light mb-3" onClick={onBack}>
        ← Назад к списку
      </button>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">
            Заказ <span className="badge bg-warning text-dark">#{order.serialNumber}</span>
          </h5>
          <div className="mb-2 text-muted">
            <strong>Дата и время заказа:</strong> {formatDateTime(order.createDateTime)}
          </div>
          <div className="mb-2">
            <strong>Статус:</strong>{" "}
            <span className="badge bg-info">
              {statusLabels[order.status] ?? order.status}
            </span>
            {" "}
            <span className={`badge ${order.isPaid ? "bg-primary" : "bg-danger"}`}>
              {order.isPaid ? "Оплачен" : "Не оплачен"}
            </span>
          </div>
          <div className="mb-2">
            <strong>Стоимость:</strong>{" "}
            <span className="badge bg-success">
              {order.totalPrice.toLocaleString("ru-RU", {
                style: "currency",
                currency: "RUB",
              })}
            </span>
          </div>
          <div className="mb-2">
            <strong>Заказчик:</strong>{" "}
            {customer
              ? `${customer.name.familyName} ${customer.name.firstName} ${customer.name.patronymic}, тел. ${customer.phoneNumber}`
              : "Неизвестный заказчик"}
          </div>
          <div className="mb-2">
            <strong>Адрес:</strong> {formatAddress(order.address)}
          </div>
          {order.comment && (
            <div className="mb-2">
              <strong>Комментарий:</strong> {order.comment}
            </div>
          )}
          <div className="mb-3">
            <strong>Товары:</strong>
            <ul className="list-group mt-2">
              {order.cartLines.length === 0 ? (
                <li className="list-group-item text-muted">Нет товаров</li>
              ) : (
                order.cartLines.map((line, idx) => {
                  const product = products.find((p) => p.id === line.productId);
                  return (
                    <li key={line.productId + idx} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        {product ? product.title : "Неизвестный товар"}
                        {product && (
                          <span className="text-muted ms-2" style={{ fontSize: "0.9em" }}>
                            (Артикул: {product.sku})
                          </span>
                        )}
                      </span>
                      <span className="badge bg-secondary">
                        {line.quantity} шт.
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-warning" onClick={() => onEdit(order)}>
              Редактировать
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(order)}>
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;