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
  Modal,
  Pressable,
  Dimensions,
  TextInput,
  Button,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import HeaderDetails from './HeaderDetails';
import MapView, {Marker} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Icons from './Icons';
import moment, {localeData} from 'moment';
import ButtonInput from './ButtonInput';
import Toast from 'react-native-toast-message';
import {baseUrl} from '../global';

const JobDetailsScreen = ({route}) => {
  const [users, setusers] = useState('');
  const [usertype, setusertype] = useState(0);
  const [userId, setuserId] = useState();
  const [data, setdata] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const navigation = useNavigation();

  const [rejectioReason, setRejectioReason] = useState('');

  const windowWidth = Dimensions.get('window').width;
  const windowheight = Dimensions.get('window').height;

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
    section2: {
      flexDirection: 'column',
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
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      width: windowWidth * 0.7,
      height: windowheight * 0.2,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });
  const itemsList = {id: route?.params?.created_by, reciever: userId};
  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem('data');
      setuserId(JSON.parse(value)?.user_data[0]?.id);
      handleSubmit(JSON.parse(value));
      setusers(JSON.parse(value));
      setusertype(JSON.parse(value)?.user_data[0].user_type);
      route?.params?.hide_post == 0
        ? setIsPasswordVisible(false)
        : setIsPasswordVisible(true);
    }
    replacementFunction();
  }, []);

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
      //   Alert.alert('An error occurred while processing your request.');
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
          }
        });
    } catch (error) {
      console.log('error1', error);
    }
  };

  const [activityLoader, setActivityLoader] = useState(false);
  const handleSubmit = async ({access_token}) => {

    try {
      setActivityLoader(true);
      const loadList = await fetch(
        `${baseUrl}/posts/GetAllBookedBartenderByPostId/${route?.params?.post_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'BarTenderAPI',
            accesstoken: `Bearer ${access_token}`,
          },
        },
      );
      const res = await loadList.json();
  
      if (res.message == 'Success') {
        setActivityLoader(false);
        setdata(res?.posts);
      }
    } catch (error) {
      setActivityLoader(false);
    }
  };

  var latitude = parseFloat(route.params?.event_lat);
  var longitude = parseFloat(route.params?.event_lng);
  const [rejectModal, setRejectModal] = useState({
    isVisible: false,
    bart_Id: '',
    post_Id: '',
  });

  const [rejectLoader, setRejectLoader] = useState(false);
  const RejectJobBartander = async () => {
   console.log( { post_id: rejectModal?.post_Id,
          bartender_id: (rejectModal?.bart_Id),
          rejection_reason: rejectioReason,})
   
    setRejectLoader(true);
    try {
      const loadReject = await fetch(`${baseUrl}/posts/RejectPost`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${users.access_token}`,
        },
        body: JSON.stringify({
          post_id: crejectModal?.post_Id,
          bartender_id: rejectModal?.bart_Id,
          rejection_reason: rejectioReason,
        }),
      });

      const loadRejection = await loadReject.json();
      console.log(loadRejection,"loadReject")
      if (loadRejection.message == 'rejected Successfully') {
        setRejectModal({
          isVisible: false,
          bart_Id: '',
          post_Id: '',
        });
        setRejectLoader(false);
        handleSubmit(users);
      } else {
        setRejectModal({
          isVisible: false,
          bart_Id: '',
          post_Id: '',
        });
        setRejectLoader(false);
        handleSubmit(users);
      }
    } catch (error) {
   console.log("",error)
      setRejectModal({
        isVisible: false,
        bart_Id: '',
        post_Id: '',
      });
      setRejectLoader(false);
      handleSubmit(users);
    }
  };

  const Item = ({name, image, number, onPress, item}) => {
    const imageuri = image?.split('uploads');

    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: 'whitesmoke',
        }}>
        <TouchableOpacity
          onPress={onPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={
              image != null && image != '' && image != undefined
                ? {uri: `${baseUrl}${imageuri[1]}`}
                : require('../assets/userpic.jpg')
            }
            style={{width: 50, height: 50, borderRadius: 7}}
          />

          <View style={{marginLeft: 15}}>
            <Text style={{color: 'grey'}}>{name}</Text>
            <Text style={{color: 'grey'}}>{number}</Text>
          </View>
        </TouchableOpacity>

        <View style={{marginRight: 15}}>
          <TouchableOpacity
            onPress={() =>
              setRejectModal({
                isVisible: true,
                bart_Id: item?.bartender_id,
                post_Id: item?.post_id,
              })
            }
            style={{
              paddingHorizontal: 25,
              paddingVertical: 5,
              borderRadius: 20,
              backgroundColor: 'red',
            }}>
            <Text style={{color: 'white'}}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderItem = ({item}) => (
    <>
      <Item
        item={item}
        name={item.name}
        image={item.image}
        number={item.number}
        onPress={() => navigation.navigate('BartenderProfile', item)}
      />
    </>
  );

  const togglePasswordVisibility = () => {
    if (route?.params?.post_id) {
      try {
        fetch(`${baseUrl}/posts/ChangePostHideStatus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'BarTenderAPI',
            accesstoken: `Bearer ${users.access_token}`,
          },
          body: JSON.stringify({
            post_id: route?.params?.post_id,
          }),
        })
          .then(response => {
            return response.json();
          })
          .then(chat => {
            setIsPasswordVisible(!isPasswordVisible);
          })
          .catch(err => {
            console.log(err, 'error2');
          });
      } catch (error) {
        console.log(
          'An error occurred while processing your request. 2',
          error,
        );
      }
    } else {
      console.log('Please fill in all fields 3');
    }
  };

  const socketUrl = 'https://bartinder-socket.digitalmobix.com';

  const seenMessage = async sender => {
    if (sender !== null)
      try {
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
        console.log('An error occurred while processing your request.', error);
      }
  };
  return (
    <View style={styles.container}>
      <HeaderDetails title="Event Details" />
      {route.params ? (
        <ScrollView>
          <View style={styles.section}>
            {usertype == 1 ? (
              <Text style={{fontWeight: 'bold', fontSize: 18, color: 'black'}}>
                {' '}
                Posted by : {route.params.posted_by}
              </Text>
            ) : (
              <View>
                <Text
                  style={{fontWeight: 'bold', fontSize: 18, color: 'black'}}>
                  {route.params.post_title}
                </Text>
                <TouchableOpacity
                  style={{paddingRight: 15}}
                  onPress={togglePasswordVisibility}>
                  <Icons.MaterialCommunityIcons
                    name={!isPasswordVisible ? 'eye' : 'eye-off'}
                    size={20}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.labels}># of People</Text>
            <Text style={{fontWeight: 'bold', color: 'black'}}>
              {' '}
              {route.params.no_of_people} or Less
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.labels}>Theme</Text>
            <Text style={{fontWeight: 'bold', color: 'black'}}>
              {' '}
              {route.params.theme}{' '}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.labels}>Phone Number</Text>
            <Text style={{fontWeight: 'bold', color: 'black'}}>
              {' '}
              {route.params.contact_phone}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.labels}>Date and Time</Text>

            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {`${moment(route.params.event_date).format(
                'MMMM Do YYYY',
              )}, ${moment(route.params.event_time, 'HH:mm:ss').format('LTS')}`}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.labels}>Event Duration</Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {route.params.event_duration} hours{' '}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.labels}>Hourly Rate</Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {' '}
              $ {parseFloat(route?.params?.bartender_hourly_rate).toFixed(2)}
            </Text>
          </View>

          <View style={{...styles.section, ...styles.location}}>
            <Text style={styles.labels}>Location</Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {route.params.event_location}{' '}
            </Text>
          </View>
          <View style={styles.section2}>
            {usertype == 2 ? (
              <>
                {data?.length > 0 ? (
                  <Text style={{color: 'grey', fontWeight: 'bold'}}>
                    Booked Bartender
                  </Text>
                ) : (
                  ''
                )}

                {activityLoader ? (
                  <View style={styles.loaderWrapper}>
                    <ActivityIndicator />
                  </View>
                ) : (
                  <FlatList data={data} renderItem={renderItem} />
                )}
              </>
            ) : (
              ''
            )}
            <Modal
              animationType="slide"
              transparent={true}
              visible={rejectModal.isVisible}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TextInput
                    onChangeText={newText => setRejectioReason(newText)}
                    placeholder="Reason for rejection"
                    style={{
                      borderWidth: 1,
                      borderColor: 'gray',
                      width: '100%',
                      borderRadius: 15,
                      paddingHorizontal: 10,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      paddingTop: 15,
                    }}>
                    <TouchableOpacity
                      onPress={() => setRejectModal({isVisible: false})}
                      style={{
                        width: '48%',
                        padding: 5,
                        borderRadius: 10,
                        borderColor: 'black',
                        borderWidth: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{color: 'black'}}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => RejectJobBartander()}
                      style={{
                        width: '48%',
                        padding: 5,
                        backgroundColor: 'red',
                        borderRadius: 10,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {rejectLoader ? (
                        <ActivityIndicator color={'white'} />
                      ) : (
                        <Text style={{color: 'white'}}>Reject</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              title={'Marker Title'}
              description={'Marker Description'}
            />
          </MapView>
          {usertype == 1 ? (
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
                  {data?.length > 0 ? (
                    <>
                      <ButtonInput
                        onPress={() => {
                          // seenMessage(item.id);
                          navigation.navigate('Chats', {
                              screen: 'Message',
                              params: {id: route?.params?.created_by, reciever: userId},
                            });
                        }}
                        title={'Chat With User'}
                      />
                      <ButtonInput
                        title={'Cancel Job'}
                        onPress={() => handleCancel(route.params.post_id)}
                      />
                    </>
                  ) : (
                    <>
                      <View
                        style={{
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <ButtonInput
                          title={'Book Job'}
                          onPress={() => handleBookEvent(route.params.post_id)}
                        />
                        <ButtonInput
                          onPress={() => {
                            // seenMessage(item.id);
                            navigation.navigate('Chats', {
                              screen: 'Message',
                              params: {id: route?.params?.created_by, reciever: userId}
                              ,
                            });
                          }}
                          title={'Chat With User'}
                        />
                      </View>
                    </>
                  )}
                </>
              )}
            </View>
          ) : (
            ''
          )}
        </ScrollView>
      ) : (
        ''
      )}
    </View>
  );
};

export default JobDetailsScreen;
