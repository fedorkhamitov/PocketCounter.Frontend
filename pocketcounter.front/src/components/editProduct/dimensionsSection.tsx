import type { Product } from "../../types";
import { useState } from "react";

interface DimensionsSectionProps {
  formData: Product;
  onSave: (updatedProduct: Product) => void;
  loading: boolean;
}

const DimensionsSection: React.FC<DimensionsSectionProps> = ({
  formData,
  onSave,
  loading,
}) => {
  const [inputs, setInputs] = useState({
    width: formData.dimensions.width.toString(),
    height: formData.dimensions.height.toString(),
    depth: formData.dimensions.depth.toString(),
    weigth: formData.weigth.toString(),
  });

  const handleSave = () => {
    const updatedProduct = {
      ...formData,
      dimensions: {
        // <-- Исправлено: обновляем вложенный объект
        width: inputs.width === "" ? 0 : Number(inputs.width),
        height: inputs.height === "" ? 0 : Number(inputs.height),
        depth: inputs.depth === "" ? 0 : Number(inputs.depth),
      },
      weigth: inputs.weigth === "" ? 0 : Number(inputs.weigth),
    };
    onSave(updatedProduct);
  };

  return (
    <div className="col-md-6">
      <h5 className="mb-3">Характеристики</h5>
      <div className="row g-2">
        <div className="col-4">
          <label className="form-label">Ширина (см)</label>
          <input
            type="number"
            className="form-control"
            value={inputs.width}
            onChange={(e) => {
              const value = e.target.value;
              setInputs((prev) => ({
                ...prev,
                width: value,
              }));
            }}
          />
        </div>
        <div className="col-4">
          <label className="form-label">Высота (см)</label>
          <input
            type="number"
            className="form-control"
            value={inputs.height}
            onChange={(e) => {
              const value = e.target.value;
              setInputs((prev) => ({
                ...prev,
                height: value,
              }));
            }}
          />
        </div>
        <div className="col-4">
          <label className="form-label">Глубина (см)</label>
          <input
            type="number"
            className="form-control"
            value={inputs.depth}
            onChange={(e) => {
              const value = e.target.value;
              setInputs((prev) => ({
                ...prev,
                depth: value,
              }));
            }}
          />
        </div>
        <div className="col-6">
          <label className="form-label">Вес (кг)</label>
          <input
            type="number"
            className="form-control"
            value={inputs.weigth}
            onChange={(e) => {
              const value = e.target.value;
              setInputs((prev) => ({
                ...prev,
                weigth: value,
              }));
            }}
          />
        </div>
      </div>
      <button
        type="button"
        className="btn btn-primary mt-3"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Сохранение..." : "Сохранить характеристики"}
      </button>
    </div>
  );
};

export default DimensionsSection;
