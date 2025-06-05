import { useState } from 'react';
import type { Order, Product, CartLine } from '../../types';
import { Modal, Button, Tabs, Tab, Form } from 'react-bootstrap';

interface EditOrderFormProps {
  order: Order;
  products: Product[];
  onClose: () => void;
  onSave: (updateData: {
    statusUpdate?: { status: number; isPaid: boolean };
    cartUpdate?: {
      add: { productId: string; quantity: number }[];
      remove: { productId: string; quantity: number }[];
    };
  }) => void;
}

const statusOptions = [
  { value: 0, label: 'Новый' },
  { value: 1, label: 'Готов к отправке' },
  { value: 2, label: 'Отправлен' }
];

const EditOrderForm: React.FC<EditOrderFormProps> = ({ 
  order, 
  products,
  onClose,
  onSave
}) => {
  const [selectedStatus, setSelectedStatus] = useState<number>(0);
  const [isPaid, setIsPaid] = useState(order.isPaid);
  const [cartChanges, setCartChanges] = useState<{
    add: CartLine[];
    remove: CartLine[];
  }>({ add: [], remove: [] });

  const handleAddProduct = (productId: string, quantity: number) => {
    setCartChanges(prev => ({
      ...prev,
      add: [...prev.add, { productId, quantity }]
    }));
  };

  const handleRemoveProduct = (productId: string, quantity: number) => {
    setCartChanges(prev => ({
      ...prev,
      remove: [...prev.remove, { productId, quantity }]
    }));
  };

  const handleSubmit = () => {
    const statusUpdate = {
      status: selectedStatus,
      isPaid
    };

    const cartUpdate = {
      add: cartChanges.add,
      remove: cartChanges.remove
    };

    onSave({ statusUpdate, cartUpdate });
    onClose();
  };

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Редактирование заказа #{order.serialNumber}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Tabs defaultActiveKey="status" className="mb-3">
          <Tab eventKey="status" title="Статус и оплата">
            <Form.Group className="mb-3">
              <Form.Label>Статус заказа</Form.Label>
              <Form.Select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(Number(e.target.value))}
              >
                {statusOptions.map(option => (
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
          </Tab>

          <Tab eventKey="cart" title="Состав заказа">
            <ProductsSelection
              products={products}
              currentCart={order.cartLines}
              onAdd={handleAddProduct}
              onRemove={handleRemoveProduct}
            />
          </Tab>
        </Tabs>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Отмена
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Сохранить изменения
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ProductsSelection: React.FC<{
  products: Product[];
  currentCart: CartLine[];
  onAdd: (productId: string, quantity: number) => void;
  onRemove: (productId: string, quantity: number) => void;
}> = ({ products, currentCart, onAdd, onRemove }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <div className="mb-4">
        <h5>Добавить товары</h5>
        <div className="d-flex gap-2">
          <Form.Select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Выберите товар</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.title}
              </option>
            ))}
          </Form.Select>
          
          <Form.Control
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{ width: '100px' }}
          />
          
          <Button 
            variant="success"
            onClick={() => {
              if (selectedProduct) {
                onAdd(selectedProduct, quantity);
                setSelectedProduct('');
              }
            }}
          >
            Добавить
          </Button>
        </div>
      </div>

      <div>
        <h5>Текущий состав заказа</h5>
        <table className="table">
          <thead>
            <tr>
              <th>Товар</th>
              <th>Количество</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {currentCart.map(line => {
              const product = products.find(p => p.id === line.productId);
              return (
                <tr key={line.productId}>
                  <td>{product?.title || 'Неизвестный товар'}</td>
                  <td>{line.quantity}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="0"
                      max={line.quantity}
                      defaultValue="0"
                      onChange={(e) => {
                        const removeQty = Number(e.target.value);
                        if (removeQty > 0) {
                          onRemove(line.productId, removeQty);
                        }
                      }}
                      style={{ width: '100px' }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditOrderForm;