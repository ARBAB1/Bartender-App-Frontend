import React from 'react';
import { TouchableOpacity, Text, Dimensions, StyleSheet } from 'react-native';
import Icons from "../components/Icons";
const { width, height } = Dimensions.get('window');

const ChatInput = ({onPress,title,icon , styleChat}) => {
  return (
    <TouchableOpacity style={title === "Create Event" || title === "Take Job" || title === "Start Chat " ? {...styles.buttons,...styleChat} : {...styles.button, ...styleChat}} onPress={onPress}>
      {/* <Text style={styles.text}>{title} </Text> */}
      <Icons.Ionicons name="send" size={24} color="black" />
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  button: {
    // height: height * 0.06, // 10% of screen height
    // backgroundColor: 'orange',
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 40,
    // marginTop:15,
    // marginBottom:5
    marginLeft:20,
  },
  buttons: {
    // width: width * 0.9, // 80% of screen width
    // height: height * 0.06, // 10% of screen height
    // backgroundColor: 'orange',
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 10,
    // marginTop:10,
    // marginBottom:10
    marginLeft:20,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ChatInput
