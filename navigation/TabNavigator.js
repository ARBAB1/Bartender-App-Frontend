import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import { AdminStackNavigator, BartenderStackNavigator, CalenderStackNavigator, ContactStackNavigator, JobStackNavigator, MainStackNavigator, PendingStackNavigator,NotificationStackNavigator } from "./StackNavigator";
import ProfileScreen from "../screens/ProfileScreen";
import ShopingCart from "../screens/ShopingCart";
import PendingEvents from "../screens/PendingEvents";
import BookedEvents from "../screens/BookedEvents";
import PendingIcons from '../assets/svg/1-04.svg'
import BookedIcons from '../assets/svg/1-05.svg'
import Job from "../screens/Job";
import ProfileIcon from '../assets/svg/profileicon.svg';
import ChatIcon from '../assets/svg/1-02.svg'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Image, TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import { useSelector } from "react-redux";
import Subscription from "../screens/Subscription";
import Icons from "../components/Icons";
import Notification from "../screens/Notification";
import notifee from '@notifee/react-native';
import { withIAPContext } from "react-native-iap";
import BookedDetails from "../screens/BookedDetails";
import Analytics from "../screens/Analytics";
import {baseUrl} from "../global";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const [state, setstate] = useState()
  const [userState, setuserState] = useState()
  const [boolstate, setboolstate] = useState(true)
  const [currentNotification, setcurrentNotification] = useState(0)
  const ref = React.useRef(null);
  const [notificationBadgeVisible, setNotificationBadgeVisible] = React.useState(true);

  const navigationStateChangeHandler = () => {
    if (ref.current?.getCurrentRoute()?.name === 'Notification') {
      setNotificationBadgeVisible(false);
      // handleSeen(); // Call handleSeen when navigating to Notification tab
    }
  }

  React.useEffect(() => {
    ref.current?.addListener('state', navigationStateChangeHandler);
    return () => { ref.current?.removeListener('state', navigationStateChangeHandler); }
  });

  // useEffect(() => {
  //   async function replacementFunction() {
  //     const value = await AsyncStorage.getItem('data');
  //     setuserState(JSON.parse(value));
  //     handleSubmit(JSON.parse(value))
  //   }
  //   replacementFunction()
  // }, [boolstate])

  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem('data');
      setuserState(JSON.parse(value)?.user_data[0]?.user_type);
      handleSubmit(JSON.parse(value))
      const permission = await notifee.requestPermission();
    }
    const intervalId = setInterval(replacementFunction, 2000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [])



  const handleSubmit = async (userss) => {
    try {
      await fetch(`${baseUrl}/notifications/GetNotifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          'accesstoken': `Bearer ${userss.access_token}`
        },
      })
        .then(response => response.json())
        .then(dataa => {
          setcurrentNotification(dataa.count)
        
        });
    } catch (error) {
    }
  };

  AsyncStorage.getItem("type").then((value) => {
    setstate(value)
  })
    .then(res => {
      //do something else
    });
  const count = useSelector((state) => state.auth.user)

  return (
    <Tab.Navigator
      ref={ref}
      screenOptions={{
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          display: "flex"
        },
        headerShown: false,
        showIcon: true
      }}>

      <Tab.Screen name="Profile" component={MainStackNavigator} options={{
        tabBarIcon: ({ color, size }) => (
          <Icons.MaterialCommunityIcons name="play-box-outline" color={color} size={size} />
        ),
      }} />
  
      {userState == 1 ?
        <>
          <Tab.Screen name="Job" component={JobStackNavigator} initialParams={true} options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="hourglass" color={color} size={size} />
            ),
          }} />
          <Tab.Screen name="Calender" component={CalenderStackNavigator} options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="calendar-outline" color={color} size={size} />
            ),
          }} />
          <Tab.Screen name="Chats" component={ContactStackNavigator} options={{
            tabBarIcon: ({ color, size }) => (
              <Icons.AntDesign name="wechat" color={color} size={size} />
            ),
          }} />
          <Tab.Screen name="Subscription" component={Subscription} options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="play" color={color} size={size} />
            ),
          }} />
        </>
        : userState == 3 || userState == 2 ?
          <>
            <Tab.Screen initialParams={{ prop: true }} name="PendingEvents" component={PendingStackNavigator} options={{
              tabBarIcon: ({ color, size }) => (
                <Icons.MaterialIcons name="event-available" color={color} size={size} />
              ), tabBarLabel:"Events"
            }} />
        
            <Tab.Screen name="Bartender" component={BartenderStackNavigator} options={{
              tabBarIcon: ({ color, size }) => (
                <Icons.AntDesign name="user" color={color} size={size} />
              ),
            }} />
            <Tab.Screen name="Subscription" component={Subscription} options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="play" color={color} size={size} />
              ),
            }} />
            <Tab.Screen name="Chats" component={ContactStackNavigator} options={{
              tabBarIcon: ({ color, size }) => (
                <Icons.AntDesign name="wechat" color={color} size={size} />
              ),
            }} />
          

          </>
          : null
      }

      {userState == 0 ?
        <>
    
        <Tab.Screen name="User" component={AdminStackNavigator} options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="people-outline" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Analytics" component={Analytics} options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="bar-chart-outline" color={color} size={size} />
          ),
        }} />
        </>
        : null}
      {userState != 0 ?
        <Tab.Screen name="Notification" component={NotificationStackNavigator} options={{
          tabBarBadge: (currentNotification>0?currentNotification:undefined),
          tabBarIcon: ({ color, size, focused }) => (
              <Icon name="notifications" color={color} size={size} />
          ),
        }} />
        : null}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
