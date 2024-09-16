import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const YesNoSelector = ({ specialties, onSpecialtySelected, defaultValue  }) => {
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
      {['Yes', 'No'].map((specialty, index) => (
        <TouchableOpacity
          key={specialty}
          style={[
            styles.button,
            selectedSpecialty === specialty ? styles.selected : styles.unselected,
          ]}
          onPress={() => handlePress(specialty)}
        >
          <Text style={[selectedSpecialty === specialty ? styles.selectedText : styles.unselectedText]}>
            {specialty}
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
    textAlign: 'center',
    borderRadius: 5,
    width: '50%',
  },
  selected: {
    backgroundColor: 'white',
    color: 'orange',
    fontWeight: '800',
    textAlign: 'center',
  },
  unselected: {
    backgroundColor: 'orange',
    color: 'whitesmoke',
    fontWeight: '800',
    textAlign: 'center',
  },
  selectedText: {
    color: 'orange',
    fontWeight: '800',
    textAlign: 'center',
  },
  unselectedText: {
    color: 'whitesmoke',
    fontWeight: '800',
    textAlign: 'center',
  },
});

export default YesNoSelector;
