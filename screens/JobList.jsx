import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';  
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useIsFocused} from '@react-navigation/native';

import {baseUrl} from '../global';
import Geolocation from '@react-native-community/geolocation';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const JobList = () => {
  const [userId, setuserId] = useState(0);
  const [data, setdata] = useState();
  const [priceRangeMax, setPriceRangeMax] = useState(10000000000);
  const [priceRangeMin, setPriceRangeMin] = useState(0);
  const [distance, setDistance] = useState(25);
  const [subscribed, setSubscribed] = useState();
  const [position, setPosition] = useState();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [users, setusers] = useState('');
  const [ListLoading, setListLoading] = useState(false);

  const handleSearch = text => {
    setspeciality(text);
  };

  useEffect(() => {
    async function replacementFunction() {
      setListLoading(true);
      const value = await AsyncStorage.getItem('data');
      AsyncStorage.setItem('data', value);
      setusers(JSON.parse(value));
      setuserId(JSON.parse(value).user_data[0].id);

      Geolocation.requestAuthorization();

      Geolocation.getCurrentPosition(pos => {
        const crd = pos.coords;
        setPosition({
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        });
        LoadList(JSON.parse(value), {
          latitude: crd.latitude,
          longitude: crd.longitude,
        });
      });
    }
    replacementFunction();
  }, [isFocused, priceRangeMax, priceRangeMin]);

  

  const LoadList = async (userss, pos) => {
    try {
      fetch(
        `${baseUrl}/posts/GetPostsWithLocationAndPriceRange?price_max=${priceRangeMax}&lat=${pos.latitude}&long=${pos.longitude}&distance=${distance}&price_min=${priceRangeMin}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'BarTenderAPI',
            accesstoken: `Bearer ${userss.access_token}`,
          },
        },
      )
        .then(response => response.json())
        .then(res => {
          if (res?.data) {
            setListLoading(false);
          
            setdata(res?.data);
          }
          setListLoading(false);
        })
        .catch(err => {
          setListLoading(false);

          console.log(err);
        });
    } catch (error) {
      console.log('An error occurred while processing your request.', error);
    }
  };

  
  const Item = ({
    name,
    role,
    image,
    onPress,
 
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'whitesmoke',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{marginLeft: 15}}>
          <Text style={{color: 'black'}}>{name}</Text>
          <Text style={{color: 'grey', fontSize: 12, paddingTop: 5}}>
            {role}
          </Text>
        </View>
      </View>
      <View>
        <Image
          source={
            image != ''
              ? {uri: `${baseUrl}${image}`}
              : require('../assets/userpic.jpg')
          }
          style={{width: 50, height: 50, borderRadius: 7}}
        />
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => (
  
    <Item
      name={item.post_title}
      role={item.event_location}
      onPress={() => {
        navigation.navigate('JobDetail', item);
      }}
    />
  );
  return (
    <SafeAreaView>
   
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <View style={styles.siders}>
            <TouchableOpacity onPress={() => navigation.openDrawer('helloo')}>
              <Icon name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingVertical: 15,
            }}>
            <Text style={styles.headerText}>Jobs</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Jobs')}
              style={styles.ListBtn}>
              <Text style={styles.headerText2}>Map View</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <Text style={{color: 'white'}}>Minimum Price Range</Text>
              <View style={styles.searchContainers}>
                <Icon name="search" size={20} color="orange" />
                <TextInput
                  style={styles.input}
                  placeholder="PriceRangeMin"
                  placeholderTextColor={'orange'}
                  value={priceRangeMin}
                  onChangeText={text => setPriceRangeMin(text)}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
              <Text style={{color: 'white'}}>Maximum Price Range</Text>
              <View style={styles.searchContainers}>
                <Icon name="search" size={20} color="orange" />
                <TextInput
                  style={styles.input}
                  placeholder="PriceRangeMax"
                  placeholderTextColor={'orange'}
                  value={priceRangeMax}
                  onChangeText={text => setPriceRangeMax(text)}
                />
              </View>
            </View>
          </View>

          <View style={{paddingVertical:10}}>
            <Text style={{color: 'white'}}>Distance per Mile</Text>
            <View style={styles.searchContainer}>
              <Icon name="search" size={20} color="orange" />
              <TextInput
                style={styles.input}
                placeholder="Distance Per Mile"
                placeholderTextColor={'orange'}
                value={distance}
                onChangeText={text => setDistance(text)}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
   
     
      <View style={styles.container}>
        {ListLoading ? (
          <>
            <View style={{paddingTop: 20}}>
              <ActivityIndicator />
            </View>
          </>
        ) :  data?.length==0?(<View style={styles.notfound}><Text style={{color:"orange"}}>No Job Found</Text></View>):(
        
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default JobList;

const styles = StyleSheet.create({
  container: {
    width: 'auto',
    height: '78.5%',
    backgroundColor: '#fff',
  },
  notfound:{
  display:'flex',alignItems:'center',justifyContent:'center',height:windowHeight*0.5
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#ccc',
  },
  headerText2: {
    color: '#FFA500',
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ListBtn: {
    backgroundColor: 'white',
    borderRadius: 20,
  },
  button: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#F2994A',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#D98100',
    paddingHorizontal: 10,
    marginTop: 10,
    height: 40,
    borderRadius: 10,
  },
  searchContainers: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#D98100',
    paddingHorizontal: 10,
    margin: 5,
    height: 40,
    width: '100%',
    borderRadius: 10,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    color: 'white',
  },
});
