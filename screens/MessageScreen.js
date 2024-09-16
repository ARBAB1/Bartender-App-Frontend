import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import ImageModal from 'react-native-image-modal'
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import HeaderDetails from '../components/HeaderDetails';
import Icons from '../components/Icons';
import ChatInput from '../components/ChatInput';
import {launchImageLibrary} from 'react-native-image-picker';
import {configureLayoutAnimations} from 'react-native-reanimated/lib/typescript/reanimated2/core';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {baseUrl} from '../global';
import {RefreshControl} from 'react-native-gesture-handler';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { successToast } from '../toast';
import { socketUrl } from '../global';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Messagescreen({route}) {

  const [userId, setUserId] = useState(0);
  const [subscribed, setSubscribed] = useState();
  const [currentChatMessage, setCurrentChatMessage] = useState('');
  const [token, setToken] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  // const socketUrl = 'http://192.168.200.163:3001'
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const value = await AsyncStorage.getItem('data');
      AsyncStorage.setItem('data', value);
      setUserId(JSON.parse(value).user_data[0].id);
      ValidateUserSubscription(JSON.parse(value));
      setToken(JSON.parse(value)?.access_token)
    }
    fetchData();
  }, []);
  const adUnitId =
    Platform.OS == 'android'
      ? 'ca-app-pub-9019633061186947/5654933464'
      : 'ca-app-pub-9019633061186947/2017906941';
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
  const socket = useRef(io(`${socketUrl}`));
console.log(socket,"sss")
  useEffect(() => {
    setRefreshing(true);
    socket.current.emit('getUserChatList', msgs => {
      console.log(msgs,"--------------")
      setMessages(msgs);
      setRefreshing(false);
      setTimeout(scrollToBottom, 100);
    });
  }, []);

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  };

  const [skeleton, setskeleton] = useState(false);

  const sendMessage = async () => {
    if (currentChatMessage !== '') {
      const msgData = {
        sender: userId,
        receiver: route.params.id,
        message: currentChatMessage,
        messagebool: true,
        image: '',
      };
      socket.current.emit('chat message', msgData);
      setCurrentChatMessage('');
      setImageUri(null);
    }
    setRefreshing(false);
  };
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleSelectImage = async () => {
    const options = {
      noData: true,
      mediaType: 'photo',
      selectionLimit: 1,
    };

    launchImageLibrary(options, async response1 => {
      const newdate = new Date().getTime();
      const datet = newdate;

      const formData = new FormData();
      formData.append('sender', userId);
      formData.append('receiver', route.params.id);
      if (response1.assets) {
        formData.append('file', {
          uri: response1?.assets[0]?.uri,
          name: `${datet}.jpg`,
          type: 'image/jpeg',
        });
      }
      try {
        const response = await fetch(`${baseUrl}/sendImage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
        const res = await response.json();
      
        if (res.message == 'Success') {
          const msgData = {
            sender: userId,
            receiver: route.params.id,
            message: '',
            messagebool: false,
            image: res?.ImageUrl,
          };

          socket.current.emit('chat message', msgData);
          setTimeout(() => {
            setskeleton(false);
          }, 1000);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };
  const navigation = useNavigation();

  const KeyboardUpper = () => {
    scrollToBottom();
  };
  const DeleteAllChats = async () => {
  
    try {
      fetch(`${socketUrl}/deleteChat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accesstoken: `Bearer ${token}`,
          'x-api-key': 'BarTenderAPI',
        },
        body: JSON.stringify({
          sender_id: userId,
          receiver_id: route.params.id,
        }),
      })
        .then(response => response.json())
        .then(responce => {
            if(responce.message == "Chat deleted for sender"){
              navigation.navigate('Chat')
              successToast('Chat Delete','chat successfully deleted ')
            }
        });
    } catch (error) {
      console.log('An error occurred while processing your request.', error);
    }
  };

  return (
    <>
      <HeaderDetails title={'Messages'} deleteChat={DeleteAllChats}/>

      {subscribed?.subscription_status != 1 ? (
        <></>
      ) : //   <BannerAd
      //   unitId={adUnitId}
      //   size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      // />
      null}
      <View style={styles.container}>
        {refreshing ? (
          <View
            style={{
              height: '100%',
              width: '100%',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator color={'black'} size={'large'} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            refreshing={refreshing}
            data={messages.filter(
              data =>
                (data.receiver == route.params.id && data.sender == userId) ||
                (data.receiver == userId && data.sender == route.params.id),
            )}
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => {
              const imageuri = item?.item?.thumbnail?.split('uploads');
          
              const LastTime =new Date(item?.item?.sent_at)
              return (
                <>
                  {item?.item?.image != 1 ? (
                    <View
                      style={
                        item?.item?.sender === parseInt(userId)
                          ? styles.rightMsg
                          : styles.leftMsg
                      }>
                      <Text
                        style={{
                          color:
                            item?.item?.sender === parseInt(userId)
                              ? 'white'
                              : 'black',
                        }}>
                        {item?.item?.message}
                      </Text>
                       <Text
                        style={{
                          color:
                            item?.item?.sender === parseInt(userId)
                              ? 'white'
                              : 'black',
                        }}>
                     {`${moment(LastTime).format(
                                'MMMM Do YYYY',
                              )}, ${moment(
                                LastTime,
                                'HH:mm:ss',
                              ).format('LTS')}`}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={
                        item?.item?.sender === parseInt(userId)
                          ? styles.rightMsgimg
                          : styles.leftMsgimg
                      }>
                      { (!item?.item?.image && !imageLoaded) ? (
                        <SkeletonPlaceholder borderRadius={4}>
                          <View
                            style={{width: 125, height: 120, borderRadius: 4}}
                          />
                        </SkeletonPlaceholder>
                      ) : (
                        <>
                          <View
                            style={{
                              flexDirection: 'column',
                              alignItems: 'flex-end',
                            }}>
                            <View
                              style={
                                item?.item?.sender === parseInt(userId)
                                  ? styles.rightMsg
                                  : styles.leftMsg
                              }>
                           
    <ImageModal
    resizeMode='contain'
    imageBackgroundColor='#000000'
    style={{
      width: 250,
      height: 250,
    }}
    source={{uri: `${baseUrl}/${imageuri[1]}`}}
  />
                            </View>
                            <Text style={{color: 'black'}}>
                              {`${moment(LastTime).format(
                                'MMMM Do YYYY',
                              )}, ${moment(
                                LastTime,
                                'HH:mm:ss',
                              ).format('LTS')}`}
                            </Text>
                          </View>
                          {messages?.length == item?.index - 1 ? (
                            <View
                              style={
                                item?.item?.sender === parseInt(userId)
                                  ? styles.rightMsg
                                  : styles.leftMsg
                              }></View>
                          ) : (
                           <></>
                          )}
                        </>
                      )}
                    </View>
                  )}
                </>
              );
            }}
          />
        )}

        <View
          style={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
          <View style={styles.messageInputContainer}>
            <TextInput
              style={{
                color: 'black',
                borderBottomWidth: 0,
                height: 50,
                width: '100%',
                paddingLeft: 20,
              }}
              value={currentChatMessage}
              onFocus={KeyboardUpper}
              onChangeText={value => setCurrentChatMessage(value)}
              placeholder="Enter your message"
              placeholderTextColor={'black'}
            />
          </View>

          <ChatInput title={'Send'} onPress={sendMessage} />

          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 20,
            }}
            onPress={() => handleSelectImage()}>
            <Icons.Entypo name="attachment" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

{
  /* 
<View style={{display:'flex',alignItems:'center',flexDirection:"row"}}>
<View style={styles.messageInputContainer}>

<TextInput
style={{color:'black',borderBottomWidth:0}}
value={currentChatMesage}
onChangeText={(value) => setCurrentChatMessage(value)}
placeholder="Enter your message"
placeholderTextColor={"black"}
/>
</View>
{
  currentChatMesage!=""?<ChatInput title={"Send"} onPress={sendMessage}/>:""
}
  <TouchableOpacity style={{alignItems:'center',justifyContent:'center', marginLeft:20}}>
  <Icons.Entypo name="attachment" size={24} color="black" />
  </TouchableOpacity>
</View>
 */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  leftMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5e5',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    color: 'black',
  },
  rightMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#007aff',
    color: 'black',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  leftMsgimg: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    color: 'black',
  },
  rightMsgimg: {
    alignSelf: 'flex-end',
    color: 'black',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  messageInputContainer: {
    width: '70%',
    backgroundColor: 'white',
    borderBottomColor: 'black',
    // borderBottomWidth:1,
    borderRadius: 30,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  messageInput: {
    borderWidth: 1,
    padding: 15,

    borderRadius: 50,
    marginRight: 10,
  },
  button: {
    width: '30%',
    backgroundColor: '#703efe',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
});
