import { useState, useEffect } from "react";
import type { Product } from "../types";
import {
  updateProductMainInfo,
  updateProductDimensions,
  updateProductQuantities,
  updateProductPrices,
} from "../api";
import MainInfoSection from "./editProduct/mainInfoSection";
import DimensionsSection from "./editProduct/dimensionsSection";
import QuantitiesSection from "./editProduct/quantitiesSection";
import PricesSection from "./editProduct/pricesSection";

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

export const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Product>({ ...product });
  const [loading, setLoading] = useState({
    main: false,
    dimensions: false,
    quantities: false,
    prices: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setFormData({ ...product }), [product]);

  // --- Сохранение основной информации ---
  const handleSaveMainInfo = async () => {
    setLoading((prev) => ({ ...prev, main: true }));
    setError(null);

    try {
      await updateProductMainInfo(formData.id, formData.categoryId, {
        sku: formData.sku,
        title: formData.title,
        description: formData.description,
        price: formData.price,
        costPrice: formData.costPrice,
      });
      onSave(formData);
      window.location.href = "/products";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ошибка сохранения основной информации"
      );
    } finally {
      setLoading((prev) => ({ ...prev, main: false }));
    }
  };

  // --- Сохранение характеристик ---
  const handleSaveDimensions = async (updatedProduct: Product) => {
    setLoading((prev) => ({ ...prev, dimensions: true }));
    setError(null);

    try {
      await updateProductDimensions(updatedProduct.id, updatedProduct.categoryId, {
        width: updatedProduct.dimensions.width,
        height: updatedProduct.dimensions.height,
        depth: updatedProduct.dimensions.depth,
        weigth: updatedProduct.weigth,
      });
      setFormData(updatedProduct);
      onSave(updatedProduct);
      window.location.href = "/products";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка сохранения характеристик"
      );
    } finally {
      setLoading((prev) => ({ ...prev, dimensions: false }));
    }
  };

  // --- Сохранение количеств ---
  const handleSaveQuantities = async (updatedProduct: Product) => {
    setLoading((prev) => ({ ...prev, quantities: true }));
    setError(null);

    try {
      await updateProductQuantities(
        updatedProduct.id,
        updatedProduct.categoryId,
        {
          actualQuantity: updatedProduct.actualQuantity,
          reservedQuantity: updatedProduct.reservedQuantity,
          quantityForShipping: updatedProduct.quantityForShipping,
        }
      );
      setFormData(updatedProduct);
      onSave(updatedProduct);
      window.location.href = "/products";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка сохранения количеств"
      );
    } finally {
      setLoading((prev) => ({ ...prev, quantities: false }));
    }
  };

  // --- Сохранение стоимости ---
  const handleSavePrices = async (updatedProduct: Product) => {
    setLoading((prev) => ({ ...prev, prices: true }));
    setError(null);
    try {
      await updateProductPrices(updatedProduct.id, updatedProduct.categoryId, {
        price: updatedProduct.price,
        costPrice: updatedProduct.costPrice,
      });
      setFormData(updatedProduct);
      onSave(updatedProduct);
      window.location.href = "/products";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка сохранения стоимости"
      );
    } finally {
      setLoading((prev) => ({ ...prev, quantities: false }));
    }
  };

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="card-title mb-0">Редактирование продукта</h4>
          <button
            className="btn btn-close"
            onClick={onClose}
            aria-label="Закрыть"
          />
        </div>
        {error && <div className="alert alert-danger mb-4">{error}</div>}
        <div className="row g-3">
          <MainInfoSection
            formData={formData}
            onChange={setFormData}
            onSave={handleSaveMainInfo}
            loading={loading.main}
          />
          <QuantitiesSection
            formData={formData}
            onSave={handleSaveQuantities}
            loading={loading.quantities}
          />
          <PricesSection
            formData={formData}
            onSave={handleSavePrices}
            loading={loading.prices}
          />
          <DimensionsSection
            formData={formData}
            onSave={handleSaveDimensions}
            loading={loading.dimensions}
          />
          <div className="col-12">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
