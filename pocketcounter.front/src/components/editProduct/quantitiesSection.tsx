import type { Product } from "../../types";
import { useState } from "react";

interface QuantitiesSectionProps {
  formData: Product;
  onSave: (updatedProduct: Product) => void;
  loading: boolean;
}

const QuantitiesSection: React.FC<QuantitiesSectionProps> = ({
  formData,
  onSave,
  loading,
}) => {
  const [inputs, setInputs] = useState({
    actualQuantity: formData.actualQuantity.toString(),
    reservedQuantity: formData.reservedQuantity.toString(),
    quantityForShipping: formData.quantityForShipping.toString(),
  });

  const [editEnabled, setEditEnabled] = useState(false);
  const [addQuantity, setAddQuantity] = useState("");

  const handleSave = () => {
    let newActual = Number(inputs.actualQuantity);

    // Если редактирование выключено, прибавляем addQuantity к actualQuantity
    if (!editEnabled && addQuantity.trim() !== "") {
      newActual += Number(addQuantity);
    }

    const updatedProduct = {
      ...formData,
      actualQuantity: isNaN(newActual) ? 0 : newActual,
      reservedQuantity:
        inputs.reservedQuantity === "" ? 0 : Number(inputs.reservedQuantity),
      quantityForShipping:
        inputs.quantityForShipping === ""
          ? 0
          : Number(inputs.quantityForShipping),
    };
    onSave(updatedProduct);
    setAddQuantity(""); // очищаем поле после сохранения
  };

  return (
    <div className="col-12">
      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="toggleEdit"
          checked={editEnabled}
          onChange={() => setEditEnabled((prev) => !prev)}
        />
        <label className="form-check-label" htmlFor="toggleEdit">
          Разрешить редактирование количеств
        </label>
      </div>
      <h5 className="mb-3">Количества</h5>
      <table style={{ width: "100%", minWidth: 350 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Фактическое количество</th>
            <th style={{ textAlign: "left" }}>Резерв</th>
            <th style={{ textAlign: "left" }}>На отправку</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="number"
                className="form-control"
                value={inputs.actualQuantity}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputs((prev) => ({
                    ...prev,
                    actualQuantity: value,
                  }));
                }}
                disabled={!editEnabled}
              />
            </td>
            <td>
              <input
                type="number"
                className="form-control"
                value={inputs.reservedQuantity}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputs((prev) => ({
                    ...prev,
                    reservedQuantity: value,
                  }));
                }}
                disabled={!editEnabled}
              />
            </td>
            <td>
              <input
                type="number"
                className="form-control"
                value={inputs.quantityForShipping}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputs((prev) => ({
                    ...prev,
                    quantityForShipping: value,
                  }));
                }}
                disabled={!editEnabled}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {/* Инпут для добавления количества, активен только если редактирование запрещено */}
      <div className="mt-3">
        <input
          type="number"
          className="form-control"
          placeholder="Добавить к фактическому количеству"
          value={addQuantity}
          onChange={(e) => setAddQuantity(e.target.value)}
          disabled={editEnabled}
        />
      </div>
      <button
        type="button"
        className="btn btn-primary mt-3"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Сохранение..." : "Сохранить количества"}
      </button>
    </div>
  );
};

export default QuantitiesSection;