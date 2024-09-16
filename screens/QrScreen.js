import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import AboutHeader from '../components/AboutHeader'

const QrScreen = () => {
  return (
    <View>
    <AboutHeader screen={"qr"}/>
    <View style={{justifyContent:'center',alignItems:"center",height:'100%'}}>
  
    <Image source={require('../assets/scan.png')} style={{width: 200, height: 200}} />
    </View>
    </View>
  )
}

export default QrScreen

const styles = StyleSheet.create({})