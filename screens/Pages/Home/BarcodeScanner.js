import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { useCart } from '../../../context/CartContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const BarcodeScanner = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const { addToCart, scannedBarcode } = useCart();
  const [scannedItem, setScannedItem] = useState(null);
  const cameraRef = useRef(null);

  const askForCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    try {
      const response = await axios.get(`/items/Barcode/${data}`);
      setScannedItem(response.data);
      

    } catch (error) {
      console.error('Error searching for item:', error);
      alert('Error searching for item');
      console.log(data)
    }
  };

  const addToCartHandler = () => {
    if (scannedItem) {
      addToCart(scannedItem);
      setScannedItem(null);
      setScanned(false);
    }
  };

  const toggleTorch = () => {
    setTorchOn(!torchOn);
    if (cameraRef.current) {
      (torchOn ? Camera.Constants.FlashMode.off : Camera.Constants.FlashMode.torch);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>
    );
  }

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
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }}
          flashMode={torchOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        />
      </View>
      {scannedItem ? (
        <View style={styles.itemDetails}>
          <Text style={styles.detailText}>Name: {scannedItem.subCategoryId?.subCategoryName}</Text>
          <Text style={styles.detailText}>Price: {scannedItem.buyingprice}</Text>
          <Button title="Add to Cart" color='#5FC084' onPress={addToCartHandler} />
        </View>
      ) : (
        <Text style={styles.maintext}>Scanned Barcode: {scannedBarcode ? scannedBarcode : "Not Yet"}</Text>
      )}

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
