import { useState } from "react";
import type { Product, CartLine } from "../../types";
import { Button, Form } from "react-bootstrap";

const ProductsSelection: React.FC<{
  products: Product[];
  currentCart: CartLine[];
  onAdd: (productId: string, quantity: number) => void;
  onRemove: (productId: string, quantity: number) => void;
}> = ({ products, currentCart, onAdd, onRemove }) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <div className="d-flex gap-2 mb-3">
        <Form.Select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Выберите товар</option>
          {products.map((product) => (
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
          style={{ width: "100px" }}
        />
        <Button
          variant="success"
          type="button"
          onClick={() => {
            if (selectedProduct) {
              onAdd(selectedProduct, quantity);
              setSelectedProduct("");
            }
          }}
        >
          Добавить
        </Button>
      </div>
      <h5>Текущий состав заказа</h5>
      <table className="table">
        <thead>
          <tr>
            <th>Товар</th>
            <th>Количество</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          {currentCart.map((line) => {
            const product = products.find((p) => p.id === line.productId);
            return (
              <tr key={line.productId}>
                <td>{product?.title || "Неизвестный товар"}</td>
                <td>{line.quantity}</td>
                <td>
                  <Form.Control
                    type="number"
                    min="0"
                    max={line.quantity}
                    defaultValue="0"
                    onBlur={(e) => {
                      const removeQty = Number(e.target.value);
                      if (removeQty > 0) {
                        onRemove(line.productId, removeQty);
                        e.target.value = "0";
                      }
                    }}
                    style={{ width: "100px" }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsSelection;