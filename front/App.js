import React from 'react';
import MapView from 'react-native-maps';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    
    <View style={styles.container}>
     

      <MapView style={styles.map}
        initialRegion={{
          latitude: 30.6123,
          longitude: -96.3415,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        provider={'google'}
        showsMyLocationButton={true}
      />
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // #500000 is maroon
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '98%',
    height: '75%',
  },
});



