// Import necessary components and functions
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ButtonInput from '../components/ButtonInput';
import {RadioButton} from 'react-native-paper';
import PasswordInput from '../components/PasswordInput';
import LoginInput from '../components/LoginInput';
import Toast from 'react-native-toast-message';
import {baseUrl} from '../global';
import {emailRegex, passwordRegex} from '../regex';
import {errorToast, successToast} from '../toast';

// Define the LoginScreen component
const LoginScreen = () => {
  // State variables to store user input and loading state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user_type, setUser_type] = React.useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Handle login button press
  const handleLogin = async () => {
    // Check if the login request is already in progress
    if (isLoading) {
      return;
    }

    // Set loading state to true
    setIsLoading(true);

    // Check if email and password fields are not empty
    if (email != '' && password != '') {
      // Validate email format using regex
      if (!emailRegex.test(email)) {
        // Display error toast if email format is invalid
        errorToast('Invalid Email', 'Please enter a valid email address');

        // Set loading state to false
        setIsLoading(false);
        return;
      }
      // Validate password format using regex
      if (!passwordRegex.test(email)) {
        // Display error toast if password format is invalid
        errorToast('Invalid Password', 'Please enter a valid Password');

        // Set loading state to false
        setIsLoading(false);
        return;
      }

      // Create a JSON object to send to the server
      const body = {email: email, password: password, user_type: user_type};

      // Make a POST request to the server
      try {
        fetch(`${baseUrl}/users/Login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'BarTenderAPI',
          },
          body: JSON.stringify(body),
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            // Check if the server response is successful
            if (data) {
              if (data.message === 'Success') {
                // Display success toast if login is successful
                successToast('Login Successful!', 'Otp sent to your email👋');

                // Navigate to the OTP screen with the login credentials
                navigation.navigate('OtpS', {body});
              } else {
                // Display error toast if login fails
                Toast.show({
                  type: 'error',
                  text1: `${data?.data}`,
                });
                errorToast('Invalid Email', `${data?.data}`);
              }
            } else {
              // Display error toast if login fails
              errorToast('Login Failed!', 'Please try Again');
            }
          })
          .catch(error => {
            // Catch any errors that occur during the login process
            console.log(
              'An error occurred while processing your request.',
              error,
              'ghg',
            );
            errorToast('Login Failed!', `${error}`);
          })
          .finally(() => {
            // Set loading state to false regardless of success or failure
            setIsLoading(false);
          });
      } catch (error) {
        // Catch any errors that occur during the login process
        console.log(
          'An error occurred while processing your request.',
          error,
          'okkks',
        );
        Alert.alert(
          'Error',
          'An error occurred while processing your request.',
        );
        setIsLoading(false);
      }
    } else {
      // Display error toast if email or password fields are empty
      Toast.show({
        type: 'error',
        text1: 'Please fill all fields',
      });
      setIsLoading(false);
    }
  };

  // Render the login screen components
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/logomain.png')}
          style={{width: 200, height: 100}}
        />
      </View>
      <View>
        <LoginInput
          placeholder={'Please Enter Email address'}
          placeholderColor={'black'}
          icon={'mail'}
          setValues={text => setEmail(text)}
          type={'email'}
        />
      </View>
      <View>
        <PasswordInput
          placeholder={'Please Enter Password'}
          placeholderColor={'black'}
          icon={'lock'}
          setValues={text => setPassword(text)}
          pass={true}
          type={'password'}
        />
        <TouchableOpacity
          style={{padding: 20, color: 'white'}}
          onPress={() => navigation.navigate('ForgotPassScreen')}>
          <Text style={{color: 'orange', textDecorationLine: 'underline'}}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <RadioButton.Group
          style={styles.checkBoxBorder}
          onValueChange={value => setUser_type(value)}
          value={user_type}>
          <RadioButton.Item color="orange" label="Admin" value={0} />
          <RadioButton.Item color="orange" label="Bartender" value={1} />
          <RadioButton.Item color="orange" label="User" value={2} />
          <RadioButton.Item color="orange" label="Business" value={3} />
        </RadioButton.Group>
      </View>
      <View>
        <TouchableOpacity
          style={{padding: 20, color: 'white'}}
          onPress={() => navigation.navigate('SignUp')}>
          <Text style={{color: 'orange', textDecorationLine: 'underline'}}>
            Dont have an Account SignUp
          </Text>
        </TouchableOpacity>
      </View>

      <ButtonInput title={'Login'} onPress={handleLogin} disabled={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  checkBoxBorder: {
    height: 33,
    width: 33,
    borderWidth: 0,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
  header: {
    marginBottom: 50,
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

  forgotPassword: {
    color: 'white',
    marginBottom: 20,
  },
  or: {
    color: 'white',
    marginBottom: 20,
  },
  signup: {
    color: 'white',
    marginTop: 20,
  },
});

export default LoginScreen;
