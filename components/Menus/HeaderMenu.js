import React, { useContext, useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, SafeAreaView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import Sidebar from './Sidebar';
import { AuthContext } from '../../context/authContext';
import { useCart } from '../../context/CartContext';


const HeaderMenu = () => {
  const [state, setState] = useContext(AuthContext);
  const navigation = useNavigation();
  const [showSidebar, setShowSidebar] = useState(false);
  const {Role}=useCart()

  // Update showSidebar state when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setShowSidebar(false);
      console.log("Role",Role)
    }, [])
  );

  const handleLogout = async () => {
    setState({ token: '', user: null });
    await AsyncStorage.removeItem('@auth');
    alert('Logout Successful');
    navigation.navigate('Login');
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };


  return (
    <SafeAreaView style={styles.container}>
    {Role === 'Admin' && !showSidebar &&(
      <TouchableOpacity onPress={() => setShowSidebar(true)}>
        <FontAwesome5 name="ellipsis-v" color={'#5FC084'} style={styles.iconStyle} />
      </TouchableOpacity>
    )}
    {Role !== 'Admin' && (
      <TouchableOpacity onPress={handleLogout}>
        <FontAwesome5 name="sign-out-alt" color={'#5FC084'} style={styles.iconStyle} />
      </TouchableOpacity>
    )}

    <Modal animationType="slide" transparent={true} visible={showSidebar} onRequestClose={() => setShowSidebar(false)}>
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} handleLogout={handleLogout} />
    </Modal>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',


  },
  iconStyle: {
    marginBottom: 3,
    alignSelf: 'center',
    fontSize: 25,
    marginTop: 5,
  },
});

export default HeaderMenu;
