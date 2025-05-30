import { CartItem, CartState } from "@/types/cart";

type Action =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartState }
  | { type: "INCREASE_QTY"; payload: { id: string } }
  | { type: "DECREASE_QTY"; payload: { id: string } };

export function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM": {
      return {
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }

    case "CLEAR_CART": {
      return { items: [] };
    }
    case "SET_CART":
      return action.payload;
    case "INCREASE_QTY":
      return {
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      };
    case "DECREASE_QTY": {
      return {
        items: state.items.map((item) =>
          item.id === action.payload.id && item.quantity !== 1
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      };
    }
    default:
      return state;
  }
}
