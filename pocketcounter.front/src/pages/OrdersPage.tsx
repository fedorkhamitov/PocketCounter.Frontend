import { useEffect, useState } from "react";
import type { CartLine, Customer, Order, Product } from "../types";
import {
  fetchCustomers,
  fetchOrders,
  fetchProducts /*updateProductQuantities*/,
} from "../api";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import OrderList from "../components/Orders/OrdersList";
import { ErrorAlert } from "../components/ErrorAlert";
import OrderCard from "../components/Orders/OrderCard";
import EditOrderForm from "../components/Orders/EditOrderForm";
import { updateOrderCartLines, updateOrderStatus } from "../api";

const OrdersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchCustomers()
      .then((data) => {
        if (!data) throw new Error("Нет данных");
        setCustomers(data);
      })
      .catch(() => setError("Ошибка при загрузке заказчиков"));
  }, []);

  useEffect(() => {
    fetchOrders()
      .then((data) => setOrders(data.result.items))
      .catch((err) => {
        setError("Ошибка при загрузке продуктов");
        if (err.message.includes("401") || err.message.includes("403")) {
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data.result.items))
      .catch((err) => {
        setError("Ошибка при загрузке продуктов");
        if (err.message.includes("401") || err.message.includes("403")) {
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
  };

  const handleDelete = (order: Order) => {
    alert(`Удаление заказа №${order.serialNumber} (id: ${order.id})`);
  };

  const handleSaveStatus = async (newStatus: number, isPaid: boolean) => {
    try {
      await updateOrderStatus(selectedOrder!.customerId, selectedOrder!.id, {
        status: newStatus,
        isPaid: isPaid,
      });
      window.location.href = "/orders";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    }
  };

  const handleSaveCartLines = async (data: {
    cartLinesDtoForAdd: CartLine[] | null;
    cartLinesDtoForRemove: CartLine[] | null;
  }) => {
    try {
      await updateOrderCartLines(selectedOrder!.customerId, selectedOrder!.id, {
        cartLinesDtoForAdd: data.cartLinesDtoForAdd || [],
        cartLinesDtoForRemove: data.cartLinesDtoForRemove || [],
      });
      window.location.href = "/orders";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    }
  };

  const filteredOrders = orders.filter((order) =>
    showArchived ? order.status === "Shipped" : order.status !== "Shipped"
  );

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <ErrorAlert
        message={error}
        onRetry={() => navigate("/login")}
        buttonText="Перейти к авторизации"
      />
    );

  if (editingOrder) {
    const customer = customers.find((c) => c.id === selectedOrder!.customerId);
    return (
      <EditOrderForm
        order={editingOrder}
        products={products}
        customer={customer}
        onClose={() => setEditingOrder(null)}
        onSaveStatus={handleSaveStatus}
        onSaveCartLines={handleSaveCartLines}
      />
    );
  }

  if (selectedOrder) {
    const customer = customers.find((c) => c.id === selectedOrder.customerId);
    return (
      <OrderCard
        order={selectedOrder}
        products={products}
        customer={customer}
        onBack={() => setSelectedOrder(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Список заказов</h2>
        <button className="btn btn-success" onClick={() => navigate("/order/new")}>Добавить</button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setShowArchived(!showArchived)}
        >
          {showArchived ? "Актив" : "Архив"}
        </button>
      </div>
      <OrderList
        orders={filteredOrders}
        customers={customers}
        onOrderClick={handleOrderClick}
      />
    </div>
  );
};

export default OrdersPage;
