import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React,{useState} from 'react'
import StarRating from 'react-native-star-rating-widget'

const RatingCard = ({rating,text}) => {
  return (
    <View style={styles.ratingcard}>
          <Text style={{color:'black',fontWeight:'bold'}}>{text}</Text>
          
    <StarRating
    rating={rating}
onChange={()=>""}
    starSize={19}
  />

    </View>
  )
}

export default RatingCard

const styles = StyleSheet.create({
    ratingcard: {
        borderRadius: 6,
        elevation: 3,
        padding:10,
      
        backgroundColor: '#fff',
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
    
      },
})