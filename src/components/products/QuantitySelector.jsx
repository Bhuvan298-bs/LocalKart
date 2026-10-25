import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  disabled = false
}) {
  const handleDecrement = () => {
    if (value > min && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max && !disabled) {
      onChange(value + 1);
    }
  };

  return (
    <div className="qty-stepper">
      <button
        type="button"
        className="qty-stepper-btn"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>

      <span className="qty-stepper-val mono-num">{value}</span>

      <button
        type="button"
        className="qty-stepper-btn"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
