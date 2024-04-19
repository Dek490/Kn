import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,SafeAreaView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/authContext';
import FooterMenu from '../../../components/Menus/FooterMenu';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import HeaderMenu from '../../../components/Menus/HeaderMenu';
import { useNavigation } from '@react-navigation/native';
import ItemsList from './ItemsList';
// import ItemsList from './Items';
import { useCart } from '../../../context/CartContext';



const Home = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const { state } = useContext(AuthContext); // Access the AuthContext
    const { totalAmount,UserName} = useCart(); // Access the total amount from the context
    



    // Function to handle search input change
    const handleSearchInputChange = (text) => {
        setSearchQuery(text);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.subcontainer}>
                <View style={styles.headerFlex}>
                    <View style={styles.userIconContainer}>
                        <FontAwesome5
                            name="user"
                            style={styles.iconStyle}
                        />

                        {/* Access the username from the state */}
                        {/* <Text style={styles.userName}>{`Hi ${state?.username || 'Mohamed Abdulkadir'}`}</Text> */}
                        <Text style={styles.userName}>Hi {UserName}</Text>
                    </View>

                    <HeaderMenu/>

                </View>
                {/* headerEnded */}

                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <FontAwesome5
                            name="search"
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search..."
                            placeholderTextColor="grey"
                            keyboardType="default"
                            value={searchQuery}
                            onChangeText={handleSearchInputChange}
                        />
                    </View>
                </View>

                <View style={styles.sectionBarCart}>
                    <TouchableOpacity onPress={() => navigation.navigate('BarcodeScanner')}>
                        <View style={styles.barcodeContainer}>
                            <FontAwesome5
                                name="camera"
                                style={styles.cameraIcon}
                            />
                            <Text style={styles.barcodeTxt}>Barcode</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewCartButton} onPress={() => navigation.navigate('Cart')}>
                        <Text style={styles.viewCartText}><FontAwesome5 name="shopping-cart" style={{fontSize:16}} /> View Cart (${totalAmount})</Text>
                    </TouchableOpacity>



                </View>

                <View style={styles.itemsHeaderContainer}>
                    <FontAwesome5
                        name="list"
                        style={styles.itemsIcon}
                    />
                    <Text style={styles.itemsTxtTitle}>Items <Text style={{ color: "#449964" }}>List</Text></Text>
                </View>
                <View>
                    {/* Pass the searchQuery state to the ItemsList component */}
                    <ItemsList searchQuery={searchQuery} />
                </View>


            </View>


            <View style={{ backgroundColor: "#ffffff", borderTopRightRadius: 20, borderTopLeftRadius: 20 , padding:5}}>
                <FooterMenu />
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    subcontainer: {
        margin: 15,
        
        

    },
    iconStyle: {
        marginBottom: 3,
        fontSize: 20,
        color: "grey"
    },
    userIconContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    userName: {
        marginLeft: 5,
        fontSize: 20,
    },
    headerFlex: {
        marginTop: 35,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    searchContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
    },
    searchInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#C9DED1",
        borderRadius: 10,
    },
    searchIcon: {
        fontSize: 20,
        color: "#5FC084",
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        color: "#333333",
    },
    barcodeContainer: {
        flexDirection: "row",
        margin: 10
    },
    cameraIcon: {
        fontSize: 20,
        color: "white",
        paddingHorizontal: 5,
        backgroundColor: "#5FC084",
        borderRadius: 5,
        paddingVertical: 3,
    },
    barcodeTxt: {
        marginLeft: 5,
        fontSize: 20,
        fontWeight: "500"
    },
    sectionBarCart: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
    },
    viewCartButton: {
        backgroundColor: "#5FC084",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    viewCartText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
    itemsHeaderContainer: {
        flexDirection: "row",
        margin: 10
    },
    itemsIcon: {
        fontSize: 18,
        color: "#449964",
        paddingHorizontal: 5,
        borderRadius: 5,
        paddingVertical: 3,
    },
    itemsTxtTitle: {
        marginLeft: 5,
        fontSize: 18,
        fontWeight: "500"
    },
    maintext: {
        fontSize: 16,
        margin: 20,
    },
    barcodebox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        width: 300,
        overflow: 'hidden',
        borderRadius: 30,
        backgroundColor: 'tomato'
    }

});


export default Home;