import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const Sidebar = ({ showSidebar, setShowSidebar, handleLogout }) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.SafeContainer}>
      <SafeAreaView style={styles.container}>
        {/* Close Icon */}
        <TouchableOpacity onPress={() => setShowSidebar(false)} style={styles.closeButton}>
          <FontAwesome5 name="times" style={styles.closeIcon} />
        </TouchableOpacity>

        {/* Sidebar Content */}
        <View style={styles.sidebarContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logoText}>SAXANSAXO ELECTRONICS</Text>
          </View>

          {/* Menu Items */}
          <TouchableOpacity style={styles.menuItem} onPress={() => {navigation.navigate('Dashboard'); setShowSidebar(false)}}>
            <FontAwesome5 name="home" style={styles.menuIcon} />
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {navigation.navigate('Home'); setShowSidebar(false)}}>
            <FontAwesome5 name="home" style={styles.menuIcon} />
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {navigation.navigate('Category'); setShowSidebar(false)}}>
          <FontAwesome5 name="layer-group" style={styles.menuIcon} />
          <Text style={styles.menuText}>Category</Text>
        </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => { toggleSidebar(); navigation.navigate('Category'); }}>
            <FontAwesome5 name="layer-group" style={styles.menuIcon} />
            <Text style={styles.menuText}>Category</Text>
          </TouchableOpacity> */}

<TouchableOpacity style={styles.menuItem} onPress={() => {navigation.navigate('SubCategory'); setShowSidebar(false)}}>
            <FontAwesome5 name="columns" style={styles.menuIcon} />
            <Text style={styles.menuText}>SubCategory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {navigation.navigate('Items'); setShowSidebar(false)}}>
            <FontAwesome5 name="store" style={styles.menuIcon} />
            <Text style={styles.menuText}>Items</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {setShowSidebar(false)}}>
            <FontAwesome5 name="shopping-cart" style={styles.menuIcon} />
            <Text style={styles.menuText}>New sales</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {navigation.navigate('ItemsReportList'); setShowSidebar(false)}}>
            <FontAwesome5 name="file-alt" style={styles.menuIcon} />
            <Text style={styles.menuText}>Items Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {navigation.navigate('SalesReport'); setShowSidebar(false)}}>
            <FontAwesome5 name="chart-bar" style={styles.menuIcon} />
            <Text style={styles.menuText}>Sales Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {navigation.navigate('TInvoices'); setShowSidebar(false)}}>
            <FontAwesome5 name="file-invoice" style={styles.menuIcon} />
            <Text style={styles.menuText}>All invoices</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {navigation.navigate('Users'); setShowSidebar(false)}}>
            <FontAwesome5 name="users" style={styles.menuIcon} />
            <Text style={styles.menuText}>Users</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <FontAwesome5 name="sign-out-alt" style={styles.menuIcon} />
            <Text style={styles.menuText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // marginTop:20
  },
  SafeContainer: {
    flex: 1,

  },
  closeButton: {
    position: 'absolute',
    right: 20,

  },
  closeIcon: {
    fontSize: 25,
    color: '#5FC084',
    marginTop: 30,
  },
  sidebarContent: {
    width: '60%',
    height: '70%',
    position: 'absolute',
    backgroundColor: '#F5F5F5',
    top: 57,
    left: 0,
    paddingTop: 20,
    paddingLeft: 20,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16,


  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 15,
    marginBottom: 15
  },
  logoText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15, // Adjust the marginBottom for spacing
  },
  menuIcon: {
    marginRight: 10,
    fontSize: 20,
    color: '#5FC084', // Adjust color as needed
  },
  menuText: {
    fontSize: 16,
    color: '#333', // Adjust color as needed
  },
});

export default Sidebar;
