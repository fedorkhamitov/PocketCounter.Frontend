import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type Product, type Category } from "../types";
import ProductList from "../components/ProductList";
import { ProductCard } from "../components/ProductCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorAlert } from "../components/ErrorAlert";
import { fetchCategories, fetchProducts, hardDeleteProduct } from "../api";
import { EditProductForm } from "../components/EditProductForm";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        if (!data) throw new Error("Нет данных");
        setCategories(data);
      })
      .catch(() => setError("Ошибка при загрузке категорий"));
  }, []);

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



  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSave = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null);
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Удалить продукт "${product.title}"?`)) {
      try {
        await hardDeleteProduct(product.id, product.categoryId);
        alert(`Продукт "${product.title}" удалён`);
        window.location.reload();
      } catch {
        alert("Ошибка при удалении продукта");
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <ErrorAlert
        message={error}
        onRetry={() => navigate("/login")}
        buttonText="Перейти к авторизации"
      />
    );

  if (editingProduct) {
    return (
      <EditProductForm
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleSave}
      />
    );
  }

  if (selectedProduct)
    return (
      <ProductCard
        product={selectedProduct}
        categories={categories}
        onBack={handleBackToList}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategoryId === "all" || p.categoryId === selectedCategoryId;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-2">
        <h2 className="mb-0 me-3">Список продуктов</h2>
        <select
          className="form-select w-auto"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <option value="all">Все категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={() => navigate("/product/new")}
          >
            Добавить продукт
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setShowSearch((prev) => !prev)}
          >
            Поиск
          </button>
        </div>
        {showSearch && (
          <div className="mt-2">
            <input
              type="text"
              className="form-control"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        )}
      </div>
      <ProductList
        products={filteredProducts}
        onProductClick={handleProductClick}
      />
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ProductsPage;
