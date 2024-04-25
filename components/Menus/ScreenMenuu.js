import { View, Text } from "react-native";
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthContext } from "../../context/authContext";
import HeaderMenu from "./HeaderMenu";
import Home from "../../screens/Pages/Home/Home";
import Cart from "../../screens/Pages/Cart/Cart";
import Invoices from "../../screens/Pages/Invoice/Invoices";
import Login from "../../screens/auth/login";
import Register from "../../screens/auth/register";
import BarcodeScanner from "../../screens/Pages/Home/BarcodeScanner";
import Category from "../../screens/Pages/Category/Category";
import SubCategory from "../../screens/Pages/SubCategiry/SubCategory";
import Items from "../../screens/Pages/Items/Items"
import ItemsReportList from "../../screens/Pages/Repprts/ItemsReport";
import SaleReport from "../../screens/Pages/Repprts/SalesReport/SalesReport";
import Users from "../../screens/auth/Users/Users";
import AllInvoices from "../../screens/Pages/Invoice/AllInvoices";
import TestIinvoices from "../../screens/Pages/Invoice/TestIinvoices";
import TInvoices from "../../screens/Pages/Invoice/TodatysInvoice";
import Dashboard from "../../screens/Pages/Dashboard/Dashboard";
import NewItemBarcode from "../../screens/Pages/Dashboard/NewItemBarcode"

const ScreenMenuu = () => {
    //global state
    const [state] = useContext(AuthContext);
    //auth condition true false
    const authenticatedUser = state?.user && state?.token;

    // Define addToCart function
    const addToCart = (item) => {
        // Add your logic here for adding items to the cart
        console.log("Adding item to cart:", item);
    };

    const Stack = createNativeStackNavigator();
    return (

        <Stack.Navigator initialRouteName='Login'>

            <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    headerShown: false,
                    headerRight: () => <HeaderMenu />,
                }}
            />
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    headerShown: false,
                    headerRight: () => <HeaderMenu />,
                }}
            />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />

            <Stack.Screen
                name="Cart"
                component={Cart}
                options={({ route }) => ({
                    headerBackTitle: "Back",

                    headerRight: () => <HeaderMenu />,
                    initialParams: { addToCart: addToCart } // Pass addToCart as a parameter
                    ,
                    headerTitle: "Cart screen",

                })}
            />

            <Stack.Screen
                name="BarcodeScanner"
                component={BarcodeScanner}
                options={({ route }) => ({
                    headerBackTitle: "Back",
                    headerRight: () => <HeaderMenu />,
                    initialParams: { addToCart: addToCart } // Pass addToCart as a parameter
                })}
            />
            <Stack.Screen
                name="Invoices"
                component={Invoices}
                options={{
                    headerBackTitle: "Back",
                    headerRight: () => <HeaderMenu />,
                }}
            />
            <Stack.Screen
                name="Category"
                component={Category}
                options={{
                    headerBackTitle: "Back",
                    headerRight: () => <HeaderMenu />,
                }}
            />
            <Stack.Screen
                name="SubCategory"
                component={SubCategory}
                options={{
                    headerBackTitle: "Back",
                    headerRight: () => <HeaderMenu />,
                }}
            />

            <Stack.Screen
                name="Items"
                component={Items}
                options={{
                    headerBackTitle: "Back",
                    headerRight: () => <HeaderMenu />,
                }}
            />
            <Stack.Screen
                name="ItemsReportList"
                component={ItemsReportList}
                options={{
                    headerBackTitle: "Back",
                    headerRight: () => <HeaderMenu />,
                }}
            />
            <Stack.Screen
                name="SalesReport"
                component={SaleReport}
                options={{
                    headerBackTitle: "Back",
                    headerRight: () => <HeaderMenu />,
                }}
            />
            <Stack.Screen
                name="AllInvoices"
                component={AllInvoices}
                options={{
                    headerBackTitle: "Back",
                    headerRight: () => <HeaderMenu />,
                }}
            />

            <Stack.Screen
                name="TInvoices"
                component={TInvoices}
                options={{
                    headerBackTitle: "Back",
                    headerRight: () => <HeaderMenu />,
                }}
            />
  
            <Stack.Screen
                name="Users"
                component={Users}
                options={{
                    headerBackTitle: "Back",
                    headerRight: () => <HeaderMenu />,
                }}
            />
            <Stack.Screen
                name="NewItemBarcode"
                component={NewItemBarcode}
                options={{
                    headerBackTitle: "Back",
                    headerRight: () => <HeaderMenu />,
                }}
            />

        </Stack.Navigator>
    );
};

export default ScreenMenuu;
