import {
  SafeAreaView,
  Image,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import FormInput from '../components/FormInput';
import FormTextInput from '../components/FormTextInput';
import FormTextInputWithLocationAutocomplete from '../components/FormTextInputWithLocationAutocomplete'
import PasswordInput from '../components/PasswordInput';
import ButtonInput from '../components/ButtonInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import HeaderDetails from '../components/HeaderDetails';
import { launchImageLibrary } from 'react-native-image-picker';
import Icons from '../components/Icons';
import SpecialtySelector from '../components/Selector';
import AboutHeader from '../components/AboutHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {baseUrl} from "../global";
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SelectList } from 'react-native-dropdown-select-list';

const AddJobScreen = () => {
  const navigation = useNavigation()
  const [users, setusers] = useState("")
  const [selected, setSelected] = React.useState("");
  const [isLoading, setIsLoading] = useState(false);
  const data = Array.from({length: 350}, (_, index) => ({ key: `${index + 1}`, value: `${index + 1}` }));
  const datas = Array.from({length: 6}, (_, index) => ({ key: `${index + 1}`, value: `${index + 1}` }));
  const datal = Array.from({length: 35}, (_, index) => ({ key: `${index + 1}`, value: `${index + 1}` }));

  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem("data");
      setusers(JSON.parse(value))
      setImageUri(`${baseUrl}/${JSON.parse(value).user_data[0].image}`)
      setpost_type(JSON.parse(value).user_data[0].user_type == 1 ? "bartender" : "user")
    }
    replacementFunction()

  }, [])

  const count = useSelector(state => state.auth.user);
  const [post_type, setpost_type] = useState('bartender');
  const [post_title, setpost_title] = useState();
  const [hostname, sethostName] = useState();
  const [no_of_people, setno_of_people] = useState();
  const [location, setLocation] = useState("");
  const [contact_phone, setcontact_phone] = useState();
  const [event_date, setevent_date] = useState(new Date());
  const [event_time, setevent_time] = useState(new Date());
  const [event_duration, setevent_duration] = useState();
  const [event_location, setevent_location] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [theme, setTheme] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [imageUri, setImageUri] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const hourlyRate = ["20", "25", "30", , "40", "50"]
  const [no_of_bartenders, setNo_of_bartenders] = useState();
  const handleSpecialtySelected = (specialty) => {
    setSelectedSpecialty(specialty)
  };
  const emojisWithIcons = [
    {title: "happy", icon: "alpha-f"},
    {title: 'cool', icon: 'emoticon-cool-outline'},
    {title: 'lol', icon: 'emoticon-lol-outline'},
    {title: 'sad', icon: 'emoticon-sad-outline'},
    {title: 'cry', icon: 'emoticon-cry-outline'},
    {title: 'angry', icon: 'emoticon-angry-outline'},
    {title: 'confused', icon: 'emoticon-confused-outline'},
    {title: 'excited', icon: 'emoticon-excited-outline'},
    {title: 'kiss', icon: 'emoticon-kiss-outline'},
    {title: 'devil', icon: 'emoticon-devil-outline'},
    {title: 'dead', icon: 'emoticon-dead-outline'},
    {title: 'wink', icon: 'emoticon-wink-outline'},
    {title: 'sick', icon: 'emoticon-sick-outline'},
    {title: 'frown', icon: 'emoticon-frown-outline'},
  ];
  const handleSelectImage = () => {
    const options = {
      noData: true,
      mediaType: 'photo',
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };
  const handleSubmit = async () => {
    // Validate all fields
    if (!hostname) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter the host name.'
      });
      return;
    }
    if (!contact_phone) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter the contact phone.'
      });
      return;
    }
    if (!post_title) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter the event name.'
      });
      return;
    }
    if (!event_date) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please select the event date.'
      });
      return;
    }
    if (!event_time) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please select the event time.'
      });
      return;
    }
    if (!no_of_people) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please select the number of people.'
      });
      return;
    }
    if (!theme) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter the theme.'
      });
      return;
    }
    if (!event_location) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter the event location.'
      });
      return;
    }
    if (!no_of_bartenders) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please select the number of bartenders.'
      });
      return;
    }
    if (!selectedSpecialty) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please select the bartender hourly rate.'
      });
      return;
    }
    if (!event_duration) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please select the event duration.'
      });
      return;
    }
  
    // All fields are valid, proceed with API call
    setIsLoading(true);
  
    const JsonBody = {
      host_name: hostname,
      contact_phone: contact_phone,
      post_title: post_title,
      event_date: new Date(event_date).toISOString().split('T')[0],
      event_time: new Date(event_time).toISOString().split('T')[1].split('.')[0],
      no_of_people: no_of_people,
      theme: theme,
      event_location: event_location?.location,
      event_lng: event_location?.latlng.lng,
      event_lat: event_location?.latlng.lat,
      no_of_bartenders: no_of_bartenders,
      post_type: post_type,
      bartender_hourly_rate: selectedSpecialty,
      event_duration: event_duration,
      zip_code: 9999
    };
  console.log(JsonBody,"data")
    try {
      const response = await fetch(`${baseUrl}/posts/CreatePost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accesstoken': `Bearer ${users.access_token}`,
          'x-api-key': 'BarTenderAPI',
        },
        body: JSON.stringify(JsonBody),
      });
      const data = await response.json();
      console.log(data)
      setIsLoading(false);
      if (data.message === "Created") {
        Toast.show({
          type: 'success',
          text1: 'Job Created',
          text2: 'Job has been created 👋'
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Job Not Created',
          text2: `${data?.message}`
        });
      }
    } catch (error) {
      setIsLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while creating the job.'
      });
    }
  };
  
  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || event;
    setShowPicker(Platform.OS === 'ios');
    setevent_date(currentDate);
  };
  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || event_time;
    setShowTimePicker(Platform.OS === 'ios');
    setevent_time(currentDate);
  };
  return (
    <>
    {isLoading? 
     <View style={[styles.containerSpinner, styles.horizontalSpinner]}>
     <ActivityIndicator size="large" />
   </View>
    :<>
    <SafeAreaView>
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ display: "flex", flexDirection: "row" }}>
        <Text style={styles.headerText}>Cancel</Text>
      </TouchableOpacity>
      <Text style={styles.headerText}>Form</Text>
      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={{ display: "flex", flexDirection: "row" }}>
        <Text style={styles.headerText}>Submit</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
  <ScrollView 
  keyboardShouldPersistTaps="handled"

  >
    <View style={{ padding: 15, width: windowWidth }}>

      <Text style={styles.title}>THIS IS A BARTENDER BOOKING ONLY. </Text>
      <Text style={styles.title}>ALCOHOL IS NOT INCLUDED IN THIS </Text>
      <Text style={styles.title}>PURCHASE.</Text>

      <View >
        <FormTextInput
          placeholder={'Host Name'}
          placeholderColor={'grey'}
          setValues={text => sethostName(text)}
        />
        <FormTextInputWithLocationAutocomplete setValues={setevent_location} />
        <FormTextInput
          placeholder={'Phone Number'}
          placeholderColor={'grey'}
          keyboardType="numeric"
          setValues={text => setcontact_phone(text)}
        />
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <FormTextInput
            placeholderColor={'grey'}
            currentvalue={event_date.toLocaleDateString()}
            edit={false}
            icon={'calendar'}
            title={'Date and Time'}
          />
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            testID="startDateTimePicker"
            value={event_date}
            mode="datetime"
            display="default"
            onChange={onChangeEnd}
          />
        )}
        <FormTextInput
          placeholder={'Event Name'}
          placeholderColor={'grey'}
          setValues={text => setpost_title(text)}
        />
        <View >
        <Text style={styles.dropdownButtonTxtStyle}>
        Select Event Duration
        </Text>
        <SelectList 
        searchPlaceholder=""
      
        setSelected={(val) => setevent_duration(val)} 
        data={datas} 
        inputStyles={{color:'grey'}}
        dropdownTextStyles={{color:'grey'}}
        
        dropdownStyles={{color:'grey'}}
        save="value"
        dropdownItemStyles={{color:"grey"}}
        boxStyles={{color:"grey",}}
        placeholder='Select Event Duration'
      />
      
   
         <Text  style={styles.dropdownButtonTxtStyle}>Number of People</Text>
         <SelectList
      searchPlaceholder=" "
      setSelected={(val) => setno_of_people(val)} 
      inputStyles={{color:'grey'}}
      dropdownTextStyles={{color:'grey'}}
 
      data={data} 
      save="value"
      dropdownItemStyles={{color:"grey"}}
      boxStyles={{color:"grey"}}
      
      placeholder='Select No. of People'
    />
        <Text style={{fontWeight:"bold",color:"black",fontSize:13}}>(Note): For more than 350 people contact our website.</Text>
        <Text  style={styles.dropdownButtonTxtStyle}>Number of Bartenders</Text>
        <SelectList
        searchPlaceholder=" "
        setSelected={(val) => setNo_of_bartenders(val)} 
        inputStyles={{color:'grey'}}
        dropdownTextStyles={{color:'grey'}}
    
        data={datal} 
        save="value"
        dropdownItemStyles={{color:"grey"}}
        boxStyles={{color:"grey"}}
        
        placeholder='Select No. of Bartenders'
      />

          <Text style={{fontWeight:"bold",color:"black",fontSize:13}}>(Suggestion): 1 bartender would be enough for 35 people.</Text>
        </View>
       
        
        <FormTextInput
          placeholder={'Theme'}
          placeholderColor={'grey'}
          setValues={text => setTheme(text)}
        />
      <View style={{justifyContent:"center"}}>
     
        </View>
  
{/* 
        <FormTextInput
          placeholder={'Location'}
          placeholderColor={'grey'}
          setValues={text => setevent_location(text)}
        /> */}
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20 }}>
          <Text style={{ textAlign: 'center', color: "black", fontWeight: 900,lineHeight:15 }}>Below Please select the rate you are willing to pay bartender per hour. If you are finding that your event is not being booked by bartender we suggest that you review your hourly rate. </Text>
        </View>
        <View>
          <Text style={{ color: "black", fontWeight: "bold", lineHeight: 17 }}>Bartender Hourly Rate</Text>
          <SpecialtySelector
            specialties={hourlyRate}
            onSpecialtySelected={handleSpecialtySelected}
          />
        </View>
        {/* <ButtonInput title={"Create Event"} onPress={()=>handleSubmit()}/> 

        */}

      </View>
    </View>
  </ScrollView>
  </>
    }
   
    </>
  );
};

export default AddJobScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: "bold",
    color: 'black',
    fontSize: 15,
    textAlign: "center"
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#FFA500',
    padding: 10,
    paddingBottom: 10,
  },
  headerText: {
    color: 'whitesmoke',
    fontSize: 17,
    fontWeight: 'bold',

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
  dropdownButtonStyle: {
    width: 500,
   
    
 
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: 'grey',
    paddingVertical:10
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    borderRadius: 8,
    width:"90%",
    
    
  
    
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
    
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    // marginRight: 8,
  },
});
