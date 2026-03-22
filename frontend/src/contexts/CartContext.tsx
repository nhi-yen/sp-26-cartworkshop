import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import { cartReducer, initialCartState } from "../reducers/cartReducer";
import type { CartState, CartAction } from "../types/cart";

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  cartItemCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // Derived values (NOT stored in state)
  const cartItemCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartTotal = state.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        cartItemCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}

// Alias for backwards compatibility with component imports
export const useCart = useCartContext;
