import type { Order, Customer } from "../../types";

interface OrderListProps {
  orders: Order[];
  customers: Customer[];
  onOrderClick: (order: Order) => void;
}

const statusLabels: Record<string, string> = {
  CreatedOnly: "Новый",
  Completed: "Готов к отправке",
  Reserved: "Бронь",
  PartlyReserved: "Частичная бронь",
  Deferred: "Готов отложен",
  Shipped: "Отправлен",
};

const OrderList: React.FC<OrderListProps> = ({
  orders,
  customers,
  onOrderClick,
}) => {
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return (
      date.toLocaleDateString("ru-RU") + " " + date.toLocaleTimeString("ru-RU")
    );
  };

  const getCustomerFullName = (customerId: string): string => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return "Неизвестный клиент";
    const { familyName, firstName, patronymic } = customer.name;
    return `${familyName} ${firstName} ${patronymic}`;
  };

  return (
    <ul className="list-group">
      {orders.length === 0 ? (
        <li className="list-group-item text-center text-muted">Нет заказов</li>
      ) : (
        [...orders]
        .sort((a, b) => b.serialNumber - a.serialNumber)
        .map((order) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-center mb-2"
            style={{ cursor: "pointer" }}
            key={order.id}
            onClick={() => onOrderClick(order)}
          >
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                {/* serialNumber как цветной бейдж */}
                <span className="badge bg-warning text-dark fs-6 px-2 py-1">
                  #{order.serialNumber}
                </span>
                {/* Город только если Архангельск или Северодвинск */}
                {(order.address.city === "Архангельск" ||
                  order.address.city === "Северодвинск") && (
                  <span className="fw-bold">{order.address.city}</span>
                )}
              </div>

              <div className="small text-secondary">
                {getCustomerFullName(order.customerId)}
              </div>
              <div className="small text-muted">
                {formatDateTime(order.createDateTime)}
              </div>
            </div>

            <div className="text-end">
              {/* totalPrice как зелёный бейдж */}
              <div>
                <span className="badge bg-success mb-1">
                  {order.totalPrice.toLocaleString("ru-RU", {
                    style: "currency",
                    currency: "RUB",
                  })}
                </span>
              </div>
              <div>
                <span className="badge bg-info mb-1">
                  {statusLabels[order.status] ?? order.status}
                </span>
              </div>
              <span
                className={`badge ${order.isPaid ? "bg-primary" : "bg-danger"}`}
              >
                {order.isPaid ? "Оплачен" : "Не оплачен"}
              </span>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default OrderList;
