import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import HeaderDetails from '../components/HeaderDetails';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-gesture-handler';
import ButtonInput from '../components/ButtonInput';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import ChatInput from '../components/ChatInput';
import LoginInput from '../components/LoginInput';
import { baseUrl } from '../global';
const windowWidth = Dimensions.get('window').width;

const BookedDetails = ({route}) => {

  const [userState, setuserState] = useState(11);
  const [users, setusers] = useState('');
  const [data2, setdata] = useState();
  const [maindata, mainsetdata] = useState();
  const [comment, setComment] = useState([]);
  const [commentWritten, setCommentWritten] = useState([]);
  const [imageUri, setImageUri] = useState('');
  const [imageUris, setImageUris] = useState('');

  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem('data');
      if (value) {
        AsyncStorage.setItem('data', value);
        const parsedValue = JSON.parse(value);
        setusers(parsedValue);
        setuserState(parsedValue?.user_data[0]?.user_type);
        handleSubmit(parsedValue);
        handleComments(parsedValue);
        handleSubmit2(parsedValue);
        setImageUris(`${baseUrl}/${JSON.parse(value).user_data[0].image}`);
      }
   
    }
    replacementFunction();
  }, []);

  const handleSubmit2 = async users => {
    try {
      await fetch(
        `${baseUrl}/posts/GetAllBookedBartenderByPostId/${route?.params?.job_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'BarTenderAPI',
            accesstoken: `Bearer ${users.access_token}`,
          },
        },
      )
        .then(response => response.json())
        .then(dataa => {
  

          mainsetdata(dataa.posts);
        });
    } catch (error) {
      setActivityLoader(false);
      Alert.alert('An error occurred while processing your request.');
    }
  };
  const handleSubmit = async userss => {
    try {
      await fetch(`${baseUrl}/users/GetUserById/${userss.user_data[0].id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${userss.access_token}`,
        },
      })
        .then(response => response.json())
        .then(dataa => {
          if (dataa?.users.length > 0) {
            setImageUri(`${baseUrl}${dataa?.users[0]?.image}`);
            setdata(dataa?.users);
          }
        });
    } catch (error) {
      Alert.alert('An error occurred while processing your request.');
    }
  };
  const handleComments = async userss => {

    const commentData = {
      post_id: data?.job_id,
    };

    try {
      await fetch(`${baseUrl}/comments/GetAllCommentsById`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${userss.access_token}`,
        },
        body: JSON.stringify(commentData),
      })
        .then(response => response.json())
        .then(dataa => {
       
          if (dataa?.data.length > 0) {
            setComment(dataa.data);
          }
        });
    } catch (error) {}
  };
  const handleSubmitComment = async () => {
    const comentData = {
      post_id: data?.job_id,
      comment: commentWritten,
    };

    try {
      await fetch(`${baseUrl}/comments/CreateComment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${users.access_token}`,
        },
        body: JSON.stringify(comentData),
      })
        .then(response => response.json())
        .then(dataa => {
     
          if (dataa?.message == 'success') {
            Toast.show({
              type: 'success',
              text1: 'Comment',
              text2: 'Comment Posted Successfully👋',
            });
          }
          setCommentWritten('');
          handleComments(users);
        });
    } catch (error) {
      console.log('An error occurred while processing your request.');
    }
  };
  const handleCancel = async postId => {
    try {
      const JsonBody = {post_id: postId};
      await fetch(`${baseUrl}/posts/CancelBookedPost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          accesstoken: `Bearer ${users.access_token}`,
        },
        body: JSON.stringify(JsonBody),
      })
        .then(response => response.json())
        .then(dataa => {
         
          if (dataa?.success === 'Success') {
            Toast.show({
              type: 'success',
              text1: 'Job Cancel',
              text2: 'Job has been cancel 👋',
            });
            navigation.goBack();
          }
        });
    } catch (error) {
      Alert.alert('An error occurred while processing your request.');
    }
  };
  const navigation = useNavigation();
  const data = route?.params?.item;
  const datas = [
    {
      id: 1,
      name: 'John Brown',
      role: 'Bartender',
      image: require('../assets/userpic.jpg'),
      email: 'csjguy@gmail.com',
      PhoneNumber: '999-999-999',
    },
  ];
  const commentData = [
    {
      id: 1,
      name: 'John Brown',
      comment: 'i am Bartender',
      image: require('../assets/userpic.jpg'),
      date: '7 November 2024 12:12:12',
    },
  ];
  const Item = ({id, name, role, image, onPress}) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={
            imageUri == '' ? {uri: imageUri} : require('../assets/userpic.jpg')
          }
          style={{width: 50, height: 50, borderRadius: 50}}
        />
        <View style={{marginLeft: 15}}>
          <Text style={{color: 'black'}}>{name}</Text>
          <Text style={{color: 'black'}}>{role}</Text>
        </View>
      </View>
      <View>
        <Icon name="right" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );
  const CommentItem = ({id, name, comment, image, created_at}) => (
    <View
      style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
        <Image
          source={{uri: `${baseUrl}${image}`}}
          style={{width: 50, height: 50, borderRadius: 50}}
        />
        <View style={{marginLeft: 15}}>
          <Text style={{color: 'black'}}>{name} </Text>
          <Text style={{color: 'black', fontSize: 11}}>
            {created_at.split('GMT')[0]}
          </Text>
        </View>
        <View style={{marginTop: 15}}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <View
              style={{
                width: '100%',
                backgroundColor: '#f6f6f6',
                borderRadius: 20,
                padding: 20,
              }}>
              <Text style={{color: 'black', flexWrap: 'wrap'}}>{comment}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
  const renderComment = ({item}) => (
    <CommentItem
      name={item.name}
      comment={item.comment}
      image={item.image}
      created_at={item.created_at}
    />
  );
  const renderItem = ({item}) => (
    <Item
      name={item.name}
      role="Bartender"
      image={imageUri}
      onPress={() => navigation.navigate('DetailScreen', {item})}
    />
  );

  return (
    <View style={styles.container}>
      <HeaderDetails title="Booked" />
      <View>
        <View style={styles.section}>
          <Text style={{marginBottom: 10, color: 'black'}}>Job Title</Text>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            {' '}
            {data?.title}{' '}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={{marginBottom: 10, color: 'black'}}>Date and time</Text>
          <Text style={{color: 'black'}}>
            {moment(data.booked_at).format('YYYY-MM-DD hh:mm:ss A')}{' '}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={{marginBottom: 10, color: 'black'}}>Time</Text>
          <Text style={{color: 'black'}}>
            {`${moment(data.time, 'HH:mm:ss').format('hh:mm:ss A')}`}{' '}
          </Text>
        </View>
      </View>
      {userState == 1 ? (
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <ButtonInput
            title={'Cancel Booking'}
            onPress={() => handleCancel(data?.job_id)}
          />
        </View>
      ) : null}
      {userState == 2 ? (
        <View style={{padding: 10}}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            Confirmed Bartender
          </Text>
          <FlatList
            data={data2}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      ) : null}
      <Text style={{fontWeight: 'bold', color: 'black', padding: 10}}>
        Comments
      </Text>
      <ScrollView style={{padding: 10}}>
        <View>
          <FlatList
            data={comment}
            renderItem={renderComment}
            keyExtractor={item => item.id}
          />
        </View>
      </ScrollView>
      <View>
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            width: windowWidth * 0.9,
            paddingHorizontal: 10,
            alignSelf: 'center',
            marginBottom: 20,
          }}>
          <Image
            source={
              imageUri ? {uri: imageUri} : require('../assets/cardimg.png')
            }
            style={{width: 50, height: 50, borderRadius: 50 / 2}}
          />
          <LoginInput
            placeholder={'Please Enter Comment'}
            placeholderColor={'grey'}
            setValues={text => setCommentWritten(text)}
            value={commentWritten}
            styled={{marginTop: 0, marginHorizontal: 10}}
          />
          <ChatInput
            title={'Send'}
            onPress={handleSubmitComment}
            styleChat={{marginLeft: 0}}
          />
        </View>
      </View>
    </View>
  );
};

export default BookedDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  section: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 10,
    margin: 5,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
