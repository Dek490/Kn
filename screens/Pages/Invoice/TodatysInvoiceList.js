import React, { useEffect,memo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ActivityIndicator, FlatList } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useCart } from '../../../context/CartContext';


// Define your ItemsList component

const TInvoicesList = ({ invoices, loading, handleDelete, handleEdit, ViewInv }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // State to hold the items per page
    const [searchText, setSearchText] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // State to hold the selected item for "See More"
    const [InvToDe, setInvToDe] = useState(null); // State to hold the item to delete
    const { setInvTotalPrice } = useCart();


    // Calculate pagination variables
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = invoices.filter(item =>
        item.orders.order_id?.toString().includes(searchText)
    ).slice(indexOfFirstItem, indexOfLastItem);

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteInvoice = () => {
        handleDelete(InvToDe)
        handleCloseDeleteModal();
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    if (invoices.length === 0) {
        return <Text>No available invoice today</Text>;
    }

    return (
        <View>
            {/* Filter input */}
            <TextInput
                style={styles.input}
                placeholder="Search Invoice"
                value={searchText}
                onChangeText={setSearchText}
            />
            <RNPickerSelect
                onValueChange={(value) => setItemsPerPage(value)}
                items={[
                    { label: '5', value: 5 },
                    { label: '10', value: 10 },
                    { label: '100', value: 100 },
                ]}
                value={itemsPerPage}
                style={{
                    inputIOS: styles.dropdownInput,
                    inputAndroid: styles.dropdownInput,
                    iconContainer: styles.iconContainer,
                }}
            />
            {/* Table */}
            <View>
                <Table style={styles.table}>
                    {/* Table headers */}
                    <Row data={['#', 'Inv_No', 'items', 'price', 'tQty', 'Actions']} style={styles.head} textStyle={styles.headText} flexArr={[2, 5, 4, 4, 4, 6]} />
                </Table>
                <FlatList
                    data={currentItems}
                    renderItem={({ item, index }) => (
                        <Row
                            key={index}
                            data={[
                                <Text style={styles.longText}>{item?.numberOfInvoice}</Text>,
                                <Text style={styles.longText}>{item?.orders.order_id}</Text>,
                                <Text style={styles.longText}>{item?.orders.totalOrders}</Text>,
                                <Text style={styles.PriceQty}>${item?.orders.totalPrice}</Text>,
                                <Text style={styles.PriceQty}>{item?.orders.totalQuantity}</Text>,
                                <View style={styles.actions}>

                                    <TouchableOpacity onPress={() => handleEdit(item.orders.order_id)} style={styles.actionButton}>
                                        <FontAwesome name="edit" size={20} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        ViewInv(item)
                                        setInvTotalPrice(item.orders?.totalPrice);
                                    }} style={[styles.actionButton, styles.ViewInvButton]}>
                                        <FontAwesome5
                                            name="eye"
                                            style={styles.viewIcon}
                                        />

                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        setInvToDe(item._id);
                                        setShowDeleteModal(true);
                                    }} style={[styles.actionButton, styles.deleteButton, styles.RefunAlldIcon]}>
                                        <MaterialCommunityIcons
                                            name="cash-refund"
                                            style={styles.cancelInvIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ]}
                            style={styles.row}
                            textStyle={styles.text}
                            flexArr={[3, 6, 4, 4, 4, 8]}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />


            </View>

            {/* Pagination */}
            <View style={styles.pagination}>
                <TouchableOpacity onPress={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <Text style={[styles.pageLink, currentPage === 1 && styles.disabled]}>Previous</Text>
                </TouchableOpacity>
                <Text>{currentPage}</Text>
                <TouchableOpacity
                    onPress={() => handlePageChange(currentPage + 1)}
                    disabled={currentItems.length < itemsPerPage}
                >
                    <Text style={[styles.pageLink, currentItems.length < itemsPerPage && styles.disabled]}>Next</Text>
                </TouchableOpacity>
            </View>

            {/* Delete Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showDeleteModal}
                onRequestClose={handleCloseDeleteModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Are You Sure To Return</Text>
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "red" }]}
                                onPress={handleCloseDeleteModal}
                            >
                                <Text style={styles.buttonText}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "#5FC084" }]}
                                onPress={handleDeleteInvoice}
                            >
                                <Text style={styles.buttonText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
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
        maxHeight: 450,
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
    ViewInvButton: {
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
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
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
    // PriceQty: {
    //     flex: 1,
    //     textAlign: 'left',
    //     backgroundColor: "#a8e6b1",
    //     borderRadius: 3,
    //     marginRight: 2,
    //     fontSize: 13,

    // },
    PriceQty: {
        flex: 1,
        textAlign: 'center',
    },
    RowCell: {
        flex: 1,
        textAlign: 'left',
        backgroundColor: "#edb42f",
        borderRadius: 3,
        marginLeft: 2,
        fontSize: 13
    },
    Username: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        backgroundColor: "#edb42f",
        borderRadius: 5,

    },
    viewIcon: {
        color: "white",
        fontSize: 16,
    },
    RefunAlldIcon: {
        flex: 1,
        fontSize: 14,
        backgroundColor: 'tomato',
        justifyContent: 'center',
        alignItems: 'center',

    },
    cancelInvIcon: {
        color: "white",
        fontSize: 20,
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



export default memo(TInvoicesList);
