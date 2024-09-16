import { Alert, StyleSheet, Text, TextInput, View } from 'react-native'
import React,{useEffect, useState} from 'react'
import HeaderDetails from '../components/HeaderDetails'
import FormInput from '../components/FormInput'
import AboutHeader from '../components/AboutHeader'
import { useNavigation,useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {baseUrl} from '../global'
const CommentScreen = ({route}) => {
  const isFocused = useIsFocused();
    const navigation = useNavigation()
    const [comment, setComment] = useState()
    const [isLoading, setIsLoading] = useState(false);

    const[userState,setuserState]=useState(11)
  const [users,setusers]=useState("")
  const [data, setdata] = useState() 
  useEffect(() => {
    async function replacementFunction(){        
      const value =  await AsyncStorage.getItem('data');
        AsyncStorage.setItem('data',value)
          setusers(JSON.parse(value));
          setuserState(JSON.parse(value)?.user_data[0]?.user_type);
 
          
  }
  replacementFunction()

  }, [userState,isFocused]);
  const handleSubmit = async () => {
    setIsLoading(true)
    const comentData={
      post_id:route?.params?.job_id,
      comment:comment
      
    }

    try {
     await fetch(`${baseUrl}/comments/CreateComment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key':'BarTenderAPI',
          'accesstoken':`Bearer ${users.access_token}`
        },
        body: JSON.stringify(comentData),
      })
      .then(response => response.json())
      .then(dataa => {
      
        if(dataa?.message=="success"){
        
          Alert.alert(
            dataa.message,
            dataa.data,
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('BookedDetails',{item:route?.params,bool:true}),
                style: 'cancel',
              }
            ]
            )
        }
     
        setIsLoading(false)
       
      });
    } catch (error) {
      console.log('An error occurred while processing your request.');
    }}
  return (
    <View>
    <AboutHeader screen={"comment"} name={"Comment"} onPress={handleSubmit}/>
    <View style={{padding:20}}>
    <TextInput
    style={styles.input}
    placeholder="Enter Your comment here"
    placeholderTextColor='grey'
    onChangeText={(text) => setComment(text)}
    />
    </View>
    </View>
  )
}

export default CommentScreen

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: 300,
        borderBottomColor:"black",
        borderBottomWidth:StyleSheet.hairlineWidth,
        color: 'black',
      },
})