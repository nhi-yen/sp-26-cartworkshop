import styles from "./CartPage.module.css";
import { useCartContext } from "../../contexts/CartContext";
import { CheckoutForm } from "../../components/CheckoutForm/CheckoutForm";

export default function CartPage() {
  const { state, dispatch, cartTotal } = useCartContext();
  const items = state.items;

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Your cart is empty</h2>
        <a href="/" className={styles.link}>Browse products</a>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <h2>Your Cart</h2>

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.productId} className={styles.item}>
            <div className={styles.info}>
              <h3>{item.productName}</h3>
              <p>${item.price.toFixed(2)}</p>
            </div>

            <div className={styles.quantityControls}>
              <button
                type="button"
                aria-label={`Decrease quantity of ${item.productName}`}
                onClick={() =>
                  dispatch({
                    type: "UPDATE_QUANTITY",
                    payload: {
                      productId: item.productId,
                      quantity: Math.max(1, item.quantity - 1),
                    },
                  })
                }
                disabled={item.quantity === 1}
              >
                −
              </button>

              <span className={styles.quantity}>{item.quantity}</span>

              <button
                type="button"
                aria-label={`Increase quantity of ${item.productName}`}
                onClick={() =>
                  dispatch({
                    type: "UPDATE_QUANTITY",
                    payload: {
                      productId: item.productId,
                      quantity: Math.min(99, item.quantity + 1),
                    },
                  })
                }
              >
                +
              </button>
            </div>

            <div className={styles.lineTotal}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            <button
              type="button"
              className={styles.remove}
              aria-label={`Remove ${item.productName} from cart`}
              onClick={() =>
                dispatch({
                  type: "REMOVE_FROM_CART",
                  payload: { productId: item.productId },
                })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.summary}>
        <h3>Total: ${cartTotal.toFixed(2)}</h3>
      </div>

      {state.items.length > 0 && <CheckoutForm />}
    </div>
  );
}
