import { useState } from "react";
import type { Product, CartLine } from "../../types";

interface CartLinesEditorProps {
  products: Product[];
  onChange: (cartLines: CartLine[]) => void;
}

const CartLinesEditor: React.FC<CartLinesEditorProps> = ({ products, onChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [addQuantities, setAddQuantities] = useState<{ [id: string]: string }>({});
  const [cartLines, setCartLines] = useState<CartLine[]>([]);

  // Фильтрация по поиску
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Добавить или увеличить количество продукта
  const handleAddProduct = (product: Product) => {
    const qtyToAdd = parseInt(addQuantities[product.id], 10) || 0;
    if (qtyToAdd > 0) {
      setCartLines((prev) => {
        const index = prev.findIndex((line) => line.productId === product.id);
        let updated;
        if (index !== -1) {
          updated = prev.map((line, i) =>
            i === index ? { ...line, quantity: line.quantity + qtyToAdd } : line
          );
        } else {
          updated = [...prev, { productId: product.id, quantity: qtyToAdd }];
        }
        onChange(updated);
        return updated;
      });
      setAddQuantities((prev) => ({ ...prev, [product.id]: "" }));
    }
  };

  // Удалить из корзины
  const handleDeleteFromCart = (productId: string) => {
    setCartLines((prev) => {
      const updated = prev.filter((line) => line.productId !== productId);
      onChange(updated);
      return updated;
    });
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Поиск по названию..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table className="table table-bordered table-sm">
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
              <td>{product.title}
                <p className="text-bg-info">Факт: {product.actualQuantity}</p>
              </td>
              <td style={{ width: 120 }}>
                <input
                  type="text"
                  className="form-control"
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
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={() => handleAddProduct(product)}
                  disabled={!addQuantities[product.id]}
                >
                  Добавить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h6>Товары в заказе</h6>
      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Название</th>
            <th>Количество</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cartLines.map((line) => {
            const product = products.find((p) => p.id === line.productId);
            return (
              <tr key={line.productId}>
                <td>{product?.sku}</td>
                <td>{product?.title}</td>
                <td>{line.quantity}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteFromCart(line.productId)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CartLinesEditor;