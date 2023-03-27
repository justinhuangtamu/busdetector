
import React, {useState, useEffect} from 'react';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker, Polyline, Callout } from 'react-native-maps';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView, Modal } from 'react-native';

import {sort_times, create_table} from './table.js';
import { useNavigation, CommonActions } from '@react-navigation/native';
// import { ScrollView } from 'react-native-gesture-handler'
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
  const [dynamic, SetDynamic] = useState(true);
   
  
  var waypoints;
  var bus_ids = "01";
  var static_times;
  var eta_times;
  var markers;
  var buses_loc;
  if (route.params === undefined) {
    waypoints = route.params || [];
    bus_ids = "01";
    static_times = [];
    markers = [];
    eta_times = [];
    buses_loc = [];
  } else {
    waypoints  = route.params["waypoint"] || [];
    bus_ids = route.params["bus_id"] || "";
    markers = route.params["stops"] || [];
    static_times = route.params["static_time"] || [];
    eta_times = [];
    buses_loc = route.params["bus"] || [];

  }
  
  // gets the route number that is selected and processes it
  handlePress = async (id) => {
    setSelectedId(id);

    queryString = "Select latitude, longitude from public.stops inner join public.route_stop_bridge on route_stop_bridge.stop_id=stops.stop_id where route_id='" + id + "' order by route_stop_bridge.rank asc;";

    console.log(queryString);
    // CallDatabase(queryString);
    const waypoint = await CallDatabase(queryString);
    const bus_id = id


    //Querry for static tables
    queryString = "Select static_time, stop_name, key from static_table where route_id='" + id + "' order by (key, index) asc";
    const static_time = await CallDatabase(queryString);
    //console.log(static_time);  
    
    // get the stops from the database
    queryString = "select distinct stop_name, timed_stop, longitude, latitude from route_stop_bridge inner join stops on route_stop_bridge.stop_id = stops.stop_id where (stop_name != 'Way Point' and route_id='" + id + "');";
    const stops = await CallDatabase(queryString);
    // console.log(stops)

    //get the bus locations from the database
    queryString = "select latitude, longitude, occupancy from buses where route_id='" + id + "';";
    const bus = await CallDatabase(queryString);
    
    
    // Navigate to the Map screen and pass the selected waypoints as a parameter
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Home',

        params: {waypoint, bus_id, stops, static_time, bus}, 

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
        <Swiper 
          horizontal={false} 
          loop={false} 
          showsButtons={false}
        
        >

          {create_Map(navigation, waypoints, bus_ids, markers, buses_loc)}
        <View>
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
            
            <TouchableWithoutFeedback >
                <Text style={styles.buttonTable}   onPress={() => SetDynamic(!dynamic)}   >
                {dynamic ? 'Show ETA Times' : 'Show Static Times'}
                </Text> 
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Information')}>
              <Image source={require('./assets/question.png')} style={styles.question} />
            </TouchableWithoutFeedback>
            {table_view(static_times, eta_times, dynamic)
            }
            
          </SafeAreaView> 
          </View>
        </Swiper> 
    );
}

function create_Map(navigation, waypoints, bus_id, markers, buses_loc) {
  var navigation = useNavigation();
  var id = 0;
  var bus_key = 0;
  // console.log("in create map")
  // console.log(markers)
  return (
    <View style={styles.container}>

      {
        // Google API block
        <MapView
          style={styles.map}
          initialRegion={MSC}
          provider={PROVIDER_GOOGLE}
        // showsMyLocationButton={true}
        >

          {markers.map(marker => (
            <Marker
              key={id++}

              coordinate={
                {latitude: marker.latitude,
                longitude: marker.longitude,
                }
              }
              // pinColor={marker.timed_stop ? buses[bus_id]["color"] : buses[bus_id]["color"]}
              
            >
              <Callout style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{/*height: 50,*/ width: 110, textAlign: 'center'}}>{marker.stop_name}</Text>
              </Callout>
              {marker.timed_stop ? <Image source={require('./assets/fast-time.png')} style={{height: 35, width: 35}}/> : <Image source={require('./assets/bus-stop.png')} style={{height: 35, width: 35}}/>}
              {/* { ShadowColor, overlayColor, tintColor (changes the color of the picture), borderColor,} */}
              {/* <a href="https://www.flaticon.com/free-icons/bus-stop" title="bus stop icons">Bus stop icons created by Freepik - Flaticon</a> */}
            </Marker>
          ))}
           {buses_loc.map(bus => (
            <Marker
              key={bus_key++}
              
              coordinate={
                {latitude: bus.latitude,
                longitude: bus.longitude,
                }
              }
              
            >
              <Callout style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{width: 100, textAlign: 'center'}}>{"occupancy: " + bus.occupancy}</Text>
              </Callout>
             <Image source={require('./assets/bus.png')} style={{height: 35, width: 35}}/> 
              {/* { ShadowColor, overlayColor, tintColor (changes the color of the picture), borderColor,} */}
              {/* <a href="https://www.flaticon.com/free-icons/bus-stop" title="bus stop icons">Bus stop icons created by Freepik - Flaticon</a> */}
            </Marker>
          ))} 
          <Polyline
            //key={polyline.id}
            coordinates={waypoints}
            
            strokeColor={buses[bus_id]["color"]}
            strokeWidth={6} />

        </MapView>
      }
      <StatusBar style="auto" />
      {/* <Image
      style={{ width: 50, height: 50 }}
      source={require('./assets/settings.png')}
    /> */}
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
        width: '100%',
        height: '87%',
        marginBottom: 100
        ,
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
      buttonTable: {
        position: 'absolute',
        zIndex: 2,
        backgroundColor: '#E7E6E1', 
        color: '#500000', 
        fontWeight: 'bold',
        width: 155, 
        height: 43,
        padding: 12,
        top: 305,
        left: 179,
        borderWidth: 1,
        
      },
      question: {
        position:'absolute',
        zIndex: 1,
        backgroundColor: '#E7E6E1', 
        top: 305,
        left: 334,
        width: 43,
        height: 43,
        borderWidth: 1,
        
      }
});

export function table_view(time_array_static, time_array_eta, dynamic) {
    
  if (!(time_array_static === undefined || time_array_eta === undefined)) { // 
    return (
      <View>
        {sort_times(time_array_static, time_array_eta, dynamic)
        }
      </View>
    );
  } else {
    return <View></View>;
  }
    

}



