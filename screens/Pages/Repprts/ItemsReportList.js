import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select'; // Import RNPickerSelect
import moment from 'moment';
import axios from 'axios'
// Define your ItemsReportList component
const ItemsReportList = ({ loading, data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // State to hold the items per page
    const [searchText, setSearchText] = useState('');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // State to hold the selected item for "See More"

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('DD-MM-YYYY hh:mm');
    };


    // Calculate pagination variables
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.filter(item =>
        item.subCategoryId.subCategoryName.toLowerCase().includes(searchText.toLowerCase())
    ).slice(indexOfFirstItem, indexOfLastItem);



    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
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
            <View style={styles.searchSelecView}>
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
                    inputIOS: styles.dropdownInputt,
                    inputAndroid: styles.dropdownInput,
                    iconContainer: styles.iconContainer,
                }}
            />
            </View>

            {/* Table */}
            <View>
                <Table style={styles.table}>
                    {/* Table headers */}
                    <Row data={['#', 'Name', 'Price', 'Qty','Date', 'More']} style={styles.head} textStyle={styles.headText}     flexArr={[2, 7, 4, 4, 6, 4]} />
                    {/* Table rows */}
                    <ScrollView>
                    {currentItems.map((rowData, index) => (
                        <Row
                            key={index}
                            data={[
                                <Text style={styles.longText}>{indexOfFirstItem + index + 1}</Text>,
                                <Text style={styles.longText}>{rowData.subCategoryId.subCategoryName}</Text>,
                                <Text style={styles.PriceQty}>${rowData.buyingprice}</Text>,
                                <Text style={styles.PriceQty}>{rowData.quantity}</Text>,
                                <Text style={styles.longText}>{formatDate(rowData.createdAt)}</Text>,
                                <View style={styles.actions}>
                                    <TouchableOpacity onPress={() => {
                                        setSelectedItem(rowData);
                                        setShowDetailsModal(true);
                                    }} style={[styles.actionButton, styles.seeMoreButton]}>
                                        <Text style={styles.buttonText}>---</Text>
                                    </TouchableOpacity>
                                </View>
                            ]}
                            style={styles.row}
                            textStyle={styles.text}
                            flexArr={[2, 7, 4, 4,7, 4]} // Adjust the flexArr as needed
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
        padding: 8,
        marginBottom: 1,
        width: '100%',
    },
    pageSelect: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    table: {
        maxHeight: 300,
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
    searchSelecView:{
        backgroundColor:"white",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
       
    },
   
    
      dropdownInputt: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 10,
        marginBottom: 1
      },
      PriceQty:{
        flex: 1,
        textAlign: 'center',
    }
  
});

export default ItemsReportList;




