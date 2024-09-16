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
import { types } from 'react-native-document-picker';
import {baseUrl} from '../global';
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from 'react-native-toast-message';
const AddJobScreen2 = () => {
  const navigation = useNavigation()
  const [users, setusers] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem("data");
      setusers(JSON.parse(value))
      setpost_type(JSON.parse(value).user_data[0].user_type == 1 ? "bartender" : "user")
    }
    replacementFunction()

  }, [])
  const data = Array.from({length: 350}, (_, index) => ({ key: `${index + 1}`, value: `${index + 1}` }));
  const datas = Array.from({length: 6}, (_, index) => ({ key: `${index + 1}`, value: `${index + 1}` }));
  const datal = Array.from({length: 35}, (_, index) => ({ key: `${index + 1}`, value: `${index + 1}` }));

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
  const [imageUriimage, setImageUriimage] = useState();
const [imageUriflag, setImageUriflag] = useState(false);

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [theme, setTheme] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [imageUri, setImageUri] = useState();
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const hourlyRate = ["20", "25", "30", , "40", "50"]
  const [no_of_bartenders, setNo_of_bartenders] = useState();
  const handleSpecialtySelected = (specialty) => {
    setSelectedSpecialty(specialty)
  };
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
        const uri2 = response.assets[0];
        setImageUri(uri);
        setImageUriimage(uri2)
      }
    });
  };
  const handleSubmit = async () => {
    const Images = {
      uri: imageUri,
      type: imageUriimage?.type,
      name: `${new Date()}image.jpg`,
    };
 
    
   
    const formData = new FormData();
    formData.append('attachment', Images);
    formData.append('host_name', hostname);
    formData.append('contact_phone', contact_phone);
    formData.append('post_title', post_title);
    formData.append('event_date', new Date(event_date).toISOString().split('T')[0]);
    formData.append('event_time', new Date(event_time).toISOString().split('T')[1].split('.')[0]);
    formData.append('no_of_people', no_of_people);
    formData.append('theme', theme);
    formData.append('event_location', location);
 
    formData.append('event_lng', event_location?.latlng.lng);
    formData.append('event_lat', event_location?.latlng.lat);
    formData.append('no_of_bartenders', no_of_bartenders);
    formData.append('post_type', post_type);
    formData.append('bartender_hourly_rate', selectedSpecialty);
    formData.append('event_duration', event_duration);
    formData.append('zip_code', 9999);
    imageUriflag ? formData.append('file', Images) : "";

  
if (!post_title || !hostname || !contact_phone || !event_date || !event_time || !no_of_people || !event_duration  || !selectedSpecialty || !no_of_bartenders || !imageUri) {
  Alert.alert('All fields are required');
  if (data.message == "Created") {
    Toast.show({
      type: 'success',
      text1: 'Job Created',
      text2: 'Job has been created 👋'
    });
  
    navigation.goBack()
  } else {
    Toast.show({
      type: 'error',
      text1: 'Job Not Created',
      text2: `${data.message}`
    });
  }
  return;
}else{


    try {
      fetch(`${baseUrl}/posts/CreateFullTimeJob`, {

        method: 'POST',
        headers: {
          'accesstoken': `Bearer ${users.access_token}`,
          'x-api-key': 'BarTenderAPI',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
      
          setIsLoading(false)
          if (data.message == "Full Time Job Created") {
            Toast.show({
              type: 'success',
              text1: 'Job Created',
              text2: 'Job has been created 👋'
            });
          
            navigation.goBack()
          } else {
            Toast.show({
              type: 'error',
              text1: 'Job Not Created',
              text2: `${data?.message}`
            });
          }
        });
    } catch (error) {
    }
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
  keyboardShouldPersistTaps='always'

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
            mode="date"
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

       
             

          <Text style={{fontWeight:"bold",color:"grey",fontSize:13}}>(Suggestion): 1 bartender would be enough for 35 people.</Text>
        </View>
        
        <FormTextInput
          placeholder={'Theme'}
          placeholderColor={'grey'}
          setValues={text => setTheme(text)}
        />
   

        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
          <Text style={{ textAlign: 'center', color: "grey", fontWeight: 800 }}>Below Please select the rate you are willing to pay bartender per hour. If you are finding that your event is not being booked by bartender we suggest that you review your hourly rate. </Text>
        </View>
        <View>
          <Text style={{ color: "grey", fontWeight: "bold", lineHeight: 17 }}>Bartender Hourly Rate</Text>
          <SpecialtySelector
            specialties={hourlyRate}
            onSpecialtySelected={handleSpecialtySelected}
          />
        </View>
  
              <Text style={{ color: "grey", fontWeight: "bold", lineHeight: 17 }}>Attachment</Text>
            <TouchableOpacity
                style={{
                  backgroundColor: '#ECECEC',
                  padding: 12,
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 15,
                }}
                onPress={()=>handleSelectImage()}>
                {imageUri ? (
                  <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: "100%" }}>
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', }}>
                    <Icons.AntDesign name="file1"  size={20} />
                    
                      <Text style={{ color: 'grey' }}>{imageUriimage?.fileName}</Text>
                    </View>
                    <Icons.AntDesign name={"closecircle"} />
                  </View>
                ) : (
                  <Icons.AntDesign name="file1"  size={20} />
                )}
              </TouchableOpacity>
      </View>
    </View>
  </ScrollView>
  </>
    }
   
    </>
  );
};

export default AddJobScreen2;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: 'grey',
    paddingVertical:10
  },
  title: {
    fontWeight: "bold",
    color: 'grey',
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
  }
});
