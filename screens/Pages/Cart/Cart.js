import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView,SafeAreaView } from 'react-native';
import { useCart } from '../../../context/CartContext';
import FooterMenu from '../../../components/Menus/FooterMenu';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Currecy } from '../../../shared/config';



const Cart = ({ navigation }) => {
    const { cartItems, setCartItems, totalAmount } = useCart();
    const [submitted, setSubmitted] = useState(false);

    const SubmitOrder = async () => {
        const newcart = cartItems.map((item) => ({
            ItemId: item._id,
            order_qty: item.quantity,
        }));

        try {
            await axios.post('/orders', newcart);

            Toast.show({
                type: 'success',
                text1: 'Successfully Ordered',
                visibilityTime: 3000,
                autoHide: true,
            });
            setCartItems([]); // Clear cart items
            setSubmitted(true); // Set submitted to true

            // // Navigate to the invoice page after 5 seconds
            // setTimeout(() => {
            //     navigation.navigate('Invoices'); // Replace 'Invoices' with the name of your invoice page in the navigation stack
            // }, 3000);

        } catch (error) {
            console.log('Not Success', error);
        }
    };

    const handleQuantityChange = (index, value) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].quantity = parseInt(value, 10) || 0;
        setCartItems(updatedCartItems);
       

    };

    const removeItem = (index) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems.splice(index, 1);
        setCartItems(updatedCartItems);
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.subcontainer}>
                {submitted || cartItems.length === 0 ? (
                    <Text style={styles.NothingInTheCart}>
                        {submitted ? "Order Submitted Successfully" : "There Is Nothing In the Cart"}
                    </Text>
                ) : (
                    <View style={styles.tableContainer}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderCellForName}>Name</Text>
                            <Text style={styles.tableHeaderCell}>Quantity</Text>
                            <Text style={styles.tableHeaderCell}>Price({Currecy})</Text>
                            <Text style={styles.tableHeaderCell}>Total({Currecy})</Text>
                            <Text style={styles.tableHeaderCell}>Action</Text>
                        </View>
                        <ScrollView style={styles.tableContainers} >
                            {cartItems.map((item, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.ItemName}>{item.subCategoryId?.subCategoryName || 'N/A'}</Text>
                                    <TextInput
                                        style={styles.quantityInput}
                                        value={item.quantity.toString()}
                                        onChangeText={(value) => handleQuantityChange(index, value)}
                                        keyboardType="numeric"
                                    />
                                    <Text style={styles.tableCell}>{item.buyingprice || 'N/A'}</Text>
                                    <Text style={styles.tableCell}>{item.buyingprice * item.quantity || 'N/A'}</Text>
                                    <Text style={styles.tableCell}>
                                        <TouchableOpacity  style={styles.DeleteIcon} onPress={() => removeItem(index)}>
                                            <AntDesign name="delete" style={styles.iconStyle} />
                                        </TouchableOpacity>
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                        <View style={[styles.tableRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total Amount:</Text>
                            <Text style={styles.totalAmount}>{Currecy}:{totalAmount}</Text>
                        </View>

                    </View>

                )}
                {!submitted && cartItems.length > 0 && ( // Conditionally render submit button
                    <View>
                        <TouchableOpacity style={styles.submitButton} onPress={SubmitOrder}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View style={{ backgroundColor: "#ffffff", borderTopRightRadius: 20, borderTopLeftRadius: 20, padding: 5 }}>
                <FooterMenu />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        marginTop: 1,
    },
    subcontainer: {
        margin: 10,

    },
    tableContainers: {
        maxHeight: 400, // Fixed height for 10 rows
    },
    tableContainer: {
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 10,

    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#ffffff',
        paddingVertical: 8,
    },
    tableHeaderCell: {
        flex: 2,
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'center',
    },
    tableHeaderCellForName: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'left',
        // marginLeft: 5,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 5,
    },
    tableCell: {
        flex: 1,
        fontSize: 16,
        textAlign: 'center',
    },
    ItemName: {
        flex: 1,
        fontSize: 15,
        textAlign: 'left',
        marginLeft: 5,
    },
    totalRow: {
        backgroundColor: '#727171',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    totalLabel: {
        flex: 3,
        fontWeight: 'bold',
        color: "white",
        fontSize: 16,
        textAlign: 'left',
        paddingRight: 5,
    },
    totalAmount: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        color: "white",
    },
    NothingInTheCart: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        color: '#d62828',
        justifyContent: 'center',

    },
    submitButton: {
        backgroundColor: '#5FC084',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: "auto",
    },
    submitText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        backgroundColor: "#ffffff",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    centered: {
        position: "absolute",
        right: 100,
        bottom: -50,
    },
    quantityInput: {
        flex: 1,
        fontSize: 16,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 5,
        marginHorizontal: 5,
    },
    iconStyle: {
        marginBottom: 3,
        fontSize: 25,
        color: "white",
        textAlign: "center",

    },
    DeleteIcon:{
        backgroundColor: 'tomato', 
        borderRadius: 5,
        padding:2,
    }
});

const ToastRef = React.createRef();
export { ToastRef };

export default Cart;
