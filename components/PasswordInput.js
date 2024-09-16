import { StyleSheet, Text, View,TextInput, TouchableOpacity, Dimensions } from 'react-native'
import React,{useState} from 'react'

import Icon from 'react-native-vector-icons/AntDesign';
import Icons from './Icons';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const PasswordInput = ({placeholder,placeholderColor,setValues,icon,pass}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (

    <View style={styles.searchContainer}>
  
    <Icon name={icon} size={20} color="orange" />

    <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor={placeholderColor}
    onChangeText={setValues}
    secureTextEntry={!isPasswordVisible}
    
  />
  <TouchableOpacity style={styles.icon} onPress={togglePasswordVisibility}>
  <Icons.MaterialCommunityIcons name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#000" />
</TouchableOpacity>
  </View>
  )
}

export default PasswordInput

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
       
        paddingHorizontal: 5,
        width:"80%",
        marginTop: 10,
        borderRadius:10,
        borderColor:'black',
        borderWidth:StyleSheet.hairlineWidth
      },
      input: {
        flex: 1,
        marginLeft: 10,
        height:windowHeight*0.06,
        color: 'black',
      },
})