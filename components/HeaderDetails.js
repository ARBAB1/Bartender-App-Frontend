import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import SearchInput from './SearchInput';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
const HeaderDetails = ({title, headerShown,deleteChat}) => {
  const navigation = useNavigation();



  
  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
      {title=="Messages"?(
        <TouchableOpacity
         
          onPress={() => navigation.navigate("Chat")}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="left" size={24} color="#fff" />
          <Text style={{color: '#fff', fontSize: 17}}>Back</Text>
        </TouchableOpacity>
      ):(
        <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon name="left" size={24} color="#fff" />
        <Text style={{color: '#fff', fontSize: 17}}>Back</Text>
      </TouchableOpacity>
      )}
        <Text style={styles.headerText}>{title}</Text>

        <TouchableOpacity onPress={()=>{
          Alert.alert(
            'Delete Chat',
            'Are you sure you want to delete your chat permanently?',
            [
              {
                text: 'Cancel',
                onPress:  () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Confirm', onPress: () => deleteChat()},
            ],
           
            )
        }}>
        {title=="Messages"?
<>

<Icon name="delete" color={'#fff'} size={24} />
</>
          :null
        }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HeaderDetails;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    backgroundColor: '#FFA500',
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: '100%',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
