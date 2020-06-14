import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const cart = await AsyncStorage.getItem('@GoMarketplace:cart');

      if (cart) {
        setProducts(JSON.parse(cart));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      // TODO ADD A NEW ITEM TO THE CART

      const allProducts = products;

      const findIndexProduct = products.findIndex(
        cartProduct => cartProduct.id === product.id,
      );

      if (findIndexProduct !== -1) {
        allProducts[findIndexProduct].quantity += 1;
      } else {
        allProducts.push({ ...product, quantity: 1 });
      }

      setProducts([...allProducts]);

      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify([...allProducts]),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART

      const allProducts = products;

      const findIndexProduct = products.findIndex(product => product.id === id);

      if (findIndexProduct !== -1) {
        allProducts[findIndexProduct].quantity += 1;
      }

      setProducts([...allProducts]);

      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify(allProducts),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART

      const allProducts = products;

      const findIndexProduct = products.findIndex(product => product.id === id);

      if (findIndexProduct !== -1) {
        allProducts[findIndexProduct].quantity -= 1;

        if (allProducts[findIndexProduct].quantity <= 0) {
          allProducts.splice(findIndexProduct, 1);
        }
      }

      setProducts([...allProducts]);

      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify(allProducts),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
