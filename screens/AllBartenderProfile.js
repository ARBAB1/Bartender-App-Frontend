


import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet, ImageBackground,ActivityIndicator,ScrollView, Switch } from 'react-native';
import Header from '../components/Header';
import StarRating from 'react-native-star-rating-widget';
import RatingCard from '../components/RatingCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation,useIsFocused } from '@react-navigation/native';
import HeaderDetails from '../components/HeaderDetails';
import {baseUrl} from '../global';


export default function AllBartenderProfile({route}) {

    const id = route.params.id
  const isFocused = useIsFocused();
  const [rating, setRating] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const[userState,setuserState]=useState(11)
  const [users,setusers]=useState("")
  const [data, setdata] = useState()
  const [imageUri, setImageUri] = useState(`${baseUrl}/${users?.image}`||'');
  const [isLoading, setIsLoading] = useState(false);
  const [rat, setRat] = useState([]);

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
  const handleSubmit = async (userss) => {
    setIsLoading(true)
    try {
     await fetch(`${baseUrl}/users/GetUserById/${route?.params?.id}`, {
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
       
        }
      });
    } catch (error) {
      Alert.alert('An error occurred while processing your request.');
    }
 
};
  return (
<>
<HeaderDetails title={`${data?.name}`}/>
{
  isLoading?
  <View style={[styles.containerSpinner, styles.horizontalSpinner]}>
  <ActivityIndicator size="large" />
</View>
:
<>
<ScrollView style={styles.card}>
  
 
  {
data?.image==""?
<ImageBackground source={require('../assets/cardimg.png')} style={styles.image}>
    
  </ImageBackground>
  :
  <ImageBackground source={{uri: imageUri}} style={styles.image}>
    
  </ImageBackground>
}
  <View style={styles.maintitle}>
  <Text style={styles.titlemain}>{data?.name}</Text>
  <Text style={styles.titlemain}>{data?.user_type==1?"Bartender":""}</Text>
  </View>
<View style={styles.section}>
<Text style={{color:'black',fontWeight:"700"}}>Speciality</Text>
<Text style={{color:'grey',fontWeight:"700"}}>{data?.speciality}</Text>
</View>

<View style={styles.section}>
<Text style={{color:'black',fontWeight:"700"}}>Payment Link</Text>
<Text style={{color:'grey',fontWeight:"700"}}>{data?.payment_link}</Text>
</View>
<View style={styles.section}>
<Text style={{color: 'black', fontWeight: '700'}}>Rating</Text>

<RatingCard rating={data?.average_rating} />
</View>

<View style={styles.rating}>
<Text style={{color:'black',fontSize:16,fontWeight:'bold'}}>Rating and Reviews</Text>

{rat?rat.map((digit, index) => (
    <>
   
        <RatingCard rating={digit.rating} text={digit.reviewer}/>
    </>
        )):"No Rating Yet"}



</View>
</ScrollView>
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
