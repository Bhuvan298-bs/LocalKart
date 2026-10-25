import {
  ShoppingBag,
  Apple,
  Milk,
  Croissant,
  Cookie,
  Coffee,
  Sparkles,
  Flame
} from 'lucide-react';
import { MOCK_CATEGORIES } from '../../data/mock/categories.js';

const iconMap = {
  ShoppingBag,
  Apple,
  Milk,
  Croissant,
  Cookie,
  Coffee,
  Sparkles,
  Flame
};

export default function CategoryNavigation({
  activeCategory = 'all',
  onSelectCategory,
  showAll = true
}) {
  return (
    <div className="categories-grid">
      {showAll && (
        <button
          type="button"
          className={`category-card ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          <div className="category-icon">
            <ShoppingBag size={28} />
          </div>
          <span className="category-name">All Items</span>
          <span className="category-count">Explore all</span>
        </button>
      )}

      {MOCK_CATEGORIES.map((cat) => {
        const Icon = iconMap[cat.iconName] || ShoppingBag;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            className={`category-card ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <div className="category-icon">
              <Icon size={28} />
            </div>
            <span className="category-name">{cat.name}</span>
            <span className="category-count">{cat.count}+ items</span>
          </button>
        );
      })}
    </div>
  );
}
