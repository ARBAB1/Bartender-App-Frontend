import React,{useState} from 'react';
import { View, Text, StyleSheet, ImageBackground,TouchableOpacity,ScrollView } from 'react-native';
import Header from './Header';
import StarRating from 'react-native-star-rating-widget';
import RatingCard from './RatingCard';
import {baseUrl} from '../global';

export default function AdminProfileDetails({name,email,number,signature_drink,payment_link,speciality,image,referal}) {
  const [rating, setRating] = useState(0);

  return (

    <ScrollView style={styles.card}>
  
      <ImageBackground source={image!=("" || " ")?{uri:`${baseUrl}${image}`}:require('../assets/user.jpeg')} style={styles.image}>
        <Text style={image!=("" || " ")?styles.title:styles.titles}>{name}</Text>
        
      </ImageBackground>
 <View style={styles.section}>
 <Text style={{color:'black'}}>Name</Text>
 <Text style={{color:'black'}}>{name}</Text>
 </View>
 <View style={styles.section}>
 <Text style={{color:'black'}}>Email</Text>
 <Text style={{color:'#FFA500'}}>{email}</Text>
 </View>
 <View style={styles.section}>
 <Text style={{color:'black'}}>Speciality</Text>
 <Text style={{color:'black'}}>{speciality?speciality:""}</Text>
 </View>
 <View style={styles.section}>
 <Text style={{color:'black'}}>Phone</Text>
 <Text style={{color:'#FFA500'}}>{number}</Text>
 </View>

 <View style={styles.section}>
 <Text style={{color:'black'}}>Personal Payment Link</Text>
 <Text style={{color:'black'}}>{payment_link?payment_link:""}</Text>
 </View>
 <View style={styles.section}>
 <Text style={{color:'black'}}> Refer From</Text>
 <Text style={{color:'black'}}>{referal?referal:""}</Text>
 </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',

  },
  ratingcard: {
    borderRadius: 6,
    elevation: 3,
    padding:10,
    margin:10,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',

  },
  section:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    padding:5,
    paddingVertical:15
  },
  rating:{
    padding:10,
    paddingVertical:15
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
  titles: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft:10,
    color: 'black' // white color for better visibility on image
  },
  text: {
    fontSize: 16,
    color: 'black', // white color for better visibility on image
    marginBottom: 5
  }
});
