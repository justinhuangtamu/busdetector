
import React, {useState, useEffect} from 'react';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';

import {sort_times, create_table} from './table.js';
import { useNavigation, CommonActions } from '@react-navigation/native';
// import * as turf from '@turf/turf'; // import Turf.js library
import Swiper from 'react-native-swiper';
// import * as turf from '@turf/turf'; // import Turf.js library

import buses from "./buses.json";
import on_bus_buttons from "./bus-on-campus-button.json";
import off_bus_buttons from "./bus-off-campus-buttons.json";

const MSC = {
    latitude: 30.6123,
    longitude: -96.3415,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
}

var queryString = "";


// this is for the button list
const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={() => onPress(item.id)} style={[styles.item, { backgroundColor }]}>
    <Text style={[styles.title, { color: textColor }]}>{item.id}</Text>
  </TouchableOpacity>
);



export function Map({ navigation, route }) {
  //const { waypoints } = route.params || []; //route.params
  
  const [selectedId, setSelectedId] = useState();
  //const [waypoint, setWaypoint] = useState([]);
  console.log(route.params);
  var waypoints;
  if (route.params === undefined) {
    waypoints = route.params || [];
  } else {
    waypoints  = route.params["waypoint"] || [];
  }
  
  // gets the route number that is selected and processes it
  handlePress = async (id) => {
    setSelectedId(id);

    queryString = "Select latitude, longitude from public.stops inner join public.route_stop_bridge on route_stop_bridge.stop_id=stops.stop_id where route_id='" + id + "' order by route_stop_bridge.rank asc;";

    console.log(queryString);
    // CallDatabase(queryString);
    const waypoint = await CallDatabase(queryString);

    // Navigate to the Map screen and pass the selected waypoints as a parameter
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Home',
        params: {waypoint},
      })
    )


  };


  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? '#dcdcdc' : item.color;
    const color = item.id === selectedId ? 'black' : 'white';

    return (
      <Item
        item={item}
        onPress={handlePress}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
    
  }
    return (
      <Swiper horizontal={false} loop={false} showsButtons={false}>
        {create_Map(navigation, waypoints)}
        <SafeAreaView style={styles.item}>
          <Text style={[styles.buttonTitle]}>On Campus Routes</Text>
          <FlatList
            horizontal={true}
            data={on_bus_buttons}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            extraData={selectedId}
          />
          <Text style={[styles.buttonTitle]}>Off Campus Routes</Text>
          <FlatList
            horizontal={true}
            data={off_bus_buttons}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            extraData={selectedId}
          />
          {/* <Button
            title="Return to Map"
            onPress={() => navigation.navigate('Home', { waypoint })}
          /> 
          
          
          */}

          {//table_view()
          }
        </SafeAreaView> 
      </Swiper>
    );
}

function create_Map(navigation, waypoints) {
  var navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* <Button
                title="Go to Route Selection"
                onPress={() => navigation.navigate('RouteSelection')}
            /> */}
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
      <Button
        title="Go to Announcments"
        onPress={() => navigation.navigate('Announcments')}
      />

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

            strokeColor={buses["01"]["color"]}
            strokeWidth={6} />

        </MapView>
      }
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      <StatusBar style="auto" />
    </View>
  )
  
}


// API connection function
async function CallDatabase(query) {
    try {
      const fetchString = "http://us-lvm1.southcentralus.cloudapp.azure.com:3001/" + query;
        const response = await fetch(fetchString,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            });

        let json = undefined;

        if (response.status === 200) {
            json = await response.json();
           // console.log(json);                       // UNCOMMENT TO LOG JSON RESPONSES
            // waypoints = json;
        } else {
            console.log(response.status);
        }

        return json;
    } catch (err) {
        console.log(err)
    }

}
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: '98%',
        height: '75%',
    },
    link: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        padding: 20,
        // marginVertical: 8,
        marginHorizontal: 8,
        // flexDirection: 'row',
        borderRadius: 20,
      },
      title: {
        fontSize: 24,
      },
      buttonTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 20,
      },
});

export function table_view() {

    return (
        <View>
            {sort_times()}
        </View>
    );

}






  