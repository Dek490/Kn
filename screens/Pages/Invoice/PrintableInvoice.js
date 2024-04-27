import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useCart } from '../../../context/CartContext';

const PrintableInvoice = () => {
  const { invoiceItems,InvTotalPrice } = useCart();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Raadsan</Text>

      {/* Customer Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address: Suuqa Xoolaha</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact: +2526222222</Text>
      </View>

      <Text style={styles.customerName}>Customer Name: Shamuurey Hassan</Text>

      {/* Invoice Items */}

        <View style={styles.tableHeader}>
          <Text style={styles.columnHeader}>Item Name</Text>
          <Text style={styles.columnHeader}>Qty</Text>
          <Text style={styles.columnHeader}>Price</Text>
          <Text style={styles.Totalcell}>Total</Text>
        </View>
    <ScrollView style={styles.tableContainer} >
        {invoiceItems?.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.discriptioncell}>{item.description}</Text>
            <Text style={styles.cell}>{item.order_qty}</Text>
            <Text style={styles.cell}>${item.price}</Text>
            <Text style={styles.cell}>${item.total_Price}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Total */}
      <View style={styles.total}>
        <Text style={styles.totalText}>Total Amount:</Text><Text style={{textAlign:'right',marginRight:15,fontWeight:'bold'}}>${InvTotalPrice}</Text>
        {/* Render the total amount here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    minWidth:300
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black', // Matching color with MUI theme
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: 'black', // Matching color with MUI theme
  },
  customerName: {
    marginBottom: 10,
    color: 'black', // Matching color with MUI theme
  },
  tableContainer: {
    maxHeight: 250, // Fixed height for 10 rows
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2', // Matching background color with MUI theme
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  columnHeader: {
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderColor: 'black', // Matching border color with MUI theme
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  discriptioncell: {
    flex: 1,
  },
  cell: {
    flex: 0.6,
    marginLeft:15,
    textAlign:'center'
  },
  Totalcell: {
    fontWeight: 'bold',
    marginRight:6
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    borderTopWidth: 0.5,
    paddingTop: 10,
    borderColor: 'black', // Matching border color with MUI theme
  },
  totalText: {
    fontWeight: 'bold',
    color: 'black', // Matching color with MUI theme
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  printButton: {
    backgroundColor: '#449964',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: 'tomato',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PrintableInvoice;
