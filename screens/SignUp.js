import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icons from '../components/Icons';
import {useNavigation} from '@react-navigation/native';
import ButtonInput from '../components/ButtonInput';
import {Checkbox, RadioButton} from 'react-native-paper';
import PasswordInput from '../components/PasswordInput';
import LoginInput from '../components/LoginInput';
import Toast from 'react-native-toast-message';
import {baseUrl} from '../global';
import {ScrollView} from 'react-native-gesture-handler';
import {SelectList} from 'react-native-dropdown-select-list';
import HeaderDetails from '../components/HeaderDetails';
import { successToast } from '../toast';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user_type, setUser_type] = useState(0);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [referral_code, setReferral_code] = useState('');
  const [checked, setChecked] = React.useState(false);
  const navigation = useNavigation();
  const refer = [
    'Facebook',
    'Instagram',
    'Twitter',
    'Website',
    'Google',
    'Other',
  ];
  const validateEmail = email => {
    // var re =
    // /^([a-zA-Z0-9~`!@#\$%\^&\\(\)_\-\+={\[\}\]\|\\:;"'<,>\.\?\/  ])@([a-zA-Z0-9]+)\.(com+)$/;

    var re = /^[a-zA-Z0-9_\.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+$/;
    return re.test(email);
  };
  const handleLogin = async () => {
    // Your existing login logic
    console.log("dd")
    if (email !== '' && password !== '' && number != '' && name != '') {
   
      if (!validateEmail(email)) {
        Toast.show({
          type: 'error',
          text1: 'Email Unverified',
        });
        return;
      }
      setButtonDisable(true); 
      try {
        fetch(`${baseUrl}/users/CreateUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'BarTenderAPI',
          },
          body: JSON.stringify({
            name: name,
            email: email,
            number: number,
            password: password,
            user_type: user_type,
            referred_from: referral_code,
          }),
        })
          .then(response => response.json())
          .then(data => {
            console.log(data,"data")
            if (data.message == 'Success') {
              setButtonDisable(false)
            successToast("Sign Up Success",)
              navigation.navigate('Login');
            } else {
                    setButtonDisable(false)
              Toast.show({
                type: 'error',
                text1: `${data?.message}`,
              });
            }
          });
      } catch (error) {
        console.log('An error occurred while processing your request.', error);
      }
    } else {
      if (email === '' && password === '' && number === '' && name === '') {
        Toast.show({
          type: 'error',
          text1: 'Sign Up Failed',
          text2: 'All fields are required.',
        });
      } else {
        let errorMessage = '';
        if (email === '') {
          errorMessage += 'Email is required. ';
        }
        if (password === '') {
          errorMessage += 'Password is required. ';
        }
        if (number === '') {
          errorMessage += 'Number is required. ';
        }
        if (name === '') {
          errorMessage += 'Name is required. ';
        }
        Toast.show({
          type: 'error',
          text1: 'Sign Up Failed',
          text2: errorMessage,
        });
      }
    }
  };
  return (
  <SafeAreaView style={styles.container}>

    <ScrollView >
      <View style={styles.header}>
        <View style={{flex:1}}>
          <TouchableOpacity style={{marginTop:15}} onPress={() => navigation.goBack()}>
            <Icons.Ionicons name="chevron-back" size={40} color="orange" />
          </TouchableOpacity>
        </View>
   
     
      </View>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
             <View >
          <Image
            source={require('../assets/mainlogo.png')}
            style={{width: 180, height: 100}}
          />
        </View>
        <View>
          <LoginInput
            placeholder={'Please Enter Email address'}
            placeholderColor={'black'}
            icon={'mail'}
            setValues={text => setEmail(text)}
          />
        </View>
        <View>
          <PasswordInput
            placeholder={'Please Enter Password'}
            placeholderColor={'black'}
            icon={'lock'}
            setValues={text => setPassword(text)}
            pass={true}
          />
        </View>
        <View>
          <LoginInput
            placeholder={'Enter Full Name'}
            placeholderColor={'black'}
            icon={'user'}
            setValues={text => setName(text)}
          />
        </View>
        <View>
          <LoginInput
            placeholder={'Please Enter Phone Number'}
            placeholderColor={'black'}
            icon={'phone'}
            setValues={text => setNumber(text)}
          />
          <View style={{paddingTop: 10}}>
            <SelectList
              searchPlaceholder="search"
              setSelected={text => setReferral_code(text)}
              inputStyles={{color: 'grey'}}
              dropdownTextStyles={{color: 'grey'}}
              data={refer}
              save="value"
              dropdownItemStyles={{color: 'grey'}}
              boxStyles={{color: 'grey'}}
              placeholder="Refered From"
              search={false}
            />
          </View>
          <View style={{marginTop: 15}}>
            <RadioButton.Group
              onValueChange={value => setUser_type(value)}
              value={user_type}>
       
              <RadioButton.Item color="orange" label="Bartender" value={1} />
              <RadioButton.Item color="orange" label="User" value={2} />
              <RadioButton.Item color="orange" label="Business" value={3} />
            </RadioButton.Group>
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexDirection: 'row',
            padding: 20,
          }}>
          <View
             style={Platform.OS=="ios" ? (checked ? styles.checkBoxBorder : styles.checkBoxBorderU):(styles.check)}
            >
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              color={Platform.OS=="ios" ?"white" :"orange"}
              // uncheckedColor={"redr"}

              onPress={() => {
                setChecked(!checked);
              }}
            />
          </View>
          <Text style={{marginLeft: 30,lineHeight:20.3,color:'black'}}>
            Are you sure you acccept{' '}
            <Text
              style={{color: 'orange', textDecorationLine: 'underline'}}
              onPress={() => navigation.navigate('Privacy')}>
              Privacy Policy
            </Text>{' '}
            and{' '}
            <Text
              style={{color: 'orange', textDecorationLine: 'underline'}}
              onPress={() => navigation.navigate('Terms')}>
              Terms and Condition
            </Text>
          </Text>
        </View>
        <ButtonInput title={'Get Started!'} onPress={handleLogin} disabled={buttonDisable}/>
      </View>
    </ScrollView>
      </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: 'white',
    width: '100%',
    
  },
  checkBoxBorderU: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: 'black',

    backgroundColor: 'transparent',
  },
  checkBoxBorder: {
    height: 33,
    width: 33,
    borderWidth: 0,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: 'orange',
  },
  header: {
    marginTop: 0,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: windowWidth,
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
  signup: {
    color: 'white',
    marginTop: 20,
  },
  check:{
  color:"black"
  }
});

export default SignUp;
