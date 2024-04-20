import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,SafeAreaView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import FooterMenu from '../../../components/Menus/FooterMenu';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import HeaderMenu from '../../../components/Menus/HeaderMenu';
// import ItemsList from './Items';
import { useCart } from '../../../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Latest10inoices from './Latest10inoices';


const Dashboard = () => {
    // const navigation = useNavigation();
    // const [searchQuery, setSearchQuery] = useState('');
    const {UserName} = useCart(); // Access the total amount from the context
    const [Itemslength, setItemsLength] = useState();
    const [Categorylength, setCategoryLength] = useState();
    const [Subcategorylength, setSubcategoryLength] = useState();


    useEffect(() => {
        fetchData();
        fetchCategories();
        fetchSubCategories();
    
      }, []);

      const fetchData = async () => {
        try {
            const response = await axios.get("/items");
            setItemsLength(response.data.length); // Use 'length' property instead of 'Length()'

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    const fetchCategories = async () => {
        try {
            const response = await axios.get("/category");
            setCategoryLength(response.data.length); // Use 'length' property instead of 'Length()'
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    const fetchSubCategories = async () => {
        try {
            const response = await axios.get("/subcategory");
            setSubcategoryLength(response.data.length); // Use 'length' property instead of 'Length()'
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    



    // Function to handle search input change
    // const handleSearchInputChange = (text) => {
    //     setSearchQuery(text);
    // };

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
            

                <View style={styles.SummaryInfo}>
                    <FontAwesome5
                        name="list"
                        style={styles.itemsIcon}
                    />
                    <Text style={styles.itemsTxtTitle}>Information <Text style={{ color: "#449964" }}>Summary</Text></Text>
                </View>

                <View style={styles.Info}>
                    <View style={styles.Card1}>
                        <Text style={styles.CardTitleText}>Number Of Categories</Text>
                        <Text style={styles.CardText}>{Categorylength}</Text>
                        </View>
                    <View style={styles.Card2}>
                    <Text style={styles.CardTitleText}>Sored Sub Categories</Text>
                    <Text style={styles.CardText}>{Subcategorylength}</Text>
                    </View>
                    <View style={styles.Card3}>
                    <Text style={styles.CardTitleText}>Number Of Items</Text>
                    <Text style={styles.CardText}>{Itemslength}</Text>
                    </View>
                </View>
                <View style={styles.shortcuts}>
                    <FontAwesome5
                        name="list"
                        style={styles.itemsIcon}
                    />
                    <Text style={styles.itemsTxtTitle}>Shortcuts </Text>
                </View>
                <View style={styles.Activity}>
                    <View style={styles.Category}>
                        <TouchableOpacity>
                            <Text style={{color:'white',fontSize:15,fontWeight:'bold', textAlign:'center'}}>Add New Category</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.Subcategory}>
                    <TouchableOpacity>
                    <Text style={{color:'white',fontSize:15,fontWeight:'bold', textAlign:'center'}}>Add Sub Category</Text>
                    </TouchableOpacity>
                    </View>
                    <View>
                    <TouchableOpacity style={styles.Items}>
                    <Text style={{color:'white',fontSize:15,fontWeight:'bold', textAlign:'center'}}>Add New Item</Text>
                    </TouchableOpacity>
                    </View>
                </View>



                <View style={styles.LatestInvoices}>
                    <FontAwesome5
                        name="list"
                        style={styles.itemsIcon}
                    />
                    <Text style={styles.itemsTxtTitle}>Latest <Text style={{ color: "#449964" }}>Invoices</Text></Text>
               
                    
                    
                </View>     
                <View style={{width:'100%',height:200}}>
                        <Latest10inoices/>
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
    SummaryInfo: {
        flexDirection: "row",
        margin: 10,
        marginTop:20
    },
    shortcuts: {
        flexDirection: "row",
        marginLeft: 10,
        marginTop:20
    },
    LatestInvoices: {
        flexDirection: "row",
        marginLeft: 10,
        marginTop:20
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
    },
    Info:{
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',


    },
    Card1:{
        height:100,
        width:100,
        backgroundColor:"#449964",
        alignSelf: 'center',
        borderTopRightRadius:10,
        borderBottomLeftRadius:10,
        padding:10,
    },
    Card2:{
        height:100,
        width:100,
        backgroundColor:"#D9AF3D",
        alignSelf: 'center',
        borderTopRightRadius:10,
        borderBottomLeftRadius:10,
        padding:10,
    },
    Card3:{
        height:100,
        width:100,
        backgroundColor:"#bd632f",
        alignSelf: 'center',
        borderTopRightRadius:10,
        borderBottomLeftRadius:10,
        padding:10,
    },
    CardText:{
        textAlign: 'center',
        color:"white",
        marginTop:"15%"
    },
    CardTitleText:{
        textAlign: 'center',
        color:"white",
        fontWeight:"bold",
        // marginTop:"40%"
    },
    Activity:{
        justifyContent:'space-between',
        flexDirection:"row",
        margin:10

    },
    Category:{
        backgroundColor:"#449964",
        padding:2,
        borderRadius:5,
        width:100,
        

    },
    Subcategory:{
        backgroundColor:"#D9AF3D",
        padding:2,
        borderRadius:5,
        width:100,
        

    },
    Items:{
        backgroundColor:"#bd632f",
        padding:2,
        borderRadius:5,
        width:100,
       
        

    },


});


export default Dashboard;