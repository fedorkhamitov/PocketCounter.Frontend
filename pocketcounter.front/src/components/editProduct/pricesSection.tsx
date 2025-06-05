import type { Product } from "../../types";
import { useState, useEffect } from "react";

interface PricesSectionProps {
  formData: Product;
  onSave: (updatedProduct: Product) => void;
  loading: boolean;
}

const PricesSection: React.FC<PricesSectionProps> = ({
  formData,
  onSave,
  loading,
}) => {
  const [inputs, setInputs] = useState({
    price: formData.price.toString(),
    costPrice: formData.costPrice.toString(),
  });

  const handleSave = () => {
    const updatedProduct = {
      ...formData,
      price:
        inputs.price === "" ? 0 : Number(inputs.price),
      reservedQuantity:
        inputs.costPrice === "" ? 0 : Number(inputs.costPrice),
    };
    onSave(updatedProduct); // Просто отдаём наружу новые значения
  };

  useEffect(() => {
    setInputs({
      price: formData.price.toString(),
      costPrice: formData.costPrice.toString(),
    });
  }, [formData]);

  return (
    <div className="col-12">
      <h5 className="mb-3">Стоимость</h5>
      <table style={{ width: "100%", minWidth: 350 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Цена</th>
            <th style={{ textAlign: "left" }}>Себестоимость</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="number"
                className="form-control"
                value={inputs.price}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputs((prev) => ({
                    ...prev,
                    price: value,
                  }));
                }}
              />
            </td>
            <td>
              <input
                type="number"
                className="form-control"
                value={inputs.costPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputs((prev) => ({
                    ...prev,
                    costPrice: value,
                  }));
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button
        type="button"
        className="btn btn-primary mt-3"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Сохранение..." : "Сохранить стоимость"}
      </button>
    </div>
  );
};

export default PricesSection;
