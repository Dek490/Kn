import { View, Text, StyleSheet, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import InputBox from '../../components/Forms/inputBox'
import SubmitButton from '../../components/Forms/submitButton'
// import { AddData } from '../../Shared/apiCRUD'
import axios from 'axios'



const Register = ({navigation}) => {
    // states
    const [username, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false);

    // functions
    // const handleSubmit = async() => {
    //     try {
    //         setLoading(true);
    //         if (!username || !email || !password) {
    //             Alert.alert("please fill all required fields")
    //             setLoading(false);
    //             return
    //         }
    //         setLoading(false);
    //         // console.log("Register Data ==>>", { name, email, password })
    //         const { data } = await axios.post("/users/signup", {
    //             username,
    //             email,
    //             password,
    //           });
    //         //   alert(data && data.message);
    //         console.log(data && data.message);
    //           navigation.navigate("Login");
    //           console.log("Register Data==> ", { username, email, password });
    //         } catch (error) {
    //         //   alert(error.response.data.message);
    //         console.log (error.response.data.message);
    //           setLoading(false);
    //           console.log(error);
    //         }
    
    // }
    const handleSubmit = async () => {
        try {
          setLoading(true);
      
          if (!username || !email || !password) {
            Alert.alert("Please fill all required fields");
            setLoading(false);
            return;
          }
      
          const response = await axios.post("/users/signup", {
            username,
            email,
            password,
          });
      
          // Check the structure of the response
          console.log("Response Data ==> ", response.data);
      
          setLoading(false);
          navigation.navigate("Login");
          console.log("Register Data ==> ", { username, email, password });
        } catch (error) {
          // Handle errors
          console.log("Error:", error.message);
          Alert.alert("Error occurred while registering. Please try again.");
          setLoading(false);
        }
      };
      

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Register</Text>
            <View style={{ marginHorizontal: 20 }}>
                <InputBox inputTitle='Name'

                    value={username}
                    setValue={setName}

                />

                <InputBox inputTitle='Email'
                    keyboardType="email-address"
                    autoComplete='email'
                    value={email}
                    setValue={setEmail}

                />
                <InputBox inputTitle='Password'
                    secureTextEntry={true}
                    autoComplete='password'
                    value={password}
                    setValue={setPassword}
                />
            </View>

            {/* <Text>{JSON.stringify({name, email, password}, null, 4)}</Text> */}
            <SubmitButton
                btnTitle="Register"
                loading={loading}
                handleSubmit={handleSubmit}
            />

            <Text style={styles.linkText}>
                ALready Register Please{" "}
                <Text style={styles.link} onPress={() => navigation.navigate('Login')} >
                    LOGIN
                </Text>{" "}
            </Text>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#e1d5c9'
    },
    pageTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#1e2225',
        textAlign: 'center',
        marginBottom: 20

    },
    linkText: {
        textAlign: "center",
      },
      link: {
        color: "red",
      },
})


export default Register