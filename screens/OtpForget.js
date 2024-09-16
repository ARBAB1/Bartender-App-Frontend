import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import ButtonInput from '../components/ButtonInput';
import { useNavigation } from '@react-navigation/native';
import {baseUrl} from '../global';
import Icons from '../components/Icons';
const OtpForget = ({route}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [email, setEmail] = useState(route?.params?.bodys?.email);
  const [user_type, setuser_type] = useState(route?.params?.bodys?.user_type)
  const navigation = useNavigation()
  const inputRefs = useRef(Array(4).fill(0).map((_, i) => i));

  const handleInputChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    // Move to the next input if a digit is entered
    if (value !== '') {
      const nextIndex = index + 1;
      if (nextIndex < 4) {
        inputRefs.current[nextIndex].focus();
      }
    }

    setOtp(newOtp);
  };

  const handleBackspace = (index) => {
    const newOtp = [...otp];

    // Move to the previous input on backspace
    if (index > 0) {
      const prevIndex = index - 1;
      inputRefs.current[prevIndex].focus();
    }

    newOtp[index] = '';

    setOtp(newOtp);
  };

  const handleSubmit = async({route}) => {

    const enteredOtp = otp.join('');
    console.log('Entered OTP:',parseInt(enteredOtp) );
    // Add your logic here to handle the entered OTP (e.g., send to server)
    try {
      if (otp) {

         try {
const bodys ={email:email,user_type:user_type}
            fetch(`${baseUrl}/users/VerifyOtp`, {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
                 'x-api-key':'BarTenderAPI'
               },
               body: JSON.stringify({ otp:enteredOtp,email:email,user_type:user_type }),
             })
             .then(response => response.json())
             .then(data => {
               if (data) {
            navigation.navigate('NewPassword',{bodys})
               } else {
                 Alert.alert("Login","Email UnVerify")
               }
             });
         
   
        } catch (error) {
         console.log('An error occurred while processing your request.',error);
         }
      } else {
      Alert.alert('Please Fill All Fields')
      }

    }catch (error) {
        console.log('An error occurred while processing your request.');
      }

   
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={
      Platform.OS === 'ios'
        ? 'padding'
        : 'height'
    }
  >
  <SafeAreaView style={styles.container}>
  <TouchableOpacity style={{position:'absolute',top:45,left:20}}  onPress={() => navigation.goBack()}>
  <Icons.Ionicons
  name="arrow-back"
  style={{color: 'orange',padding:10}}
  size={27}
  />
  </TouchableOpacity>
 
  
  <Text style={styles.title}>OTP Verification</Text>
  <Text style={styles.subtitle}>Please Enter OTP from your Email</Text>
  <View style={styles.inputContainer}>
  {otp.map((digit, index) => (
    <TextInput
    key={index}
    ref={(ref) => (inputRefs.current[index] = ref)}
    style={styles.input}
    maxLength={1}
    value={digit}
    placeholderTextColor='white'
    onChangeText={(value) => handleInputChange(index, value)}
    onKeyPress={({ nativeEvent }) => {
      if (nativeEvent.key === 'Backspace') {
        handleBackspace(index);
      }
    }}
    />
  ))}
  </View>
  <ButtonInput title={"Continue"} onPress={handleSubmit}/>
  
  

  </SafeAreaView>
  </KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    color: 'orange',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'orange',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    
    marginVertical: 60,
    alignItems:'center',
    justifyContent:"center",
    display:'flex',
    width:'100%'
  },
  input: {
    height: 40,
    width: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    textAlign: 'center',
    color: 'orange',
  },
  button: {
    backgroundColor: '#FFC500',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default OtpForget;


