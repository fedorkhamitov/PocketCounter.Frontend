// components/CategoryFilter.tsx
import type { Category } from "../types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string;
  onChange: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onChange,
}) => (
  <select
    className="form-select w-auto"
    value={selectedCategoryId}
    onChange={e => onChange(e.target.value)}
  >
    <option value="all">Все категории</option>
    {categories.map(category => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </select>
);

export default CategoryFilter;
