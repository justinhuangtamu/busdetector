
import React, {useState, useEffect} from 'react';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';

import {sort_times, create_table} from './table.js';
import { useNavigation } from '@react-navigation/native';
import times from './route1.json';

import waypoints2 from './route1.json';
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

export function Map({ navigation, route }) {
  // const [waypoints, setWaypoints] = useState([]);
  const { waypoints } = route.params || [];

  // useEffect(() => {
  //   // Call your function to get the waypoints from the database and update the state variable
  //   async function fetchData() {
  //     console.log(queryString);
  //     const json = await CallDatabase(queryString);
  //     setWaypoints(json);
  //   }

  //   fetchData();
  // }, []);

    return (
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
    );
}

// API connection function
async function CallDatabase(query) {
    try {
      // this still has to be set to the IP using ipConfig
        const fetchString = "http://192.168.12.146:3001/" + query;
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

// this is for the button list
const Item = ({item, onPress, backgroundColor, textColor}) => (
    <TouchableOpacity onPress={() => onPress(item.id)} style={[styles.item, {backgroundColor}]}>
      <Text style={[styles.title, {color: textColor}]}>{item.id}</Text>
    </TouchableOpacity>
  );

export function RouteSelection() {
    const navigation = useNavigation();
    const [selectedId, setSelectedId] = useState();

    // gets the route number that is selected and processes it
    handlePress = async (id) => {
      setSelectedId(id);
      queryString = "Select latitude, longitude from public.stops inner join public.route_stop_bridge on route_stop_bridge.stop_id=stops.stop_id where route_id='" + id + "';";
      
      console.log(queryString);
      // CallDatabase(queryString);
      const waypoints = await CallDatabase(queryString);

    // Navigate to the Map screen and pass the selected waypoints as a parameter
    navigation.navigate('Home', { waypoints });
      
        console.log(queryString);
        CallDatabase(queryString);


        const tableString = "select stop_name, static_time from route_stop_bridge " +
            "inner join stops on route_stop_bridge.stop_id = stops.stop_id " +
            "where(timed_stop and route_id = '" + id + "'); ";
        console.log(tableString);
        CallDatabase(tableString);
           
    };

  
    const renderItem = ({item}) => {
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
      };

      return (
        
        <SafeAreaView style={styles.item}>
          <Text style={[styles.buttonTitle]}>On Campus Routes</Text>
          <FlatList
            horizontal = {true}
            data={on_bus_buttons}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            extraData={selectedId}
          />
          <Text style={[styles.buttonTitle]}>Off Campus Routes</Text>
          <FlatList
            horizontal = {true}
            data={off_bus_buttons}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            extraData={selectedId}
          />
        {table_view()}
        </SafeAreaView>        
      );
  }












  