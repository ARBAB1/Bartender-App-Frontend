import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import JobDetails from '../components/JobDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JobDetailsScreens = ({route}) => {
  const [userType, setUserType] = useState();
  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem('data');
      AsyncStorage.setItem('data', value);

      setUserType(JSON.parse(value)?.user_data[0]?.user_type);
    }
    replacementFunction();
  }, [setUserType]);

  const [details, setDetails] = useState(route.params);
  return (
    <View>
      <JobDetails
        post_title={'Conocation'}
        hourlyRate={'12'}
        timeStamp={'16 Jan 2024 6:56'}
        noofpeople={12}
        location={'Raleigh'}
        uniqueId={'327834242941'}
        contact_phone={'99999999999'}
        event_date={'17 Jan 2024 5:50 PM'}
        theme={'Red and White'}
        userType={1}
        latitude={35.7796}
        longitude={-78.6382}
        event_duration={'7'}
      />
    </View>
  );
};

export default JobDetailsScreens;
// <View>
// <JobDetails
//   post_title={route.params.item.post_title}
//   post_description={route.params.item.post_description}
//   contact_email={route.params.item.contact_email}
//   contact_phone={route.params.item.contact_phone}
//   event_date={route.params.item.event_date}
//   event_duration={route.params.item.event_duration}
// />
// </View>

// <JobDetails
// post_title={details?.post_title}
// hourlyRate={details?.bartender_hourly_rate}
// timeStamp={details?.contact_phone}
// noofpeople={details?.no_of_people}
// location={details?.event_location}
// uniqueId={details?.post_uuid}
// contact_phone={details?.contact_phone}
// event_date={details?.event_date}
// theme={details?.theme}
// latitude= {details?.event_lat}
// longitude= {details?.event_lng}
// event_duration={details?.event_duration}
// userType={userType}
// postedBy = {details?.posted_by}
// />
const styles = StyleSheet.create({});
