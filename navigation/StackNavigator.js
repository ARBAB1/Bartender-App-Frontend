// ./navigation/StackNavigator.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import UserHomeScreen from '../screens/UserHomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ProfileScreen from "../screens/ProfileScreen";
import Chats from "../screens/Chats";
import MessageScreen from "../screens/MessageScreen";
import qrScreen from "../screens/QrScreen";
import QrScreen from "../screens/QrScreen";
import Job from "../screens/Job";
import BookedDetails from "../screens/BookedDetails";
import MyCalender from "../screens/MyCalender";
import CommentScreen from "../screens/CommentScreen";
import AdminProfileScreen from "../screens/AdminProfileScreen";
import AdminDetailsScreen from "../screens/AdminDetailsScreen";
import AddJobScreen from "../screens/AddJobScreen";
import JobDetailsScreen from "../components/JobDetails";
import PendingEvents from "../screens/PendingEvents";
import BookedEvents from "../screens/BookedEvents";
import BartenderProfile from "../screens/BartenderProfile";
import AllBartenders from "../screens/AllBartenders";
import AllBartenderProfile from "../screens/AllBartenderProfile";
import AddJobScreen2 from "../screens/AddJobScreen2";
import Notification from "../screens/Notification";
import Notificationdetail from "../screens/NotificationDetail";
import JobList from "../screens/JobList";
const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#9AC4F8",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
      }}>
      <Stack.Screen name="Home" initialParams={{prop:true}} component={ProfileScreen} screenOptions={{
        headerShown: false
        }} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="BookedEvents" component={BookedEvents} />
      <Stack.Screen name="AddJob" component={AddJobScreen} />
      <Stack.Screen name="AddJob2" component={AddJobScreen2} />
      <Stack.Screen name="QRScreen" component={QrScreen} screenOptions={{
        headerShown: false
        }}/>
    </Stack.Navigator>
  );
};
const NotificationStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
      }}>
      
      <Stack.Screen name="NotificationScreen" component={Notification} screenOptions={{
        headerShown: false
        }}/>
        <Stack.Screen name="NotificationDetail" component={Notificationdetail} screenOptions={{
          headerShown: false
          }}/>
         
    </Stack.Navigator>
  );
};
const ContactStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
      }}>
      
      <Stack.Screen name="Chat" component={Chats} screenOptions={{
        headerShown: false
        }}/>
        <Stack.Screen name="Message" component={MessageScreen} screenOptions={{
          headerShown: false
          }}/>
         
    </Stack.Navigator>
  );
};
const BartenderStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
      }}>
        <Stack.Screen name="AllBartenders" component={AllBartenders} screenOptions={{
        headerShown: false
        }}/>
           <Stack.Screen name="Bartender" component={AllBartenderProfile} screenOptions={{
        headerShown: false
        }}/>

     
         
    </Stack.Navigator>
  );
};
const CalenderStackNavigator = () => {
  return (
  <Stack.Navigator screenOptions={{
    headerShown: false
    }}>
    <Stack.Screen name="Calenders" component={MyCalender} screenOptions={{
      headerShown: false
      }}/>
      <Stack.Screen name="BookedDetails" component={BookedDetails} screenOptions={{
        headerShown: false
        }}/>
        <Stack.Screen name="DetailScreen" component={DetailsScreen} />
        <Stack.Screen name="CommentScreen" component={CommentScreen} />
        
  </Stack.Navigator>
  );

}
const AdminStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
      }}>
      <Stack.Screen name="Admin" component={AdminProfileScreen} screenOptions={{
        headerShown: false
        }} />
      <Stack.Screen name="AdminDetailsScreen" component={AdminDetailsScreen} />
      <Stack.Screen name="QRScreen" component={QrScreen} screenOptions={{
        headerShown: false
        }}/>
    </Stack.Navigator>
  );
};
const JobStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
      }}>
      <Stack.Screen name="JobList" component={JobList} screenOptions={{
        headerShown: false
        }} />
      <Stack.Screen name="Jobs" component={Job} screenOptions={{
        headerShown: false
        }} />
      
      <Stack.Screen name="JobDetail" component={JobDetailsScreen} />
    
    </Stack.Navigator>
  );
};
const PendingStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
      }}>
      <Stack.Screen name="Pending" component={PendingEvents} screenOptions={{
        headerShown: false
        }}/>
         <Stack.Screen name="JobDetail" component={JobDetailsScreen} />

         <Stack.Screen name="BartenderProfile" component={BartenderProfile} />
    </Stack.Navigator>
  );
};
export { CalenderStackNavigator,ContactStackNavigator,MainStackNavigator,AdminStackNavigator,JobStackNavigator,PendingStackNavigator,BartenderStackNavigator,NotificationStackNavigator };