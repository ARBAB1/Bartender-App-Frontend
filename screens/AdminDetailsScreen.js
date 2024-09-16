import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HeaderDetails from '../components/HeaderDetails'
import AdminProfileDetails from '../components/AdminProfileDetails'

const AdminDetailsScreen = ({route}) => {
  return (
    <View>
    <HeaderDetails title={route.params.item.name}/>
 <AdminProfileDetails name={route.params.item.name} email={route.params.item.email} number={route.params.item.number} signature_drink={route.params.item.signature_drink} payment_link={route.params.item.payment_link=="null"||route.params.item.payment_link==null?"--":route.params.item.payment_link} speciality={route.params.item.speciality} image={route?.params?.item?.image} referal={route?.params?.item?.refered_from}/>
    </View>
  )
}

export default AdminDetailsScreen

const styles = StyleSheet.create({})