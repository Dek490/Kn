// MainNavigation.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './context/authContext';
import Home from './screens/Pages/Home/Home';
import Login from './screens/auth/login';
import Register from './screens/auth/register';
import ScreenMenuu from './components/Menus/ScreenMenuu';
import { CartProvider } from './context/CartContext';


const MainNavigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <AuthProvider>
      <CartProvider>
      <ScreenMenuu/>
      </CartProvider>
    </AuthProvider>
  );
}

export default MainNavigation;
