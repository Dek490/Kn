import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ScrollView,
    TextInput,
    SafeAreaView
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
  import FooterMenu from "../../../components/Menus/FooterMenu";
  import Modal from "react-native-modal";
  import { MaterialCommunityIcons } from "@expo/vector-icons";
  import { Entypo } from "@expo/vector-icons";
  import PrintableInvoice from "./PrintableInvoice"
  import { useCart } from "../../../context/CartContext";
  
  const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [ItemInfo, setItemInfo] = useState([]);
    const [OrderID, setOrderID] = useState();
    const [ItemID, setItemID] = useState();
    const [InvoiceID, setInvoiceID] = useState();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisible1, setModalVisible1] = useState(false);
    const [isModalVisible2, setModalVisible2] = useState(false);
    const [isModalVisible3, setModalVisible3] = useState(false);
    const [newQty, setNewQty] = useState();
    const [selectedInvoice, setSelectedInvoice] = useState(null); // State to store the selected invoice for printing
    const { setInvoiceItems, setInvTotalPrice } = useCart();
    const [time, setTime]= useState(new Date());
  
  
  
  
    useEffect(() => {
      const getInvoices = () => {
        axios
          .get("/orders/today-invoices")
          .then((resp) => {
            setInvoices(resp.data);
            setExpandedRows(new Array(resp.data.length).fill(false)); // Initialize all rows as collapsed
          })
          .catch((error) => {
            console.error("Error fetching items:", error);
          });
      };
  
      getInvoices();
    }, []);
  
    const returnInvoice = async () => {
      try {
        const response = await axios.delete(`/orders/invoice/${InvoiceID}`);
        console.log("Invoice deleted:", response.data);
  
        // Remove the deleted invoice from the invoices state array
        setInvoices((prevInvoices) =>
          prevInvoices.filter((invoice) => invoice._id !== InvoiceID)
        );
      } catch (error) {
        console.error("Error deleting invoice:", error);
        // Handle errors, such as displaying an error message to the user.
      }
    };
  
    const returnItem = async () => {
      try {
        // Delete the item from the invoice
        const response = await axios.delete(
          `/orders/invoice/${OrderID}/orders/${ItemID}`
        );
        console.log("Delete order", response.data);
  
        // Remove the returned item from the list of ItemInfo
        setItemInfo((prevItemInfo) =>
          prevItemInfo.filter((item) => item.ItemId !== ItemID)
        );
  
        // Fetch the updated invoice data
        const updatedInvoiceResponse = await axios.get("/orders/today-invoices");
        const updatedInvoices = updatedInvoiceResponse.data;
  
        // Update the invoices state array with the new data
        setInvoices(updatedInvoices);
      } catch (error) {
        console.error("Error returning item:", error);
        // Handle errors, such as displaying an error message to the user.
      }
    };
  
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };
  
    const EditQuantity = async () => {
      try {
        await axios.put(`orders/invoice/${OrderID}/orders/${ItemID}`, { order_qty: newQty });
  
        // Fetch the updated item details for the selected order
        const response = await axios.get(`/orders/orderlist/${OrderID}`);
        const updatedItems = response.data;
  
        // Update the ItemInfo state array with the new item details
        setItemInfo(updatedItems);
      } catch (error) {
        console.error("Error editing quantity:", error);
        // Handle errors, such as displaying an error message to the user.
      }
    }
  
  
    const toggleModal1 = () => {
      setModalVisible1(!isModalVisible1);
    };
  
    const toggleModal2 = () => {
      setModalVisible2(!isModalVisible2);
    };
  
    const toggleModal3 = () => {
      setModalVisible3(!isModalVisible3);
    };
  
    const toggleRowExpansion = async (index, orderID) => {
      setOrderID(orderID);
      // Fetch item details for the selected order
      const response = await axios.get(`/orders/orderlist/${orderID}`);
      const items = response.data;
      setItemInfo(items);
      // Toggle expansion for the selected row
      const newExpandedRows = [...expandedRows];
      newExpandedRows[index] = !newExpandedRows[index];
      setExpandedRows(newExpandedRows);
  
      // Close other expanded rows
      const updatedExpandedRows = newExpandedRows.map((row, idx) =>
        idx === index ? row : false
      );
      setExpandedRows(updatedExpandedRows);
    };
  
    useEffect(() => {
      InvoiceItems();
    }, [selectedInvoice,time]);
    
    const InvoiceItems = async () => {
      if (selectedInvoice && selectedInvoice.orders) {
        try {
          const response = await axios.get(`/orders/orderlist/${selectedInvoice.orders.order_id}`);
          setInvoiceItems(response?.data);
          setTime(new Date());
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      } else {
        // console.warn("Selected invoice or its orders are null.");
      }
    }
    
    
    
    
  
  
    const renderItemDetails = (order) => {
      return (
        <View style={styles.detailsContainer}>
          <View style={{ flexDirection: "row", backgroundColor: "#5FC084" }}>
            <Text style={styles.detailsHeader}>Name</Text>
            <Text style={styles.detailsHeader}>Qty</Text>
            <Text style={styles.detailsHeader}>Price</Text>
            <Text style={styles.detailsHeader}>Total</Text>
            <Text style={styles.detailsHeader}>Actions</Text>
          </View>
          {ItemInfo?.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.detailsCellForDescription}>
                {item.description}
              </Text>
              <Text style={styles.detailsCell}>{item.order_qty}</Text>
              <Text style={styles.detailsCell}>${item.price}</Text>
              <Text style={styles.detailsCell}>${item.total_Price}</Text>
              <Text style={[styles.detailsCell]}>
                <TouchableOpacity onPress={() => {
                  toggleModal2();
                  setItemID(item.ItemId);
                }}>
                  <Text>
                    <Entypo
                      name="edit"
                      style={[styles.editIcon, styles.iconMargin]}
                    />
                    {"     "}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setItemID(item.ItemId);
                    toggleModal();
                  }}
                >
                  <Text>
                    <FontAwesome5
                      name="undo"
                      style={[styles.returnIcon, { marginRight: 10 }]}
                    />
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          ))}
        </View>
      );
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subcontainer}>
          <View style={styles.containerr}>
            <View style={styles.headerRow}>
              <Text style={[styles.cell, styles.headerSecondColumn]}>#</Text>
              <Text style={[styles.cell, styles.header]}>Inv.No</Text>
              <Text style={[styles.cell, styles.header]}>Items</Text>
              <Text style={[styles.cell, styles.header]}>T.Qty</Text>
              <Text style={[styles.cell, styles.header]}>Price</Text>
              <Text style={[styles.cell, styles.header]}>Details</Text>
              <Text style={[styles.cell, styles.header]}>Action</Text>
            </View>
            <View style={styles.tableContainer}>
              <FlatList
                data={invoices}
                renderItem={({ item, index }) => (
                  <ScrollView>
                    <View style={styles.row}>
                      <Text style={styles.Hashcell}>{item.numberOfInvoice}</Text>
                      <Text style={styles.cell}>
                        {item.orders?.order_id || "N/A"}
                      </Text>
                      <Text style={styles.cell}>
                        {item.orders?.totalOrders || "N/A"}
                      </Text>
                      <Text style={styles.CellOrganizing}>
                        {item.orders?.totalQuantity || "N/A"}
                      </Text>
                      <Text style={styles.CellOrganizing}>
                        ${item.orders?.totalPrice || "N/A"}
                      </Text>
  
                      <TouchableOpacity
                        style={styles.DownArrow}
                        onPress={() =>
                          toggleRowExpansion(index, item.orders?.order_id)
                        }
                      >
                        <Text style={{ color: 'white' }}>{expandedRows[index] ? "▲" : "▼"}</Text>
                      </TouchableOpacity>
  
                      <View style={styles.cell}>
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity
                            style={styles.EyeOpacity}
                            onPress={() => {
                              setSelectedInvoice(item); // Set the selected invoice
                              InvoiceItems();
                              setInvTotalPrice(item.orders?.totalPrice);
                              toggleModal3(); // Show the modal
                            }}
                          >
                            <Text>
                              <FontAwesome5
                                name="eye"
                                style={styles.viewIcon}
                              />
                              {"    "}
                            </Text>
                          </TouchableOpacity>
  
                          <TouchableOpacity
                            onPress={() => {
                              setInvoiceID(item._id);
                              toggleModal1();
                            }}
                            style={styles.RefunAlldIcon}>
                            <MaterialCommunityIcons
                              name="cash-refund"
                              style={styles.cancelInvIcon}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
  
                    {expandedRows[index] && renderItemDetails(item.orders)}
                  </ScrollView>
                )}
                keyExtractor={(item) => item._id}
              />
            </View>
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
  
        {/* modelForrefudAll */}
        <Modal isVisible={isModalVisible1} style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure to refund?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={toggleModal1}>
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  returnInvoice();
                  toggleModal1();
                }}
              >
                <Text style={styles.modalButton}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
  
        {/* modelForrefudSpecic */}
        <Modal isVisible={isModalVisible} style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure to return?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={toggleModal}>
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  returnItem();
                  toggleModal();
                }}
              >
                <Text style={styles.modalButton}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
  
        {/* Modal for Editing The Quantity */}
        <Modal isVisible={isModalVisible2} style={styles.modal}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.numberInput}
              placeholder="Enter a number"
              keyboardType="numeric"
              onChangeText={(text) => setNewQty(text)}
            />
  
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={toggleModal2}>
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  EditQuantity()
                  toggleModal2();
                }}
              >
                <Text style={styles.modalButton}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
  
  
        {/* Modal for displaying printable invoice */}
        <Modal isVisible={isModalVisible3} style={styles.modal}>
          <View style={styles.modalContentt}>
  
  
            {/* Render the PrintableInvoice component */}
            {selectedInvoice && <PrintableInvoice/>}
  
            {/* OK button */}
            <View style={styles.modalButtonss}>
              <TouchableOpacity onPress={() => setModalVisible3(false)}>
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>
              {/* Left-aligned print button */}
              <TouchableOpacity >
                <Text style={styles.modalButtonn}>Print</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
  
  
  
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    numberInput: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    container: {
      flex: 1,
      justifyContent: "space-between",
      marginTop: 1,
    },
    subcontainer: {
      margin: 5,
    },
    containerr: {
      padding: 5,
      backgroundColor: "#fff",
      borderRadius: 2,
    },
    headerRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      paddingVertical: 5,
    },
    tableContainer: {
      maxHeight: 500, // Fixed height for 10 rows
      overflow: "scroll", // Enable scrolling
    },
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      paddingVertical: 5,
    },
    header: {
      flex: 1,
      fontWeight: "bold",
      fontSize: 14,
    },
    headerSecondColumn: {
      flex: 0.5,
      fontWeight: "bold",
      fontSize: 16,
    },
    cell: {
      flex: 0.4,
      fontSize: 14,
    },
    Hashcell: {
      flex: 0.2,
      fontSize: 14,
    },
    firstColumn: {
      flex: 0.5, // Adjusted flex for the first column
    },
    detailsContainer: {
      borderTopWidth: 1,
      borderTopColor: "#ccc",
      paddingVertical: 5,
    },
    detailsHeader: {
      flex: 1,
      fontWeight: "bold",
      fontSize: 14,
      color: "#ffffff",
    },
    detailsRow: {
      flexDirection: "row",
      paddingVertical: 5,
    },
    detailsCell: {
      flex: 0.5,
      fontSize: 14,
    },
    DownArrow: {
      flex: 0.2,
      fontSize: 14,
      backgroundColor: '#E1C552',
      justifyContent: 'center',
      alignItems: 'center',
  
    },
    editIcon: {
      flex: 1,
      color: "#5FC084",
      fontSize: 16,
    },
    returnIcon: {
      color: "tomato",
      fontSize: 16,
      marginRight: 10,
    },
    CellOrganizing: {
      flex: 0.3,
    },
    ayaga: {
      justifyContent: "space-around",
    },
    viewIcon: {
      color: "white",
      fontSize: 16,
    },
    cancelInvIcon: {
      color: "white",
      fontSize: 20,
    },
    detailsCellForDescription: {
      flex: 1,
      fontSize: 16,
    },
    // // styles for modal content
    modalContent: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      height: 250, // Set fixed height
      width: 250,
      justifyContent: "center", // Align content vertically at the center
      alignSelf: "center", // Align modal horizontally at the center
    },
  
    modalText: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: "center",
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    modalButtonss: {
      flexDirection: "row",
      justifyContent: "flex-end",
  
    },
    modalButton: {
      fontSize: 16,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "#ccc",
      color: "#333",
    },
    modalButtonn: {
      fontSize: 16,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "#ccc",
      color: "#333",
      marginLeft: 10,
    },
  
    modal: {
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    EyeOpacity: {
      backgroundColor: '#5FC084',
      alignItems: 'center',
      justifyContent: 'center',
    },
    RefunAlldIcon: {
      flex: 1,
      fontSize: 14,
      backgroundColor: 'tomato',
      justifyContent: 'center',
      alignItems: 'center',
  
    },
    // Update styles for modal content
    modalContentt: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      justifyContent: "center",
      minWidth: 380, // Set a minimum width to ensure content is visible
    },
  
    // Add styles for the print button
    printButton: {
      fontSize: 16,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "#ccc",
      color: "#333",
      marginBottom: 20, // Add some bottom margin for spacing
    },
  });
  
  export default Invoices;
  