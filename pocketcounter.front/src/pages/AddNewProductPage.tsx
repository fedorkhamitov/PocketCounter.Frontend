import { addNewProduct, fetchCategories } from "../api";
import type { Category } from "../types";
import { ErrorAlert } from "../components/ErrorAlert";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Select, { components } from "react-select";
import type { MenuListProps, GroupBase } from "react-select";
import AddCategoryModal from "../components/addCategoryModal";

const AddProductPage: React.FC = () => {
  const [inputs, setInputs] = useState({
    sku: "",
    title: "",
    description: "",
    price: "",
    costPrice: "",
    width: "",
    height: "",
    depth: "",
    weigth: "",
    quantityForShipping: "",
    reservedQuantity: "",
    actualQuantity: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        if (!data) throw new Error("Нет данных");
        setCategories(data);
      })
      .catch(() => setError("Ошибка при загрузке категорий"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      sku: inputs.sku,
      title: inputs.title,
      description: inputs.description,
      price: inputs.price === "" ? 0 : Number(inputs.price),
      costPrice: inputs.costPrice === "" ? 0 : Number(inputs.costPrice),
      width: inputs.width === "" ? 0 : Number(inputs.width),
      height: inputs.height === "" ? 0 : Number(inputs.height),
      depth: inputs.depth === "" ? 0 : Number(inputs.depth),
      weigth: inputs.weigth === "" ? 0 : Number(inputs.weigth),
      quantityForShipping:
        inputs.quantityForShipping === ""
          ? 0
          : Number(inputs.quantityForShipping),
      reservedQuantity:
        inputs.reservedQuantity === "" ? 0 : Number(inputs.reservedQuantity),
      actualQuantity:
        inputs.actualQuantity === "" ? 0 : Number(inputs.actualQuantity),
    };
    if (!selectedCategoryId) {
      setError("Выберите категорию");
      return;
    }

    try {
      await addNewProduct(selectedCategoryId, productData);
      navigate("/products");
    } catch {
      setError("Ошибка при создании продукта");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (error)
    return (
      <ErrorAlert
        message={error}
        onRetry={() => navigate("/login")}
        buttonText="Перейти к авторизации"
      />
    );

  type OptionType = { value: string; label: string };
  const options: OptionType[] = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const handleAddCategory = () => {
    setShowAddCategoryModal(true);
  };

  const refreshCategories = () => {
    fetchCategories()
      .then((data) => data && setCategories(data))
      .catch(() => setError("Ошибка при загрузке категорий"));
  };

  // Кастомный компонент меню с кнопкой
  const Menu = (
    props: MenuListProps<OptionType, false, GroupBase<OptionType>>
  ) => (
    <components.MenuList {...props}>
      {props.children}
      <div
        style={{
          borderTop: "1px solid #eee",
          padding: "8px",
          textAlign: "center",
          cursor: "pointer",
          color: "#0d6efd",
          fontWeight: "bold",
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          handleAddCategory();
        }}
      >
        + Добавить категорию
      </div>
    </components.MenuList>
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Добавление нового продукта</h2>
      {showAddCategoryModal && (
      <AddCategoryModal 
        show={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onCategoryAdded={refreshCategories}
      />
    )}
      <form onSubmit={handleSubmit}>
        <div className="row align-items-end">
          <div className="col-auto">
            <h4>Категория:</h4>
          </div>
          <div className="col-auto">
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={
                options.find((opt) => opt.value === selectedCategoryId) || null
              }
              onChange={(option) =>
                setSelectedCategoryId(option ? option.value : "")
              }
              options={options}
              placeholder="Выберите категорию"
              components={{ MenuList: Menu }}
              isClearable
            />
          </div>
        </div>
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label">Артикул</label>
            <input
              type="text"
              className="form-control"
              name="sku"
              value={inputs.sku}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-8">
            <label className="form-label">Название</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={inputs.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label">Описание</label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={inputs.description}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="d-flex align-items-end flex-wrap gap-3">
          <div style={{ width: "140px" }}>
            <label className="form-label">Цена продажи</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={inputs.price}
              onChange={handleInputChange}
              min="0"
              //placeholder="Цена продажи"
              required
            />
          </div>
          <div style={{ width: "140px" }}>
            <label className="form-label">Себестоимость</label>
            <input
              type="number"
              className="form-control"
              name="costPrice"
              value={inputs.costPrice}
              onChange={handleInputChange}
              min="0"
              //placeholder="Себестоимость"
              required
            />
          </div>
        </div>
        <div className="border rounded p-3 my-4">
          <div className="mb-2 fw-bold">Габариты</div>
          <div className="d-flex align-items-end flex-wrap gap-3">
            <div style={{ width: "140px" }}>
              <label className="form-label">Ширина</label>
              <input
                type="number"
                className="form-control"
                name="width"
                value={inputs.width}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            <div style={{ width: "140px" }}>
              <label className="form-label">Высота</label>
              <input
                type="number"
                className="form-control"
                name="height"
                value={inputs.height}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            <div style={{ width: "140px" }}>
              <label className="form-label">Глубина</label>
              <input
                type="number"
                className="form-control"
                name="depth"
                value={inputs.depth}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            <div style={{ width: "140px" }}>
              <label className="form-label">Вес</label>
              <input
                type="number"
                className="form-control"
                name="weigth"
                value={inputs.weigth}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
          </div>
        </div>
        <div className="border rounded p-3 mb-3">
          <div className="mb-2 fw-bold">Количества</div>
          <div
            className="d-flex align-items-center mb-2"
            style={{ maxWidth: 320 }}
          >
            <label
              className="form-label mb-0 me-2 flex-grow-1"
              style={{ minWidth: 0 }}
            >
              Фактическое на складе
            </label>
            <input
              type="number"
              className="form-control"
              name="actualQuantity"
              value={inputs.actualQuantity}
              onChange={handleInputChange}
              min="0"
              required
              style={{ width: "120px", flexShrink: 0 }}
            />
          </div>
          <div
            className="d-flex align-items-center mb-2"
            style={{ maxWidth: 320 }}
          >
            <label className="form-label mb-0 me-2 flex-grow-1">
              Забронировано
            </label>
            <input
              type="number"
              className="form-control"
              name="reservedQuantity"
              value={inputs.reservedQuantity}
              onChange={handleInputChange}
              min="0"
              required
              style={{ width: "120px", flexShrink: 0 }}
            />
          </div>
          <div
            className="d-flex align-items-center mb-2"
            style={{ maxWidth: 320 }}
          >
            <label className="form-label mb-0 me-2 flex-grow-1">
              На отправку
            </label>
            <input
              type="number"
              className="form-control"
              name="quantityForShipping"
              value={inputs.quantityForShipping}
              onChange={handleInputChange}
              min="0"
              required
              style={{ width: "120px", flexShrink: 0 }}
            />
          </div>
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary mb-4">
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
