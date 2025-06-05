import type { Product } from "../types";

interface ProductListProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductClick,
}) => (
  <div className="row g-3">
  {[...products]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((product) => (
    <div className="col-12 col-md-6 col-lg-4" key={product.id}>
      <div
        className="card h-100 shadow-sm border-0"
        style={{ cursor: "pointer" }}
        onClick={() => onProductClick(product)}
      >
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex align-items-center mb-2">
              <span className="badge bg-info me-2">#{product.sku}</span>
              <span className="fw-bold fs-5">{product.title}</span>
            </div>
            <div className="text-muted mb-2">
              <span className="fw-medium">Цена:&nbsp;</span>
              <span className="fw-bold">{product.price} ₽</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="small mb-1">
              <span className="badge bg-warning text-dark me-1">
                На отправку: {product.quantityForShipping} шт.
              </span>
              <span className="badge bg-secondary me-1">
                Бронь: {product.reservedQuantity} шт.
              </span>
              <span className="badge bg-success">
                Факт: {product.actualQuantity} шт.
              </span>
            </div>
            <div className="fst-italic small text-success">
              Доступно для продажи:{" "}
              {product.actualQuantity -
                (product.quantityForShipping + product.reservedQuantity)}{" "}
              шт.
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
);

export default ProductList;
