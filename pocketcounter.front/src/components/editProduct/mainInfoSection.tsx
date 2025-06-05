import type { Product } from "../../types";

interface MainInfoSectionProps {
  formData: Product;
  onChange: React.Dispatch<React.SetStateAction<Product>>;
  onSave: () => void;
  loading: boolean;
}

const MainInfoSection: React.FC<MainInfoSectionProps> = ({
  formData,
  onChange,
  onSave,
  loading,
}) => (
  <div className="col-md-6">
    <h5 className="mb-3">Основная информация</h5>
    <div className="mb-3">
      <label className="form-label">SKU</label>
      <input
        type="text"
        className="form-control"
        value={formData.sku}
        onChange={(e) => onChange((prev) => ({ ...prev, sku: e.target.value }))}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Название</label>
      <input
        type="text"
        className="form-control"
        value={formData.title}
        onChange={(e) =>
          onChange((prev) => ({ ...prev, title: e.target.value }))
        }
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Описание</label>
      <textarea
        className="form-control"
        rows={3}
        value={formData.description}
        onChange={(e) =>
          onChange((prev) => ({ ...prev, description: e.target.value }))
        }
      />
    </div>
    <button
      type="button"
      className="btn btn-primary"
      onClick={onSave}
      disabled={loading}
    >
      {loading ? "Сохранение..." : "Сохранить основную информацию"}
    </button>
  </div>
);

export default MainInfoSection;