import { FlatList, SafeAreaView, ImageBackground, ActivityIndicator, PermissionsAndroid,Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, TextInput, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import { baseUrl } from '../global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Icons from '../components/Icons';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const BookedEvents = ({ route }) => {
  const [userState, setuserState] = useState(11)
  const [users, setusers] = useState("")
  const [data, setdata] = useState()
  const [show, setShow] = useState(false)
  const [no_of_people, setno_of_people] = useState("")
  const [zip_code, setzip_code] = useState("")
  const [Distance_Radius, setDistance_Radius] = useState("")
  const [Hourly_Rate, setHourly_Rate] = useState("")
  const [event_duration, setevent_duration] = useState("")
  const [bookedEvents, setBookedEvents] = useState([])
  const [imageUri, setImageUri] = useState(`${baseUrl}/${users?.image}` || '');
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [startDate, setStartDate] = useState("null");
  const [endDate, setEndDate] = useState("null");
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  
  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    hideStartDatePicker();
  };
  const handleEndDateConfirm = (date) => {
    setEndDate(date);
    hideEndDatePicker();
  };



  const rating = ["1", "2", "3", "4", "5"]
  const availabilty = ["No", "Yes"]
  const navigation = useNavigation()
  const [speciality, setspeciality] = useState("")
  const handleSearch = (text) => {
    setspeciality(text);

  };


  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem('data');
      AsyncStorage.setItem('data', value)
      setusers(JSON.parse(value));
      setuserState(JSON.parse(value)?.user_data[0]?.user_type);
      handleSubmit(JSON.parse(value));
      getAllPosts(JSON.parse(value).access_token)
    }
    replacementFunction()
  }, [userState, route, isFocused, event_duration, zip_code, Distance_Radius, startDate, endDate, no_of_people, Hourly_Rate]);

  const handleSubmit = async (userss) => {
    try {
      await fetch(`${baseUrl}/users/GetUserById/${userss.user_data[0].id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          'accesstoken': `Bearer ${userss.access_token}`
        },
      })
        .then(response => response.json())
        .then(dataa => {
          if (dataa?.users.length > 0) {
            setImageUri(`${baseUrl}/${dataa?.users[0]?.image}`)
            setdata(dataa?.users[0])
          }
        });
    } catch (error) {
      Alert.alert('An error occurred while processing your request.');
    }

  };

  const getAllPosts = async (access_token) => {

    // return
    setIsLoading(true)
    try {
      await fetch(`${baseUrl}/posts/SearchJobsPremiumPackage?event_duration=${event_duration}&zip_code=${zip_code}&DistanceRadius=${Distance_Radius}&date_start=${startDate != "null" ? new Date(startDate).toISOString().split("T")[0] : "null"}&date_end=${endDate != "null" ? new Date(endDate).toISOString().split("T")[0] : "null"}&no_of_people=${no_of_people}&bartender_hourly_rate=${Hourly_Rate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          'accesstoken': `Bearer ${access_token}`
        }
      }).then(response => response.json())
        .then(data => {
          setIsLoading(false)

          if (data.posts.length > 0) {
            setBookedEvents([...data.posts])
          }
          else {
            setBookedEvents([])
          }
        })
    } catch (error) {
      // Alert.alert('An error occurred while processing your request.');

    }
  }

  const handleBookEvent = async (postId) => {
    const JsonBody = { post_id: postId }
    try {
      fetch(`${baseUrl}/posts/BookPost`, {

        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'accesstoken': `Bearer ${users.access_token}`,
          'x-api-key': 'BarTenderAPI',
        },
        body: JSON.stringify(JsonBody),
      })
        .then(response => {
          return response.json()
        }
        )
        .then(data => {
          if (data.message == "Success") {
            Alert.alert(
              "Booked Event Successfully",
              "Booked Event Successfully"
              [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                  style: 'cancel',
                }
              ]
              )
            getAllPosts()
          } else {
            Alert.alert("Something Went Wrong")
          }
        });

    } catch (error) {
      console.log("erroror", error)
    }
  }

  const Item = ({ EventDate, postId, name, contact, EventTime, theme, EventLocation, NoOfPeople, event_duration,post_type, onPress }) => (
    <View style={styles.card}>


      <TouchableOpacity style={styles.cardtext2}>
        <View style={styles.cardtext}>
          <Text style={styles.text1}>Event Name: </Text>
          <Text style={styles.text}>{name}</Text>

          <Text style={styles.text1}>Event Date :</Text>
          <Text style={styles.text}>{moment(EventDate).format('MMMM Do YYYY, h:mm:ss a')}</Text>

          <Text style={styles.text1}>Event Duration :</Text>
          <Text style={styles.text}>{event_duration}</Text>
        </View>

        {post_type == "Full Time"?
 <TouchableOpacity  style={{
  width: 40, height: 40, borderRadius: 50, backgroundColor: '#F4E8D6', display: 'flex', alignItems: 'center', justifyContent: 'center'
}}>
  <Icons.Ionicons name="attach" color="#FFA500" size={20} />
 
</TouchableOpacity>:null
        }
        {/* <View style={{
          width: 40, height: 40, borderRadius: 50, backgroundColor: '#F4E8D6', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon name="mail" color="#FFA500" size={20} />
        </View> */}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cardtext}>
        <Text style={styles.text1}>Theme:</Text>
        <Text style={styles.text}>{theme}</Text>

      </TouchableOpacity>
      <TouchableOpacity style={styles.cardtext}>
        <Text style={styles.text1}>Phone Number:  </Text>
        <Text style={styles.text}>{contact}</Text>

      </TouchableOpacity>

      <TouchableOpacity style={styles.cardtext}>
        <Text style={styles.text1}>Time:</Text>
        <Text style={styles.text}>{EventTime}</Text>

      </TouchableOpacity>

      <TouchableOpacity style={styles.cardtext}>
        <Text style={styles.text1}>Event Location:</Text>
        <Text style={styles.text}>{EventLocation}</Text>

      </TouchableOpacity>
      <TouchableOpacity style={styles.cardtext}>
        <Text style={styles.text1}>No Of People:</Text>
        <Text style={styles.text}>{NoOfPeople}</Text>

      </TouchableOpacity>

      <TouchableOpacity style={styles.cardtext} onPress={onPress}>
        <Text style={styles.BookEventButton}>
          Book Event
        </Text>

      </TouchableOpacity>



    </View>
  );
  const renderItem = ({ item }) => (
    <>
    <Item postId={item?.post_id} name={item?.post_title} contact={item?.contact_phone} image={item?.image} theme={item?.theme} EventDate={item?.event_date} EventTime={item?.event_time} EventLocation={item?.event_location} NoOfPeople={item?.no_of_people} event_duration={item?.event_duration} onPress={()=>handleBookEvent(item?.post_id)} post_type={item?.post_type}/>
    </>
  );
  return (
    <>
      {


        <ScrollView>
          {/* <SafeAreaView> */}
            <View style={styles.headerContainer}>
              <View style={styles.siders}>
                <TouchableOpacity onPress={() => navigation.openDrawer("helloo")}>
                  <Icon name="menu" size={24} color="#fff" />
                </TouchableOpacity>

              </View>
              <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>

                <Text style={styles.headerText}>Events</Text>
                <TouchableOpacity onPress={() => setShow(!show)}>

                  <Icons.AntDesign name="filter" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              {show ?
                <View>


                  <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                    <View style={{ paddingTop: 10 }}>


                      <Text style={{ color: 'white', fontSize: 11 }}>Start Date</Text>
                      <View style={styles.searchContainers}>


                        <TouchableOpacity onPress={showStartDatePicker} >
                          <TextInput
                            style={styles.input}
                            placeholder="Start Date"
                            placeholderTextColor={"white"}
                            value={startDate != "null" ? startDate?.toDateString() : ""} // Display the selected date
                            editable={false} // Disable manual input

                          />
                        </TouchableOpacity>

                        <DatePicker
                          modal
                          open={isStartDatePickerVisible}
                          mode="date"
                          date={startDate != "null" ? startDate : new Date()}
                          onConfirm={handleStartDateConfirm}
                          onCancel={hideStartDatePicker}
                        />
                      </View>
                    </View>
                    <View>

                      <Text style={{ color: 'white', fontSize: 11 }}>End Date</Text>
                      <View style={styles.searchContainers}>


                        <TouchableOpacity onPress={showEndDatePicker} >
                          <TextInput
                            style={styles.input}
                            placeholder="End Date"
                            placeholderTextColor={"white"}
                            value={endDate != "null" ? endDate.toDateString() : ""} // Display the selected date
                            editable={false} // Disable manual input

                          />
                        </TouchableOpacity>

                        <DatePicker
                          modal
                          open={isEndDatePickerVisible}
                          mode="date"
                          date={endDate != "null" ? endDate : new Date()}
                          onConfirm={handleEndDateConfirm}
                          onCancel={hideEndDatePicker}
                        />
                      </View>
                    </View>

                  </View>
                  <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                    <View style={{ paddingTop: 10 }}>

                      <Text style={{ color: 'white', fontSize: 11 }}>Event Duration</Text>
                      <View style={styles.searchContainers}>
                        <TextInput
                          style={styles.input}
                          placeholder="Event Duration"
                          placeholderTextColor={"white"}
                          value={event_duration}
                          onChangeText={(e) => setevent_duration(e)}

                        />
                      </View>
                    </View>
                    <View>

                      <Text style={{ color: 'white', fontSize: 11 }}>No of People</Text>
                      <View style={styles.searchContainers}>
                        <TextInput
                          style={styles.input}
                          placeholder="No of People"
                          placeholderTextColor={"white"}
                          value={no_of_people}
                          onChangeText={(e) => setno_of_people(e)}

                        />
                      </View>
                    </View>
                  </View>
                  <View style={{ paddingTop: 10 }}>


                    <Text style={{ color: 'white', fontSize: 11 }}>Hourly_Rate</Text>
                    <View style={styles.searchContainer}>

                      <TextInput
                        style={styles.input}
                        placeholder="Hourly_Rate"
                        placeholderTextColor={"white"}
                        value={Hourly_Rate}
                        onChangeText={(e) => setHourly_Rate(e)}

                      />
                    </View>
                  </View>
                </View>
                : null}
            </View>

          {/* </SafeAreaView> */}
          {
            bookedEvents.length > 0 ?
              <View>
                <FlatList
                  data={bookedEvents}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                />
              </View>
              : <Text style={{ color: "black", textAlign: "center", fontSize: 20 }}>No events</Text>
          }
        </ScrollView>


      }
    </>


  )
}

export default BookedEvents

const styles = StyleSheet.create({
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
    borderRadius: 10
  },
  searchContainers: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#D98100',
    paddingHorizontal: 10,
    marginTop: 10,
    height: 40,
    width: windowWidth * 0.4,
    borderRadius: 10
  },
  input: {
    marginLeft: 10,
    flex: 1,
    color: 'white'
  },
  cardtext: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardtext2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  BookEventButton: {
    backgroundColor: '#FFA500',
    height: 38,
    color: '#fff',
    width: 190,
    marginLeft: 65,
    paddingTop: 9,
    textAlign: 'center',
    fontSize: 16,
    borderRadius: 10


  },
  card: {

    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    padding: 20


  },
  image: {
    width: '100%', // specify the width
    height: 200, // specify the height
    justifyContent: "flex-end",
    alignItems: 'flex-start', // center the text horizontally
    marginBottom: 20,
    opacity: 1,
    background: "#000"
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 10,
    color: '#fff' // white color for better visibility on image
  },
  text: {
    fontSize: 16,
    color: 'black', // white color for better visibility on image
    marginBottom: 5,
    fontWeight: "600"
  },
  text1: {
    fontSize: 14,
    color: 'black', // white color for better visibility on image
  },
  container: {
    width: 'auto',
    height: "87%",
    backgroundColor: '#fff',
  },
  button: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#F2994A',
    borderRadius: 30,
    width: 60, height: 60,
    justifyContent: 'center', alignItems: 'center'
  },
  flatList: {
    paddingBottom: 1320,
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
  }
})