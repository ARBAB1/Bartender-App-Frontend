import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import ButtonInput from '../components/ButtonInput';
import {useDispatch} from 'react-redux';
import {loginSuccess} from '../redux/reducers/authReducer';
import {useNavigation} from '@react-navigation/native';
import {baseUrl} from '../global';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import Icons from '../components/Icons';
import Geolocation from '@react-native-community/geolocation';
import notifee from '@notifee/react-native';

const Otp = ({onLogin, route}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [email, setEmail] = useState(route?.params?.body?.email);
  const [user_type, setuser_type] = useState(route?.params?.body?.user_type);

  const inputRefs = useRef(
    Array(4)
      .fill(0)
      .map((_, i) => i),
  );
  const handleInputChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    if (value !== '') {
      const nextIndex = index + 1;
      if (nextIndex < 4) {
        inputRefs.current[nextIndex].focus();
      }
    }

    setOtp(newOtp);
  };

  const handleBackspace = index => {
    const newOtp = [...otp];
    if (index > 0) {
      const prevIndex = index - 1;
      inputRefs.current[prevIndex].focus();
    }

    newOtp[index] = '';

    setOtp(newOtp);
  };
  const getDeviceToken = async () => {};
  const handleSubmit = async ({route}) => {
    let token = await messaging().getToken();
    const enteredOtp = otp.join('');
 console.log(   {otp: enteredOtp,
  email: email,
  user_type: user_type,
  FCM_token: `${token}`},"fgh")
    try {
      if (otp) {
        try {
          fetch(`${baseUrl}/users/VerifyOtp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'BarTenderAPI',
            },
            body: JSON.stringify({
              otp: enteredOtp,
              email: email,
              user_type: user_type,
              FCM_token: `${token}`,
            }),
          })
            .then(response => response.json())
            .then(async data => {
              if (data.message == 'Success') {
                await AsyncStorage.setItem('data', JSON.stringify(data));
                if (user_type != 0) {
                  Geolocation.requestAuthorization();
                } else {
                  console.log('He is Admin');
                }

                onLogin();
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Otp Failure',
                });
              }
            });
        } catch (error) {
          console.log(
            'An error occurred while processing your request.',
            error,
          );
        }
      } else {
        Alert.alert('An error occurred while processing your request.');
      }
    } catch (error) {
      console.log('An error occurred while processing your request.');
    }
  };
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={{position: 'absolute', top: 45, left: 20}}
          onPress={() => navigation.goBack()}>
          <Icons.Ionicons
            name="arrow-back"
            style={{color: 'orange', padding: 10}}
            size={27}
          />
        </TouchableOpacity>

        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subtitle}>Please enter OTP from your Email</Text>
          <View style={styles.inputContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                style={styles.input}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                placeholderTextColor="white"
                onChangeText={value => handleInputChange(index, value)}
                onKeyPress={({nativeEvent}) => {
                  if (nativeEvent.key === 'Backspace') {
                    handleBackspace(index);
                  }
                }}
              />
            ))}
          </View>
          <ButtonInput title={'Continue'} onPress={handleSubmit} />
        </View>
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

export default Otp;
