import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';
import Header from '../components/Header';
import HeaderDetails from '../components/HeaderDetails';
const PrivacyPolicy = () => {
  return (
   <>
   <HeaderDetails title={"Privacy Policy"}/>
  
      <WebView source={{ uri: 'https://www.thebartinderapp.com/privacypolicy' }} style={{ flex: 1 }} />
   </>
     
   
  )
}

export default PrivacyPolicy

const styles = StyleSheet.create({})