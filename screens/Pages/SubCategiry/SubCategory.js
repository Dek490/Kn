import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, TextInput } from "react-native";
import { useForm, Controller } from "react-hook-form";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import SubCategoryList from "./SubCategoryList";
import FooterMenu from "../../../components/Menus/FooterMenu";
import axios from "axios";
import Toast from "react-native-toast-message";
import RNPickerSelect from 'react-native-picker-select';


const SubCategory = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryID, setSelectedCategoryID] = useState([]);
  const [data, setData] = useState([]);
  const [CateName, setCateName] = useState([]);
  const [SubCategoryIdToUpdate, setSubCategoryIdToUpdate] = useState({ id: null, name: "" }); // Updated state structure
  const { control, handleSubmit, formState: { errors }, reset } = useForm();


  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/subcategory");
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


  const handleEditCategory = (subCategoryId, categoryName,subCategoryName,categoryId) => {
    setSubCategoryIdToUpdate({ id: subCategoryId, CategoryName: categoryName ,subCategoryName:subCategoryName,categoryId:categoryId}); // Update state with both id and name
    setModalVisible(true);
    setCateName(categoryName)
    
    
  };

  

  const handleDeleteCategory = async (subCategoryId) => {
    try {
      await axios.delete(`/subcategory/${subCategoryId}`);

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
      if (SubCategoryIdToUpdate.id) {
        await axios.put(`/subcategory/${SubCategoryIdToUpdate.id}`, 
        { 
            categoryId: selectedCategoryID ,
            subCategoryName:formData.subCategoryName
        });
        Toast.show({
          type: 'success',
          text1: 'SubCategory Updated',
          visibilityTime: 3000,
          autoHide: true,
        });
      } else {
        await axios.post('/subcategory', {categoryId:selectedCategoryID, subCategoryName: formData.subCategoryName });
        Toast.show({
          type: 'success',
          text1: 'New Sub Category Added',
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
    setSubCategoryIdToUpdate({ id: null, name: "" });
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
          SubCategory <Text style={{ color: "#449964" }}>List</Text>
          </Text>
        </View>
        <TouchableOpacity onPress={handleAddCategory} style={styles.addButton}>
          <Text style={styles.addIcon} >Add</Text> 
        </TouchableOpacity>
        <View style={{ marginTop: 15 }}>
          <SubCategoryList
            loading={loading}
            data={data}
            handleDelete={handleDeleteCategory}
            handleEdit={handleEditCategory}
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
      <Text style={styles.modalHeader}>{SubCategoryIdToUpdate.id ? "Edit Sub Category" : "Add SubCategory"}</Text>

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

      {/* TextInput for entering subcategory name */}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="SubCategory Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="subCategoryName"
        rules={{ required: 'SubCategory name is required', minLength: { value: 3, message: 'SubCategory name must be at least 3 characters' }, maxLength: { value: 50, message: 'Category name must not exceed 50 characters' } }}
        defaultValue={SubCategoryIdToUpdate.subCategoryName}
      />
      
      {errors.subCategoryName && <Text style={styles.errorText}>{errors.subCategoryName.message}</Text>}
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
  

export default SubCategory;
