import * as React from 'react';
import MapView from 'react-native-maps';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

  //used in the stack.screen; passed into component as the function name
function Map({navigation}) {
  return(
    <View style={styles.container}>
      <Button
        title="Go to Route Selection"
        onPress={() => navigation.navigate('RouteSelection')}
      />
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
      <Button
        title="Go to Announcments"
        onPress={() => navigation.navigate('Announcments')}
      />
      

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

function Settings() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
    </View>
  );
}

function Announcments() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Announcments Screen</Text>
    </View>
  );
}

function RouteSelection() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home" 
          component={Map} 
          options={{ title: 'Map'}}
        />
        <Stack.Screen name="RouteSelection" component={RouteSelection} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Announcments" component={Announcments} />
      </Stack.Navigator>
    }</NavigationContainer>
    
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



