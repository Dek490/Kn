import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select'; // Import RNPickerSelect
import axios from 'axios'
import Toast from 'react-native-toast-message';
// Define your ItemsList component
const UsersList = ({ loading,data,handleDelete,handleEdit,Seemore}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // State to hold the items per page
    const [searchText, setSearchText] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
    const [showUpdateRoleModal, setShowUpdateRoleModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // State to hold the selected item for "See More"
    const [UserToDe, setUserToDe] = useState(null); // State to hold the item to delete
    const [userIdToUpdateStatus, setUserIdToUpdateStatus] = useState(null);
    const [userIdToUpdateRole, setUserIdToUpdateRole] = useState(null);
    const [selectedUserStatus, setSelectedUserStatus] = useState();
    const [selectedUserRole, setSelectedUserRole] = useState();
    const [UserName, setUserName] = useState();

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
    };


    const handleClose = () => {
        setShowDeleteModal(false);
        setShowUpdateStatusModal(false);
        setShowUpdateRoleModal(false);

    };

    // Handle delete action
    const handleDeleteUser = () => {
        handleDelete(UserToDe)
        handleCloseDeleteModal();
    };
    const handleStatusUpdate = (UserId,UserName) => {
        setUserIdToUpdateStatus(UserId)
        setUserName(UserName)
        setShowUpdateStatusModal(true)
        
    };
    const handleRoleUpdate = (UserId,UserName) => {
        setUserIdToUpdateRole(UserId)
        setUserName(UserName)
        setShowUpdateRoleModal(true)
        
    };


    const StatusUpdate = async()=>{
        await axios.put(`/users/status/${userIdToUpdateStatus}`,
        {
            status:selectedUserStatus

        })
        Toast.show({
            type: "success",
            text1: "User Status updated successfully",
            visibilityTime: 3000,
            autoHide: true,
          });
          setShowUpdateStatusModal(false)


    }
    const RoleUpdate = async()=>{
        await axios.put(`/users/role/${userIdToUpdateRole}`,
        {
            role:selectedUserRole

        })
        Toast.show({
            type: "success",
            text1: "User Status updated successfully",
            visibilityTime: 3000,
            autoHide: true,
          });
          setShowUpdateRoleModal(false)


    }




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
                placeholder="Search User"
                value={searchText}
                onChangeText={setSearchText}
            />

            {/* Table */}
            <View>
                <Table style={styles.table}>
                    {/* Table headers */}
                    <Row data={['#', 'Name', 'Status', 'Role', 'Actions']} style={styles.head} textStyle={styles.headText} flexArr={[2, 5, 4, 4, 6, 4]} />
                    {/* Table rows */}
                    <ScrollView>
                    {data.map((rowData, index) => (
                        <Row
                            key={index}
                            data={[
                                <Text style={styles.longText}>{index + 1}</Text>,
                                <Text style={styles.longText}>{rowData.username}</Text>,
                                <Text style={styles.PriceQty} onPress={() => handleStatusUpdate(rowData._id,rowData.username)}>▼{rowData.status}</Text>,
                                <Text style={styles.RowCell}  onPress={() => handleRoleUpdate(rowData._id,rowData.username)}>▼{rowData.role}</Text>,
                                
                                
                                <View style={styles.actions}>
                                    <TouchableOpacity onPress={() => {
                                        Seemore(rowData);
                                    }} style={[styles.actionButton, styles.seeMoreButton]}>
                                        <Text style={styles.buttonText}>---</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleEdit(rowData)} style={styles.actionButton}>
                                        <FontAwesome name="edit" size={20} color="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        setUserToDe(rowData._id);
                                        setShowDeleteModal(true);
                                    }} style={[styles.actionButton, styles.deleteButton]}>
                                        <FontAwesome name="trash" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ]}
                            style={styles.row}
                            textStyle={styles.text}
                            flexArr={[2, 5,5, 5,7, 4]}
                        />
                    ))}
                    </ScrollView>
                </Table>
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
                                onPress={handleDeleteUser}
                            >
                                <Text style={styles.buttonText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Update Status Modal */}
             <Modal
                animationType="slide"
                transparent={true}
                visible={showUpdateStatusModal}
                onRequestClose={handleClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeaderForStatus}>Update Status:</Text>
                        <Text style={styles.Username}>{UserName}</Text>
                        <View>
                    <RNPickerSelect
                onValueChange={(value) => setSelectedUserStatus(value)} // handle selected value
                items={[
                  { label: "Active", value: "Active" },
                  { label: "Pending", value: "Pending" },
                ]} // items for selection
                placeholder={{ label: 'Select a User...', value: null }} // placeholder text
                style={{ ...pickerSelectStyles }} // custom styles if needed
              />
              </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "red" }]}
                                onPress={handleClose}
                            >
                                <Text style={styles.buttonText}>No</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "#5FC084" }]}
                                onPress={StatusUpdate}
                            >
                                <Text style={styles.buttonText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Update Role Modal */}
             <Modal
                animationType="slide"
                transparent={true}
                visible={showUpdateRoleModal}
                onRequestClose={handleClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeaderForStatus}>Update Status:</Text>
                        <Text style={styles.Username}>{UserName}</Text>
                        <View>
                    <RNPickerSelect
                onValueChange={(value) => setSelectedUserRole(value)} // handle selected value
                items={[
                  { label: "Admin", value: "Admin" },
                  { label: "Sales", value: "Sales" },
                ]} // items for selection
                placeholder={{ label: 'Select a User...', value: null }} // placeholder text
                style={{ ...pickerSelectStyles }} // custom styles if needed
              />
              </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "red" }]}
                                onPress={handleClose}
                            >
                                <Text style={styles.buttonText}>No</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "#5FC084" }]}
                                onPress={RoleUpdate}
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
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    modalHeaderForStatus: {
        fontSize: 17,
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
    PriceQty:{
        flex: 1,
        textAlign: 'left',
        backgroundColor:"#a8e6b1",
        borderRadius:3,
        marginRight:2,
        fontSize:13,
        
    },
    RowCell:{
        flex: 1,
        textAlign: 'left',
        backgroundColor:"#edb42f",
        borderRadius:3,
        marginLeft:2,
        fontSize:13
    },
    Username:{
        textAlign: 'center',
        fontSize:16,
        fontWeight:'600',
        backgroundColor:"#edb42f",
        borderRadius:5,

    }
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

export default UsersList;


