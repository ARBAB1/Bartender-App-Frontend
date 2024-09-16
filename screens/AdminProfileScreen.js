import { Button, StyleSheet, Text, View,SafeAreaView, TouchableOpacity,FlatList,Image } from 'react-native'
import React,{useEffect, useState} from 'react'
import Header from '../components/Header'
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';
import { useSelector } from 'react-redux';
import {baseUrl} from '../global';

const AdminProfileScreen = ({ route }) => {
const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState();
  const count = useSelector((state) => state.auth.user)
  // const data = [
  //   { id: 1, name: 'John Brown', role: 'Host', image: require('../assets/userpic.jpg'),email:'csjguy@gmail.com',PhoneNumber:"999-999-999" },
  //   { id: 1, name: 'John Brown', role: 'Host', image: require('../assets/userpic.jpg'),email:'csjguy@gmail.com',PhoneNumber:"999-999-999" },
    
  // ];
  const [users,setusers]=useState("")
  useEffect(()=>{
    async function replacementFunction(){
    const value = await AsyncStorage.getItem("data");
      setusers(JSON.parse(value))
      handleSubmit(JSON.parse(value))
    }
    replacementFunction()

  },[route])
  const handleSubmit = async (user) => {
    try {
      fetch(`${baseUrl}/users/GetAllUsers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key':'BarTenderAPI',
          'accesstoken':`Bearer ${user.access_token}`
        },
      })
      .then(response => response.json())
      .then(data => {
     setData(data.users)
      });
    } catch (error) {
      console.log('An error occurred while processing your request.',error);
    }
 
};
  useEffect(() => {
    handleSubmit()
  }, [route ])

  const Item = ({ id, name,user_type,image, onPress }) => (
    <TouchableOpacity onPress={onPress} style={{justifyContent:'space-between', flexDirection: 'row', alignItems: 'center',padding: 10, }}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image source={image!=("" || " ")?{uri:`${baseUrl}${image}`}:require('../assets/user.jpeg')} style={{ width: 50, height: 50,borderRadius:7 }} />


   
    <View style={{marginLeft:15}}>
    <Text style={{color:'black'}}>{name}</Text>

    <Text style={{color:'black'}}>{user_type==0?"admin":user_type==1?"bartender":user_type==2?"user":"buisness"}</Text>
    </View>
    </View>
    <View>
    <Icon name="right" size={24} color="black" />
    </View>
    </TouchableOpacity>
  );
  const renderItem = ({ item }) => (
    <Item name={item.name} user_type={item.user_type} image={item.image}  onPress={() => navigation.navigate('AdminDetailsScreen', {item})}/>
  );
  return (
    <SafeAreaView style={{backgroundColor:"white",height:'100%'}}>
    <Header title="User" headerShown={false}/>
  
    
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />

    </SafeAreaView>
  )
}

export default AdminProfileScreen

const styles = StyleSheet.create({
  container: {
   width:'auto',
   height:"87%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#ccc',
  },
  button: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor:'#F2994A',
    borderRadius:30,
    width :60,height :60, 
    justifyContent:'center',alignItems:'center'
  }
})