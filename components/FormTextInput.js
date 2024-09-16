import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';

import Icon from 'react-native-vector-icons/AntDesign';
import Icons from './Icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const FormTextInput = ({
  placeholder,
  placeholderColor,
  setValues,
  icon,
  pass,
  currentvalue,
  edit,
  title,
  keyboardType,
}) => {
  
  return (
    <View style={{marginTop: 5}}>
      <Text style={{color: placeholderColor}}>{title}</Text>
      <View style={styles.searchContainer}>
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
        <Icon name={icon} size={20} color="grey" />
      </View>
    </View>
  );
};

export default FormTextInput;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5, // This adds a bottom border
    borderBottomColor: 'grey', // This sets the bottom border color to black
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginLeft: 0,
    height:windowHeight*0.06,
    color: 'black',
  },
});
