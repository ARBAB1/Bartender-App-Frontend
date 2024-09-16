import 'react-native-gesture-handler';
import React, {useEffect, useState,} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import DeviceInfo from 'react-native-device-info';
import BottomTabNavigator from './navigation/TabNavigator';
import Otp from './screens/Otp';
import DrawerNavigator from './navigation/DrawerNavigation';
import SignUp from './screens/SignUp';
import SplashScreen from './screens/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDrawer from './navigation/DrawerNavigation';
import BartenderHomeScreen from './screens/BartenderHomeScreen';
import SignOut from './screens/SignOut';
import {Provider} from 'react-redux';
import store from './redux/store';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import ForgotPassScreen from './screens/ForgotPassScreen';
import OtpForget from './screens/OtpForget';
import NewPassword from './screens/NewPassword';
import ChangePassword from './screens/ChangePassword';
import EditProfileScreen from './screens/EditProfileScreen';
import {useNavigation} from '@react-navigation/native';
import PrivacyPolicy from './screens/PrivacyPolicy';
import TermsCondition from './screens/TermsCondition';
import {baseUrl} from './global';
import messaging from '@react-native-firebase/messaging';
import Deleteuser from './screens/Deleteuser';
import { Alert,Linking,Platform } from 'react-native';
import { LogBox } from 'react-native';



const AuthStack = createStackNavigator();
const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'green'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),

  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),

  tomatoToast: ({text1, props}) => (
    <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};

const App = () => {
  LogBox.ignoreAllLogs();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const Drawer = createDrawerNavigator();
  const [users, setusers] = useState();
  const [buildNumber, setBuildNumber] = useState();
  useEffect(() => {
    getAppBuildNumber();
    async function checkLoginStatus() {
      const value = await AsyncStorage.getItem('data');
  
      setusers(JSON.parse(value)?.user_data[0].id)
      if (value !== null) {

        setIsLoggedIn(true);

      } else {
        setIsLoggedIn(false);
      }
    }

    checkLoginStatus();
  }, []);
  const getAppBuildNumber = () => {
    const buildNumber = DeviceInfo.getBuildNumber()
     
      try {
        fetch(`${baseUrl}/users/CheckAppVersion`, {
          method:'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'BarTenderAPI',
          },
          body: JSON.stringify({
            platform:Platform.OS==="ios"?"ios":"android",
            currentVersion:buildNumber,
            }),
          
          }).then(response => {
            return response.json();
          }).then(res => {
            console.log(res)
            if(res.message=="lesser"){
              Alert.alert(
                'Update App',
                'There is a new version of the app available. Please update the app.',
                [
                  {
                    text: 'Cancel',
                    onPress:  () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {text: 'Confirm', onPress: () =>Platform.OS==="ios"?Linking.openURL('https://apps.apple.com/pk/app/bartinder/id6502832300'): Linking.openURL('https://play.google.com/store/apps/details?id=com.bartinder')},
                ],
               
                )
            }
          })
      
      } catch (error) {
        
      }
   
   
  };
  const LogoutInstant = async () => {
    let token = await messaging().getToken();

    const value = await AsyncStorage.getItem('data');
    const access_token1 = JSON.parse(value)
    
    try {
      fetch(`${baseUrl}/users/Logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${access_token1.access_token}`,
        },
        body: JSON.stringify({
          FCM_token: `${token}`,
        }),
      })
        .then(response => {
          return response.json();
        })
        .then(chat => {

       
          AsyncStorage.clear()
        })

        .catch(err => {
          console.log(err, 'dddd');
        });
    } catch (error) {
      console.log('An error occurred while processing your request.', error);
    }
  };
  const DeleteInstant = async () => {
    let token = await messaging().getToken();

    const value = await AsyncStorage.getItem('data');
    const access_token1 = JSON.parse(value)
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account permanently?',
      [
        {
          text: 'Cancel',
          onPress:  () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Confirm', onPress: () => DeleteUser()},
      ],
     
      )
  
  };
  const DeleteUser=async ()=>{
    let token = await messaging().getToken();

    const value = await AsyncStorage.getItem('data');
    const access_token1 = JSON.parse(value)
    console.log( access_token1?.user_data[0].id)
    try {
      fetch(`${baseUrl}/users/DeleteUser`, {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'BarTenderAPI',
      },
      body: JSON.stringify({
          id:access_token1?.user_data[0].id,
        }),
      
      }).then(response => {
        return response.json();
      })
      .then(chat => {
        console.log(chat)
        Toast.show({
          type: 'success',
          text1: 'User Data Deleted ',
          text2: 'User Data Deleted Successfully'
        });
       fetch(`${baseUrl}/users/Logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${access_token1.access_token}`,
        },
        body: JSON.stringify({
          FCM_token: `${token}`,
        }),
      })
        .then(response => {
          return response.json();
        })
        .then(chat => {

          setIsLoggedIn(false)
          AsyncStorage.clear()
        })
          })
     

        .catch(err => {
          console.log(err, 'dddd');
        });
    } catch (error) {
      console.log('An error occurred while processing your request.', error);
    }
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        {isLoggedIn ? (
          <Drawer.Navigator
            screenOptions={{
              headerShown: false,
            }}
            drawerContent={props => <CustomDrawer {...props} onLogin={()=>DeleteInstant()}/>}>
            <Drawer.Screen name="Home" component={BottomTabNavigator} />
            <Drawer.Screen name="About" component={BartenderHomeScreen} />
            <Drawer.Screen name="SignOut">
              {props => (
                <SignOut
                  {...props}
                  onLogout={
                    LogoutInstant()
                    }
                  onLogin={setIsLoggedIn(false)}
                />
              )}
            </Drawer.Screen>
      
            <Drawer.Screen
              name="ChangePassword"
              component={ChangePassword}
              options={{title:"Change Password"}}
              initialParams={true}
            />
            <Drawer.Screen
              name="EditProfile"
              options={{title:"Edit Profile"}}
              initialParams={true}
              component={EditProfileScreen}            
            >
            
            </Drawer.Screen>
            <Drawer.Screen name="Privacy Policy" component={PrivacyPolicy} />
            <Drawer.Screen name="Terms Condition" component={TermsCondition} />
          
          </Drawer.Navigator>
        ) : (
          <AuthStack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <AuthStack.Screen name="Splash">
              {props => <SplashScreen />}
            </AuthStack.Screen>

            <AuthStack.Screen
              name="ForgotPassScreen"
              component={ForgotPassScreen}
            />

            <AuthStack.Screen name="OtpForget" component={OtpForget} />

            <AuthStack.Screen name="NewPassword" component={NewPassword} />
            <AuthStack.Screen name="Privacy" component={PrivacyPolicy} />
            <AuthStack.Screen name="Terms" component={TermsCondition} />
            <AuthStack.Screen name="Login">
              {props => <LoginScreen />}
            </AuthStack.Screen>

            <AuthStack.Screen name="OtpS">
              {props => <Otp {...props} onLogin={() => setIsLoggedIn(true)} />}
            </AuthStack.Screen>
            <AuthStack.Screen name="SignUp">
              {props => <SignUp />}
            </AuthStack.Screen>
          </AuthStack.Navigator>
        )}
      </NavigationContainer>

      <Toast config={toastConfig} />
    </Provider>
  );
};
export default App;
