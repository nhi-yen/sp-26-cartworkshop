import { useState } from "react";
import styles from "./AddToCartButton.module.css";
import { useCartContext } from "../../contexts/CartContext";

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { dispatch } = useCartContext();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      aria-label={`Add ${product.name} to cart`}
    >
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}
