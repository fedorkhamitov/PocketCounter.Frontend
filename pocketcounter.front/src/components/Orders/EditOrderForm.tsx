import { useState } from "react";
import type { Order, Product, CartLine, Customer } from "../../types";
import { Button, Form, Collapse, Table } from "react-bootstrap";
import EditCustomerName from "./EditCustomerName";
import EditAddressForm from "./EditAddressForm";

interface EditOrderFormProps {
  order: Order;
  products: Product[];
  customer: Customer | undefined;
  onClose: () => void;
  onSaveStatus: (newStatus: number, isPaid: boolean) => void;
  onSaveCartLines: (data: {
    cartLinesDtoForAdd: CartLine[] | null;
    cartLinesDtoForRemove: CartLine[] | null;
  }) => void;
}

const statusOptions = [
  { value: 1, label: "Новый" },
  { value: 2, label: "Готов к отправке" },
  { value: 3, label: "Бронь" },
  { value: 4, label: "Частичная бронь" },
  { value: 5, label: "Готов отложен" },
  { value: 6, label: "Отправлен" },
];

const EditOrderForm: React.FC<EditOrderFormProps> = ({
  order,
  products,
  customer,
  onClose,
  onSaveStatus,
  onSaveCartLines,
}) => {
  const [showEditCustomer, setShowEditCustomer] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  // Статус и оплата
  const [selectedStatus, setSelectedStatus] = useState<number>(
    order.status ? Number(order.status) : 1
  );
  const [isPaid, setIsPaid] = useState(order.isPaid);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Для добавления продуктов
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [addLines, setAddLines] = useState<CartLine[]>([]);
  const [addQuantities, setAddQuantities] = useState<{ [id: string]: string }>(
    {}
  );

  // Для удаления продуктов
  const [removeLines, setRemoveLines] = useState<CartLine[]>([]);
  const [removeQuantities, setRemoveQuantities] = useState<{
    [id: string]: string;
  }>({});

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Добавить или увеличить количество продукта
  const handleAddProduct = (product: Product) => {
    const qtyToAdd = parseInt(addQuantities[product.id], 10) || 0;
    if (qtyToAdd > 0) {
      setAddLines((prev) => {
        const index = prev.findIndex((line) => line.productId === product.id);
        if (index !== -1) {
          // Продукт уже есть — увеличиваем количество
          return prev.map((line, i) =>
            i === index ? { ...line, quantity: line.quantity + qtyToAdd } : line
          );
        } else {
          // Продукта нет — добавляем новый
          return [...prev, { productId: product.id, quantity: qtyToAdd }];
        }
      });
      setAddQuantities((prev) => ({ ...prev, [product.id]: "" }));
    }
  };

  // Удалить часть продукта
  const handleRemoveProduct = (product: Product) => {
    const qty = parseInt(removeQuantities[product.id], 10) || 0;
    if (qty > 0) {
      setRemoveLines((prev) => {
        const index = prev.findIndex((line) => line.productId === product.id);
        if (index !== -1) {
          return prev.map((line, i) =>
            i === index ? { ...line, quantity: line.quantity + qty } : line
          );
        }
        return [...prev, { productId: product.id, quantity: qty }];
      });
      setRemoveQuantities((prev) => ({ ...prev, [product.id]: "" }));
    }
  };

  // Удалить всё количество продукта
  const handleRemoveAll = (product: Product) => {
    const current = order.cartLines.find(
      (line) => line.productId === product.id
    );
    if (current) {
      setRemoveLines((prev) => [
        ...prev.filter((line) => line.productId !== product.id),
        { productId: product.id, quantity: current.quantity },
      ]);
      setRemoveQuantities((prev) => ({ ...prev, [product.id]: "" }));
    }
  };

  // Удалить из списка добавленных (UI только)
  const handleDeleteFromAdd = (productId: string) => {
    setAddLines((prev) => prev.filter((line) => line.productId !== productId));
  };

  // Удалить из списка удалённых (UI только)
  const handleDeleteFromRemove = (productId: string) => {
    setRemoveLines((prev) =>
      prev.filter((line) => line.productId !== productId)
    );
  };

  const handleSaveStatus = () => {
    // Вызываем колбэк и передаём данные в родитель
    onSaveStatus(selectedStatus, isPaid);
  };

  const handleSaveCartLines = () => {
    // Передаём данные корзины
    onSaveCartLines({
      cartLinesDtoForAdd: addLines.length > 0 ? addLines : null,
      cartLinesDtoForRemove: removeLines.length > 0 ? removeLines : null,
    });
  };

  return (
    <div className="container my-4">
      <h3>Редактирование заказа #{order.serialNumber}</h3>
      <div className="row mb-4">
        <div className="m-2">
          <Button
            variant="outline-primary"
            className="mb-3"
            onClick={() => setShowEditCustomer(true)}
          >
            Редактировать имя и телефон клиента
          </Button>
          {showEditCustomer && (
            <EditCustomerName
              customerId={order.customerId}
              initialName={customer!.name} // или order.customer.name, если структура такая
              initialPhone={customer!.phoneNumber} // или order.customer.phoneNumber
              onClose={() => setShowEditCustomer(false)}
              onSave={async () => {
                // Можно обновить данные заказа через API или перезапросить заказчика
                setShowEditCustomer(false);
              }}
            />
          )}
        </div>
        <div className="m-2">
          <Button
            variant="outline-info"
            className="mb-3"
            onClick={() => setShowEditAddress(true)}
          >
            Изменить адрес доставки
          </Button>

          {showEditAddress && (
            <EditAddressForm
              customerId={order.customerId}
              orderId={order.id}
              initialAddress={order.address}
              onClose={() => setShowEditAddress(false)}
              onSave={() => {
                // Можно обновить локальные данные или перезапросить заказ
                setShowEditAddress(false);
              }}
            />
          )}
        </div>
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>Статус заказа</Form.Label>
            <Form.Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(Number(e.target.value))}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Заказ оплачен"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
            />
          </Form.Group>
          <Button variant="primary" className="mb-4" onClick={handleSaveStatus}>
            Сохранить статус
          </Button>
        </div>
      </div>
      <hr />
      <div className="mb-4">
        <Button
          variant="outline-success"
          onClick={() => setShowProductSelector((v) => !v)}
          className="mb-3"
        >
          Выбрать продукт
        </Button>
        <Collapse in={showProductSelector}>
          <div>
            <Form.Control
              type="text"
              placeholder="Поиск по названию..."
              className="mb-3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Название</th>
                  <th>Количество</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.sku}</td>
                    <td>{product.title}</td>
                    <td style={{ width: 120 }}>
                      <Form.Control
                        type="text"
                        value={addQuantities[product.id] || ""}
                        onChange={(e) =>
                          setAddQuantities((prev) => ({
                            ...prev,
                            [product.id]: e.target.value,
                          }))
                        }
                        placeholder="Введите число"
                      />
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleAddProduct(product)}
                        disabled={!addQuantities[product.id]}
                      >
                        Добавить
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Collapse>
      </div>

      {/* Список добавленных продуктов */}
      <div className="mb-4">
        <h6>Добавленные продукты</h6>
        <Table bordered size="sm">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Название</th>
              <th>Количество</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {addLines.map((line) => {
              const product = products.find((p) => p.id === line.productId);
              return (
                <tr key={line.productId}>
                  <td>{product?.sku}</td>
                  <td>{product?.title}</td>
                  <td>{line.quantity}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDeleteFromAdd(line.productId)}
                    >
                      Удалить
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Удаление продуктов */}
      <div className="mb-4">
        <h6>Удалить из заказа</h6>
        <Table bordered size="sm">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Название</th>
              <th>Количество</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {order.cartLines.map((line) => {
              const product = products.find((p) => p.id === line.productId);
              return (
                <tr key={line.productId}>
                  <td>{product?.sku}</td>
                  <td>{product?.title}</td>
                  <td style={{ width: 120 }}>
                    <Form.Control
                      type="text"
                      value={removeQuantities[line.productId] || ""}
                      onChange={(e) =>
                        setRemoveQuantities((prev) => ({
                          ...prev,
                          [line.productId]: e.target.value,
                        }))
                      }
                      placeholder="Введите число"
                    />
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => handleRemoveProduct(product!)}
                      disabled={!removeQuantities[line.productId]}
                    >
                      Удалить
                    </Button>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleRemoveAll(product!)}
                    >
                      Удалить всё
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <h6>К удалению:</h6>
        <Table bordered size="sm">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Название</th>
              <th>Количество</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {removeLines.map((line) => {
              const product = products.find((p) => p.id === line.productId);
              return (
                <tr key={line.productId}>
                  <td>{product?.sku}</td>
                  <td>{product?.title}</td>
                  <td>{line.quantity}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDeleteFromRemove(line.productId)}
                    >
                      Удалить
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <Button variant="success" onClick={handleSaveCartLines}>
        Сохранить продукты
      </Button>
      <Button
        variant="secondary"
        type="button"
        className="ms-3"
        onClick={onClose}
      >
        Отмена
      </Button>
    </div>
  );
};

export default EditOrderForm;
