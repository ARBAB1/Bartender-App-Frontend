import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import ButtonInput from './ButtonInput';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../global';
const windowWidth = Dimensions.get('window').width;
export default function UserDetails({prop}) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [userState, setuserState] = useState(11);
  const [users, setusers] = useState('');
  const [data, setdata] = useState();
  const [imageUri, setImageUri] = useState('');
  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem('data');
      AsyncStorage.setItem('data', value);
      setusers(JSON.parse(value));
      setuserState(JSON.parse(value)?.user_data[0]?.user_type);
      handleSubmit(JSON.parse(value));
    }
    replacementFunction();
  }, [userState, isFocused]);

  const handleSubmit = async userss => {
    setIsLoading(true);

    try {
      fetch(`${baseUrl}/users/GetUserById/${userss.user_data[0].id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${userss.access_token}`,
        },
      })
        .then(response => response.json())
        .then(dataa => {
          setIsLoading(false);

          if (dataa?.users) {
            setImageUri(dataa?.users[0]?.image.split('uploads')[1]);
            setdata(dataa?.users[0]);
          }
        });
    } catch (error) {
      Alert.alert('An error occurred while processing your request.');
    }
  };

  return (
    <>
      {isLoading ? (
        <View style={[styles.containerSpinner, styles.horizontalSpinner]}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView style={styles.card}>
          {(data?.image && data?.image.length <= 3) ||  data?.image == ''  ? (
            <>
              <ImageBackground
                source={require('../assets/user.jpeg')}
                style={styles.image}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: windowWidth,
                  }}>
                  <ButtonInput
                    title={'Update Your Profile'}
                    onPress={() => navigation.navigate('EditProfile')}
                  />
                </View>
              </ImageBackground>
            </>
          ) : (
            <ImageBackground
               source={{uri:`${baseUrl}${imageUri}`}}
              style={styles.image}></ImageBackground>
          )}
          <View style={styles.maintitle}>
            <Text style={styles.titlemain}>Welcome {data?.name},</Text>
            {prop == 3 ? (
              <Text style={styles.titlemain}>you are a Host!</Text>
            ) : prop == 4 ? (
              <Text style={styles.titlemain}>you are Business!</Text>
            ) : (
              <Text style={styles.titlemain}>
                {userState == 2 ? 'you are User' : 'you are Admin'}
              </Text>
            )}
          </View>
          {prop == 3 ? (
            <View style={styles.rating}>
              <ButtonInput
                title={'Create Full Time Job'}
                onPress={() => navigation.navigate('AddJob2')}
              />
            </View>
          ) : null}
          {prop != 0 ? (
            <View style={styles.rating}>
              <ButtonInput
                title={'Create Gig'}
                onPress={() => navigation.navigate('AddJob')}
              />
            </View>
          ) : null}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  maintitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlemain: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Lato, BlinkMacSystemFont, Roboto, sans-serif',
    color: 'black',
  },
  card: {
    borderRadius: 6,
  },
  ratingcard: {
    borderRadius: 6,
    elevation: 3,
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
  },
  section: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    paddingVertical: 15,
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 358,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginBottom: 10,
    opacity: 1,
    background: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 10,
    color: '#fff', // white color for better visibility on image
  },
  text: {
    fontSize: 16,
    color: 'black', // white color for better visibility on image
    marginBottom: 5,
  },
  containerSpinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  horizontalSpinner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});
