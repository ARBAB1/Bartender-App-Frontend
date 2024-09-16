import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import FormInput from '../components/FormInput';
import YesNoSelector from '../components/Selectors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icons from '../components/Icons';
import ButtonInput from '../components/ButtonInput';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import { useSelector } from 'react-redux';
import SpecialtySelector from '../components/Selector';
import FormTextInput from '../components/FormTextInput';
import AboutHeader from '../components/AboutHeader';
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../global';
const EditProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [newval, setnewVal] = useState(false)
  const [users, setusers] = useState({})
  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem("data");
      setuserTypes(JSON.parse(value).user_data[0].user_type)
      setusers(JSON.parse(value))
      setName(JSON.parse(value).user_data[0].name)
      getDefaultData(JSON.parse(value))
      setnewVal(true)

    }
    replacementFunction()
  }, [isFocused])
  const emojisWithIcons = [
    {title: 'happy', icon: 'emoticon-happy-outline'},
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
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const count = useSelector(state => state.auth.user);
  const specialitys = ['None', 'Shots', 'Cocktail'];
  const training = ['Yes', 'No'];
  const [paymentLink, setPaymentLink] = useState("")
  const [signature_drink, setsignature_drink] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('None');
  const [selectedTraing, setSelectedTraining] = useState('Yes');
  const [name, setName] = useState("");
  const [number, setNumber] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [dob_date, setdob_date] = useState(new Date());
  const [imageUri, setImageUri] = useState();
  const [certificationUri, setCertificationUri] = useState();
  const [resumeUri, setResumeUri] = useState();
  const [imageUriflag, setImageUriflag] = useState(false);
  const [certificationUriflag, setCertificationUriflag] = useState(false);
  const [resumeUriflag, setResumeUriflag] = useState(false);
  const [imageUriimage, setImageUriimage] = useState();
  const [certificationUriimage, setCertificationUriimage] = useState();
  const [resumeUriimage, setResumeUriimage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFileName, setImageFileName] = useState("profile.png");

  const handleTrainingSelected = training => {
    setSelectedTraining(training);
  };
  const handleSpecialitySelected = speciality => {
    setSelectedSpecialty(speciality);
  };
  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || event;
    setShowPicker(Platform.OS === 'ios');
    setdob_date(currentDate);
  };
  const handleSelectImage = (setUriFunction, seturi, setflag) => {
    const options = {
      noData: true,
      mediaType: 'photo',
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        const uri = response.assets[0].uri;
        const uri2 = response.assets[0];
        setUriFunction(uri);
        seturi(uri2)
        setflag(true)
        const fileName = uri.split('/').pop();
  const fileType = fileName.split('.').pop();
  setImageFileName(`${fileName.substring(0,10)}.${fileType}`)

      }
    });
  };
  const selectDoc = async (setUriFunction, seturi, setflag) => {
    try {
      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        allowMultiSelection: true
      });
      const uri = doc[0].uri;
      const uri2 = doc[0];
      setUriFunction(uri);
      seturi(uri2)
      setflag(true)

      
      
 
    } catch(err) {
      if(DocumentPicker.isCancel(err)) 
        console.log("User cancelled the upload", err);
      else 
        console.log(err)
    }
  }
  const[userTypes,setuserTypes]=useState(0)

  const getDefaultData = async (users) => {
    setIsLoading(true)
    setusers(users)
    try {
      await fetch(`${baseUrl}/users/GetUserById/${users?.user_data[0]?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'accesstoken': `Bearer ${users?.access_token}`,
          'x-api-key': 'BarTenderAPI',
        }
      }).then(
        response => response.json())
        .then(data => {
     
          if (data.message === 'Success') {
            setName(data?.users[0]?.name)
            setuserTypes(data?.users[0]?.user_type)
            var tra = data?.users[0]?.alcohol_serving
            setSelectedTraining(training.filter(data => data == `${tra == "1" ? "Yes" : "No"}`)[0])
            setNumber(data?.users[0]?.number)
            setdob_date(new Date(data?.users[0]?.dob))
            setImageUri(`${baseUrl}` + data?.users[0]?.image)
            setCertificationUri(`${baseUrl}` + data?.users[0]?.certificate)
            setResumeUri(`${baseUrl}` + data?.users[0]?.resume)
            setsignature_drink(data?.users[0]?.signature_drink)
            setPaymentLink(data?.users[0].payment_link)
            var spe = data?.users[0]?.speciality
            setSelectedSpecialty(specialitys.filter(data => data == `${spe}`)[0])
            setIsLoading(false)
          } else {
            console.log(data.data);
          }
        });
    } catch (error) {
console.log(error)
    }
  }
  const handleSubmit = async () => {
    setIsLoading(true);
        const newdate = new Date().getTime();
      const datet = newdate;
    const file = {
      uri: imageUri,
      type: imageUriimage?.type,
      name: `${datet}profile_image.jpg`,
    };
    
    const Certification = {
      uri: certificationUri,
      type: certificationUriimage?.type,
      name: `${datet}certificate_image.pdf`,
    };
    const Resume = {
      uri: resumeUri,
      type: resumeUriimage?.type,
      name: `${datet}resume_image.pdf`,
    };
  
    const formData = new FormData();
    imageUriflag ? formData.append('file', file) : "";
    formData.append('name', name);
    formData.append('user_id', users?.user_data[0]?.id)
    formData.append('number', number);
    formData.append('speciality', selectedSpecialty==undefined?"":selectedSpecialty);
    formData.append('signature_drink', signature_drink);
    formData.append('payment_link', paymentLink);
    resumeUriflag ? formData.append('resume', Resume) : "";
    certificationUriflag ? formData.append('certificate', Certification) : "";
    formData.append('alcohol_serving', selectedTraing == 'Yes' ? 1 : 0)
    formData.append('dob', dob_date.toString())
console.log(formData,"meraUser")

    try {
      await fetch(`${baseUrl}/userProfile/updateProfiles`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'accesstoken': `Bearer ${users?.access_token}`,
          'x-api-key': 'BarTenderAPI',
        },
        body: formData,
      })
        .then(response => response.text()) // <-- log the response text
        .then(text => {
          return JSON.parse(text);

        })
        .then(data => {
         
          if (data.success === 'success') {
            setIsLoading(false);

            setImageUriflag(false)
            setCertificationUriflag(false)
            setResumeUriflag(false)
            Alert.alert(
            'Profile Updated',
            data.message,
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
                style: 'cancel',
              }
            ]
            )
          } else {
            console.log(data.data,"ProfileError");
          }
        });

    } catch (error) {
      console.log('An error occurred while processing your request.', error.message);
    }
  };
  const Dob = dob_date.toLocaleDateString().split("/")
  const actaulDob = `${Dob[1]}/${Dob[0]}/${Dob[2]}`
  return (
    <>

      {isLoading||users=={} ?
        <View style={[styles.containerSpinner, styles.horizontalSpinner]}>
          <ActivityIndicator size="large" />
        </View> :
         <>
          <SafeAreaView>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ display: "flex", flexDirection: "row" }}>
                <Text style={styles.headerText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.headerText}>Edit Profile</Text>
              <TouchableOpacity
                onPress={handleSubmit}
                style={{ display: "flex", flexDirection: "row" }}>
                <Text style={styles.headerText}>Done</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <ScrollView style={{ marginBottom: 50, height: '100%' }}>
            <View style={{ padding: 15, width: windowWidth }}>
              <FormTextInput
                title={'Name'}
                placeholder={'Enter Full Name'}
                placeholderColor={'grey'}
                setValues={text => setName(text)}
                currentvalue={name}
                style={{ backgroundColor: 'blue' }}
              />
              <TouchableOpacity onPress={() => setShowPicker(true)}>
                  <FormTextInput
                    placeholderColor={'grey'}
                    currentvalue={actaulDob}
                    edit={false}
                    icon={'calendar'}
                    title={'Date of Birth'}
                  />
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  dateFormat="month day year"
                  testID="startDateTimePicker"
                  value={dob_date}
                  mode="date"
                  display="default"
                  onChange={onChangeEnd}
                />
              )}
              <Text style={{ color: 'grey' }}>Profile Picture</Text>
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
                onPress={() => handleSelectImage(setImageUri, setImageUriimage, setImageUriflag)}>
                {imageUri ? (
                  <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: "100%" }}>
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', }}>
                      <Image
                        source={{ uri: imageUri }}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 10,
                          marginRight: 10,
                        }}
                      />
                      <Text style={{ color: 'black' }}>{imageFileName}</Text>
                    </View>
                    <Icons.AntDesign name={"closecircle"} />
                  </View>
                ) : (
                  <Icons.AntDesign name="user" size={70} />
                )}
              </TouchableOpacity>
              <FormTextInput
                placeholder={'Please Enter Phone Number'}
                placeholderColor={'grey'}
                icon={'phone'}
                setValues={text => setNumber(text)}
                currentvalue={number}
                title={'Phone'}
                keyboardType="numeric"
              />
         
              {
                userTypes==2 || userTypes == 0?"":
               <>
                <Text style={{ fontWeight: 'bold', color: 'black' }}>
                Please Select Your Speciality
              </Text>
              <SpecialtySelector
                specialties={specialitys}
                onSpecialtySelected={handleSpecialitySelected}
                defaultValue={selectedSpecialty}
              />
              </>
              }
            
            {
                userTypes==1|| userTypes == 0 ? <></>:
              <FormInput
                titleName={'Please Select Your Signature Drink'}
                placeholder={'Moscow Mule'}
                iconss={'menuunfold'}
                placeholderColor={'grey'}
                setValues={text => setsignature_drink(text)}
                currentvalue={signature_drink === "null"  ? " " :signature_drink}
                
              />
            }
            {
                userTypes==2|| userTypes == 0?"":
             <>
              <Text style={{ fontWeight: 'bold', color: 'black', marginTop: 20 }}>
                Do you have alchohol seller and server training?
              </Text>
              <YesNoSelector
                specialties={training}
                onSpecialtySelected={handleTrainingSelected}
                defaultValue={selectedTraing}
              />
              <Text style={{ color: 'grey', marginTop: 20 }}>
                Upload Certification
              </Text>
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
                onPress={()=>selectDoc(setCertificationUri,setCertificationUriimage,setCertificationUriflag)}>
                {(certificationUri || certificationUriflag) ? (
                  <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: "100%" }}>
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', }}>
                    <Icons.AntDesign name="file1"  size={20} />
                      <Text style={{ color: 'black' }}>{certificationUriimage?.name ? certificationUriimage?.name : certificationUri ? "Doc.pdf" : "Doc.pdf"   }</Text>
                    </View>
                    <Icons.AntDesign name={"closecircle"} />
                  </View>
                ) : (
                  <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: "100%" }}>
                  <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', }}>
                  <Icons.AntDesign name="file1"  size={20} />
                    <Text style={{ color: 'black' }}>Upload Document</Text>
                  </View>
                  <Icons.AntDesign name={"closecircle"} />
                </View>
                )}
              </TouchableOpacity>
              <Text style={{ color: 'grey', marginTop: 20 }}>Please Add Your Bartinding Resume</Text>

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
                onPress={() => selectDoc(setResumeUri, setResumeUriimage, setResumeUriflag)}>
                {(resumeUriflag || resumeUri) ? (
                  <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: "100%" }}>
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', }}>
                    <Icons.AntDesign name="file1"  size={20} />
                      <Text style={{ color: 'black' }}>{resumeUriimage?.name ? resumeUriimage.name : resumeUri ? "Doc.pdf" : "Doc.pdf"}</Text>
                    </View>
                    <Icons.AntDesign name={"closecircle"} />
                  </View>
                ) : (
                  <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: "100%" }}>
                  <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', }}>
                  <Icons.AntDesign name="file1"  size={20} />
                    <Text style={{ color: 'black' }}>Upload Document</Text>
                  </View>
                </View>
                )}
              </TouchableOpacity>
              <FormTextInput
                Input
                placeholder={'Cash.app/$Account'}
                placeholderColor={'grey'}
                title={'Personal Payment Link'}
                setValues={text => setPaymentLink(text)}
                currentvalue={paymentLink === "null"  ? " " :paymentLink}
                
              />
           
             </>
            }
              
            </View>
          </ScrollView></>
      }


    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
  header: {
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'white',
  },
  forgotPassword: {
    color: 'white',
    marginBottom: 20,
  },
  or: {
    color: 'white',
    marginBottom: 20,
  },
  EditProfileScreen: {
    color: 'white',
    marginTop: 20,
  },
  SubmitButtonView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
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
    width: 200,
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
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
    marginRight: 8,
  },
});
export default EditProfileScreen;