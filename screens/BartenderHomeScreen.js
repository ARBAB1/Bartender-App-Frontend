import { StyleSheet, Text, View,Button,Linking,Image } from 'react-native'
import React from 'react'
import HeaderDetails from '../components/HeaderDetails'
import AboutHeader from '../components/AboutHeader'
import MainHeader from '../components/MainHeader'

const BartenderHomeScreen = () => {
  return (
 <View>
<MainHeader/>
 <View style={{  justifyContent: 'center', alignItems: 'center',height:'60%' }}>
 <Image source={require('../assets/logo1.png')} style={{ width: 50, height: 50 }} />

<Text style={{ fontSize: 24, marginBottom: 20,color:'orange' }}>Bartender</Text>
<View style={{display:'flex',justifyContent:'space-between',flexDirection:'row',width:'100%',padding:10}}>
<Text style={{ marginBottom: 10 }}>
Author</Text>
<Text style={{ fontWeight: 'bold',color:'orange' }}> Bartinder LLC</Text>

</View>
<View style={{display:'flex',justifyContent:'space-between',flexDirection:'row',width:'100%',padding:10}}>
<Text style={{ marginBottom: 10 }}>
Share</Text>
<Text style={{ fontWeight: 'bold',color:'orange' }}> bartinder.glideapp.io</Text>

</View>
<View style={{display:'flex',justifyContent:'space-between',flexDirection:'row',width:'100%',padding:10}}>
<Text style={{ marginBottom: 10 }}>
Author</Text>
<Text style={{ fontWeight: 'bold', color:'orange' }}> Send feedback  </Text>

</View>


</View>
</View>
  )
}

export default BartenderHomeScreen
