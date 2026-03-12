import type { CartState, CartAction, CartItem } from '../types/cart';

export const initialCartState: CartState = {
  items: [],
  isOpen: false,
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.productId === action.payload.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      const newItem: CartItem = {
        productId: action.payload.id,
        productName: action.payload.name,
        price: action.payload.price,
        quantity: 1,
        imageUrl: action.payload.imageUrl,
      };

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload.productId),
      };

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity < 1) {
        return {
          ...state,
          items: state.items.filter(item => item.productId !== action.payload.productId),
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
  }
}
