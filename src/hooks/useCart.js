import { useCartContext } from '../features/cart/CartContext.jsx';

export function useCart() {
  return useCartContext();
}
