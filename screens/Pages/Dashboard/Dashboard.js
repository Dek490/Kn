import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity,SafeAreaView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import FooterMenu from '../../../components/Menus/FooterMenu';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import HeaderMenu from '../../../components/Menus/HeaderMenu';
// import ItemsList from './Items';
import { useCart } from '../../../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Latest10inoices from './Latest10inoices';
import Toast from "react-native-toast-message";
import RNPickerSelect from 'react-native-picker-select';

const Dashboard = () => {
    // const navigation = useNavigation();
    // const [searchQuery, setSearchQuery] = useState('');
    const {UserName} = useCart(); // Access the total amount from the context
    const [Itemslength, setItemsLength] = useState();
    const [Categorylength, setCategoryLength] = useState();
    const [Subcategorylength, setSubcategoryLength] = useState();
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategoryID, setSelectedCategoryID] = useState([]);
    const [selectedSubCategoryID, setSelectedSubCategoryID] = useState([]);
    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [CateName, setCateName] = useState([]);
    const [SubCatName, setSubCatName] = useState([]);
    const [isCategory, setIsCategory] = useState(false);
    const [isSubCatgory, setisSubCategory] = useState(false);
    const [isItem, setIsItem] = useState(false);

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
            setCategories(response.data);
            setCategoryLength(response.data.length); // Use 'length' property instead of 'Length()'

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
            setSubcategoryLength(response.data.length); // Use 'length' property instead of 'Length()'
            setCateName(response.data.CategoryName)
            setSubCategories(subCategoryData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    const onSubmit = async (formData) => {
        try {

            if(isCategory){
                await axios.post('/category', {
                    CategoryName:formData.CategoryName
                });
                Toast.show({
                    type: 'success',
                    text1: 'New Category Added',
                    visibilityTime: 3000,
                    autoHide: true,
                });
                fetchCategories()

            }else if(isItem){

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

            fetchData();
            }else if(isSubCatgory){
                await axios.post('/subcategory', {categoryId:selectedCategoryID, subCategoryName: formData.subCategoryName });
                Toast.show({
                  type: 'success',
                  text1: 'New Sub Category Added',
                  visibilityTime: 3000,
                  autoHide: true,
                });

                fetchSubCategories()

            }



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

    const handleClose = () => {
        reset();
        setModalVisible(false);
     
    };

    const AddNewItem =()=>{
        setModalVisible(true)
        setIsItem(true)
        setisSubCategory(false)
        setIsCategory(false)

    }
    const AddNewCategory =()=>{
        setModalVisible(true)
        setIsCategory(true)
        setisSubCategory(false)
        setIsItem(false)
        

    }
    const AddNewSubcategory =()=>{
        setModalVisible(true)
        setIsCategory(false)
        setisSubCategory(true)
        setIsItem(false)

    }
    

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
                        <TouchableOpacity onPress={AddNewCategory}>
                            <Text style={{color:'white',fontSize:15,fontWeight:'bold', textAlign:'center'}}>Add New Category</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.Subcategory}>
                    <TouchableOpacity  onPress={AddNewSubcategory}>
                    <Text style={{color:'white',fontSize:15,fontWeight:'bold', textAlign:'center'}}>Add Sub Category</Text>
                    </TouchableOpacity>
                    </View>
                    <View>
                    <TouchableOpacity style={styles.Items}  onPress={AddNewItem}>
                    <Text style={{color:'white',fontSize:15,fontWeight:'bold', textAlign:'center'}}>Add New Item</Text>
                    </TouchableOpacity>
                    </View>
                </View>


                <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Add New</Text>


                        {isCategory && (

                            <View>
                                             {/* RNPickerSelect for selecting category */}
                     
                    {/* TextInput for entering description */}
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={{ flexDirection: 'column' }}>
                   
                                <TextInput
                                    style={styles.input}
                                    placeholder="CategoryName"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            </View>

                        )}
                        name="CategoryName"
                        rules={{ required: 'CategoryName is required', minLength: { value: 3, message: 'CategoryName must be at least 3 characters' }, maxLength: { value: 50, message: 'Category name must not exceed 50 characters' } }}
                        // defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.CategoryName : ''}
                    />

                    {errors.CategoryName && <Text style={styles.errorText}>{errors.CategoryName.message}</Text>}

                    </View>
     
                        )}

                        {isSubCatgory && (
                            <View>

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


                        {/* TextInput for entering description */}
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={{ flexDirection: 'column' }}>
                       
                                    <TextInput
                                        style={styles.input}
                                        placeholder="subCategoryName"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>

                            )}
                            name="subCategoryName"
                            rules={{ required: 'subCategoryName is required', minLength: { value: 2, message: 'subCategoryName must be at least 2 characters' }, maxLength: { value: 50, message: 'Category name must not exceed 50 characters' } }}
                            // defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.subCategoryName : ''}
                        />

                        {errors.subCategoryName && <Text style={styles.errorText}>{errors.subCategoryName.message}</Text>}

                           </View>
                        )}


                        {isItem && (
                            <View>
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
                            // defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.description : ''}
                        />

                        {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

                        {/* TextInput for entering quantity */}
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                    
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
                            // defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.quantity.toString() : ''}
                        />

                        {errors.quantity && <Text style={styles.errorText}>{errors.quantity.message}</Text>}

                        {/* TextInput for entering saleprice */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={{ flexDirection: 'column' }}>
    
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
                                // defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.saleprice.toString() : ''}
                            />

                            {errors.saleprice && <Text style={styles.errorText}>{errors.saleprice.message}</Text>}

                            {/* TextInput for entering buyingprice */}
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={{ flexDirection: 'column' }}>

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
                                // defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.buyingprice.toString() : ''}
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
                                // defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.made_in : ''}
                            />

                            {errors.made_in && <Text style={styles.errorText}>{errors.made_in.message}</Text>}



                            {/* TextInput for entering supplier */}
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={{ flexDirection: 'column' }}>
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
                                // defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.supplier : ''}
                            />

                            {errors.supplier && <Text style={styles.errorText}>{errors.supplier.message}</Text>}

                        </View>


                        {/* TextInput for entering barcode */}
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={{ flexDirection: 'column' }}>
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
                            // defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.barcode.toString() : ''}
                        />

                        {errors.barcode && <Text style={styles.errorText}>{errors.barcode.message}</Text>}


                            </View>
                        )}



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


export default Dashboard;