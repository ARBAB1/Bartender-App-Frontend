import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  ScrollView,
  TurboModuleRegistry,
  Alert,
  Button,
  Image,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import DatePicker from 'react-native-modern-datepicker';
import {Agenda} from 'react-native-calendars';
import moment from 'moment';
import {baseUrl} from '../global'

const MyCalender = ({route}) => {
  const [userState, setuserState] = useState(11);
  const [selectedDate, setSelectedDate] = useState('');
  const [users, setusers] = useState('');
  const [data, setdata] = useState();
  const [bookedEvents, setBookedEvents] = useState([]);
  const [imageUri, setImageUri] = useState(`${baseUrl}/${users?.image}` || '');
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState({
    '2024-05-01': [{name: 'Meeting with Client', time: '10:00 AM'}],
    '2024-05-03': [{name: 'Lunch with Team', time: '12:30 PM'}],
    '2024-05-06': [{name: 'Conference Call', time: '2:00 PM'}],
    '2024-05-10': [{name: 'Project Deadline', time: 'End of Day'}],
  });

  const adUnitId =
    Platform.OS == 'android'
      ? 'ca-app-pub-9019633061186947/7789108378'
      : 'ca-app-pub-9019633061186947/1453616961';
  // const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-9019633061186947/9389211687';
  const [subscribed, setSubscribed] = useState();
  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem('data');
      AsyncStorage.setItem('data', value);
      setusers(JSON.parse(value));
      setuserState(JSON.parse(value)?.user_data[0]?.user_type);
      handleSubmit(JSON.parse(value));
      getAllPosts(JSON.parse(value));
      ValidateUserSubscription(JSON.parse(value));
    }
    replacementFunction();
    getDeviceToken();
  }, [userState, route, isFocused, selectedDate]);

  const getDeviceToken = async () => {
    let token = await messaging().getToken();
  };
  useEffect(() => {
    const unsubscribeBackground = messaging().onMessage(async remoteMessage => {
      const notifeeData = remoteMessage;

      const permission = await notifee.requestPermission();
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
  await notifee.displayNotification({
        title: notifeeData.notification.title,
        body: notifeeData.notification.body,
        android: {
          channelId,
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
          
        },
      });
      
    });

    return unsubscribeBackground;
  }, []);

  const handleSubmit = async userss => {
    try {
      await fetch(`${baseUrl}/users/GetUserById/${userss.user_data[0].id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${userss.access_token}`,
        },
      })
        .then(response => response.json())
        .then(dataa => {
          if (dataa?.users.length > 0) {
            setImageUri(`${baseUrl}/${dataa?.users[0]?.image}`);
            setdata(dataa?.users[0]);
          }
        });
    } catch (error) {
      // Alert.alert('An error occurred while processing your request.');
    }
  };
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
    
          const subscriptions = dataa.subscription_status;

          setSubscribed(subscriptions);
        });
    } catch (error) {
      Alert.alert('An error occurred while processing your request.');
    }
  };
  const getAllPosts = async value => {
    try {
      await fetch(`${baseUrl}/posts/GetAllBookedPosts`, {
        method: 'GET',
        headers: {
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${users.access_token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
        
            setBookedEvents(data);
          } else {
            setBookedEvents([]);
          }
        });
    } catch (error) {
      // Alert.alert('An error occurred while processing your request.');
    }
  };
  const navigation = useNavigation();

  return (
    <>
      {isLoading ? (
        <>
          <View style={[styles.containerSpinner, styles.horizontalSpinner]}>
            <ActivityIndicator size="large" />
          </View>
        </>
      ) : (
        <>
          {bookedEvents.length > 0 ? (
            <>
              <Header title="My Calender" />

              {subscribed?.subscription_status != 1 ? (
                <Image source={require('../assets/banner.jpeg')} />
              ) : null}

              <Agenda
                items={bookedEvents}
                renderItem={item => (
                  <TouchableOpacity style={styles.card}>
                    <Text style={styles.text1}>{item.title}</Text>

                    <Text
                      style={{
                        fontSize: 16,
                        color: 'grey', // white color for better visibility on image
                        marginBottom: 5,
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}>
                      {' '}
                      {` ${moment(item?.time, 'HH:mm:ss').format('LTS')}`}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </>
          ) : (
            <>
              <Header title="My Calender" />
              {subscribed!= "1" ? 
                
                 <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              />:
              null}
              <Agenda
                items={bookedEvents}
                renderEmptyData={() => {
                  return (
                    <View
                      style={{
                        display: 'flex',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text>No Data Found</Text>
                    </View>
                  );
                }}
                renderItem={item => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('BookedDetails', {item})}
                    style={styles.card}>
                    <Text style={styles.text1}>{item.title}</Text>

                    <Text
                      style={{
                        fontSize: 16,
                        color: 'grey', // white color for better visibility on image
                        marginBottom: 5,
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}>{` ${moment(item?.time, 'HH:mm:ss').format(
                      'LTS',
                    )}`}</Text>
                  </TouchableOpacity>
                )}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default MyCalender;

const styles = StyleSheet.create({
  cardtext: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardtext2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 10,
    marginVertical: 6,
    padding: 20,
  },
  image: {
    width: '100%', // specify the width
    height: 200, // specify the height
    justifyContent: 'flex-end',
    alignItems: 'flex-start', // center the text horizontally
    marginBottom: 20,
    opacity: 1,
    background: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 10,
    color: '#fff', // white color for better visibility on image
  },
  text: {
    fontSize: 16,
    color: 'black', // white color for better visibility on image
    marginBottom: 5,
    fontWeight: 'bold',
  },
  text1: {
    fontSize: 14,
    color: 'orange', // white color for better visibility on image
  },
  container: {
    width: 'auto',
    height: '87%',

    backgroundColor: '#fff',
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
  containerSpinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  horizontalSpinner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});
