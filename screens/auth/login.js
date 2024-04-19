import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import React, { useState, useContext } from 'react';
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputBox from '../../components/Forms/inputBox';
import SubmitButton from '../../components/Forms/submitButton';
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import axios from 'axios';
import { useCart } from '../../context/CartContext';
const Login = ({ navigation }) => {
  //global state 
   
  const [state , setState] = useContext(AuthContext)
  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  // states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {setRole}=useCart()


//     // functions
//     // const handleSubmit = () => {
//     //     try {
//     //         setLoading(true);
//     //         if (!email || !password) {
//     //             Alert.alert("please fill all required fields")
//     //             setLoading(false);
//     //             return
//     //         }
//     //         setLoading(false);
//     //         console.log("Login Data ==>>", { email, password })
//     //     } catch (error) {
//     //         setLoading(false);
//     //         console.log(error)
//     //     }
//     // }

  // functions
 
  // const handleSubmit = async () => {
  //   try {
  //     setLoading(true);

  //     if (!email || !password) {
  //       Alert.alert('Please fill all required fields');
  //       setLoading(false);
  //       return;
  //     }

  //     const response = await axios.post('https://fruitsapii.vercel.app/login', {
  //       email,
  //       password,
  //     });

  //     // Check the structure of the response
  //     console.log('Response Data ==> ', response.data);

  //     // Assuming the token is present in the response.data.token
  //     const token = response.data.Token;

  //     // Store the token in local storage
  //     await AsyncStorage.setItem('userToken', token);

  //     setLoading(false);
  //     console.log('Login Data ==> ', { email, password });

  //     // Display the stored token
  //     const storedToken = await AsyncStorage.getItem('userToken');
  //     console.log('Stored Token ==> ', storedToken);

  //   } catch (error) {
  //     // Handle errors
  //     console.log('Error:', error.message);
  //     Alert.alert('Error occurred while logging in. Please try again.');
  //     setLoading(false);
  //   }
  // };

    // btn funcn
    const handleSubmits = async () => {
      try {
        setLoading(true);
        if (!email || !password) {
          Alert.alert("Please Fill All Fields");
          setLoading(false);
          return;
        }
        setLoading(false);
        const { data } = await axios.post("/login", { email, password });
        setState(data);
        await AsyncStorage.setItem("@auth", JSON.stringify(data));
        navigation.navigate("Home");
        console.log("Login Data==> ", { email, password });
        reset();
      } catch (error) {
        alert(error.response.data.message);
        setLoading(false);
        console.log(error);
      }
    };
    //temp function to check local storage data
    const getLcoalStorageData = async () => {
     let data = await AsyncStorage.getItem("@auth");  
      console.log("Local Storage Of Token==> ", data);
      try {
          // const Base64token =Base64(data);
          // let token = "HloBJVwOLNLr4TQeBB2i+w=="
          const decoded = jwtDecode(data);
          console.log("Tokens decoded Now ==> ",decoded);
          setRole(decoded.Roles)

      } catch (error) {
        console.log("Error decoding",error.message)
      }
      
  
    };
    getLcoalStorageData();

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Sign in</Text>
      <View style={{ marginHorizontal: 20 }}>
        <InputBox
          inputTitle="Email"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          setValue={setEmail}
        />
        <InputBox
          inputTitle="Password"
          secureTextEntry={true}
          autoComplete="password"
          value={password}
          setValue={setPassword}
        />
      </View>

      <SubmitButton btnTitle="Login" loading={loading} handleSubmit={handleSubmits} />

      <Text style={styles.linkText}>
        Don't have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          Register
        </Text>{' '}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e1d5c9',
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1e2225',
    textAlign: 'center',
    marginBottom: 20,
  },
  linkText: {
    textAlign: 'center',
  },
  link: {
    color: 'red',
  },
});

export default Login;
