import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Customer, HumanName, Address, CartLine, Product } from "../types";
import {
  fetchCustomers,
  createNewCustomer,
  createNewOrder,
  fetchProducts,
} from "../api";
import CartLinesEditor from "../components/Orders/CartLinesEditor";

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [customerSearch, setCustomerSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [step, setStep] = useState<
    "select-customer" | "create-customer" | "create-order"
  >("select-customer");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [newCustomerData, setNewCustomerData] = useState<{
    fullName: HumanName;
    phoneNumber: string;
  }>({
    fullName: { firstName: "", patronymic: "", familyName: "" },
    phoneNumber: "",
  });
  const [orderData, setOrderData] = useState<{
    address: Address;
    comment: string;
  }>({
    address: {
      zipCode: "",
      country: "",
      state: "",
      city: "",
      streetName: "",
      streetNumber: "",
      apartment: "",
      specialAddressString: "",
    },
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchCustomers()
      .then((customers) => {
        if (!customers) throw new Error("Нет данных");
        setCustomers(customers);
      })
      .catch(() => setError("Ошибка при загрузке заказчиков"));
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetchProducts();
        setProducts(response.result.items); // Правильное обращение
      } catch {
        setError("Ошибка при загрузке товаров");
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const search = customerSearch.trim().toLowerCase();
    const { familyName, firstName, patronymic } = customer.name;
    const fullName = `${familyName} ${firstName} ${patronymic}`.toLowerCase();
    const phone = customer.phoneNumber?.toLowerCase() || "";
    return fullName.includes(search) || phone.includes(search);
  });

  const handleCreateCustomer = async () => {
    try {
      setLoading(true);
      const response = await createNewCustomer(newCustomerData);
      setSelectedCustomerId(response.result);
      setStep("create-order");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      await createNewOrder(selectedCustomerId, {
        cartLineDtos: cartLines,
        address: orderData.address,
        comment: orderData.comment,
      });
      navigate("/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Создание нового заказа</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Поиск по ФИО или телефону"
          value={customerSearch}
          onChange={(e) => setCustomerSearch(e.target.value)}
        />
      </div>
      {/* Шаг 1: Выбор заказчика */}
      {step === "select-customer" && (
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-4">Выберите заказчика</h3>

            <div className="mb-4">
              <button
                className="btn btn-outline-primary"
                onClick={() => setStep("create-customer")}
              >
                Создать нового заказчика
              </button>
            </div>

            {customers.length > 0 && (
              <>
                <h5 className="mb-3">Или выберите существующего:</h5>
                <div className="list-group">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        setSelectedCustomerId(customer.id);
                        setStep("create-order");
                      }}
                    >
                      {customer.name.familyName} {customer.name.firstName} (
                      {customer.phoneNumber})
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Шаг 2: Создание заказчика */}
      {step === "create-customer" && (
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-4">Создание нового заказчика</h3>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Фамилия</label>
                <input
                  type="text"
                  className="form-control"
                  value={newCustomerData.fullName.familyName}
                  onChange={(e) =>
                    setNewCustomerData((prev) => ({
                      ...prev,
                      fullName: {
                        ...prev.fullName,
                        familyName: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Имя</label>
                <input
                  type="text"
                  className="form-control"
                  value={newCustomerData.fullName.firstName}
                  onChange={(e) =>
                    setNewCustomerData((prev) => ({
                      ...prev,
                      fullName: { ...prev.fullName, firstName: e.target.value },
                    }))
                  }
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Отчество</label>
                <input
                  type="text"
                  className="form-control"
                  value={newCustomerData.fullName.patronymic}
                  onChange={(e) =>
                    setNewCustomerData((prev) => ({
                      ...prev,
                      fullName: {
                        ...prev.fullName,
                        patronymic: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Телефон</label>
                <input
                  type="tel"
                  className="form-control"
                  value={newCustomerData.phoneNumber}
                  onChange={(e) =>
                    setNewCustomerData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="mt-4 d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={handleCreateCustomer}
                disabled={loading}
              >
                {loading ? "Создание..." : "Создать заказчика"}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setStep("select-customer")}
              >
                Назад
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Шаг 3: Создание заказа */}
      {step === "create-order" && (
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-4">Создание заказа</h3>
            {loadingProducts ? (
              <div className="text-center my-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
              </div>
            ) : (
              <CartLinesEditor products={products} onChange={setCartLines} />
            )}
            {/* Поля адреса доставки */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <label className="form-label">Индекс</label>
                <input
                  type="text"
                  className="form-control"
                  value={orderData.address.zipCode}
                  onChange={(e) =>
                    setOrderData((prev) => ({
                      ...prev,
                      address: { ...prev.address, zipCode: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="col-md-5">
                <label className="form-label">Город</label>
                <input
                  type="text"
                  className="form-control"
                  value={orderData.address.city}
                  onChange={(e) =>
                    setOrderData((prev) => ({
                      ...prev,
                      address: { ...prev.address, city: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Улица</label>
                <input
                  type="text"
                  className="form-control"
                  value={orderData.address.streetName}
                  onChange={(e) =>
                    setOrderData((prev) => ({
                      ...prev,
                      address: { ...prev.address, streetName: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Номер дома</label>
                <input
                  type="text"
                  className="form-control"
                  value={orderData.address.streetNumber}
                  onChange={(e) =>
                    setOrderData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        streetNumber: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Номер квартиры</label>
                <input
                  type="text"
                  className="form-control"
                  value={orderData.address.apartment}
                  onChange={(e) =>
                    setOrderData((prev) => ({
                      ...prev,
                      address: { ...prev.address, apartment: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Cпец строка адреса</label>
                <input
                  type="text"
                  className="form-control"
                  value={orderData.address.specialAddressString}
                  onChange={(e) =>
                    setOrderData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        specialAddressString: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
            {/* Комментарий */}
            <div className="mb-4">
              <label className="form-label">Комментарий к заказу</label>
              <textarea
                className="form-control"
                value={orderData.comment}
                onChange={(e) =>
                  setOrderData((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
              />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={handleCreateOrder}
                disabled={loading}
              >
                {loading ? "Создание заказа..." : "Создать заказ"}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setStep("select-customer")}
              >
                Назад
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrderPage;
