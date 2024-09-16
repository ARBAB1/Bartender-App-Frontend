import React, {useEffect, useRef, useState} from 'react';
import {Button, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import Icons from './Icons';
import MapView, {Marker} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
const MapComponent = ({onPress, dataSend}) => {

  var navigation = useNavigation();
  const gMap = useRef(null);
  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  useEffect(() => {
    Geolocation.requestAuthorization();

    Geolocation.getCurrentPosition(pos => {
      const crd = pos.coords;
      setPosition({
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <MapView ref={gMap} style={styles.map} region={position} focusable>
        {dataSend?.map((item, index) => (
          <View key={index}>
            <Marker
              key={index}
              coordinate={{
                latitude: item.event_lat,
                longitude: item.event_lng,
              }}
              onPress={() => navigation.navigate('JobDetail', item)}
              // identifier={index}
              title={item.post_title}
              focusable
            />
          </View>
        ))}
        <Marker title="You are here" coordinate={position}>
          <Icons.Entypo name="location-pin" size={40} color={'blue'} />
        </Marker>
      </MapView>
      <View style={styles.buttonContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapicon: {
    width: 50,
    height: 50,
    margin: 10,
  },
  buttonContainer: {
    position: 'absolute', //Here is the trick
    top: '65%', //Position from top
    right: '5%', //Position from right
  },
});

export default MapComponent;
// <TouchableOpacity style={{marginLeft:10,width:50,height:50,backgroundColor:'orange',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:50}} onPress={()=>navigation.navigate('BookedEvents')}>
// <Icons.AntDesign name="menuunfold" size={24} color="#fff" />
// </TouchableOpacity>
