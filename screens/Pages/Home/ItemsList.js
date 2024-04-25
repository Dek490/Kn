import React, { useState, useEffect,memo,useCallback  } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Pressable,ActivityIndicator, TextInput } from 'react-native';
import axios from 'axios';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Modal from 'react-native-modal';
import { useCart } from '../../../context/CartContext';
import { useNavigation } from '@react-navigation/native';
// import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import { Currecy } from '../../../shared/config';

const ItemsList = ({ searchQuery, scannedBarcode }) => {
  //Holds Item List
  const [itemsList, setItemsList] = useState([]);
  //Holds Selected Item to View its Details
  const [selectedItem, setSelectedItem] = useState(null);
  //Holds Popup to View Selected Item
  const [isModalVisible, setModalVisible] = useState(false);
  //Edit Qty Model
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editItemQuantity, setEditItemQuantity] = useState(0);
  //Selected Category to filter items of that category
  const [selectedCategory, setSelectedCategory] = useState(null);
  //Category List
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();
  //Add To the Cart list
  const { addToCart, setCartData, cartItems,setCartItems } = useCart();
  const [time, setTime] = useState(new Date());
//Loading 
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(true);


//Category List Api
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);


  //Filtering Items by Category
  const fetchItemsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(`/items/category/${categoryId}`);
      setItemsList(response.data);
    } catch (error) {
      console.error("Error fetching items by category:", error);
    }
  };

  //Items list Api
  useEffect(() => {
    if (selectedCategory) {
      fetchItemsByCategory(selectedCategory);
    } else {
      // If no category is selected, fetch all items
      const fetchAllItems = async () => {
        try {
          const response = await axios.get("/items");

          setItemsList(response.data);
          setLoading(false)
          setTime(new Date());
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      };
      fetchAllItems();
    }
  }, [selectedCategory, time]);

  //Put the selected to the cart list
  const handleAddToCart = (item) => {
    console.log("clicked before")
    addToCart(item);
    console.log("clicked after")
  };

  const handleScanResult = (item) => {
    addToCart(item);
    alert(`${item.subCategoryId.subCategoryName}`, handleAddToCart);
  };

  //Searching item by name and barcode
  const filteredItems = itemsList.filter((item) => {
    const descriptionMatch = item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const barcodeMatch = item.barcode && item.barcode.toString().includes(searchQuery);
    return descriptionMatch || barcodeMatch;
  });

//Popup to show the details of specific item
  const toggleModal = (item) => {
    setSelectedItem(item);
    setModalVisible(!isModalVisible);

  };
  const toggleModal1 = () => {
    setEditModalVisible(false)
  };
  const handleQuantityChange = (value) => {

    const updatedCartItems = cartItems.map((cartItem) => {
      if (cartItem._id === editItemQuantity._id) {
        return { ...cartItem, quantity: parseInt(value, 10) };
      }
      return cartItem;
    });
    setCartItems(updatedCartItems)

};


  if (loading) {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
}

  return (
    <View style={styles.container}>
      <View style={styles.SelectingCategory}>
        {/* <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}>
        <Picker.Item label="Select Category" value={null} />
        {categories.map((category) => (
          <Picker.Item label={category.CategoryName} value={category._id} key={category._id} />
        ))}
      </Picker> */}
        {/* <RNPickerSelect
          onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
          items={categories.map(category => ({ label: category.CategoryName, value: category._id }))} // Convert your categories array to an array of objects with label and value properties
          value={selectedCategory}
        /> */}

        <RNPickerSelect
  onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
  items={categories.map(category => ({ label: category.CategoryName, value: category._id }))} // Convert your categories array to an array of objects with label and value properties
  value={selectedCategory}
  style={{
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    iconContainer: {
      top: 10,
      right: 12,
    },
  }}
/>



      </View>
      <View style={styles.headerRow}>
        <Text style={[styles.headerSecondColumn]}>#</Text>
        <Text style={[styles.Nameheader]}>Name</Text>
        <Text style={[styles.header,styles.Columns]}>Qty</Text>
        <Text style={[styles.header,styles.Columns]}>Price</Text>
        <Text style={[styles.cell, styles.header]}>Actions</Text>
      </View>
      <View style={styles.tableContainer}>
        <FlatList
          data={filteredItems.length > 0 ? filteredItems : itemsList}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={[styles.cell, styles.firstColumn]}>{index + 1}</Text>
              <Text style={[styles.widthIncrease]}>{item.subCategoryId?.subCategoryName || 'N/A'}</Text>
              <Text style={styles.QTYColumns}>{item.quantity || 'N/A'}</Text>
              <Text style={[styles.cell, styles.Columns]}>{Currecy}:{item.buyingprice || 'N/A'}</Text>
              
              <TouchableOpacity onPress={() => toggleModal(item)} style={styles.seemoreButton}>
                <Text style={styles.seemoreText}>---</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAddToCart(item)} style={styles.cartButton} >
                <FontAwesome5 name="shopping-cart" style={styles.cartIcon} />
                {cartItems.find((cartItem) => cartItem._id === item._id) && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{cartItems.find((cartItem) => cartItem._id === item._id).quantity}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() =>  
              {
                console.log("Edited",cartItems.find((cartItem) => cartItem._id === item._id)?.quantity || 0);
                setIndex(index)
                  setEditItemQuantity(cartItems.find((cartItem) => cartItem._id === item._id));
                  setEditModalVisible(true);
              
              }} 

               

               >
                 <FontAwesome5 name="ellipsis-v" color={'#595454'} style={styles.iconStyle} />
             </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedItem?.name || 'N/A'}</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.modalText}><Text style={styles.modalLabel}>Description:</Text> {selectedItem?.description || 'N/A'}</Text>
            <Text style={styles.modalText}><Text style={styles.modalLabel}>Sale Price:</Text> ${selectedItem?.saleprice || 'N/A'}</Text>
            <Text style={styles.modalText}><Text style={styles.modalLabel}>Price:</Text> ${selectedItem?.buyingprice || 'N/A'}</Text>
            <Text style={styles.modalText}><Text style={styles.modalLabel}>Quantity:</Text> {selectedItem?.quantity || 'N/A'}</Text>
            <Text style={styles.modalText}><Text style={styles.modalLabel}>Barcode:</Text> {selectedItem?.barcode || 'N/A'}</Text>
            <Text style={styles.modalText}><Text style={styles.modalLabel}>Made in:</Text> {selectedItem?.made_in || 'N/A'}</Text>
            <Text style={styles.modalText}><Text style={styles.modalLabel}>Supplier:</Text> {selectedItem?.supplier || 'N/A'}</Text>
            <Text style={styles.modalText}><Text style={styles.modalLabel}>Expire Date:</Text> {selectedItem?.expire_Date || 'N/A'}</Text>
          </ScrollView>
          <Pressable style={styles.closeButton} onPress={toggleModal}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </Modal>

      {editModalVisible && (
      <Modal isVisible={editModalVisible} onBackdropPress={()=>{
        setEditModalVisible(false)
      }} style={styles.modal2}>
        <View style={styles.modalContent2}>
            <View style={styles.modalText2}>
              <Text style={styles.modalLabel2}>Edit the Quantity Of</Text>
              <Text> {editItemQuantity?.description || 'N/A'}</Text>
             </View>
            <TextInput
  style={styles.quantityInput}
  value={editItemQuantity?.quantity?.toString()}
  onChangeText={(value) => handleQuantityChange(value)}
  keyboardType="numeric"
/>
          <Pressable style={styles.closeButton2} onPress={toggleModal1}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 2,
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

  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdownLabel: {
    marginRight: 10,
  },
  dropdownInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  iconStyle: {
    marginBottom: 3,
    alignSelf: 'center',
    fontSize: 25,
    marginTop: 5,
    marginLeft: 5,
  },

  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  tableContainer: {
    maxHeight: 330, // Fixed height for 10 rows
    overflow: 'scroll', // Enable scrolling
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  header: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
  },
  Nameheader: {
    flex: 1.4,
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerSecondColumn: {
    flex: 0.5,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cell: {
    flex: 1,
    fontSize: 14,
  },
  Namecell: {
    flex: 1,
    fontSize: 14,
  },
  firstColumn: {
    flex: 0.5, // Adjusted flex for the first column
  },
  Columns: {
    fontSize: 14,
  },
  QTYColumns: {
    fontSize: 14,
    flex:0.8,
    marginLeft:3

  },
  seemoreButton: {
    backgroundColor: "#E1C552",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  cartButton: {
    flexDirection: 'row', // Added flexDirection
    backgroundColor: "#5FC084",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginLeft: 5,
  },
  cartIcon: {
    fontSize: 20,
    color: "white",
  },
  quantityText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 5, // Adjust as needed
  },
  closeButton: {
    backgroundColor: "#E1C552",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 80,
    position: "absolute",
    right: 15,
    bottom: 10,
  },
  closeButton2: {
    backgroundColor: "#E1C552",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 80,
    marginTop:10,
    justifyContent: "center",

  },
  seemoreText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  closeText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  modal: {
    margin: 0,
  },
  modal2: {
    margin: 0,
    maxHeight:250,
    justifyContent: "center",
    position:'absolute',
    top:'45%',
    left:'18%'

  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
    alignSelf: 'center',
  },
  modalContent2: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    height:200,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalText2: {
    marginBottom: 5,
    flexDirection: 'column',
  },
  modalLabel: {
    fontWeight: 'bold',
  },
  modalLabel2: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    maxHeight: 300, // Adjust as needed
  },
  widthIncrease: {
    fontSize:14,
    flex: 1.5, // Adjust as needed
  },
  badgeContainer: {
    position: "absolute",
    top: 1,
    right: 3,
    backgroundColor: "red",
    borderRadius: 100,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  SelectingCategory: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    height: 50,

  },
});


export default ItemsList;