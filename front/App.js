import * as React from 'react';
// import MapView from 'react-native-maps';
// import { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';


import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Map, getRoutesFromAPI, styles } from './MapClass';
function Settings() {
  return (
    <View style={styles.link}>
      {/* {console.log(getRoutesFromAPI())} */}
      <Text>
        Settings Screen</Text>
    </View>
  );
}

function Announcments() {
  return (
    <View style={styles.link}>
      <Text>Announcments Screen</Text>
    </View>
  );
}

function RouteSelection() {
  return (
    <View style={styles.link}>
      <Text>RouteSelection Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // all app code has to go within the <NavigationContainer> tag
    <NavigationContainer>{
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#500000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home"
          component={Map}
          options={{ title: 'Map' }}
        />
        <Stack.Screen name="RouteSelection" component={RouteSelection} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Announcments" component={Announcments} />
      </Stack.Navigator>
    }</NavigationContainer>

  );
}


