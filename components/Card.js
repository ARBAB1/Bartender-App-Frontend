import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function Card() {
  return (
    <View style={styles.card}>
      <ImageBackground source={require('../assets/cardimg.png')} style={styles.image}>
        <Text style={styles.title}>New Years Eve</Text>
        <Text style={styles.title}>16 – 30</Text>
      </ImageBackground>
      <View style={styles.cardtext}>
      <Text style={styles.text1}>Host Email: </Text>
      <Text style={styles.text}> csjguy@gmail.com</Text>
      </View>
      <View style={styles.cardtext}>
      <Text style={styles.text}>Theme:</Text>
      <Text style={styles.text}> Red and White</Text>

      </View>
      <View style={styles.cardtext}>
      <Text style={styles.text}>Phone Number:</Text>
      <Text style={styles.text}> 9193363336</Text>

      </View>
      <View style={styles.cardtext}>
      <Text style={styles.text}>Date and Time:</Text>
      <Text style={styles.text}>November 7, 2020 at 9:00 AM</Text>

      </View>
   
    </View>
  );
}

const styles = StyleSheet.create({
  cardtext:{
display:'flex',
flexDirection:'column',
  },
  card: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    padding: 20
  },
  image: {
    width: '100%', // specify the width
    height: 200, // specify the height
    justifyContent: "flex-end",
    alignItems: 'flex-start', // center the text horizontally
    marginBottom: 20,
    opacity:1,
    background: "#000"
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft:10,
    color: '#fff' // white color for better visibility on image
  },
  text: {
    fontSize: 16,
    color: 'black', // white color for better visibility on image
    marginBottom: 5
  },
  text1: {
    fontSize: 14,
    color: 'black', // white color for better visibility on image
    marginBottom: 5
  }
});
