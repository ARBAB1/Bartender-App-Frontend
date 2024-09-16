import { Button, StyleSheet, Text, View,SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../components/Header'

import Icon from 'react-native-vector-icons/Entypo';
const ShopingCart = ({navigation}) => {
  return (
    <SafeAreaView>
    <Header title="ShopingCart" headerShown={false}/>
  
    <View style={styles.container}>
    <Icon name="shopping-cart" size={80} color="#ccc" />
    <Text style={styles.text}>No Items in cart</Text>

  </View>
    </SafeAreaView>
  )
}

export default ShopingCart

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