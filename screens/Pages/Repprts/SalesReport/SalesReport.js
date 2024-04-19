import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, TextInput, ScrollView, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import Toast from "react-native-toast-message";
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker
import SalesReportList from "./SalesReportList";
import FooterMenu from "../../../../components/Menus/FooterMenu";


const SaleReport = () => {
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [fromDate, setFromDate] = useState(new Date()); // Initialize with a valid Date object
    const [toDate, setToDate] = useState(new Date()); // Initialize with a valid Date object
    const [data, setData] = useState([]);
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);

    useEffect(() => {
        fetchSaleReportByCategory();
        fetchCategories();
    }, []);

    const fetchSaleReportByCategory = async (categoryId) => {
        try {
            if(categoryId){
             const response = await axios.get(`/orders/category/${categoryId}/report`, {
                params: {
                    fromDate: fromDate,
                    toDate: toDate
                }
            });
            setData(response?.data);
            }
            else{
                const response = await axios.get("/orders");
                setData(response?.data);

            }

        } catch (error) {
            console.error("Error fetching orders report by category:", error);
        }
    };


    useEffect(() => {
        if (selectedCategory) {
            fetchSaleReportByCategory(selectedCategory);
        }

        
    }, [selectedCategory, fromDate, toDate]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/category");
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleFromDateChange = (event, selectedDate) => {
        setShowFromDatePicker(false);
        if (selectedDate) {
            setFromDate(selectedDate);
        }
    };

    const handleToDateChange = (event, selectedDate) => {
        setShowToDatePicker(false);
        if (selectedDate) {
            setToDate(selectedDate);
        }
    };

    console.log("categories:", categories);
console.log("selectedCategory:", selectedCategory);



    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.subcontainer}>
                <View style={styles.ordersHeaderContainer}>
                    <FontAwesome5 name="list" style={styles.ordersIcon} />
                    <Text style={styles.ordersTxtTitle}>
                        orders Report <Text style={{ color: "#449964" }}>List</Text>
                    </Text>
                </View>

                <View style={styles.SelectingCategory}>
                    <RNPickerSelect
                        onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
                        items={categories.map(category => ({ label: category.CategoryName, value: category._id }))}
                        value={selectedCategory}
                        style={{
                            inputIOS: styles.dropdownInput,
                            inputAndroid: styles.dropdownInput,
                            iconContainer: styles.iconContainer
                        }}
                    />
                </View>

                <View style={styles.dateInputContainer}>
                    <TouchableOpacity onPress={() => setShowFromDatePicker(true)}>
                        <Text style={styles.dateInputLabel}>From Date: </Text>
                        <Text style={styles.dateInputText}>{fromDate.toDateString()}</Text>
                    </TouchableOpacity>
                    {showFromDatePicker && (
                        <DateTimePicker
                            value={fromDate}
                            mode="date"
                            display="default"
                            onChange={handleFromDateChange}
                        />
                    )}

                    <TouchableOpacity onPress={() => setShowToDatePicker(true)}>
                        <Text style={styles.dateInputLabel}>To Date: </Text>
                        <Text style={styles.dateInputText}>{toDate.toDateString()}</Text>
                    </TouchableOpacity>
                    {showToDatePicker && (
                        <DateTimePicker
                            value={toDate}
                            mode="date"
                            display="default"
                            onChange={handleToDateChange}
                        />
                    )}
                </View>


                <View style={{ marginTop: 15 }}>
                    <SalesReportList
                        loading={loading}
                        data={data}
                    />
                </View>

            </View>

            <View
                style={{
                    backgroundColor: "#ffffff",
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                    padding: 5,
                }}
            >
                <FooterMenu />
            </View>


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    subcontainer: {
        margin: 15,
    },
    ordersHeaderContainer: {
        flexDirection: "row",
        marginBottom:5,
    },
    ordersIcon: {
        fontSize: 18,
        color: "#449964",
        paddingHorizontal: 5,
        borderRadius: 5,
        paddingVertical: 3,
    },
    ordersTxtTitle: {
        marginLeft: 5,
        fontSize: 18,
        fontWeight: "500",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignorders: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        width: "80%",
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    modalFooter: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },

    SelectingCategory: {
        backgroundColor: "#C9DED1",
        borderRadius: 10,
        height: 50,
        marginBottom: 5,

    },
    dateInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 5,

    },
    dateInputLabel: {
        fontSize: 16,
        marginRight: 5,
    },
    dateInputText: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        backgroundColor: '#C9DED1',
        justifyContent:"space-between",
    },
    dateInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginRight: 10,
        backgroundColor: '#C9DED1',
    },

    dropdownInput: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,

        color: '#449964',


        paddingRight: 30,
    },




});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    inputAndroid: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,

    },
});




export default SaleReport;
