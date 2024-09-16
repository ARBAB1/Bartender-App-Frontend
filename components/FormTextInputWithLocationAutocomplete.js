import React,{useRef,useEffect} from 'react';
import { ScrollView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const FormTextInputWithLocationAutocomplete = ({ setValues }) => {
  const ref = useRef();
  useEffect(() => {
    ref.current?.setAddressText('Some Text');
  }, []);
  return (
    <>
    <GooglePlacesAutocomplete
        GooglePlacesDetailsQuery={{ fields: "geometry" }}
        fetchDetails={true}
        
        placeholder="Your Location"
      
        textInputProps={{placeholderTextColor:'grey'}}
        query={{
          key: "AIzaSyD6NYSHgL0LaWPeLGfPQM3CE0cWu8q5gyM",
          language: "en",
         
        }}
        onPress={(data, details = null) => {
         
  const latlng =details.geometry.location
    const loc= data.description

          setValues({location:loc, latlng:latlng});
       
        }}
        enablePoweredByContainer={false}
        styles={{
          
          textInput: {
            height: 38,
            color: '#5d5d5d',
            fontSize: 12,
          },   predefinedPlacesDescription: {
            color: '#1faadb',
          },
          description : {color : 'grey'},
          loader:{flexDirection:'row',justifyContent:'flex-end',height:20}

        }}
        onFail={(error) => console.error(error)} />
    </>
  );
};

export default FormTextInputWithLocationAutocomplete;
