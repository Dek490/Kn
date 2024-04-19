import React, { createContext, useState, useContext,useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartData, setCartData] = useState([0]);
  const [total, setTotal] = useState(0);
  const [scannedBarcode, setScannedBarcode] = useState();
  const [totalAmount, setTotalAmount] = useState(0); // New state for total amount
  const [invoiceItems, setInvoiceItems] = useState([]); // New state for total amount
  const [InvTotalPrice, setInvTotalPrice] = useState([]); // New state for total amount
  const [Role,setRole]=useState()


  useEffect(() => {
    // Calculate total amount whenever cartItems change
    const amount = cartItems.reduce((total, item) => total + (item.buyingprice * item.quantity), 0);
    setTotalAmount(amount);
  }, [cartItems]);

  const addToCart = (product) => {
    const existingProductIndex = cartItems.findIndex((item) => item._id === product._id);
    if (existingProductIndex !== -1) {
      // If the product is already in the cart, update its quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingProductIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      // If the product is not in the cart, add it with a quantity of 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart,setCartData,cartData,setCartItems,setScannedBarcode,scannedBarcode,totalAmount,invoiceItems,setInvoiceItems,InvTotalPrice,setInvTotalPrice,Role,setRole }}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => useContext(CartContext);
