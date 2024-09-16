import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
const SplashScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login');
    }, 1000);
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/logo.png')} />
      <Text style={{fontSize: 30, color: 'white'}}>The Bartinder App</Text>
    </View>
  );
};
export default SplashScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
  },
});
