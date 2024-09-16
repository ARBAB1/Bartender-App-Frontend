import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import Iconss from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {baseUrl} from '../global';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Notification = () => {
  const {width, height} = Dimensions.get('window');
  const [userId, setuserId] = useState();
  const [datas, setData] = useState();
  const isFocused = useIsFocused();
  const [subscribed, setSubscribed] = useState();
  // const [data, setdata] = useState()
  const navigation = useNavigation();
  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem('data');
      setuserId(JSON.parse(value));
      ValidateUserSubscription(JSON.parse(value));
      handleSubmit(JSON.parse(value));
      handleSeen(JSON.parse(value));
    }
    replacementFunction();
  }, [isFocused]);
  const adUnitId =
    Platform.OS == 'android'
      ? 'ca-app-pub-9019633061186947/7103746505'
      : 'ca-app-pub-9019633061186947/8616138723';
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
          const subscriptions = dataa.subscription_status[0];

          setSubscribed(subscriptions);
        });
    } catch (error) {
      Alert.alert('An error occurred while processing your request.');
    }
  };
  const handleSubmit = async userss => {
    try {
      const response = await fetch(
        `${baseUrl}/notifications/GetNotifications`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'BarTenderAPI',
            accesstoken: `Bearer ${userss.access_token}`,
          },
        },
      );
      const dataa = await response.json();

   

      setData(dataa.data);
    } catch (error) {
      // Handle error
    }
  };

  const handleSeen = async userss => {
    try {
      await fetch(
        `${baseUrl}/notifications/SeenNotifications`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'BarTenderAPI',
            accesstoken: `Bearer ${userss?.access_token}`,
          },
        },
      )
        .then(response => response.json())
        .then(dataa => {
          setboolstate(!boolstate);
        });
    } catch (error) {}
  };

  // useEffect(() => {
  //   AllChats()
  //     }, [userId])
  const Item = ({id, name, message, role, onPress, postid}) => (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={{
          justifyContent: 'space-between',
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 0,
          borderBottomColor: 'whitesmoke',
          backgroundColor: `${id == 12 ? '#D0D0D0' : ''}`,
          marginBottom: 5,
        }}>
        <Image
          source={require('../assets/userpic.jpg')}
          style={{width: 50, height: 50, borderRadius: 50, marginRight: 5}}
        />
        <Text style={{color: 'grey', width: width * 0.7}}>{name}</Text>
        <Text style={{color: 'grey', width: width * 0.7}}>{postid}</Text>
        <Iconss style={{color: 'grey'}} name="dots-three-vertical" size={20} />
      </TouchableOpacity>
    </>
  );
  const renderItem = ({item}) => (
    <Item
      id={item.id}
      name={item.name}
      message={item.message}
      role={item.role}
      image={item.image}
      postid={item?.post_id}
      onPress={() => navigation.navigate('NotificationDetail', item)}
    />
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      <Header title="Notification" headerShown={false} />

      {subscribed?.subscription_status != 1 ? (
        <></>
      ) : //   <BannerAd
      //   unitId={adUnitId}
      //   size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      // />
      null}
      {datas && datas?.length > 0 ? (
        <FlatList
          style={styles.flatlistBorder}
          data={datas}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
      <View style={styles.notfound}><Text style={{color:"orange"}}>No Notification Available</Text></View>
      )}
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
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
  button: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#F2994A',
    borderRadius: 30,
    width: 60,

    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlistBorder: {
    borderBottomWidth: 1,
    borderColor: 'black',
  },
});
