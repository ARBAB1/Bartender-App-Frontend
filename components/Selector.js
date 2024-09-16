import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const SpecialtySelector = ({ specialties, onSpecialtySelected, defaultValue }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  useEffect(() => {
    if (defaultValue) {
      setSelectedSpecialty(defaultValue);
      onSpecialtySelected(defaultValue);
    }
  }, [defaultValue]);

  const handlePress = (specialty) => {
    setSelectedSpecialty(specialty);
    onSpecialtySelected(specialty);
  };

  return (
    <View style={styles.container}>
      {specialties.map((specialty, index) => (
        <TouchableOpacity
          key={specialty}
          style={[
            styles.button,
            selectedSpecialty === specialty ? styles.selected : styles.unselected,
          ]}
          onPress={() => handlePress(specialty)}
        >
          <Text style={[selectedSpecialty === specialty ? styles.selectedText : styles.unselectedText]}>
            { specialty}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'orange',
    marginRight: 10,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 10,
    padding: 10,
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  selected: {
    backgroundColor: 'white',
  },
  unselected: {
    backgroundColor: 'orange',
  },
  selectedText: {
    color: 'orange',
    fontWeight: '800',
  },
  unselectedText: {
    color: 'whitesmoke',
    fontWeight: '800',
  },
});

export default SpecialtySelector;
