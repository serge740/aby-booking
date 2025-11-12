// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

export interface MenuItem {
  id: string;
  name: string;
  sellingPrice: number;
  mainImage?: string;
  discount?: number;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  unitPrice: number; // final price after discount
  image?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  updateQuantity: (menuItemId:string, newQty:number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // ✅ Load from localStorage on first render
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      if (prev.some((i) => i.menuItemId === item.id)) return prev; // prevent duplicates
      const finalPrice = item.sellingPrice - (item.sellingPrice * (item.discount || 0) / 100);
      return [
        ...prev,
        {
          ...item,
          menuItemId: item.id,
          name: item.name,
          unitPrice: finalPrice,
          image: item.mainImage,
        },
      ];
    });
  };

  const updateQuantity = (menuItemId:string, newQty:number) => {
  if (newQty < 1) {
    removeFromCart(menuItemId);
    return;
  }
  setCartItems(prev =>
    prev.map(item =>
      item.menuItemId === menuItemId
        ? { ...item, quantity: newQty }
        : item
    )
  );
};

  const removeFromCart = (menuItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  };

  const clearCart = () => setCartItems([]);

  const getTotal = () => cartItems.reduce((sum, i) => sum + i.unitPrice, 0);

  return (
    <CartContext.Provider value={{ cartItems, updateQuantity, addToCart, removeFromCart, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
