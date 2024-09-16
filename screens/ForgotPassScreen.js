import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert,Image, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FormInput from '../components/FormInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonInput from '../components/ButtonInput';
import { RadioButton } from 'react-native-paper'
import LoginInput from '../components/LoginInput';
import Icons from '../components/Icons';
import {baseUrl} from '../global';
import Toast from 'react-native-toast-message';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ForgotPassScreen =  ()=> {
  const [email, setEmail] = useState('');

  const [user_type, setUser_type] = useState(0);

  
  const navigation = useNavigation();
  // const validateEmail = (email) => {
  //   var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //   return re.test(email);
  // };

  const handleSubmit = async () => {
    // Your existing login logic
    if (email !== '' ) {
      
      try {
        const bodys = {email:email,user_type:user_type}

          fetch(`${baseUrl}/users/ForgetPasswordEmailVerify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key':'BarTenderAPI'
            },
            body: JSON.stringify({ email:email,user_type:user_type}),

          })
          .then(response => response.json())
          .then(data => {
        
            if(data.message=="Success"){
              Toast.show({
                type: 'success',
                text1: 'Otp sent to your email👋',
              });
               navigation.navigate('OtpForget',{bodys})
            }
            else{
              Toast.show({
                type: 'error',
                text1: `${data.data}`,
              });
            }
          
         

        
         });
       
 
      } catch (error) {
      console.log('An error occurred while processing your request.',error);
      }
   } else {
 Alert.alert("Please fill all fields")
   }
    
  };

  return (
    <SafeAreaView style={styles.container}>
    <TouchableOpacity style={{position:'absolute',top:45,left:20}} onPress={() => navigation.goBack()}>
    <Icons.Ionicons
      name="arrow-back"
      style={{color: 'orange',padding:10}}
      size={27}
    />
  </TouchableOpacity>
    <View >
 
    <View style={styles.header}>
    <Image source={require('../assets/mainlogo.png')} style={{ width: 200, height: 100 }} />
      </View>
      <View>
      <LoginInput 
      placeholder={"Please Enter Email address"}
      placeholderColor={"black"}
      icon={"mail"}
      setValues={(text) => setEmail(text)}
      styled={{width: windowWidth * 0.9}}
      
      />
      </View>
    
      <View>
    
   
      <RadioButton.Group  onValueChange={value => setUser_type(value)} value={user_type}>
      <RadioButton.Item color='orange' label="Admin" value={0} />
      <RadioButton.Item color='orange' label="Bartender" value={1} />
      <RadioButton.Item color='orange' label="User" value={2} />
      <RadioButton.Item color='orange' label="Buisness" value={3} />
    </RadioButton.Group>
      </View>
      
      </View>
      <ButtonInput title={"Submit"} onPress={handleSubmit} styled={{justifyContent:"center"}}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  padding:20,
  alignItems:'center',
  
  },
  header: {
    // marginBottom: 50,
    justifyContent: 'center',
    alignItems:'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'white',
  },
  forgotPassword: {
    color: 'white',
    marginBottom: 20,
  },
  or: {
    color: 'white',
    marginBottom: 20,
  },
  ForgotPassScreen: {
    color: 'white',
    marginTop: 20,
  },
});

export default ForgotPassScreen;
