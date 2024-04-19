import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select'; // Import RNPickerSelect


// Define your ItemsList component
const ItemsList = ({ loading, data, handleDelete, handleEdit }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // State to hold the items per page
    const [searchText, setSearchText] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // State to hold the selected item for "See More"
    const [itemToDelete, setItemToDelete] = useState(null); // State to hold the item to delete

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
    };

    // Calculate pagination variables
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.filter(item =>
        item.subCategoryId.subCategoryName.toLowerCase().includes(searchText.toLowerCase())
    ).slice(indexOfFirstItem, indexOfLastItem);

    const handleClose = () => {
        setShowDeleteModal(false);
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle delete action
    const handleDeleteItem = () => {
        handleDelete(itemToDelete);
        handleCloseDeleteModal();
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View>
            {/* Filter input */}
            <TextInput
                style={styles.input}
                placeholder="Search by name"
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
                    <Row data={['#', 'Name', 'Price', 'Qty', 'Actions']} style={styles.head} textStyle={styles.headText} flexArr={[2, 7, 4, 4, 6, 4]} />
                    {/* Table rows */}
                    <ScrollView>
                    {currentItems.map((rowData, index) => (
                        <Row
                            key={index}
                            data={[
                                <Text style={styles.longText}>{indexOfFirstItem + index + 1}</Text>,
                                <Text style={styles.longText}>{rowData.description}</Text>,
                                <Text style={styles.PriceQty}>${rowData.buyingprice}</Text>,
                                <Text style={styles.PriceQty}>{rowData.quantity}</Text>,
                                
                                
                                <View style={styles.actions}>
                                    <TouchableOpacity onPress={() => {
                                        setSelectedItem(rowData);
                                        setShowDetailsModal(true);
                                    }} style={[styles.actionButton, styles.seeMoreButton]}>
                                        <Text style={styles.buttonText}>---</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleEdit(rowData._id, rowData)} style={styles.actionButton}>
                                        <FontAwesome name="edit" size={20} color="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        setItemToDelete(rowData._id);
                                        setShowDeleteModal(true);
                                    }} style={[styles.actionButton, styles.deleteButton]}>
                                        <FontAwesome name="trash" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ]}
                            style={styles.row}
                            textStyle={styles.text}
                            flexArr={[2, 7, 4, 4,7, 4]}
                        />
                    ))}
                    </ScrollView>
                </Table>
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
                onRequestClose={handleClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Are You Sure To Delete</Text>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "red" }]}
                                onPress={handleClose}
                            >
                                <Text style={styles.buttonText}>No</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "#5FC084" }]}
                                onPress={handleDeleteItem}
                            >
                                <Text style={styles.buttonText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* See More Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showDetailsModal}
                onRequestClose={handleCloseDetailsModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Item Details</Text>
                        <ScrollView style={styles.modalScrollView}>
                            {/* <Text>Name: {selectedItem?.subCategoryId.subCategoryName}</Text>
                            <Text>Price: {selectedItem?.buyingprice}</Text>
                            <Text>Quantity: {selectedItem?.quantity}</Text>
                            Add more details as needed */}


                            <Text style={styles.modalText}><Text style={styles.modalLabel}>Category:</Text> {selectedItem?.categoryId.CategoryName || 'N/A'}</Text>
                            <Text style={styles.modalText}><Text style={styles.modalLabel}>Name:</Text> {selectedItem?.subCategoryId.subCategoryName || 'N/A'}</Text>
                            <Text style={styles.modalText}><Text style={styles.modalLabel}>Description:</Text> {selectedItem?.description || 'N/A'}</Text>
                            <Text style={styles.modalText}><Text style={styles.modalLabel}>Sale Price:</Text> ${selectedItem?.saleprice || 'N/A'}</Text>
                            <Text style={styles.modalText}><Text style={styles.modalLabel}>Price:</Text> ${selectedItem?.buyingprice || 'N/A'}</Text>
                            <Text style={styles.modalText}><Text style={styles.modalLabel}>Quantity:</Text> {selectedItem?.quantity || 'N/A'}</Text>
                            <Text style={styles.modalText}><Text style={styles.modalLabel}>Barcode:</Text> {selectedItem?.barcode || 'N/A'}</Text>
                            <Text style={styles.modalText}><Text style={styles.modalLabel}>Made in:</Text> {selectedItem?.made_in || 'N/A'}</Text>
                            <Text style={styles.modalText}><Text style={styles.modalLabel}>Supplier:</Text> {selectedItem?.supplier || 'N/A'}</Text>
                            <Text style={styles.modalText}><Text style={styles.modalLabel}>Expire Date:</Text> {selectedItem?.expire_Date || 'N/A'}</Text>

                        </ScrollView>
                        <TouchableOpacity style={styles.closeButton} onPress={handleCloseDetailsModal}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
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
        maxHeight: 370,
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

export default ItemsList;


