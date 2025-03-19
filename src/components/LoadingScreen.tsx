import {Animated, StyleSheet} from 'react-native';
import {ThemedView} from './ThemedView';
import {useEffect, useRef} from 'react';

const LoadingScreen = () => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current; // Initial scale is 0 (hidden)

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1, // Scale to full size
      duration: 160, // 1 second
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedView>
        <Animated.Image
          source={require('../../assets/images/icon.png')}
          // source={require('../../assets/images/frugio-logo-4.png')}
          style={[styles.image, {transform: [{scale: scaleAnim}]}]}
        />
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 140,
    width: 140,
  },
});

export default LoadingScreen;
