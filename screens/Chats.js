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
import React, {useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {baseUrl} from '../global';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { socketUrl } from '../global';
// Define the Chats component
const Chats = () => {
  // State variables
  const [userId, setuserId] = useState(0);
  const [data, setdata] = useState();
  const [datas, setdatas] = useState();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [subscribed, setSubscribed] = useState();
  const [users, setusers] = useState('');
  const [searchQuery, setSearchQuery] = useState('');


  const socket = useRef(io(`${socketUrl}`));
console.log(socket)
  useEffect(() => {
    setRefreshing(true);
    socket.current.emit('getUserChatList', msgs => {
      console.log(msgs,"+++++++++++++++++")
      setRefreshing(false);
      setTimeout(scrollToBottom, 100);
    });
  }, []);


  // Handle search input
  const handleSearch = text => {
    setSearchQuery(text);
    if (text === '') {
      // Reset data to original state
      setdata(datas);
    } else {
      // Filter data based on search query
      const filteredData = datas?.filter(item =>
        item.name?.toLowerCase().includes(text?.toLowerCase()),
      );
      setdata(filteredData);
    }
  };

  // Use effect to fetch data when component is focused
  useEffect(() => {
    async function replacementFunction() {
      // Get data from AsyncStorage
      const value = await AsyncStorage.getItem('data');
      AsyncStorage.setItem('data', value);
      setusers(JSON.parse(value));
      // Validate user subscription
      ValidateUserSubscription(JSON.parse(value));
      // Set user ID
      setuserId(JSON.parse(value).user_data[0].id);
      // Fetch all chats
      // AllChats(JSON.parse(value).user_data[0].id);
    }
    replacementFunction();
  }, [isFocused]);

  // Ad unit ID
  const adUnitId =
    Platform.OS == 'android'
      ? 'ca-app-pub-9019633061186947/4712552739'
      : 'ca-app-pub-9019633061186947/7568233636';

  // Validate user subscription
  const ValidateUserSubscription = async userss => {
    try {
      // Fetch subscription status
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
          // Set subscription status
          setSubscribed(subscriptions);
        });
    } catch (error) {
      Alert.alert('An error occurred while processing your request.');
    }
  };
  
  // Fetch all chats
  const AllChats = async id => {
    setRefreshing(true);
    try {
      // Fetch chats from socket URL
      // console.log(`${socketUrl}/getMyChats`,id)
      fetch(`${socketUrl}/getMyChats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: id,
        }),
      })
        .then(response => response.json())
        .then(chat => {
          // console.log(chat)
          if (chat.success) {
            // Set data and original data
            setdata(chat.users);
        
            setdatas(chat.users);
            setRefreshing(false);
          } else {
            setRefreshing(false);
          }
        })
        .catch(err => {
          setRefreshing(false);
          console.log('An error occurred while .', err);
        });
    } catch (error) {
      setRefreshing(false);
      console.log('An error occurred while processing your request.', error);
    }
  };

  // Mark message as seen
  const seenMessage = async sender => {
    if (sender !== null)
      try {
        // Mark message as read
        fetch(`${socketUrl}/messages/ReadMessages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accesstoken: `Bearer ${users?.access_token}`,
            'x-api-key': 'BarTenderAPI',
          },
          body: JSON.stringify({sender: sender}),
        })
          .then(response => {
            return response.json();
          })
          .then(chat => {})
          .catch(err => {});
      } catch (error) {
        console.log('An error occurred while processing your .', error);
      }
  };

  // Define Item component
  const Item = ({name, image, onPress}) => {
    const imageuri = image?.split('uploads');
    return (
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
          <Image
            source={
              image != '' && image != undefined && image != null
                ? {uri: `${baseUrl}${imageuri[1]}`}
                : require('../assets/userpic.jpg')
            }
            style={{width: 40, height: 40, borderRadius: 7}}
          />
          <View style={{marginLeft: 15}}>
            <Text style={{color: 'black'}}>{name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Define renderItem function
  const renderItem = items => {

    return (
      <Item
        name={items?.item.name}
        image={items?.item.image}
        onPress={() => {
          seenMessage(items?.item.id);
          navigation.navigate('Message', items?.item);
        }}
      />
    );
  };

  // State variable for refreshing
  const [refreshing, setRefreshing] = useState(false);

  // On refresh function
  const onRefresh = () => {
    setRefreshing(true);
    AllChats();
  };

  

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
          <Text style={styles.headerText}>Chat</Text>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="orange" />
            <TextInput
              style={styles.input}
              placeholder="Search"
              placeholderTextColor={'orange'}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>
        {subscribed?.subscription_status != 1 ? (
          <></>
        ) : //   <BannerAd
        //   unitId={adUnitId}
        //   size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        // />
        null}
      </SafeAreaView>
      <View style={styles.container}>
      {data?.length==0?(<View style={styles.notfound}><Text style={{color:"orange"}}>No Chat Available</Text></View>):
      
       ( <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onRefresh={() => onRefresh()}
          refreshing={refreshing}
        />)}
      </View>
    </SafeAreaView>
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {
    width: 'auto',
    height: '78.5%',
    backgroundColor: '#fff',
  },
   notfound:{
  display:'flex',alignItems:'center',justifyContent:'center',height:windowHeight*0.5
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
    justifyContent: 'pace-between',
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
  },
});
