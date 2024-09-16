import React, { useState, useEffect } from 'react';
import { View, PanResponder, StyleSheet, Text } from 'react-native';

const DraggableProgressBar = ({ width, height, barColor, backgroundColor, initialProgress }) => {
  const [progress, setProgress] = useState(initialProgress || 0.5);

  const handlePanResponderMove = (event, gestureState) => {
    const { dx } = gestureState;
    let newProgress = progress + dx / width;

    // Ensure progress stays within 0 to 1 range
    newProgress = Math.max(0, Math.min(1, newProgress));

    setProgress(newProgress);
    
    // Check if progress has reached target labels
    const targetPositions = [0.1, 0.2, 0.3, 0.4];
    targetPositions.forEach(target => {
      if (newProgress >= target && newProgress - dx / width < target) {
        console.log(`Reached ${target * 100}`);
      }
    });
  };

  useEffect(() => {
    setProgress(initialProgress || 0.5);
  }, [initialProgress]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: () => {
      // You can add any logic you want when the user releases the drag
    },
  });

  return (
    <View
      style={[styles.container, { width, height, backgroundColor }]}
      {...panResponder.panHandlers}
    >
      <View
        style={[
          styles.progressBar,
          { width: width * progress, backgroundColor: barColor },
        ]}
      />
      <View style={styles.labelsContainer}>
        <Text style={styles.label}>10</Text>
        <Text style={styles.label}>20</Text>
        <Text style={styles.label}>30</Text>
        <Text style={styles.label}>40</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 12,
    color: 'black',
  },
});

export default DraggableProgressBar;
