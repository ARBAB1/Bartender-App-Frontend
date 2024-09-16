import React, {useEffect, useState} from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
} from 'react-native';

import {
  getSubscriptions,
  initConnection,
  purchaseUpdatedListener,
  requestSubscription,
  getAvailablePurchases,
  getPurchaseHistory
  
} from 'react-native-iap';
import ButtonInput from '../components/ButtonInput';
import Header from '../components/Header';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {baseUrl} from '../global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const items = Platform.select({
  ios: {
    skus: ['bart29', 'bart179'],
  },
  android: {
    skus: ['bart29.9', 'bart29.99'],
  },
});
let purchaseUpdateSubscription = null;
let purchaseErrorSubscription;
const Subscription = () => {
  const [purchased, setPurchased] = React.useState(false);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState('');
  const [subscribed, setSubscribed] = useState();
  const navigation = useNavigation()
  useEffect(() => {
    async function fetchData() {
      
      const value = await AsyncStorage.getItem('data');
      setUsers(JSON.parse(value));

    }
    fetchData();
    
  }, []);


  const handleBuySubscription = async product => {
    try {
      if (Platform.OS === 'ios') {
        await requestSubscription({
          sku: product.productId,
        })
          .then(res => {
            console.log(res, 'res');
            // var  response = res[res.length - 1].transactionReceipt

            //   validate(JSON.parse("Monthly"))
          })
          .catch(err => console.log(err));
      } else {
        await requestSubscription({
          sku: product.productId,
          subscriptionOffers: [
            {
              sku: product.productId,
              offerToken: product.subscriptionOfferDetails[0].offerToken,
            },
          ],
        })
          .then(res => {
            console.log(res, 'res');
             var  response = res[res.length - 1].transactionReceipt

               validate()
          })
          .then()
          .catch(err => console.log(err));
      }
      console.log('Subscription request sent for product:', product.productId);
    } catch (error) {
      console.log('Subscription request error:', error);
      Alert.alert('Error!', 'Failed to initiate the subscription.');
    }
  };
  const validate = async () => {
    console.log("lol")
    try {
      const response = await fetch(
        `${baseUrl}/subscription/subscribePackage`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'BarTenderAPI',
            accesstoken: `Bearer ${users?.access_token}`,
          },
          method: 'POST',
          body: JSON.stringify({product_id: true}),
        },
      );
      const result = await response.json();
      console.log(result, 'validate response');
    } catch (error) {
      Alert.alert('Error!', error.message);
    }
  };
  const handleUnsubscribe = async () => {
    try {
      if (Platform.OS === 'android') {
      console.log("aa")
        const response = await fetch(
          `${baseUrl}/subscription/Unsubscribe`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'BarTenderAPI',
              accesstoken: `Bearer ${users?.access_token}`,
            },
            method: 'GET',
          },
        );
        const result = await response.json();
        console.log(result)
        setPurchased(false)
        Linking.openURL(
          `https://play.google.com/store/account/subscriptions?package=${products[0].name}&sku=${products[0].productId}`,
        );
      } else if (Platform.OS === 'ios') {
        Linking.openURL('https://apps.apple.com/account/subscriptions');
         const response = await fetch(
          `${baseUrl}/subscription/Unsubscribe`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'BarTenderAPI',
              accesstoken: `Bearer ${users?.access_token}`,
            },
            method: 'GET',
          },
        );
        const result = await response.json();
        console.log(result)
        setPurchased(false)
       
      }
    } catch (error) {
      Alert.alert('Error!', error.message);
    }
  };
  useEffect(() => {
    initConnection()
      .catch(() => {
        console.log('error connecting to store...');
      })
      .then(async () => {
        console.log('connected to store');
        const purchase = await getAvailablePurchases()
        const history = await getPurchaseHistory()
        console.log(purchase, "qw2")
        // if(purchase==[]){setPurchased(false)}
        const subscriptions = await getSubscriptions(items);
        setProducts(subscriptions);
        console.log(subscriptions,"subscription");
      });
    purchaseUpdateSubscription = purchaseUpdatedListener(purchase => {
      try {
        const receipt = purchase.transactionReceipt;
      
        console.log(purchase,"sss")
      
        setPurchased(true);
      } catch (error) {}
    });
    return () => {
      if (purchaseUpdateSubscription) purchaseUpdateSubscription.remove();
      if (purchaseErrorSubscription) purchaseErrorSubscription.remove();

      // IAP.endConnection();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {purchased ? (
        <>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}>
            <Text style={{fontSize: 20, color: 'orange'}}>Subscribed </Text>
            <Text style={{fontWeight: 'bold', color: 'black', fontSize: 19}}>
              Successfully
            </Text>
            <ButtonInput title={'Unsubscribe'} onPress={handleUnsubscribe} />
          </View>
        </>
      ) : (
        <>
          <Header title="Subscription" headerShown={false} />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {Platform.OS === 'ios' && products.length > 0 ? (
              <View style={styles.productContainers}>
                {products.map((product, index) => (
                  <View key={index} style={styles.productContainer}>
                    <Text style={styles.productTitle}>{product.title}</Text>
                    <Image source={require('../assets/logo.png')} />
                    <View>
                      <Text style={styles.productPrice}>
                        Duration: {product?.subscriptionPeriodNumberIOS}{' '}
                        {(product?.subscriptionPeriodUnitIOS).toLowerCase()}{' '}
                      </Text>
                      <Text style={styles.productPrice}>
                        Description: {product?.description}
                      </Text>

                      <Text style={styles.productPrice}>
                        Price of Subscription:{product?.localizedPrice}
                      </Text>
                        <Text style={styles.productDescription}>
                      Payment will be charged to your iTunes account at confirmation
                      of purchase. The subscription automatically renews unless
                      auto-renew is turned off at least 24 hours before the end of
                      the current period.you may also refer to our {""}
                      <Text style={{fontWeight:'bold',}} onPress={()=>navigation.navigate('Terms Condition')}>
                      terms of use
                      </Text> and {""}
                         <Text style={{fontWeight:'bold',}} onPress={()=>navigation.navigate('Privacy Policy')}>
                         privacy policy
                         </Text>
                    </Text>
                    </View>

           
                  
                             <ButtonInput
                      title={`${product?.localizedPrice} per ${(product?.subscriptionPeriodUnitIOS).toLowerCase()}`}
                      onPress={() => handleBuySubscription(product)}
                    />
                  </View>
                ))}
              </View>
            ) : Platform.OS === 'android' && products.length > 0 ? (
              products.map((product, index) => (
                <View key={index} style={styles.productContainer}>
                  <Image source={require('../assets/logo.png')} />
                  <Text style={styles.productTitle}>{product.title}</Text>
                  <Text style={styles.productDescription}>
                    {product.description}
                  </Text>

                  <Text>
                    {
                      product?.subscriptionOfferDetails[0]?.pricingPhases
                        ?.pricingPhaseList[0]?.formattedPrice
                    }
                  </Text>
                  <ButtonInput
                    title={'Subscribe'}
                    onPress={() => handleBuySubscription(product)}
                  />
                </View>
              ))
            ) : (
              <>
                <SkeletonPlaceholder borderRadius={4}>
                  <View style={{width: 125, height: 120, borderRadius: 4}} />
                </SkeletonPlaceholder>
              </>
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  productContainer: {
    borderWidth: 1,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    borderRadius: 20,
    display: 'flex',
    marginBottom: 20,
  },
  productContainers: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

    display: 'flex',
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color:'black'
  },
  productDescription: {
    fontSize: 12,
    marginTop: 10,
  },
  productPrice: {
    fontSize: 16,
    color:"black"
  },
});
