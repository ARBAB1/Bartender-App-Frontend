import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Icons from '../components/Icons';
import MapComponent from '../components/MApComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../global';
import Geolocation from '@react-native-community/geolocation';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
const Job = ({route}) => {
  const isFocused = useIsFocused();
  const [users, setusers] = useState('');
  const [userState, setuserState] = useState(11);
  const [position, setPosition] = useState();
  const [subscribed, setSubscribed] = useState();

  const handleSubmit = userr => {
    try {
      fetch(
        `${baseUrl}/posts/GetAllAvailablePostsLocation?lat=${userr?.latitude}&long=${userr?.longitude}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'BarTenderAPI',
            accesstoken: `Bearer ${users?.access_token}`,
          },
        },
      )
        .then(response => response.json())
        .then(data => {
          console.log(data, 'jobdata');
          setData(data.data);
        });
    } catch (error) {
      console.log('An error occurred while processing your request.', error);
    }
  };

  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem('data');
      setusers(JSON.parse(value));
      Geolocation.requestAuthorization();
      ValidateUserSubscription(JSON.parse(value));
      Geolocation.getCurrentPosition(pos => {
        const crd = pos.coords;

        setPosition({
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        });
        position && handleSubmit(position);
        setuserState(JSON.parse(value)?.user_data[0]?.user_type);
      });
    }
    replacementFunction();
  }, [userState, isFocused]);
  const ValidateUserSubscription = async userss => {
    try {
      fetch(`${baseUrl}/subscription/CheckSubscription`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${userss.access_token}`,
        },
      })
        .then(response => response.json())
        .then(dataa => {
    console.log(dataa)
          const subscriptions = dataa.subscription_status;

          setSubscribed(subscriptions);
        });
    } catch (error) {
      Alert.alert('An error occurred while processing your request.');
    }
  };
  const adUnitId =
    Platform.OS == 'android'
      ? 'ca-app-pub-9019633061186947/5846505152'
      : 'ca-app-pub-9019633061186947/6971884564';
  const navigation = useNavigation();
  const [data, setData] = useState();
  const count = useSelector(state => state.auth.user);

  const Item = ({id, post_title, post_type, image, onPress}) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{marginLeft: 15}}>
          <Text style={{color: 'black'}}>{post_title}</Text>

          <Text style={{color: 'black'}}>{post_type}</Text>
        </View>
      </View>
      <View>
        <Icon name="right" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );
  const renderItem = ({item}) => (
    <Item
      post_title={item.post_title}
      post_type={item.post_type}
      onPress={() => navigation.navigate('JobDetail', {item})}
    />
  );


  
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Jobs"
        headerShown={false}
        onPress={() => handleSubmit(position)}
      />
      {subscribed!= "1" ?  (
         
          <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      ) : null}
      <View>
        <MapComponent dataSend={data} />
      </View>
    </SafeAreaView>
  );
};

export default Job;

const styles = StyleSheet.create({
  container: {
backgroundColor: 'white', height: '100%'
  },
});
