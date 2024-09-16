import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import {baseUrl} from '../global';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from "react-native-gifted-charts";

const Analytics = () => {
  const isFocused = useIsFocused();
  const [userState, setUserState] = useState(11);
  const [users, setUsers] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    async function replacementFunction() {
      const value = await AsyncStorage.getItem('data');
      AsyncStorage.setItem('data', value);
      const parsedValue = JSON.parse(value);
      setUsers(parsedValue);
      setUserState(parsedValue?.user_data[0]?.user_type);
      handleSubmit(parsedValue);
    }
    replacementFunction();
  }, [userState, isFocused]);

  const handleSubmit = async (userss) => {
    try {
      await fetch(`${baseUrl}/users/ReferedTypeAndCount`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'BarTenderAPI',
          'accesstoken': `Bearer ${userss?.access_token}`
        },
      })
        .then(response => response.json())
        .then(dataa => {
       console.log(dataa)
          setData(dataa?.data);
        });
    } catch (error) {
      Alert.alert('An error occurred while processing your request.');
    }
  };
  const renderLegend = (text, color) => {
    return (
      <View style={{ flexDirection: 'row', marginBottom: 12 ,justifyContent : "space-between" }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // marginHorizontal: 50,
            flexWrap : "wrap",
            justifyContent : "space-between"
          }}
        >
          <View
            style={{
              height: 18,
              width: 18,
              marginRight: 10,
              marginLeft: 20,
              borderRadius: 4,
              backgroundColor: color || 'white',
            }}
          />
          <Text style={{ color: 'black', fontSize: 16 }}>{text || ''}</Text>
        </View>
      </View>
    );
  };
  
  
  const pieChartData = data.map((item, index) => {

    const colors = ['rgb(84,219,234)', 'lightgreen', 'orange', 'purple', 'red', 'blue'];
    return { value: item.total_occurrences, color: colors[index % colors.length] };
  });
console.log(pieChartData)
  return (
    <>
      <Header title="Analytics" headerShown={false} />
      
      <ScrollView contentContainerStyle={styles.container}>
     
      
      <Text style={styles.title}>Referral Analytics</Text>
          <PieChart
            strokeColor="white"
            strokeWidth={2}
            donut
            data={pieChartData}
            innerCircleColor="#414141"
            innerCircleBorderWidth={4}
            innerCircleBorderColor={'white'}
            showValuesAsLabels={true}
            showText
            textColor='black'
            textSize={14}
labelsPosition='onBorder'

            showTextBackground={true}
            centerLabelComponent={() => {
              const total = data.reduce((sum, item) => sum + item.total_occurrences, 0);
              return (
                <View>
                  <Text style={{ color: 'white', fontSize: 36 }}>{total}</Text>
                  <Text style={{ color: 'white', fontSize: 18 }}>Total</Text>
                </View>
              );
            }}
          />
          <View style={styles.legendContainer}>
            {data.map((item, index) => {
              const colors = ['rgb(84,219,234)', 'lightgreen', 'orange', 'purple', 'red', 'blue'];
              return renderLegend(item.refered_from, colors[index % colors.length],);
            })}
          </View>
        
    
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#414141',
    borderRadius: 10,
    alignItems: 'center',
  },
  legendContainer: {
    // width: '100%',
    // backgroundColor : "red",
    flexDirection: 'row',
    
    // justifyContent: 'space-between',
    marginTop: 20,
    flexWrap:'wrap'
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    width: '45%',
    margin: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default Analytics;
