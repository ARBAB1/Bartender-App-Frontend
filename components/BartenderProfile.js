import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet, ImageBackground,ActivityIndicator,ScrollView, Switch, TouchableOpacity, Button, Image } from 'react-native';
import Header from './Header';
import StarRating from 'react-native-star-rating-widget';
import RatingCard from './RatingCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation,useIsFocused } from '@react-navigation/native';
import HeaderDetails from './HeaderDetails';
import Modal from 'react-native-modal';
import ButtonInput from './ButtonInput';
import {baseUrl} from '../global';

export default function BartenderProfile({name,user_type,image,email,PhoneNumber,speciality,signatureDrink,id}) {
  const isFocused = useIsFocused();
  const [userAvalible, setuserAvalible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const[userState,setuserState]=useState(11)
  const [users,setusers]=useState("")
  const [data, setdata] = useState()
  const [rating, setRating] = useState(0);
  const [rat, setRat] = useState([]);
  const [imageUri, setImageUri] = useState(`${baseUrl}/${image}`||'');
  const [isLoading, setIsLoading] = useState(false);
  
  const styless = {
    bottomSheetContainer: {
      backgroundColor: 'white',
      height: '50%',

      paddingBottom: 20,
      borderTopLeftRadius: 20, // Adjust the value based on your desired borderRadius
      borderTopRightRadius: 20, // Adjust the value based on your desired borderRadius
    },
  };
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

  const toggleBottomSheet = () => {
    setBottomSheetVisible(!isBottomSheetVisible);
  };
  useEffect(() => {
    async function replacementFunction(){        
      const value =  await AsyncStorage.getItem('data');
        AsyncStorage.setItem('data',value)
          setusers(JSON.parse(value));
          setuserState(JSON.parse(value)?.user_data[0]?.user_type);
          handleSubmit(JSON.parse(value));
          GetRating(JSON.parse(value))
  }
  replacementFunction()
  }, [userState,isFocused]);


  const handleSubmit = async (userss) => {
    setIsLoading(true)
    try {
     await fetch(`${baseUrl}/users/GetUserById/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key':'BarTenderAPI',
          'accesstoken':`Bearer ${userss.access_token}`
        },
      })
      .then(response => response.json())
      .then(dataa => {
      
        setIsLoading(false)
        if(dataa?.users){
          setImageUri(`${baseUrl}/${dataa?.users[0]?.image}`)
          setdata(dataa?.users[0])
          dataa?.users[0]?.availability==0?
          setIsEnabled(false):setIsEnabled(true)
          
        }
      });
    } catch (error) {
console.log(error)
    }
 
};
const GetRating =  (userss) => {
    // Your existing login logic
    if (id) {
      try {
          fetch(`${baseUrl}/reviews/GetReviewsByProfileId`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key':'BarTenderAPI',
              'accesstoken':`Bearer ${userss.access_token}`
            },
            body: JSON.stringify({
                "profile_id":id
          }),
          })
          .then(response => {
           
            return response.json()
          })
          .then(chat => {
            setRat(chat.data)
          }).catch(err=>{
            console.log(err,"dddd")
          })
      } catch (error) {
      console.log('An error occurred while processing your request.',error);
      }
    } else {
      console.log('Please fill in all fields');
    }
  };
  const handleRating =  () => {
    // Your existing login logic
    if (id) {
      console.log("sss")
      try {
        fetch(`${baseUrl}/reviews/CreateReview`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key':'BarTenderAPI',
            'accesstoken':`Bearer ${users.access_token}`
          },
          body: JSON.stringify({
            "review":"good",
            "rating":rating,
            "profile_id":id
          }),
        })
        .then(response => {
          
           
            return response.json()
          })
          .then(chat => {
         
          
          }).catch(err=>{
            console.log(err,"dddd")
          })
      } catch (error) {
      console.log('An error occurred while processing your request.',error);
      }
    } else {
      console.log('Please fill in all fields');
    }
  };
  return (
<>

{
  isLoading?
  <View style={[styles.containerSpinner, styles.horizontalSpinner]}>
  <ActivityIndicator size="large" />
</View>
:
<>
<ScrollView style={styles.card}>
<HeaderDetails title={name}/>
 
  {
data?.image && data?.image.length <= 3?
<ImageBackground source={require('../assets/cardimg.png')} style={styles.image}>
    
  </ImageBackground>
  :
  <ImageBackground source={{uri: imageUri}} style={styles.image}>
    
  </ImageBackground>
}
  <View style={styles.maintitle}>
  <Text style={styles.titlemain}>Welcome {data?.name}.</Text>
  <Text style={styles.titlemain}>You are a {data?.user_type==1?"Bartender":""}!</Text>
  </View>
<View style={styles.section}>
<Text style={{color:'black',fontWeight:"700"}}>Speciality</Text>
<Text style={{color:'grey',fontWeight:"700"}}>{data?.speciality}</Text>
</View>
<TouchableOpacity style={styles.section} onPress={toggleBottomSheet} >
<Text style={{color:'black',fontWeight:"700"}}>Add Review</Text>
</TouchableOpacity>


<View style={styles.rating}>
<Text style={{color:'black',fontSize:16,fontWeight:'bold'}}>Rating and Reviews</Text>
{rat.map((digit, index) => (
    <>
   
        <RatingCard rating={digit.rating} text={digit.reviewer}/>
    </>
        ))}






</View>
</ScrollView>
<Modal
          isVisible={isBottomSheetVisible}
          style={{margin: 0}}
          onBackdropPress={toggleBottomSheet}>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <View
              style={{
                ...styless.bottomSheetContainer,
              }}>
              <View
                style={{
                 
                  display: 'flex',
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={toggleBottomSheet}
                  style={{
         
                    padding: 15,
                    marginRight: 30,
                    borderRadius: 40,
                  }}>
                 <Text>X</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.containers}>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    height: '60%',
                  }}>
                  <View style={{padding: 5}}>
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: '900',
                        color: 'green',
                        marginBottom: 15,
                      }}>
                     Rate your Bartender
                    </Text>
                    <View style={styles.ratingcard}>
    <StarRating
    rating={rating}
    onChange={setRating}
    starSize={23}
  />
 
    </View>
                  </View>
                </View>

                <View style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <ButtonInput title={"Rate Bartender"} onPress={handleRating}/>
                </View>
              </View>
            </View>
          </View>
        </Modal>
</>
}

</>

   
  );
}

const styles = StyleSheet.create({
  maintitle: {
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },
  titlemain:{
    fontSize:22,
    fontWeight:'bold',
    fontFamily:'Lato, BlinkMacSystemFont, Roboto, sans-serif',
    color:'black',

  },
  card: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',

  },
  ratingcard: {
    borderRadius: 6,
    elevation: 3,
    padding:10,
    margin:10,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',

  },
  section:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    padding:5,
    paddingVertical:15,
    borderBottomWidth: 1, // This adds a border at the bottom
    borderBottomColor: 'whitesmoke' // This sets the color of the border
  },
  
  rating:{
    padding:10,
    paddingVertical:15
  },
  image: {
    width: '100%', // specify the width
    height: 400, // specify the height
    justifyContent: "flex-end",
    alignItems: 'flex-start', // center the text horizontally
    marginBottom: 20,
    opacity:1,
    background: "#000"
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft:10,
    color: '#fff' // white color for better visibility on image
  },
  text: {
    fontSize: 16,
    color: 'black', // white color for better visibility on image
    marginBottom: 5
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
    paddingTop:300,
    borderRadius: 10,
    backgroundColor: '#fff', 
  }
});
