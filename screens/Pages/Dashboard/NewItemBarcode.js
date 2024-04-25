import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { useCart } from '../../../context/CartContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const BarcodeScanner = () => {
  const navigation = useNavigation();
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const { setNewItemByBarcode } = useCart();
  const [scannedItem, setScannedItem] = useState(null);
  const cameraRef = useRef(null);



  const toggleTorch = () => {
    setTorchOn(!torchOn);
    if (cameraRef.current) {
      (torchOn ? Camera.Constants.FlashMode.off : Camera.Constants.FlashMode.torch);
    }
  };

  const getBarcode = async({data})=>{
    await setNewItemByBarcode(data? data: null);
    navigation.goBack();

  }
  getBarcode();


  return (
    <View style={styles.container}>
      <View style={styles.topRight}>
        <TouchableOpacity onPress={toggleTorch}>
          <MaterialIcons name={torchOn ? "flash-on" : "flash-off"} size={24} color="rgba(0,0,0,0.3)" />
        </TouchableOpacity>
      </View>
      <View style={styles.barcodebox}>
        <Camera
          ref={cameraRef}
          type={Camera.Constants.Type.back}
          onBarCodeScanned={getBarcode}
          style={{ height: 400, width: 400 }}
          flashMode={torchOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <Button title={'Go Back'} onPress={() => navigation.navigate('Home')} color='#5FC084' style={styles.button} />
        <Button title={'Scan Again'} onPress={() => {
          setScannedItem(null);``
          setScanned(false);
        }} color='#E1C552' style={styles.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  itemDetails: {
    alignItems: 'center',
    marginTop: 20,
  },
  detailText: {
    fontSize: 16,
    marginVertical: 5,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '80%',
    marginTop: 20,
    
  },
  button: {
    width: '45%',
  },
  topRight: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 10,
  },
});

export default BarcodeScanner;
