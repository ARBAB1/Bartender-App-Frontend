// ./navigation/DrawerNavigator.js

import React,{useState,useEffect} from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image } from 'react-native';
import BartenderHomeScreen from "../screens/BartenderHomeScreen";
import BottomTabNavigator from "./TabNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation,useIsFocused } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import Icons from "../components/Icons";
import {baseUrl} from '../global';

const Drawer = createDrawerNavigator();

function CustomDrawer(props) {  
  const count =users
  const isFocused = useIsFocused();

  const[userState,setuserState]=useState(11)
  const [users,setusers]=useState("")
  const [data, setdata] = useState()
  const [imageUri, setImageUri] = useState('');
    useEffect(() => {
    async function replacementFunction(){        
      const value =  await AsyncStorage.getItem('data');
        AsyncStorage.setItem('data',value)
          setusers(JSON.parse(value));
          setImageUri(`${baseUrl}/${JSON.parse(value).user_data[0].image}`)
          setuserState(JSON.parse(value)?.user_data[0]?.user_type);
          handleSubmit(JSON.parse(value));
  }
  replacementFunction()
  }, [userState,props]);
  const navigation =useNavigation()

  const handleSubmit = async () => {

    try {
       fetch(`${baseUrl}/users/GetUserById/${users?.user_data[0]?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key':'BarTenderAPI',
          'accesstoken':`Bearer ${users.access_token}`
        },
      })
      .then(response => response.json())
      .then(dataa => {
        setImageUri(`${baseUrl}/${dataa?.users[0]?.image}`)
       setdata(dataa?.users[0])
      });
    } catch (error) {
    }
 
};

  return (
  <>

    <DrawerContentScrollView {...props}>
      <View style={{marginTop:-10, flex: 1, backgroundColor: 'orange', padding: 25 }}>
      <Image source={imageUri?.length<=44 ? require('../assets/user.jpeg'):{ uri:`${baseUrl}${imageUri?.split('uploads')[1]}`}} style={{width: 50, height: 50,borderRadius:50}} />
        <View style={{paddingTop:15}}>
     
        <Text style={{color:"white",fontSize:20,fontWeight:'700'}}>{data?.name}</Text>
        <Text style={{color:'white'}}>{data?.email}</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('EditProfile')}>
        <Text style={{color:'white',marginTop:10,textDecorationLine:"underline",fontWeight:'bold'}}>Edit Profile</Text>

        </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 3, backgroundColor: 'white' }}>
        <DrawerItemList {...props} />
       
      </View>
    </DrawerContentScrollView>
    <View style={{borderTopWidth:1,borderTopColor:'grey',marginBottom:20}}>
      <TouchableOpacity onPress={()=>props.onLogin()} style={{paddingLeft:20,paddingBottom:50,paddingTop:30,color:'red'}} >
   <Text style={{color:'red',fontWeight:'500'}}>Delete Your Account</Text>
   </TouchableOpacity>
    </View>
 
      </>
  );
}

function DrawerNavigator({onLogin}) {
  return (
    
      <Drawer.Navigator  screenOptions={{
        headerShown: false
        }} drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen name="Home" component={BottomTabNavigator} />
        <Drawer.Screen name="About" component={BartenderHomeScreen} />

     
        
      </Drawer.Navigator>
    
  );
}
export default CustomDrawer;