import { StyleSheet, Text, View,TextInput, TouchableOpacity, Dimensions } from 'react-native'
import React,{useState} from 'react'

import Icon from 'react-native-vector-icons/AntDesign';
import Icons from './Icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const FormInput = ({titleName,placeholder,placeholderColor,setValues,icon,pass,currentvalue,edit,iconss,title,keyboardType}) => {
 
  return (
    <>

{ titleName?
<Text style={{marginTop:15,color:placeholderColor}}>{titleName}</Text>:null}
    <View style={styles.searchContainer}>
  
    <Icon name={icon} size={20} color="orange" />

    <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor={placeholderColor}
    onChangeText={setValues}
    value={currentvalue}
    keyboardType={keyboardType}
    secureTextEntry={pass}
    editable={edit}
  />
  <Icon name={iconss} size={20} color={placeholderColor} />

  </View>

  </>
  )
}

export default FormInput

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 5,
        
        marginTop: 10,
        borderRadius:10,
        borderColor:'black',
        borderWidth:StyleSheet.hairlineWidth
      },
      input: {
        marginLeft: 10,
        flex: 1,
        height:windowHeight*0.06,
        color:'black'
      },
})