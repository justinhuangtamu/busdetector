import React, {useState, useEffect} from 'react';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import { Map, getRoutesFromAPI, styles, RouteSelection, test} from './MapClass.js';

//import {} from './table.js';
import {get_Announcements, theme} from "./News.js";




function Settings() {
  return (
    <View style = {styles.link}>
      
      <Text>Settings Screen</Text>
    </View>
  );
}


function Announcments() {
  var array = get_Announcements();
  return (
    <ScrollView style={theme.scroll}>
      {array}  
    </ScrollView>
    
  );
}



const Stack = createNativeStackNavigator();

export default function App() {
  //const scheme = useColorScheme();
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
          {/* <Stack.Screen name="RouteSelection" component={RouteSelection} /> */}
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Announcments" component={Announcments} />
        </Stack.Navigator>

    }</NavigationContainer>
    

  );
}








// have to add dependencies for dark mode/ light mode


// function MyButton() {
//   if (mode === "dark") {
//     mode = "light";
//   } else {
//     mode = "dark";
//   }
// } <Button title="Toggle Dark Mode" onPress={MyButton()} />