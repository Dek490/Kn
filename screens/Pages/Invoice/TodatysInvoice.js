import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TextInput,
    ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";
import { useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";
import TInvoicesList from "./TodatysInvoiceList";
import FooterMenu from "../../../components/Menus/FooterMenu";
import { useCart } from "../../../context/CartContext";
import PrintableInvoice from "./PrintableInvoice";
import { Table, Row } from "react-native-table-component";
import TInvoicesListMemoized from "./TodatysInvoiceList";
import { debounce } from 'lodash';


const TInvoices = () => {
    const [data, setData] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [MoreDetailsData, setMoreDetailsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserStatus, setSelectedUserStatus] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [ShowDeleteModal, setShowDeleteModal] = useState(false);
    const [modalVisibleForViewInv, setmodalVisibleForViewInv] = useState(false);
    const [ItemIdToUpdate, setItemIdToUpdate] = useState([]);
    const [OrderID, setOrderID] = useState();
    const [ItemID, seItemID] = useState();
    const [ItemName, setItem] = useState();
    const [OrderIdToDel, seIOrderIdToDel] = useState();
    const [ItemIDToDel, seItemIDToDel] = useState();
    const { setInvoiceItems, setInvTotalPrice } = useCart();
    const [selectedInvoice, setSelectedInvoice] = useState(null); // State to store the selected invoice for printing
    const [time, setTime] = useState(new Date());
    const [editingItemID, setEditingItemID] = useState(null);
    const [NewQty, setNewQty] = useState([]);


    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        fetchData()
        // Fetch data when component mounts
    }, [fetchData,console.log(ItemIdToUpdate)]);

    // Function to fetch invoices data from the API
    const fetchData = async () => {
        try {
            const response = await axios.get("/orders/today-invoices");
            setInvoices(response.data); // Update invoices state with fetched data
            setLoading(false); // Set loading state to false
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false); // Set loading state to false even in case of error
        }
    };

    // console.log("boono",invoices)



    useEffect(() => {
        if (selectedInvoice) {
            // Only fetch the invoice items if a selected invoice exists
            InvoiceItems(selectedInvoice.orders.order_id);
        }
    }, [selectedInvoice]);
    


    // const InvoiceItems = async () => {
    //     if (selectedInvoice && selectedInvoice.orders) {
    //         try {
    //             const response = await axios.get(
    //                 `/orders/orderlist/${selectedInvoice.orders.order_id}`
    //             );
    //             setInvoiceItems(response?.data);
    //             setTime(new Date());
    //         } catch (error) {
    //             console.error("Error fetching items:", error);
    //         }
    //     } else {
    //         // console.warn("Selected invoice or its orders are null.");
    //     }
    // };

    const InvoiceItems = async (InvoiceID) => {
        try {
            const response = await axios.get(`/orders/orderlist/${InvoiceID}`);
            setInvoiceItems(response?.data);
            setTime(new Date());
        } catch (error) {
            console.log("Error fetching Invoices:", error);
        }
    };
    




    const handleClose = () => {
        reset();
        setModalVisible(false);
        setmodalVisibleForViewInv(false);
        setShowDeleteModal(false)
    };

    useEffect(() => {
        handleEditItem()
    }, [time]);


    const handleEditItem = useCallback(async (OrderId) => {
        setOrderID(OrderId);
        try {
            const response = await axios.get(`/orders/orderlist/${OrderId}`);
            setItemIdToUpdate(response.data);
            setModalVisible(true);

        } catch (error) {
            console.log(error.message);
        }
    }, []);
    // const HandleViewInv = useCallback((Data) => {
    //     // setMoreDetailsData(Data)
    //     setSelectedInvoice(Data);

    //     setmodalVisibleForViewInv(true);
    // }, []);
    // Modify the function to handle selecting an invoice to directly fetch its details
    const HandleViewInv = useCallback((Data) => {
        setSelectedInvoice(Data);
        // Fetch invoice items data directly when selecting an invoice
        InvoiceItems(Data.orders.order_id);
        setmodalVisibleForViewInv(true);
    }, []);


    // useEffect(() => {
    //     handleDelete()
    // }, [time]);

    const handleDelete = useCallback(async (InvoiceID) => {
        try {
            await axios.delete(`/orders/invoice/${InvoiceID}`);

            // Remove the deleted invoice from the invoices state array
            setInvoices((prevInvoices) =>
                prevInvoices.filter((invoice) => invoice._id !== InvoiceID)
            );


            Toast.show({
                type: "success",
                text1: "Successfully Deleted",
                visibilityTime: 3000,
                autoHide: true,
            });

            fetchData();
        } catch (error) {
            console.log("Failed Trying",error.message);

            Toast.show({
                type: "error",
                text1: error.message,
                visibilityTime: 3000,
                autoHide: true,
            });
        }
    }, []);



    // Modify the handleDelete function to accept the item ID as a parameter




    const handleQtyEdit = async (id, Itemid) => {
        seItemID(Itemid);
        setEditingItemID(id);
    };

    const handleDeleteSpecific = async () => {
    
        // seItemID(Itemid);
        // setEditingItemID(id);
        try {
            // Delete the item from the invoice
            const response = await axios.delete(
              `/orders/invoice/${OrderIdToDel}/orders/${ItemIDToDel}`
            );
            console.log("Delete order", response.data);
      
            // Remove the returned item from the list of ItemInfo
            // setItemInfo((prevItemInfo) =>
            //   prevItemInfo.filter((item) => item.Itemid !== Itemid)
            // );
      
            // // Fetch the updated invoice data
            // const updatedInvoiceResponse = await axios.get("/orders/today-invoices");
            // const updatedInvoices = updatedInvoiceResponse.data;
      
            // // Update the invoices state array with the new data
            // setInvoices(updatedInvoices);
          } catch (error) {
            console.error("Error returning item:", error);
          }
    };

    const handleQtyChange = async (Text, value) => {
        setNewQty(value)

    };


    useEffect(() => {
        SubmitNewQty()
    }, [time]);

    const SubmitNewQty = async () => {
        try {
            const response = await axios.put(`orders/invoice/${OrderID}/orders/${ItemID}`, { order_qty: NewQty });

            Toast.show({
                type: 'success',
                text1: 'item Updated',
                visibilityTime: 3000,
                autoHide: true,
            });
            setModalVisible(false)
            setEditingItemID()
            fetchData()


        } catch (error) {
            console.log(error.message)

        }


    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.subcontainer}>
                <View style={styles.itemsHeaderContainer}>
                    <FontAwesome5 name="list" style={styles.itemsIcon} />
                    <Text style={styles.itemsTxtTitle}>
                        Invoices <Text style={{ color: "#449964" }}>List</Text>
                    </Text>
                </View>

                <View style={{ marginTop: 15 }}>
                    <TInvoicesListMemoized
                        invoices={invoices}
                        loading={loading}
                        handleEdit={handleEditItem}
                        ViewInv={HandleViewInv}
                        handleDelete={handleDelete}
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

            {/* Modal For Editing Quantity */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View>
                            <Table style={styles.table}>
                                {/* Table headers */}
                                <Row
                                    data={["#", "Name", "Qty", "Price", "Total", "Actions"]}
                                    style={styles.head}
                                    textStyle={styles.headText}
                                    flexArr={[2, 7, 4, 4, 4, 6]}
                                />
                                {/* Table rows */}
                                <ScrollView>
                                    {ItemIdToUpdate?.map((rowData, index) => (
                                        <Row
                                            key={index}
                                            data={[
                                                <Text style={styles.longText}>{index + 1}</Text>,
                                                <Text style={styles.longText}>
                                                    {rowData.description}
                                                </Text>,
                                                ItemID == null ? (
                                                    <Text style={styles.PriceQty}>
                                                        {rowData.order_qty}
                                                    </Text>
                                                ) : (
                                                    editingItemID === rowData._id ? ( // Check if the current row is being edited
                                                        <TextInput
                                                            style={styles.Specificinput}
                                                            value={rowData.order_qty}
                                                            defaultValue={rowData.order_qty.toString()}
                                                            onChangeText={(text) => handleQtyChange(rowData._id, text)}
                                                        />) : <Text style={styles.PriceQty}>
                                                        {rowData.order_qty}
                                                    </Text>),
                                                <Text style={styles.PriceQty}>${rowData.price}</Text>,
                                                <Text style={styles.PriceQty}>
                                                    {rowData.total_Price}
                                                </Text>,
                                                <View style={styles.actions}>
                                                    <TouchableOpacity
                                                        onPress={() => handleQtyEdit(rowData._id, rowData.ItemId)}
                                                        style={styles.actionButton}
                                                    >
                                                        <FontAwesome5 name="edit" size={20} color="white" />
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            seIOrderIdToDel(rowData.order_id)
                                                            seItemIDToDel(rowData.ItemId)
                                                            setItem(rowData.description)
                                                            setShowDeleteModal(true);
                                                        }}
                                                        style={[styles.actionButton, styles.deleteButton]}
                                                    >
                                                        <FontAwesome5
                                                            name="trash"
                                                            size={20}
                                                            color="white"
                                                        />
                                                    </TouchableOpacity>
                                                </View>,
                                            ]}
                                            style={styles.row}
                                            textStyle={styles.text}
                                            flexArr={[2, 7, 4, 4, 4, 6]}
                                        />
                                    ))}
                                </ScrollView>

                            </Table>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "#5FC084" }]}
                                onPress={SubmitNewQty}
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
            {/* Modal For Adding New User Ended */}

            {/* Modal For Deleting specific item */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={ShowDeleteModal}
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContents}>
            <Text style={styles.modalHeader}>
              Are You Sure to Delete
            </Text>
            <Text style={styles.ItemNames}>{ItemName}</Text>

            <View style={styles.modalFooters}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#5FC084" }]}
                onPress={handleDeleteSpecific}
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
            {/* Modal For Deleting specific item Ended */}

            {/* Modal for displaying printable invoice */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleForViewInv}
                onRequestClose={handleClose}
                style={styles.modal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Render the PrintableInvoice component */}
                        {selectedInvoice && <PrintableInvoice />}

                        {/* OK button */}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setmodalVisibleForViewInv(false)}>
                                <Text style={styles.modalButton}>Cancel</Text>
                            </TouchableOpacity>

                            {/* Left-aligned print button */}
                            <TouchableOpacity>
                                <Text style={styles.modalButtonn}>Print</Text>
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
    // modalContainer: {
    //     flex: 1,
    //     justifyContent: "center",
    //     alignItems: "center",
    //     backgroundColor: "rgba(0, 0, 0, 0.5)",
    // },
    // modalContent: {
    //     backgroundColor: "white",
    //     borderRadius: 10,
    //     padding: 20,
    //     width: "80%",
    // },
    modalHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    ItemNames: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    // modalText: {
    //     fontSize: 16,
    //     marginBottom: 5,
    // },
    // modalLabel: {
    //     fontWeight: 'bold',
    // },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 5,
    },
    modalContents: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        minWidth: 200

    },

    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
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
    modalContentt: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        justifyContent: "center",
        minWidth: 380, // Set a minimum width to ensure content is visible
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
        textAlign: "center",
        alignItems: "center",
        borderRadius: 5,
        marginBottom: 5,
        width: 50,
    },
    head: { height: 40, backgroundColor: "#C9DED1" },
    headText: { margin: 6, fontWeight: "bold" },
    table: {
        maxHeight: 370,
        minWidth: 350,
        backgroundColor: "white",
    },
    longText: {
        flex: 1, // Allow text to overflow and wrap dynamically
    },
    PriceQty: {
        flex: 1,
        textAlign: "center",
    },
    // modalFooter: {
    //     flexDirection: "row",
    //     justifyContent: "space-evenly",
    // },
    modalFooters: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
      
           },
    // modalButton: {
    //     padding: 10,
    //     borderRadius: 5,
    // },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    errorText: {
        color: "red",
        marginBottom: 5,
    },
    closeButton: {
        backgroundColor: "#E1C552",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    actionButton: {
        padding: 5,
        borderRadius: 5,
        backgroundColor: "#6cba8a",
        marginBottom: 5,
    },
    deleteButton: {
        backgroundColor: "red",
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    inputAndroid: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});
export default TInvoices;
