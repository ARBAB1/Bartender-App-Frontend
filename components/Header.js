import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import SearchInput from './SearchInput';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Icons from './Icons';
const Header = ({title, headerShown, onPress}) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <View style={styles.siders}>
          {title == 'Privacy Policy' ? (
            <View></View>
          ) : (
            <TouchableOpacity onPress={() => navigation.openDrawer('helloo')}>
              <Icon name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          )}

          {title == 'Jobs' ? (
            <TouchableOpacity style={styles.siders} onPress={onPress}>
              <Icons.MaterialCommunityIcons
                name="refresh"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          ) : null}
          {title == 'Profile' ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}>
              <Icons.AntDesign name="edit" size={24} color="#fff" />
            </TouchableOpacity>
          ) : null}
        </View>
        {title == 'Jobs' ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingTop:15
            }}>
            <Text style={styles.headerText}>{title}</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('JobList')} style={styles.ListBtn}><Text style={styles.headerText2}>List View</Text></TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.headerText}>{title}</Text>
        )}
        {headerShown ? <SearchInput /> : ''}
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  siders: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerContainer: {
    backgroundColor: '#FFA500',
    paddingTop: 40,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  headerText2:{
    color: '#FFA500',
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal:10,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  ListBtn:{
    backgroundColor:'white',
    borderRadius:20
  }
});
