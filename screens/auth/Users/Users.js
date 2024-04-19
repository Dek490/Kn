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
import React, { useEffect, useState } from "react";
import UsersList from "./UsersList";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FooterMenu from "../../../components/Menus/FooterMenu";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";
import { useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";
const Users = () => {
  const [data, setData] = useState([]);
  const [MoreDetailsData, setMoreDetailsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserStatus, setSelectedUserStatus] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleForMoreDetails, setModalVisibleForMoreDetails] = useState(false);
  const [ItemIdToUpdate, setItemIdToUpdate] = useState({ id: null, name: "" });
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchData();
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/users");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClose = () => {
    reset();
    setModalVisible(false);
    setModalVisibleForMoreDetails(false);
  };
  const handleEditItem = (Xogta) => {
    setItemIdToUpdate({
      id: Xogta._id,
      data: Xogta,
    });
    setModalVisible(true);
  };
  const HandleSeeMore = (Data) => {
    setMoreDetailsData(Data)

    setModalVisibleForMoreDetails(true);
  };

  const handleAddUser = () => {
    setItemIdToUpdate({ id: null, name: "" });
    setModalVisible(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (ItemIdToUpdate.id) {
        await axios.put(`/users/${ItemIdToUpdate.id}`, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          status: selectedUserStatus,
          role: formData.role,
        });
        Toast.show({
          type: "success",
          text1: "item Updated",
          visibilityTime: 3000,
          autoHide: true,
        });

      } else {
        await axios.post("/users/signup", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          status: selectedUserStatus,
          role: formData.role,
        });
        Toast.show({
          type: "success",
          text1: "New User Added",
          visibilityTime: 3000,
          autoHide: true,
        });
      }

      fetchData();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.message,
        visibilityTime: 3000,
        autoHide: true,
      });
    }

    setModalVisible(false);
    // reset();
  };

  
  const handleDelete = async (UserID) => {
    try {
        await axios.delete(`/users/${UserID}`);

        Toast.show({
            type: 'success',
            text1: 'Successfully Deleted',
            visibilityTime: 3000,
            autoHide: true,
        });

        fetchData();
    } catch (error) {
        console.log(error.message);

        Toast.show({
            type: 'error',
            text1: error.message,
            visibilityTime: 3000,
            autoHide: true,
        });
    }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subcontainer}>
        <View style={styles.itemsHeaderContainer}>
          <FontAwesome5 name="list" style={styles.itemsIcon} />
          <Text style={styles.itemsTxtTitle}>
            Users <Text style={{ color: "#449964" }}>List</Text>
          </Text>
        </View>
        <TouchableOpacity onPress={handleAddUser} style={styles.addButton}>
          <Text style={styles.addIcon}>Add</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 15 }}>
          <UsersList
            data={data}
            loading={loading}
            handleEdit={handleEditItem}
            Seemore={HandleSeeMore}
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
      {/* Modal For Adding New User */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>
              {ItemIdToUpdate.id ? "Edit Item" : "Add new item"}
            </Text>

            {/* TextInput for entering description */}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ flexDirection: "column" }}>
                  {ItemIdToUpdate.id ? (
                    <Text style={{ marginLeft: 2 }}>User Name:</Text>
                  ) : null}
                  <TextInput
                    style={styles.input}
                    placeholder="username"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
              name="username"
              rules={{
                required: "username is required",
                minLength: {
                  value: 3,
                  message: "username must be at least 3 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Category name must not exceed 50 characters",
                },
              }}
              defaultValue={
                ItemIdToUpdate.id ? ItemIdToUpdate.data.username : ""
              }
            />

            {errors.username && (
              <Text style={styles.errorText}>{errors.username.message}</Text>
            )}

            {/* TextInput for entering quantity */}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  {ItemIdToUpdate.id ? (
                    <Text style={{ marginLeft: 2 }}>Email:</Text>
                  ) : null}
                  <TextInput
                    style={styles.input}
                    placeholder="email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </>
              )}
              name="email"
              rules={{ required: "email is required" }}
              defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.email : ""}
            />

            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}

            {/* TextInput for entering saleprice */}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ flexDirection: "column" }}>
                  {ItemIdToUpdate.id ? (
                    <Text style={{ marginLeft: 2 }}>Password:</Text>
                  ) : null}
                  <TextInput
                    style={styles.input}
                    placeholder={ItemIdToUpdate.id ? "New password": "password" }
                    onBlur={onBlur}
                    onChangeText={(newValue) => {
                        // Convert the input to a string if it's a number
                        onChange(typeof newValue === 'number' ? newValue.toString() : newValue);
                      }}
                      value={value}
                  />
                </View>
              )}
              name="password"
              rules={{ required: "password is required" }}
            />

            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >

              {/* RNPickerSelect for selecting Status */}
              <RNPickerSelect
                onValueChange={(value) => setSelectedUserStatus(value)} // handle selected value
                items={[
                  { label: "Active", value: "Active" },
                  { label: "Pending", value: "Pending" },
                ]} // items for selection
                placeholder={{ label: 'Select a User...', value: null }} // placeholder text
                style={{ ...pickerSelectStyles }} // custom styles if needed
              />

              {/* {errors.status && <Text style={styles.errorText}>{errors.status.message}</Text>} */}

              {/* TextInput for entering made_in */}
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={{ flexDirection: "column" }}>
                    {ItemIdToUpdate.id ? (
                      <Text style={{ marginLeft: 2 }}>Role:</Text>
                    ) : null}
                    <TextInput
                      style={styles.Specificinput}
                      placeholder="role"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
                name="role"
                rules={{ required: "role is required" }}
                defaultValue={ItemIdToUpdate.id ? ItemIdToUpdate.data.role : ""}
              />

              {errors.role && (
                <Text style={styles.errorText}>{errors.role.message}</Text>
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#5FC084" }]}
                onPress={handleSubmit(onSubmit)}
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



    {/* Modal For Viewing Extra User Details */}
                {/* See More Modal */}
        <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleForMoreDetails}
                onRequestClose={handleClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Users Details</Text>
                        <ScrollView>
                            {/* <Text>Name: {selectedItem?.subCategoryId.subCategoryName}</Text>
                            <Text>Price: {selectedItem?.buyingprice}</Text>
                            <Text>Quantity: {selectedItem?.quantity}</Text>
                            Add more details as needed */}


                            <Text style={styles.modalText}><Text style={styles.modalLabel}>UserName:</Text> {MoreDetailsData?.username || 'N/A'}</Text>
                            <Text style={styles.modalText}><Text style={styles.modalLabel}>Name:</Text> {MoreDetailsData?.email || 'N/A'}</Text>
                            <Text style={styles.modalText}><Text style={styles.modalLabel}>Status:</Text> {MoreDetailsData?.status || 'N/A'}</Text>
                            <Text style={styles.modalText}><Text style={styles.modalLabel}>Role:</Text> {MoreDetailsData?.role || 'N/A'}</Text>
                            <Text style={styles.modalText}><Text style={styles.modalLabel}>Registred Date:</Text> {MoreDetailsData?.createdAt || 'N/A'}</Text>


                        </ScrollView>
                        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
        </Modal>
     {/* Modal For Viewing Extra User Details Ended */}




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
  modalText: {
    fontSize: 16,
    marginBottom: 5,
},
modalLabel: {
    fontWeight: 'bold',
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
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    width: 130,
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
  errorText: {
    color: "red",
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: '#E1C552',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
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
export default Users;
