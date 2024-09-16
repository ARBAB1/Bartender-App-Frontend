import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/AntDesign';
import {useFocusEffect, useIsFocused, useNavigation} from '@react-navigation/native';

import BouncyCheckbox from 'react-native-bouncy-checkbox';

import {useSelector} from 'react-redux';
import ProfileDetails from '../components/ProfileDetails';
import UserDetails from '../components/UserDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../global';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import Geolocation from '@react-native-community/geolocation';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ProfileScreen = ({route}) => {
  const [subscribed, setSubscribed] = useState();
  const [users, setusers] = useState('');
  const isFocused = useIsFocused();
  const [position, setPosition] = useState();
  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem('data');
      setusers(JSON.parse(value));
      setuserState(JSON.parse(value)?.user_data[0]?.user_type);
      Geolocation.requestAuthorization();

      Geolocation.getCurrentPosition(pos => {

        const crd = pos.coords;
        setPosition({
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        });
     
        handleUpdateLocation(JSON.parse(value), {
          latitude: crd.latitude,
          longitude: crd.longitude,
        });
      });
  P
      handleSubmit(JSON.parse(value));
     
      //  ValidateUserSubscription(JSON.parse(value))
    }
    replacementFunction();
  }, [route]);
  const adUnitId =
    Platform.OS == 'android'
      ? 'ca-app-pub-9019633061186947/9785750166'
      : 'ca-app-pub-9019633061186947/8616138723';
  //   const ValidateUserSubscription=async(userss)=>{
  //     try {
  //       fetch(`${baseUrl}/subscription/CheckSubscription`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'x-api-key':'BarTenderAPI',
  //           'accesstoken':`Bearer ${userss.access_token}`
  //         },
  //       })
  //       .then(response => response.json())
  //       .then(dataa => {

  //      const subscriptions=dataa.subscription_status[0]

  //         setSubscribed(subscriptions)

  //       });
  //     } catch (error) {
  //       Alert.alert('An error occurred while processing your request.');
  //     }

  // }
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState(null);
  const count = useSelector(state => state.auth.user);
  const [userState, setuserState] = useState(11);
  const [checked, setChecked] = useState(false);
  const [imageUri, setImageUri] = useState(`${baseUrl}/${users?.image}` || '');
  const [data, setdata] = useState();

  const handleSubmit = async userss => {
    try {
      fetch(`${baseUrl}/users/GetUserById/${userss.user_data[0].id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${userss.access_token}`,
        },
      })
        .then(response => response.json())
        .then(dataa => {
          if (dataa?.users) {
            setImageUri(`${baseUrl}/${dataa?.users[0]?.image}`);
            setdata(dataa?.users[0]);
          }
        });
    } catch (error) {
      console.log('An error occurred while processing your request.');
    }
  };
  const handleUpdateLocation = async (userss,loc) => {
   
    try {
      fetch(`${baseUrl}/users/UpdateUserLocation/${loc.latitude}/${loc.longitude}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${userss.access_token}`,
        },
      })
        .then(response => response.json())
        .then(dataa => {
       console.log(dataa,"datss")
        });
    } catch (error) {
      console.log('An error occurred while processing your request.');
    }
  };

  const Item = ({id, name, role, image, onPress}) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <BouncyCheckbox
          fillColor="black"
          unfillColor="#FFFFFF"
          onPress={isChecked => {}}
          innerIconStyle={{
            borderRadius: 0,
          }}
        />
        <Image
          source={image}
          style={{width: 50, height: 50, borderRadius: 50}}
        />
        <View style={{marginLeft: 15}}>
          <Text style={{color: 'black'}}>{name}</Text>
          <Text>HI</Text>

          <Text style={{color: 'black'}}>{role}</Text>
        </View>
      </View>
      <View>
        <Icon name="right" size={24} color="orange" />
      </View>
    </TouchableOpacity>
  );
  const renderItem = ({item}) => (
    <Item
      name={item.name}
      role={item.role}
      image={item.image}
      onPress={() => navigation.navigate('Details', {item})}
    />
  );
  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <Header title="Profile" />
      {subscribed?.subscription_status != 1 ? (
        <></>
      ) : //   <BannerAd
      //   unitId={adUnitId}
      //   size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      // />
      null}
      <ScrollView style={{height: windowHeight}}>
        {userState == 1 ? (
          <View>
            <ProfileDetails
              name={data?.name}
              user_type={data?.user_type}
              speciality={data?.speciality}
              signatureDrink={data?.signature_drink}
            />
          </View>
        ) : userState == 2 ? (
          <View>
     
             <UserDetails name={data ? data.name : ''} prop={userState} />
          </View>
        ) : userState == 3 ? (
          <View>
            <UserDetails name={data ? data.name : ''} prop={userState} />
          </View>
        ) : (
          <View>
            <UserDetails name={data ? data.name : ''} prop={userState} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    width: 'auto',
    height: '87%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#ccc',
  },
  button: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#F2994A',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
