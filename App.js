import React from 'react';
import MapView from 'react-native-maps';
import {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';


import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const GOOGLE_MAPS_APIKEY = "AIzaSyAu6nlbhY5f261wk7EGJRDpQosx844VG5Q";

const MSC = {
  latitude: 30.6123,
  longitude: -96.3415,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
}

const MSC2 = {
  latitude: 30.6125,
  longitude: -96.3420,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
}
const waypoints = [
  {
    latitude: 30.6152035662653,
    longitude: -96.3374031387212,
  },

  {
    latitude: 30.6167807052601,
    longitude: -96.3350937566217,
  },

  {
    latitude: 30.6169081101959,
    longitude: -96.3351178965043,
  },

  {
    latitude: 30.617004669726196,
    longitude: -96.335121919818,
  },

  {
    latitude: 30.617118663616107,
    longitude: -96.33509643883089,
  },

  {
    latitude: 30.61722595198309,
    longitude: -96.335060229007,
  },
];





export default function App() {
  return (
    
    <View style={styles.container}>
     
      {
        // Google API block
        <MapView 
          style={styles.map}
          initialRegion={MSC}
          provider={PROVIDER_GOOGLE}
          //showsMyLocationButton={true}
        >
          <Marker 
            coordinate={MSC}
            pinColor="grey"
          />
          <Polyline
            //key={polyline.id}
            coordinates={waypoints}
            strokeColor="#500000"
            fillColor="rgba(255, 0,0,0.75)"
            strokeWidth={6} />
          
        </MapView>
      }
      
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#500000', // #500000 is maroon
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '97%',
    height: '75%',
  },
});



