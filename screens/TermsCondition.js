import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';
import Header from '../components/Header';
import HeaderDetails from '../components/HeaderDetails';
const TermsCondition = () => {
  return (
   <>
   <HeaderDetails title={"Terms & Condition"}/>
  
      <WebView source={{ uri: 'https://www.thebartinderapp.com/termsandconditions' }} style={{ flex: 1 }} />
   </>
     
   
  )
}

export default TermsCondition

const styles = StyleSheet.create({})