import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import SelectDropdown from 'react-native-select-dropdown';
import FormTextInput from '../components/FormTextInput';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {baseUrl} from '../global';
import Geolocation from '@react-native-community/geolocation';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const AllBartenders = () => {
  const [userId, setuserId] = useState(0);
  const [data, setdata] = useState();
  const [datas, setdatas] = useState();
  const [speciality, setspeciality] = useState('');
  const [availabilties, setavailabilties] = useState('1');
  const [ratings, setratings] = useState('null');
  const [distance, setDistance] = useState(25);
  const [subscribed, setSubscribed] = useState();
  const [position, setPosition] = useState();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [users, setusers] = useState('');
  const rating = ['1', '2', '3', '4', '5'];
  const availabilty = ['No', 'Yes'];
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = text => {
    setspeciality(text);
  };

  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem('data');
      AsyncStorage.setItem('data', value);
      setusers(JSON.parse(value));
      setuserId(JSON.parse(value).user_data[0].id);

      Geolocation.requestAuthorization();
      ValidateUserSubscription(JSON.parse(value));
      Geolocation.getCurrentPosition(pos => {
        const crd = pos.coords;

        setPosition({
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        });
        position && AllChats(JSON.parse(value), position);
      });
    }
    replacementFunction();
  }, [isFocused, availabilties, ratings, speciality]);
  const adUnitId =
    Platform.OS == 'android'
      ? 'ca-app-pub-9019633061186947/2536781695'
      : 'ca-app-pub-9019633061186947/8118897977';
  const ValidateUserSubscription = async userss => {
    try {
      fetch(`${baseUrl}/subscription/CheckSubscription`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${userss.access_token}`,
        },
      })
        .then(response => response.json())
        .then(dataa => {
          const subscriptions = dataa.subscription_status[0];

          setSubscribed(subscriptions);
        });
    } catch (error) {
      Alert.alert('An error occurred while processing your request.');
    }
  };
  const AllChats = async (userss, pos) => {
    // Your existing login logic
    // &minRating=0
    try {
      fetch(
        `${baseUrl}/users/GetAllBartenders?availability=${availabilties}&skills=${speciality}&minRating=${ratings}&lat=${position.latitude}&long=${position.longitude}&distance=${distance}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'BarTenderAPI',
            accesstoken: `Bearer ${userss.access_token}`,
          },
        },
      )
        .then(response => {
          return response.json();
        })
        .then(chat => {
 
          if (chat.message) {
            setdata(chat.users);
            setdatas(chat.users);
            // navigation.navigate('OtpS')
          } else {
          }
        })
        .catch(err => {
          // console.log(err,"dddd")
        });
    } catch (error) {
      console.log('An error occurred while processing your request.', error);
    }
  };

  // useEffect(() => {
  //   AllChats(userId)
  //     }, [userId])
  const Item = ({
    id,
    name,
    message,
    role,
    image,
    onPress,
    sender,
    seen_status,
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'whitesmoke',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{marginLeft: 15}}>
          <Text style={{color: 'grey'}}>{name}</Text>

          <Text style={{color: 'grey', fontSize: 12}}>{role}</Text>
        </View>
      </View>
      <View>
        <Image
          source={
            image != ''
              ? {uri: `${baseUrl}${image}`}
              : require('../assets/userpic.jpg')
          }
          style={{width: 50, height: 50, borderRadius: 7}}
        />
      </View>
    </TouchableOpacity>
  );
  const renderItem = ({item}) => (
    // item.seen_status==0 && item.sender !==userId ?
    <Item
      name={item.name}
      image={item.image}
      onPress={() => {
        navigation.navigate('Bartender', item);
      }}
    />
  );
  return (
    <SafeAreaView>
      {/* <Header title="Chat" headerShown={true}/> */}
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <View style={styles.siders}>
            <TouchableOpacity onPress={() => navigation.openDrawer('helloo')}>
              <Icon name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>Bartenders</Text>

          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <SelectDropdown
              buttonStyle={{
                width: '40%',
                marginTop: 10,
                borderRadius: 50,
                backgroundColor: '#D98100',
              }}
              buttonTextStyle={{
                fontSize: 12,
                color: 'white',
                fontWeight: 'bold',
              }}
              defaultButtonText="Availability"
              data={availabilty}
              onSelect={(selectedItem, index) => {
                setavailabilties(index);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
              }}
            />
            <SelectDropdown
              buttonStyle={{
                width: '40%',
                marginTop: 10,
                borderRadius: 50,
                backgroundColor: '#D98100',
              }}
              buttonTextStyle={{
                fontSize: 12,
                color: 'white',
                fontWeight: 'bold',
              }}
              defaultButtonText="Rating"
              data={rating}
              onSelect={(selectedItem, index) => {
                setratings(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
              }}
            />
          </View>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="orange" />
            <TextInput
              style={styles.input}
              placeholder="Speciality"
              placeholderTextColor={'orange'}
              value={speciality}
              onChangeText={handleSearch}
            />
          </View>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="orange" />
            <TextInput
              style={styles.input}
              placeholder="Distance per Mile"
              placeholderTextColor={'orange'}
              value={distance}
              onChangeText={text => setDistance(text)}
            />
          </View>
        </View>
      </SafeAreaView>
      {subscribed?.subscription_status != 1 ? (
        <></>
      ) : //   <BannerAd
      //   unitId={adUnitId}
      //   size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      // />
      null}
      <View style={styles.container}>

       {datas?.length==0?(<View style={styles.notfound}><Text style={{color:"orange"}}>No Bartenders Available</Text></View>):
        (<FlatList
          data={datas}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />)}
      </View>
    </SafeAreaView>
  );
};

export default AllBartenders;

const styles = StyleSheet.create({
  notfound:{
    display:'flex',alignItems:'center',justifyContent:'center',height:windowHeight*0.5
    },
  container: {
    width: 'auto',
    height: '78.5%',
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
  siders: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerContainer: {
    backgroundColor: '#FFA500',
    paddingTop: 40,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#D98100',
    paddingHorizontal: 10,
    marginTop: 10,
    height: 40,
    borderRadius: 10,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    color: 'white',
  },
});
