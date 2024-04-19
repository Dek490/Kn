import React, { useEffect, useState, useCallback } from "react";
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
import axios from "axios";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FooterMenu from "../../../components/Menus/FooterMenu";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import PrintableInvoice from "./PrintableInvoice";
import { Table, Row } from 'react-native-table-component';
import { useCart } from "../../../context/CartContext"
const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [itemInfo, setItemInfo] = useState([]);
  const [orderID, setOrderID] = useState();
  const [itemID, setItemID] = useState();
  const [invoiceID, setInvoiceID] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [isModalVisible3, setModalVisible3] = useState(false);
  const [newQty, setNewQty] = useState();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { setInvoiceItems, setInvTotalPrice } = useCart();
  const [time, setTime] = useState(new Date());

  useEffect(() => {

    const getInvoices = async () => {
      try {
        const resp = await axios.get("/orders/all-invoices");
        setInvoices(resp.data);
        // console.log(resp.data);
         
        setExpandedRows(new Array(resp.data.length).fill(false));
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

   

    getInvoices();
  }, []);

  const returnInvoice = useCallback(async () => {
    try {
      const response = await axios.delete(`/orders/invoice/${invoiceID}`);
      console.log("Invoice deleted:", response.data);
      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice._id !== invoiceID)
      );
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  }, [invoiceID]);

  const returnItem = useCallback(async () => {
    try {
      const response = await axios.delete(
        `/orders/invoice/${orderID}/orders/${itemID}`
      );
      console.log("Delete order", response.data);
      setItemInfo((prevItemInfo) =>
        prevItemInfo.filter((item) => item.ItemId !== itemID)
      );
      const updatedInvoiceResponse = await axios.get("/orders/all-invoices");
      const updatedInvoices = updatedInvoiceResponse.data;
      setInvoices(updatedInvoices);
    } catch (error) {
      console.error("Error returning item:", error);
    }
  }, [orderID, itemID]);

  const toggleModal = useCallback(() => {
    setModalVisible((prev) => !prev);
  }, []);

  const EditQuantity = useCallback(async () => {
    try {
      await axios.put(`orders/invoice/${orderID}/orders/${itemID}`, {
        order_qty: newQty
      });
      const response = await axios.get(`/orders/orderlist/${orderID}`);
      const updatedItems = response.data;
      setItemInfo(updatedItems);
    } catch (error) {
      console.error("Error editing quantity:", error);
    }
  }, [orderID, itemID, newQty]);

  const toggleModal1 = useCallback(() => {
    setModalVisible1((prev) => !prev);
  }, []);

  const toggleModal2 = useCallback(() => {
    setModalVisible2((prev) => !prev);
  }, []);

  const toggleModal3 = useCallback(() => {
    setModalVisible3((prev) => !prev);
  }, []);

  const toggleRowExpansion = useCallback(async (index, orderID) => {
    setOrderID(orderID);
    const response = await axios.get(`/orders/orderlist/${orderID}`);
    const items = response.data;
    setItemInfo(items);
    const newExpandedRows = [...expandedRows];
    newExpandedRows[index] = !newExpandedRows[index];
    setExpandedRows(newExpandedRows);
    const updatedExpandedRows = newExpandedRows.map((row, idx) =>
      idx === index ? row : false
    );
    setExpandedRows(updatedExpandedRows);
  }, [expandedRows]);

  useEffect(() => {
    InvoiceItems();
  }, [selectedInvoice, time]);

  const InvoiceItems = useCallback(async () => {
    if (selectedInvoice && selectedInvoice.orders) {
      try {
        const response = await axios.get(
          `/orders/orderlist/${selectedInvoice.orders.order_id}`
        );
        setInvoiceItems(response?.data);
        setTime(new Date());
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }
  }, [selectedInvoice, setInvoiceItems, time]);

//   const renderItemDetails = useCallback((order) => {
//     return (
//       <View style={styles.detailsContainer}>
//         <View style={{ flexDirection: "row", backgroundColor: "#5FC084" }}>
//           <Text style={styles.detailsHeader}>Name</Text>
//           <Text style={styles.detailsHeader}>Qty</Text>
//           <Text style={styles.detailsHeader}>Price</Text>
//           <Text style={styles.detailsHeader}>Total</Text>
//           <Text style={styles.detailsHeader}>Actions</Text>
//         </View>
//         {itemInfo?.map((item, index) => (
//           <View key={index} style={styles.row}>
//             <Text style={styles.detailsCellForDescription}>
//               {item.description}
//             </Text>
//             <Text style={styles.detailsCell}>{item.order_qty}</Text>
//             <Text style={styles.detailsCell}>${item.price}</Text>
//             <Text style={styles.detailsCell}>${item.total_Price}</Text>
//             <Text style={[styles.detailsCell]}>
//               <TouchableOpacity onPress={() => {toggleModal2(); setItemID(item.ItemId);}}>
//                 <Text>
//                   <Entypo name="edit" style={[styles.editIcon, styles.iconMargin]} />
//                   {"     "}
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => {setItemID(item.ItemId); toggleModal();}}>
//                 <Text>
//                   <FontAwesome5 name="undo" style={[styles.returnIcon, { marginRight: 10 }]} />
//                 </Text>
//               </TouchableOpacity>
//             </Text>
//           </View>
//         ))}
//       </View>
//     );
//   }, [itemInfo, toggleModal, toggleModal2]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subcontainer}>
        <View style={styles.containerr}>
        <Table style={styles.table}>
                    {/* Table headers */}
                    <Row data={['#', 'Inv No', 'Items', 'Qty', 'Total','Actions']} style={styles.head} textStyle={styles.headText} flexArr={[2, 4, 4, 4, 4, 6]} />
                    {/* Table rows */}
                    <ScrollView>
                    {invoices.map((rowData, index) => (
                        <Row
                            key={index}
                            data={[
                                <Text style={styles.longText}>{index + 1}</Text>,
                                <Text style={styles.longText}>{rowData?.orders.order_id}</Text>,
                                <Text style={styles.PriceQty}>${rowData?.orders.totalOrders}</Text>,
                                <Text style={styles.PriceQty}>{rowData?.orders.totalQuantity}</Text>,
                                <Text style={styles.PriceQty}>{rowData?.orders.totalPrice}</Text>,
                                
                                
                                <View style={styles.actions}>
                                    <TouchableOpacity onPress={() => {
                                        setSelectedItem(rowData);
                                        setShowDetailsModal(true);
                                    }} style={[styles.actionButton, styles.seeMoreButton]}>
                                        <Text style={styles.buttonText}>---</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleEdit(rowData._id, rowData)} style={styles.actionButton}>
                                        <FontAwesome5 name="edit" size={20} color="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        setItemToDelete(rowData._id);
                                        setShowDeleteModal(true);
                                    }} style={[styles.actionButton, styles.deleteButton]}>
                                        <FontAwesome5 name="trash" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ]}
                            style={styles.row}
                            textStyle={styles.text}
                            flexArr={[2, 4, 3, 4,4, 6]}
                        />
                    ))}
                    </ScrollView>
                </Table>
        </View>
      </View>
      <View style={{ backgroundColor: "#ffffff", borderTopRightRadius: 20, borderTopLeftRadius: 20, padding: 5 }}>
        <FooterMenu />
      </View>
      {/* Modal for refund all */}
      <Modal isVisible={isModalVisible1} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Are you sure to refund?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={toggleModal1}>
              <Text style={styles.modalButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { returnInvoice(); toggleModal1(); }}>
              <Text style={styles.modalButton}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal for refund specific */}
      <Modal isVisible={isModalVisible} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Are you sure to return?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.modalButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { returnItem(); toggleModal(); }}>
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
            <TouchableOpacity onPress={() => { EditQuantity(); toggleModal2(); }}>
              <Text style={styles.modalButton}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal for displaying printable invoice */}
      <Modal isVisible={isModalVisible3} style={styles.modal}>
        <View style={styles.modalContentt}>
          {selectedInvoice && <PrintableInvoice />}
          <View style={styles.modalButtonss}>
            <TouchableOpacity onPress={() => setModalVisible3(false)}>
              <Text style={styles.modalButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity>
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

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
},
pageSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
},
table: {
    maxHeight: 500,
    minWidth: 320,
    backgroundColor: 'white',
},
head: { height: 40, backgroundColor: '#C9DED1' },
headText: { margin: 6, fontWeight: 'bold' },
row: {
    flexDirection: 'row',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
},
text: { margin: 6 },
pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
},
pageLink: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
},
disabled: {
    opacity: 0.5,
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
deleteButton: {
    backgroundColor: 'red',
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
Buttons: {
  backgroundColor: "#6cba8a",
  paddingVertical: 5,
  borderRadius: 5,
  width: "45%",
  alignContent: "center",
  alignItems: "center",
  justifyContent: "center",
},
DelButtons: {
  backgroundColor: "red",
  paddingVertical: 5,
  borderRadius: 5,
  width: "45%",
  alignContent: "center",
  alignItems: "center",
  justifyContent: "center",
},


buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',

},
closeButton: {
    backgroundColor: '#E1C552',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
},
longText: {
    flex: 1, // Allow text to overflow and wrap dynamically
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
PriceQty:{
    flex: 1,
    textAlign: 'center',
}
});

export default AllInvoices;
