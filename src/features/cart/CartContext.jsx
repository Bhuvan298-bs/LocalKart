import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'localkart_cart_demo_v1';

export function CartProvider({ children }) {
  const [cartState, setCartState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback on storage errors
    }
    return {
      shopId: null,
      shopName: null,
      shopLocality: null,
      deliveryFee: 25,
      items: []
    };
  });

  // Modal conflict state for one-shop-per-order rule
  const [shopConflict, setShopConflict] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartState));
    } catch {
      // ignore
    }
  }, [cartState]);

  const addToCart = (product, quantity = 1, shopInfo = null) => {
    const targetShopId = product.shopId || shopInfo?.id;
    const targetShopName = shopInfo?.name || 'Local Store';
    const targetLocality = shopInfo?.locality || '';
    const targetDeliveryFee = shopInfo?.deliveryFee ?? 25;

    // Check one-shop-per-order rule
    if (cartState.items.length > 0 && cartState.shopId && cartState.shopId !== targetShopId) {
      setShopConflict({
        currentShopName: cartState.shopName,
        newShopName: targetShopName,
        product,
        quantity,
        shopInfo: {
          id: targetShopId,
          name: targetShopName,
          locality: targetLocality,
          deliveryFee: targetDeliveryFee
        }
      });
      return false;
    }

    setCartState(prev => {
      const existingIdx = prev.items.findIndex(item => item.id === product.id);
      let updatedItems;

      if (existingIdx > -1) {
        updatedItems = prev.items.map((item, idx) => {
          if (idx === existingIdx) {
            return {
              ...item,
              quantity: item.quantity + quantity
            };
          }
          return item;
        });
      } else {
        updatedItems = [
          ...prev.items,
          {
            id: product.id,
            name: product.name,
            brand: product.brand || '',
            unit: product.unit,
            price: Number(product.price),
            image: product.image,
            shopId: targetShopId,
            quantity: quantity
          }
        ];
      }

      return {
        shopId: targetShopId,
        shopName: targetShopName,
        shopLocality: targetLocality,
        deliveryFee: targetDeliveryFee,
        items: updatedItems
      };
    });

    return true;
  };

  const resolveConflictReplace = () => {
    if (!shopConflict) return;
    const { product, quantity, shopInfo } = shopConflict;

    setCartState({
      shopId: shopInfo.id,
      shopName: shopInfo.name,
      shopLocality: shopInfo.locality,
      deliveryFee: shopInfo.deliveryFee,
      items: [
        {
          id: product.id,
          name: product.name,
          brand: product.brand || '',
          unit: product.unit,
          price: Number(product.price),
          image: product.image,
          shopId: shopInfo.id,
          quantity: quantity
        }
      ]
    });

    setShopConflict(null);
  };

  const cancelConflict = () => {
    setShopConflict(null);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    }));
  };

  const removeFromCart = (productId) => {
    setCartState(prev => {
      const remaining = prev.items.filter(item => item.id !== productId);
      if (remaining.length === 0) {
        return {
          shopId: null,
          shopName: null,
          shopLocality: null,
          deliveryFee: 25,
          items: []
        };
      }
      return {
        ...prev,
        items: remaining
      };
    });
  };

  const clearCart = () => {
    setCartState({
      shopId: null,
      shopName: null,
      shopLocality: null,
      deliveryFee: 25,
      items: []
    });
  };

  const subtotal = cartState.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItemsCount = cartState.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const deliveryFee = cartState.items.length > 0 ? cartState.deliveryFee : 0;
  const grandTotal = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart: cartState,
        items: cartState.items,
        shopId: cartState.shopId,
        shopName: cartState.shopName,
        shopLocality: cartState.shopLocality,
        totalItemsCount,
        subtotal,
        deliveryFee,
        grandTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        shopConflict,
        resolveConflictReplace,
        cancelConflict
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
