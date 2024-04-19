import { View, Text } from "react-native";
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthContext } from "../../context/authContext";
import HeaderMenu from "./HeaderMenu";
import Home from "../../screens/Pages/Home/Home";
import Cart from "../../screens/Pages/Cart/Cart";
import Invoices from "../../screens//Pages/Invoice/Invoices";
import Login from "../../screens/auth/login";
import Register from "../../screens/auth/register";


const ScreenMenu = () => {
    //global state
    const [state] = useContext(AuthContext);
    //auth condition true false
    const authenticatedUser = state?.user && state?.token;
    const Stack = createNativeStackNavigator();
    return (
      <Stack.Navigator initialRouteName="Login">
        {authenticatedUser ? (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                title: "Full Stack App",
                headerRight: () => <HeaderMenu />,
              }}
            />
            <Stack.Screen
              name="Cart"
              component={Cart}
              options={{
                headerBackTitle: "Back",
                headerRight: () => <HeaderMenu />,
              }}
            />
            <Stack.Screen
              name="Invoices"
              component={Invoices}
              options={{
                headerBackTitle: "Back",
                headerRight: () => <HeaderMenu />,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    );
};

export default ScreenMenu;
