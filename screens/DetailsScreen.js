import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProfileDetails from '../components/ProfileDetails'
import Header from '../components/Header'
import HeaderDetails from '../components/HeaderDetails'
import BartenderProfile from '../components/BartenderProfile'

const DetailsScreen = ({route}) => {
  return (
    <View>
 
 <BartenderProfile name={route.params.item.name} email={route.params.item.email} image={route.params.item.image} PhoneNumber={route.params.item.PhoneNumber} id={route.params.item.id}/>
    </View>
  )
}

export default DetailsScreen

const styles = StyleSheet.create({})