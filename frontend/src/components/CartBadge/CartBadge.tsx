import { Link } from "react-router-dom";
import styles from "./CartBadge.module.css";
import { useCartContext } from "../../contexts/CartContext";

export function CartBadge() {
  const { cartItemCount } = useCartContext();

  return (
    <Link
      to="/cart"
      className={styles.cartButton}
      aria-label={`Shopping cart with ${cartItemCount} items`}
    >
      🛒
      {cartItemCount > 0 && (
        <span className={styles.badge}>{cartItemCount}</span>
      )}
    </Link>
  );
}
