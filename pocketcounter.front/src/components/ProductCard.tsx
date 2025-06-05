// components/ProductCard.tsx
import type { Product, Category } from "../types";

interface ProductCardProps {
  product: Product;
  categories?: Category[];
  onBack: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductCard = ({
  product,
  categories = [],
  onBack,
  onEdit,
  onDelete,
}: ProductCardProps) => {
  const category = categories.find((c) => c.id === product.categoryId);
  return (
    <div className="container mt-4">
      <button className="btn btn-light mb-3" onClick={onBack}>
        ← Назад к списку
      </button>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            Артикул: {product.sku}
          </h6>
          <p className="card-text m-0">{product.description}</p>
          <ul className="list-group list-group-flush mb-3">
            <li className="list-group-item">Цена: {product.price} ₽</li>
            <li className="list-group-item">
              Себестоимость: {product.costPrice} ₽
            </li>
            <li className="list-group-item">
              Габариты: {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} см
            </li>
            <li className="list-group-item">Вес: {product.weigth} кг</li>
            <li className="list-group-item">
              Категория: {category ? category.name : "Неизвестно"}
            </li>
            <li className="list-group-item">
              На отправку: {product.quantityForShipping}
            </li>
            <li className="list-group-item">
              Забронировано: {product.reservedQuantity}
            </li>
            <li className="list-group-item">
              Фактическое количество на складе: {product.actualQuantity}
            </li>
            <li className="list-group-item">
              Доступно для продажи:{" "}
              {product.actualQuantity -
                (product.quantityForShipping + product.reservedQuantity)}
            </li>
          </ul>

          <div className="d-flex gap-2">
            <button className="btn btn-warning" onClick={() => onEdit(product)}>
              Редактировать
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(product)}
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
