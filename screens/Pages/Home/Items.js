import React, { useState, useEffect,memo,useCallback } from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity, ScrollView, Pressable, TextInput } from 'react-native';
import axios from 'axios';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Modal from 'react-native-modal';
import { useCart } from '../../../context/CartContext';
import { useNavigation } from '@react-navigation/native';
// import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import { Table, Row } from 'react-native-table-component';
import { Currecy } from '../../../shared/config';

const ItemsList = ({ searchQuery, scannedBarcode }) => {
  //Holds Item List
  const [itemsList, setItemsList] = useState([]);
  //Holds Selected Item to View its Details
  const [selectedItem, setSelectedItem] = useState(null);
  //Holds Popup to View Selected Item
  const [isModalVisible, setModalVisible] = useState(false);
  //Selected Category to filter items of that category
  const [selectedCategory, setSelectedCategory] = useState(null);
  //Category List
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();
  //Add To the Cart list
  const { addToCart, setCartData, cartItems } = useCart();
  const [time, setTime] = useState(new Date());


//Category List Api
  useEffect(() => {
    fetchCategories();

  }, [time]);

    const fetchCategories = useCallback(async () => {
      try {
        const response = await axios.get("/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },[]);

  //Filtering Items by Category
  const fetchItemsByCategory = useCallback(async (categoryId) => {
    try {
      const response = await axios.get(`/items/category/${categoryId}`);
      setItemsList(response.data);
    } catch (error) {
      console.error("Error fetching items by category:", error);
    }
  },[]);

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
    addToCart(item);
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
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };



  let Data= filteredItems.length > 0 ? filteredItems : itemsList

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
      {/* <View style={styles.headerRow}>
        <Text style={[styles.cell, styles.headerSecondColumn]}>#</Text>
        <Text style={[styles.cell, styles.header]}>Name</Text>
        <Text style={[styles.cell, styles.header]}>Price</Text>
        <Text style={[styles.cell, styles.header]}>Qty</Text>
        <Text style={[styles.cell, styles.header]}>Actions</Text>
      </View>
      <View style={styles.tableContainer}>
        <FlatList
          data={filteredItems.length > 0 ? filteredItems : itemsList}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={[styles.cell, styles.firstColumn]}>{index + 1}</Text>
              <Text style={[styles.cell, styles.widthIncrease]}>{item.subCategoryId?.subCategoryName || 'N/A'}</Text>
              <Text style={[styles.cell, styles.Columns]}>{Currecy}{item.buyingprice || 'N/A'}</Text>
              <Text style={styles.cell}>{item.quantity || 'N/A'}</Text>
              <TouchableOpacity onPress={() => toggleModal(item)} style={styles.seemoreButton}>
                <Text style={styles.seemoreText}>---</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAddToCart(item)} style={styles.cartButton}>
                <FontAwesome5 name="shopping-cart" style={styles.cartIcon} />
                {cartItems.find((cartItem) => cartItem._id === item._id) && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{cartItems.find((cartItem) => cartItem._id === item._id).quantity}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      </View> */}


                  {/* Table */}
                  <View>
                <Table style={styles.table}>
                    {/* Table headers */}
                    <Row data={['#', 'Name', 'Price', 'Qty', 'Actions']} style={styles.head} textStyle={styles.headText} flexArr={[2, 7, 4, 4, 6, 4]} />
                    {/* Table rows */}
                    <ScrollView>
                    <FlatList 
                           data={filteredItems.length > 0 ? filteredItems : itemsList}
                           renderItem={({ item, index }) => (
                        <Row
                            key={index}
                            data={[
                                <Text style={styles.longText}>{index + 1}</Text>,
                                <Text style={styles.longText}>{item.description}</Text>,
                                <Text style={styles.PriceQty}>${item.buyingprice}</Text>,
                                <Text style={styles.PriceQty}>{item.quantity}</Text>,
                                
                                
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={() => {
                            setSelectedItem(item);
                            toggleModal()

                        }}
                         style={styles.seemoreButton}>
                         <Text style={styles.seemoreText}>---</Text>
                        </TouchableOpacity>
                         <TouchableOpacity onPress={() => handleAddToCart(item)} style={styles.cartButton}>
                         <FontAwesome5 name="shopping-cart" style={styles.cartIcon} />
                         {cartItems.find((cartItem) => cartItem._id === item._id) && (
                         <View style={styles.badgeContainer}>
                       <Text style={styles.badgeText}>{cartItems.find((cartItem) => cartItem._id === item._id).quantity}</Text>
                    </View>
                )}
              </TouchableOpacity>

                                </View>
                            ]}
                            style={styles.row}
                            textStyle={styles.text}
                            flexArr={[2, 7, 4, 4,7, 4]}
                        />
                    )}
                    />
                    </ScrollView>
                </Table>
            </View>
      <Modal isVisible={isModalVisible} onRequestClose={() =>toggleModal} style={styles.modal}>
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
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  headerSecondColumn: {
    flex: 0.5,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cell: {
    flex: 1,
    fontSize: 16,
  },
  firstColumn: {
    flex: 0.5, // Adjusted flex for the first column
  },
  Columns: {
    marginLeft: 10,
  },
  seemoreButton: {
    backgroundColor: "#E1C552",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cartButton: {
    flexDirection: 'row', // Added flexDirection
    backgroundColor: "#5FC084",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 5,
  },
  cartIcon: {
    fontSize: 19,
    color: "white",
    paddingHorizontal: 5,
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
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
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
  modalLabel: {
    fontWeight: 'bold',
  },
  scrollView: {
    maxHeight: 300, // Adjust as needed
  },
  widthIncrease: {
    flex: 2.5, // Adjust as needed
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
  table: {
    maxHeight: 370,
    minWidth: 320,
    backgroundColor: 'white',
},
actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
},
actionButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#6cba8a',
    marginBottom: 5
},
seeMoreButton: {
    backgroundColor: '#E1C552',

},
});


export default memo(ItemsList);