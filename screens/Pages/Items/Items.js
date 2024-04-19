import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, TextInput } from "react-native";
import { useForm, Controller } from "react-hook-form";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ItemsList from "./ItemsList";
import FooterMenu from "../../../components/Menus/FooterMenu";
import axios from "axios";
import Toast from "react-native-toast-message";
import RNPickerSelect from 'react-native-picker-select';
import { useFocusEffect } from '@react-navigation/native';



const Items = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategoryID, setSelectedCategoryID] = useState([]);
    const [selectedSubCategoryID, setSelectedSubCategoryID] = useState([]);
    const [data, setData] = useState([]);
    const [CateName, setCateName] = useState([]);
    const [SubCatName, setSubCatName] = useState([]);
    const [ItemIdToUpdate, setItemIdToUpdate] = useState({ id: null, name: "" }); // Updated state structure
    const { control, handleSubmit, formState: { errors }, reset } = useForm();


    useEffect(() => {
        fetchData();
        fetchCategories();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("/items");
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/category");
            setCategories(response.data);


            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (selectedCategoryID) {
            fetchSubCategories(selectedCategoryID);
        }
    }, [selectedCategoryID]);

    const fetchSubCategories = async (categoryId) => {
        if (!categoryId) {
            setSubCategories([]);
            return;
        }

        try {
            const response = await axios.get("/subcategory");
            const subCategoryData = response.data.filter(data => data.categoryId._id === categoryId);
            setSubCategories(subCategoryData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    

 



    const handleEditItem = (itemId, Xogta) => {
        setItemIdToUpdate({
            id: itemId,
            data: Xogta,
        }


        ); // Update state with both id and name
        setModalVisible(true);
        setCateName(Xogta.categoryId.CategoryName)
        setSubCatName(Xogta.subCategoryId.subCategoryName)


    };



    const handleDeleteItem = async (itemId) => {
        try {
            await axios.delete(`/items/${itemId}`);

            Toast.show({
                type: 'success',
                text1: 'Successfully Deleted',
                visibilityTime: 3000,
                autoHide: true,
            });

            fetchData();
        } catch (error) {
            console.log(error.message);

            Toast.show({
                type: 'error',
                text1: error.message,
                visibilityTime: 3000,
                autoHide: true,
            });
        }
    };

    const onSubmit = async (formData) => {
        try {
            if (ItemIdToUpdate.id) {
                await axios.put(`/items/${ItemIdToUpdate.id}`,
                    {
                        categoryId: selectedCategoryID,
                        subCategoryId: selectedSubCategoryID,
                        description: formData.description,
                        quantity: formData.quantity,
                        saleprice: formData.saleprice,
                        buyingprice: formData.buyingprice,
                        // expire_Date: formData.expire_Date,
                        made_in: formData.made_in,
                        barcode: formData.barcode,
                        supplier: formData.supplier,

                    });
                Toast.show({
                    type: 'success',
                    text1: 'item Updated',
                    visibilityTime: 3000,
                    autoHide: true,
                });
            } else {
                await axios.post('/items', {
                    categoryId: selectedCategoryID,
                    subCategoryId: selectedSubCategoryID,
                    description: formData.description,
                    quantity: formData.quantity,
                    saleprice: formData.saleprice,
                    buyingprice: formData.buyingprice,
                    // expire_Date: formData.expire_Date,
                    made_in: formData.made_in,
                    barcode: formData.barcode,
                    supplier: formData.supplier,
                });
                Toast.show({
                    type: 'success',
                    text1: 'New item Added',
                    visibilityTime: 3000,
                    autoHide: true,
                });
            }

            fetchData();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: error.message,
                visibilityTime: 3000,
                autoHide: true,
            });
        }

        setModalVisible(false);
        reset();
    };

    const handleAddCategory = () => {
        setItemIdToUpdate({ id: null, name: "" });
        setModalVisible(true);
    };

    const handleClose = () => {
        reset();
        setModalVisible(false);
     
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.subcontainer}>
                <View style={styles.itemsHeaderContainer}>
                    <FontAwesome5 name="list" style={styles.itemsIcon} />
                    <Text style={styles.itemsTxtTitle}>
                        Items <Text style={{ color: "#449964" }}>List</Text>
                    </Text>
                </View>
                <TouchableOpacity onPress={handleAddCategory} style={styles.addButton}>
                    <Text style={styles.addIcon} >Add</Text>
                </TouchableOpacity>
                <View style={{ marginTop: 15 }}>
                    <ItemsList
                        loading={loading}
                        data={data}
                        handleDelete={handleDeleteItem}
                        handleEdit={handleEditItem}
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


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>{ItemIdToUpdate.id ? "Edit Item" : "Add new item"}</Text>

                        {/* RNPickerSelect for selecting category */}

                        <RNPickerSelect
                            onValueChange={(value) => setSelectedCategoryID(value)} // handle selected value
                            items={categories.map(category => ({
                                label: category.CategoryName, value: category._id

                            }))} // items for selection
                            placeholder={{ label: 'Select a category...', value: null }} // placeholder text
                            style={{ ...pickerSelectStyles }} // custom styles if needed
                            defaultValue={CateName}

                        />
                        {/* RNPickerSelect for selecting subcategory */}
                        <RNPickerSelect
                            onValueChange={(value) => setSelectedSubCategoryID(value)} // handle selected value
                            items={subCategories.map(subCategory => ({
                                label: subCategory.subCategoryName, value: subCategory._id

                            }))} // items for selection
                            placeholder={{ label: 'Select a subcategory...', value: null }} // placeholder text
                            style={{ ...pickerSelectStyles }} // custom styles if needed
                            defaultValue={SubCatName}

                        />

                        {/* TextInput for entering description */}
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={{ flexDirection: 'column' }}>
                                    {ItemIdToUpdate.id ? (<Text style={{ marginLeft: 2 }}>Item Name:</Text>) : null}
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Description"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>

                            )}
                            name="description"
                            rules={{ required: 'description is required', minLength: { value: 3, message: 'description must be at least 3 characters' }, maxLength: { value: 50, message: 'Category name must not exceed 50 characters' } }}
                            defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.description : ''}
                        />

                        {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

                        {/* TextInput for entering quantity */}
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    {ItemIdToUpdate.id ? (<Text style={{ marginLeft: 2 }}>Quantity:</Text>) : null}
                                    <TextInput
                                        style={styles.input}
                                        placeholder="quantity"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}

                                    />
                                </>

                            )}
                            name="quantity"
                            rules={{ required: 'quantity is required' }}
                            defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.quantity.toString() : ''}
                        />

                        {errors.quantity && <Text style={styles.errorText}>{errors.quantity.message}</Text>}

                        {/* TextInput for entering saleprice */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={{ flexDirection: 'column' }}>
                                        {ItemIdToUpdate.id ? (<Text style={{ marginLeft: 2 }}>Sale Price:</Text>) : null}
                                        <TextInput
                                            style={styles.Specificinput}
                                            placeholder="saleprice"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    </View>

                                )}
                                name="saleprice"
                                rules={{ required: 'saleprice is required' }}
                                defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.saleprice.toString() : ''}
                            />

                            {errors.saleprice && <Text style={styles.errorText}>{errors.saleprice.message}</Text>}

                            {/* TextInput for entering buyingprice */}
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={{ flexDirection: 'column' }}>
                                        {ItemIdToUpdate.id ? (<Text style={{ marginLeft: 2 }}>Buy Price:</Text>) : null}
                                        <TextInput
                                            style={styles.Specificinput}
                                            placeholder="buyingprice"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    </View>

                                )}
                                name="buyingprice"
                                rules={{ required: 'buyingprice is required' }}
                                defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.buyingprice.toString() : ''}
                            />

                            {errors.buyingprice && <Text style={styles.errorText}>{errors.buyingprice.message}</Text>}
                        </View>



                        {/* TextInput for entering expire_Date */}
                        {/* <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="expire_Date"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />

                            )}
                            name="expire_Date"
                            rules={{ required: 'expire_Date is required' }}
                            defaultValue={ItemIdToUpdate.expire_Date}
                        />

                        {errors.expire_Date && <Text style={styles.errorText}>{errors.expire_Date.message}</Text>} */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                            {/* TextInput for entering made_in */}
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={{ flexDirection: 'column' }}>
                                        {ItemIdToUpdate.id ? (<Text style={{ marginLeft: 2 }}>Made in:</Text>) : null}
                                        <TextInput
                                            style={styles.Specificinput}
                                            placeholder="made_in"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    </View>

                                )}
                                name="made_in"
                                rules={{ required: 'made_in is required' }}
                                defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.made_in : ''}
                            />

                            {errors.made_in && <Text style={styles.errorText}>{errors.made_in.message}</Text>}



                            {/* TextInput for entering supplier */}
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={{ flexDirection: 'column' }}>
                                        {ItemIdToUpdate.id ? (<Text style={{ marginLeft: 2 }}>Supplier</Text>) : null}
                                        <TextInput
                                            style={styles.Specificinput}
                                            placeholder="supplier"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    </View>

                                )}
                                name="supplier"
                                rules={{ required: 'supplier is required' }}
                                defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.supplier : ''}
                            />

                            {errors.supplier && <Text style={styles.errorText}>{errors.supplier.message}</Text>}

                        </View>


                        {/* TextInput for entering barcode */}
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={{ flexDirection: 'column' }}>
                                    {ItemIdToUpdate.id ? (<Text style={{ marginLeft: 2 }}>Barcode:</Text>) : null}
                                    <TextInput
                                        style={styles.input}
                                        placeholder="barcode"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>

                            )}
                            name="barcode"
                            rules={{ required: 'barcode is required' }}
                            defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.barcode.toString() : ''}
                        />

                        {errors.barcode && <Text style={styles.errorText}>{errors.barcode.message}</Text>}




                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "#5FC084" }]}
                                onPress={handleSubmit(onSubmit)}
                            >
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "red" }]}
                                onPress={handleClose}
                            >
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
    itemsHeaderContainer: {
        flexDirection: "row",
        margin: 10,
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
        fontWeight: "500",
    },
    addButton: {
        marginLeft: "auto",
        backgroundColor: "#5FC084",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        width: "30%",
    },
    addIcon: {
        fontSize: 15,
        color: "white",
        textAlign: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        marginBottom: 5,
    },
    Specificinput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 5,
        width: 130
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
    errorText: {
        color: "red",
        marginBottom: 5,
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


export default Items;
