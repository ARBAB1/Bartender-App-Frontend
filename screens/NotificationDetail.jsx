import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import HeaderDetails from '../components/HeaderDetails';
import MapView, {Marker} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import moment from 'moment';
import ButtonInput from '../components/ButtonInput';
import Toast from 'react-native-toast-message';

import {baseUrl} from '../global'
const NotificationDetail = ({route}) => {
  const [users, setusers] = useState('');
  const [usertype, setusertype] = useState(0);
  const [data, setdata] = useState('');
  const [userdata, setuserdata] = useState('');
  const [activityLoader, setActivityLoader] = useState(false);
  const [activityLoader1, setActivityLoader1] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem('data');
      setusers(JSON.parse(value));
      setusertype(JSON.parse(value).user_data[0].user_type);
      handleSubmit(JSON.parse(value));
      handleCancel(JSON.parse(value));
      handleData(JSON.parse(value));
    }
    replacementFunction();
  }, []);

  const handleData = async users => {
    try {
      setActivityLoader1(true);

      await fetch(`${baseUrl}/posts/GetAllPostById/${route?.params?.post_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${users.access_token}`,
        },
      })
        .then(response => response.json())
        .then(dataa => {
          setActivityLoader1(false);
      
          setuserdata(dataa.posts[0]);
        });
    } catch (error) {
      setActivityLoader1(false);
      Alert.alert('An error occurred while processing your request.');
    }
  };
  const handleSubmit = async users => {
    try {
   
      setActivityLoader(true);
      await fetch(
        `${baseUrl}/posts/GetAllBookedBartenderByPostId/${route?.params?.post_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'BarTenderAPI',
            accesstoken: `Bearer ${users.access_token}`,
          },
        },
      )
        .then(response => response.json())
        .then(dataa => {
          setActivityLoader(false);
       
          setdata(dataa.posts);
        });
    } catch (error) {
      setActivityLoader(false);
      Alert.alert('An error occurred while processing your request.');
    }
  };
  const handleCancel = async postId => {
    const JsonBody = {post_id: postId};
    try {
      await fetch(`${baseUrl}/posts/CancelBookedPost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${users.access_token}`,
        },
        body: JSON.stringify(JsonBody),
      })
        .then(response => response.json())
        .then(dataa => {
          if (dataa?.success === 'Success') {
            Toast.show({
              type: 'success',
              text1: 'Job Cancel',
              text2: 'Job has been cancel 👋',
            });
            navigation.goBack();
          }
        });
    } catch (error) {
      Alert.alert('An error occurred while processing your request.');
    }
  };
  const handleBookEvent = async postId => {
    const JsonBody = {post_id: postId};
    try {
      fetch(`${baseUrl}/posts/BookPost`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          accesstoken: `Bearer ${users.access_token}`,
          'x-api-key': 'BarTenderAPI',
        },
        body: JSON.stringify(JsonBody),
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          if (data.message == 'Success') {
            Toast.show({
              type: 'success',
              text1: 'Job Booked',
              text2: 'Job has  been booked 👋',
            });
            navigation.goBack();
          } else {
            Alert.alert('Something Went Wrong');
          }
        });
    } catch (error) {
      console.log('erroror', error);
    }
  };
  var latitude = parseFloat(userdata?.event_lat);
  var longitude = parseFloat(userdata?.event_lng);
  const dp =
    users &&
    data &&
    data?.filter((x, y) => x?.bartender_id == users.user_data[0].id);

  return (
    <>
      <HeaderDetails title="Event Details" />
      {activityLoader1 ? (
        <View style={styles.loaderWrapper}>
          <ActivityIndicator />
        </View>
      ) : (
        <View>
         
          <View style={styles.section}>
            <Text style={{fontWeight: 'bold', fontSize: 18, color: 'black'}}>
              {' '}
              Event Name : {userdata?.post_title}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.labels}># of People</Text>
            <Text style={{fontWeight: 'bold', color: 'black'}}>
              {' '}
              {userdata?.no_of_people} or Less
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.labels}>Theme</Text>
            <Text style={{fontWeight: 'bold', color: 'black'}}>
              {' '}
              {userdata?.theme}{' '}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.labels}>Phone Number</Text>
            <Text style={{fontWeight: 'bold', color: 'black'}}>
              {' '}
              {userdata?.contact_phone}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.labels}>Date and Time</Text>

            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {`${moment(userdata?.event_date).format(
                'MMMM Do YYYY',
              )}, ${moment(userdata?.event_time, 'HH:mm:ss').format('LTS')}`}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.labels}>Event Duration</Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {userdata?.event_duration} hours{' '}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.labels}>Hourly Rate</Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {' '}
              $ {parseFloat(userdata?.bartender_hourly_rate).toFixed(2)}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.labels}>Timestamp</Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {' '}
              {userdata?.event_time}
            </Text>
          </View>
          <View style={{...styles.section, ...styles.location}}>
            <Text style={styles.labels}>Location</Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {userdata?.event_location}{' '}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {activityLoader ? (
              <View style={styles.loaderWrapper}>
                <ActivityIndicator />
              </View>
            ) : (
              <>
                {usertype != 2 ? (
                  <>
                
                    {data &&
                    data?.length > 0 &&
                    users &&
                    dp &&
                    dp.length > 0 ? (
                      <>
                        <ButtonInput
                          title={'Cancel Job'}
                          onPress={() => handleCancel(route.params.post_id)}
                        />
                      </>
                    ) : (
                      <>
                        <ButtonInput
                          title={'Book Job'}
                          onPress={() => handleBookEvent(route.params.post_id)}
                        />
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </View>
        </View>
      )}
    </>
  );
};

export default NotificationDetail;

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 170,
  },
  container: {
    backgroundColor: 'white',
    height: '100%',
    paddingBottom: 30,
    flex: 1,
  },
  section: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 10,
    margin: 5,
  },
  sections: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 10,
    margin: 5,
  },
  labels: {
    fontWeight: 'bold',
    color: 'grey',
  },
  loaderWrapper: {
    paddingTop: 10,
  },
  location: {
    flexWrap: 'wrap',
  },
});
