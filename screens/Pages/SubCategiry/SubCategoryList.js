// import React, { useState } from "react";
// import {
//     View,
//     ActivityIndicator,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     Modal,
//     Text,
// } from "react-native";
// import { Table, Row } from "react-native-table-component";
// import { FontAwesome } from "@expo/vector-icons";

// const CategoryList = ({ loading, data, handleDelete, handleEdit }) => {
//     const [showModal, setShowModal] = useState(false);
//     const [SubCategoryToDelete, setSubCategoryToDelete] = useState(null);
//     // const [SubCategoryToUpdate, setSubCategoryToUpdate] = useState(null);

//     const handleClose = () => {
//         setShowModal(false);
//     };

//     const handleDeleteItem = () => {
//         console.log('delete', SubCategoryToDelete)
//         handleDelete(SubCategoryToDelete);
//         handleClose();
//     };

//     if (loading) {
//         return (
//             <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//                 <ActivityIndicator size="large" color="#0000ff" />
//             </View>
//         );
//     }

//     return (
//         <View style={styles.ViewGuud}>
//             <Table style={styles.table}>
//                 <Row
//                     data={["#", "Category","SubCategory", "Actions"]}
//                     style={styles.head}
//                     textStyle={styles.text}
//                     flexArr={[2, 5,6 ,3]}
//                 />
//                 <ScrollView>
//                     {data.map((rowData, index) => (
//                         <Row
//                             key={index}
//                             data={[
//                                 index + 1,
//                                 <Text style={styles.longText}>{rowData.categoryId.CategoryName}</Text>,
//                                 <Text style={styles.longText}>{rowData.subCategoryName}</Text>,
                                


//                                 <View style={{ flexDirection: "row" ,justifyContent:'space-between' }}>
//                                     <TouchableOpacity onPress={() => handleEdit(rowData._id,rowData.categoryId.CategoryName,rowData.subCategoryName)} style={styles.Buttons}>
//                                         <FontAwesome
//                                             name="edit"
//                                             size={20}
//                                             color="white"
//                                             style={{ width: '20px' }}
//                                         />
//                                     </TouchableOpacity>
//                                     <TouchableOpacity style={styles.DelButtons}
//                                         onPress={() => {
//                                             setSubCategoryToDelete(rowData._id);
//                                             setShowModal(true);
//                                         }}
//                                     >
//                                         <FontAwesome name="trash" size={20} color="white" />
//                                     </TouchableOpacity>
//                                 </View>,
//                             ]}
//                             style={[styles.row, index % 2]}
//                             textStyle={styles.text}
//                             flexArr={[2, 5,6, 3]}
//                         />
//                     ))}
//                 </ScrollView>
//             </Table>

//             {/* Delete Modal */}
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={showModal}
//                 onRequestClose={handleClose}
//             >
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                         <Text style={styles.modalHeader}>Are You Sure To Delete</Text>

//                         <View style={styles.modalFooter}>
//                             <TouchableOpacity
//                                 style={[styles.modalButton, { backgroundColor: "red" }]}
//                                 onPress={handleClose}
//                             >
//                                 <Text style={styles.buttonText}>No</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                                 style={[styles.modalButton, { backgroundColor: "#5FC084" }]}
//                                 onPress={handleDeleteItem}
//                             >
//                                 <Text style={styles.buttonText}>Yes</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     ViewGuud: {
//         maxHeight: 450,
//     },
//     table: {
//         minWidth: 320,
//         backgroundColor: "white",
//     },
//     head: { height: 40, backgroundColor: "#C9DED1" },
//     text: { margin: 6 },
//     row: {
//         flexDirection: "row",
//         height: 40,
//         borderBottomWidth: 1,
//         borderBottomColor: "#ccc",
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "rgba(0, 0, 0, 0.5)",
//     },
//     modalContent: {
//         backgroundColor: "white",
//         borderRadius: 10,
//         padding: 20,
//         width: "80%",
//     },
//     modalHeader: {
//         fontSize: 20,
//         fontWeight: "bold",
//         marginBottom: 10,
//     },
//     longText: {
//         flex: 1, // Allow text to overflow and wrap dynamically
//     },
//     modalFooter: {
//         flexDirection: "row",
//         justifyContent: "space-evenly",
//     },
//     modalButton: {
//         padding: 10,
//         borderRadius: 5,
//     },
//     buttonText: {
//         color: "white",
//         fontWeight: "bold",
//         textAlign: "center",
//     },
//     Buttons: {
//       backgroundColor: "#6cba8a",
//       paddingVertical: 5,
//       borderRadius: 5,
//       width: "45%",
//       alignContent: "center",
//       alignItems: "center",
//       justifyContent: "center",
//     },
//     DelButtons: {
//       backgroundColor: "red",
//       paddingVertical: 5,
//       borderRadius: 5,
//       width: "45%",
//       alignContent: "center",
//       alignItems: "center",
//       justifyContent: "center",
//     },

// });

// export default CategoryList;







import React, { useState } from "react";
import {
    View,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    Text,
    TextInput,
} from "react-native";
import { Table, Row } from "react-native-table-component";
import { FontAwesome } from "@expo/vector-icons";
import RNPickerSelect from 'react-native-picker-select'; // Import RNPickerSelect

const SubCategoryList = ({ loading, data, handleDelete, handleEdit }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // State to hold the items per page
    const [searchText, setSearchText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [SubCategoryToDelete, setSubCategoryToDelete] = useState(null);

 
    // Calculate pagination variables
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.filter(item =>
        item.subCategoryName.toLowerCase().includes(searchText.toLowerCase())
    ).slice(indexOfFirstItem, indexOfLastItem);

    const handleClose = () => {
        setShowModal(false);
    };


    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteItem = () => {
        console.log('delete', SubCategoryToDelete)
        handleDelete(SubCategoryToDelete);
        handleClose();
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.ViewGuud}>
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
                    <Row data={['#', 'CategoryName','SubCategory', 'Actions']} style={styles.head} textStyle={styles.headText} flexArr={[1, 4,4, 2]} />
                    {/* Table rows */}
                    <ScrollView>
                    {currentItems.map((rowData, index) => (
                        <Row
                            key={index}
                            data={[
                                indexOfFirstItem + index + 1,
                                <Text style={styles.longText}>{rowData.categoryId.CategoryName}</Text>,
                                <Text style={styles.longText}>{rowData.subCategoryName}</Text>,
                                <View style={styles.actions}>
                                    
                                    <TouchableOpacity onPress={() => handleEdit(rowData._id,rowData.categoryId.CategoryName,rowData.subCategoryName)} style={styles.actionButton}>
                                        <FontAwesome
                                            name="edit"
                                            size={20}
                                            color="white"
                                    
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.DelButtons}
                                        onPress={() => {
                                            setSubCategoryToDelete(rowData._id);
                                            setShowModal(true);
                                        }}
                                    >
                                        <FontAwesome name="trash" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ]}
                            style={styles.row}
                            textStyle={styles.text}
                            flexArr={[1, 4,4, 2]}
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
                visible={showModal}
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
        </View>
    );
};

const styles = StyleSheet.create({
    ViewGuud: {
        maxHeight: 380,
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
        minWidth: 320,
        maxHeight: 370,
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
        // marginBottom: 5
    },
    seeMoreButton: {
        backgroundColor: '#E1C552',

    },
    deleteButton: {
        backgroundColor: 'red',
        marginLeft: 5
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
});


export default SubCategoryList;


