import { Link, Outlet } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { CartSidebar } from "./CartSidebar/CartSidebar";
import styles from "./Layout.module.css";
import { CartBadge } from "./CartBadge/CartBadge";


export default function Layout() {
  const { state, dispatch } = useCart();
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>🌰</span>
            <h1 className={styles.title}>Buckeye Marketplace</h1>
          </Link>

          {/* ⭐ Cart Badge added to the header */}
          <CartBadge />
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
      <CartSidebar />
    </div>
  );
}
