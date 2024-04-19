import { View, Text } from "react-native";
import React,{useContext} from "react";
import { AuthProvider } from "./context/authContext";
import ScreenMenu from "./components/Menus/ScreenMenu";
import { CartProvider } from "./context/CartContext";

const RootNavigation = () => {
    return (
        <AuthProvider>
            <CartProvider>
            <ScreenMenu/>
            </CartProvider>
        </AuthProvider>
    );
};

export default RootNavigation;
