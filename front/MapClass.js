
import React, {useState, useEffect} from 'react';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker, Polyline, Callout } from 'react-native-maps';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform, FlatList, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView, Modal } from 'react-native';

import {sort_times, create_table} from './table.js';
import { useNavigation, CommonActions } from '@react-navigation/native';

import Swiper from 'react-native-swiper';

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
var refresh = true;


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
  // const [refresh, setRefresh] = useState(true);
  

  // listens for when the map page is navigated to and sets refresh to true
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // setRefresh(true);
      refresh = true;
    });

    return unsubscribe;
  }, [navigation]);
   
  
  var waypoints;
  var bus_ids = "01";
  var static_times;
  var eta_times;
  var markers;
  var buses_loc;
  //console.log(route.params);
  if (route.params === undefined) {
    waypoints = route.params || [];
    bus_ids = "01";
    static_times = [];
    markers = [{ 'stop_name': 'test', 'timed_stop': true, 'longitude': '60.001', 'latitude':'60.001' }];
    eta_times = [];
    buses_loc = [];
  } else {
    waypoints  = route.params["waypoint"] || [];
    bus_ids = route.params["bus_id"] || "";
    markers = route.params["stops"] || [];
    static_times = route.params["static_time"] || [];
    eta_times = route.params["dynamic"] || [];
    buses_loc = route.params["bus"] || [];

  }
  
  // gets the route number that is selected and processes it
  handlePress = async (id) => {
    setSelectedId(id);
    console.log(id);
    try {
      queryString = "Select latitude, longitude from public.stops inner join public.route_stop_bridge on route_stop_bridge.stop_id=stops.stop_id where (route_id='" + id + "' and rank is not null) order by route_stop_bridge.rank asc;";
      
      // CallDatabase(queryString);
      const waypoint = await CallDatabase(queryString);
      const bus_id = id;

      //Querry for static tables & dynamic tables
      queryString = "Select static_time, stop_name, key from static_table where route_id='" + id + "' order by (key, index) asc";
      const static_time = await CallDatabase(queryString);


      queryString = "Select eta_time, stop_name, stops.stop_id, raw_time from stops inner join route_stop_bridge on route_stop_bridge.stop_id = stops.stop_id where (not stop_name='Way Point' and route_id='" + id + "') order by (stops.stop_id, raw_time) asc";
      const dynamic = await CallDatabase(queryString);

      // get the stops from the database
      queryString = "select distinct stop_name, timed_stop, longitude, latitude from route_stop_bridge inner join stops on route_stop_bridge.stop_id = stops.stop_id where (stop_name != 'Way Point' and route_id='" + id + "');";
      const stops = await CallDatabase(queryString);
      // console.log(stops)

      //get the bus locations from the database
      queryString = "select latitude, longitude, occupancy from buses where route_id='" + id + "' order by bus_id;";
      const bus = await CallDatabase(queryString);
      //console.log(bus);

      // Navigate to the Map screen and pass the selected waypoints as a parameter
      navigation.dispatch(
        CommonActions.navigate({
          name: 'Home',

          params: { waypoint, bus_id, stops, static_time, bus, dynamic },

        }));
    } catch (e) {
      console.log("ERROR ERROR ERROR ERROR ERROR ERROR ERROR")
      console.log(e);

      const waypoint = route.params["waypoint"] || [];
      const bus_id = route.params["bus_id"] || "";
      const stops = route.params["stops"] || [];
      const static_time = route.params["static_time"] || [];
      const dynamic = route.params["dynamic"] || [];
      const bus  = route.params["bus"] || [];
      navigation.dispatch(
        CommonActions.navigate({
          name: 'Home',

          params: { waypoint, bus_id, stops, static_time, bus, dynamic },

        }));

    }
    

  };

  // requeries for bus routes and etas
  // refreshPress = async (id) => {
  //   const bus_id = id

  //   queryString = "Select eta_time, stop_name, stops.stop_id, raw_time from stops inner join route_stop_bridge on route_stop_bridge.stop_id = stops.stop_id where (not stop_name='Way Point' and route_id='" + id + "') order by (stops.stop_id, raw_time) asc";
  //   const dynamic = await CallDatabase(queryString); 

  //   //get the bus locations from the database
  //   queryString = "select latitude, longitude, occupancy from buses where route_id='" + id + "';";
  //   const bus = await CallDatabase(queryString);
  //   console.log(bus);

  //   // set params to route, stops, and static time selected by the user
  //   const waypoint = waypoints;
  //   const stops = markers;
  //   const static_time = static_times;
    
  //   // Navigate to the Map screen and pass the selected waypoints as a parameter
  //   navigation.dispatch(
  //     CommonActions.navigate({
  //       name: 'Home',

  //       params: {waypoint, bus_id, stops, static_time, bus, dynamic}, 

  //     })
  //   )
  // };

  // refreshes the page
  useEffect(() => {
    // Function to automatically press the button every 15 seconds
    const autoPressButton = () => {
      // Check if an item is selected
      //console.log("selectedId is outside the if: " + selectedId);
      if (selectedId && refresh) {
        // Simulate button press by calling the onPress function with the selected item
        //console.log("selectedId is inside the if: " + selectedId);
        console.log("refresh");
        handlePress(selectedId);
      }
    };

    // Set up the interval to auto-press the button every 15 seconds
    const intervalId = setInterval(autoPressButton, 15000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [selectedId, refresh]);

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
            <TouchableWithoutFeedback onPress={() =>{refresh = false; navigation.navigate('Information')}}>
              <Image source={require('./assets/question.png')} style={styles.question} />
            </TouchableWithoutFeedback>
            
            {
            table_view(static_times, eta_times, dynamic)
            }
            
          </SafeAreaView> 
          </View>
        </Swiper> 
    );
}

function create_Map(navigation, waypoints, bus_id, markers, buses_loc) {
  
  var id = 0;
  var bus_key = 0;
  console.log("in create map")
  // console.log(markers)
  const [coords, setCoords] = useState([{ "latitude": 37.00, "longitude": -96.00 },
    { "latitude": 37.00, "longitude": -96.00 }]);
  const [pin, setPin] = useState(false);

  suggestRoutes = async () => {
    // Write 
    // console.log(coords[0]);
    // console.log(coords[1]);

    var limit = 5;
    refresh = false;

    var queryString = "select stop_name, MIN(" + "distance(s.latitude, s.longitude, " + coords[0]["latitude"] + ',' + 
    coords[0]["longitude"] + ")) as min_distance from stops s where stop_name != 'Way Point'" +
    " group by stop_name order by min_distance asc limit " + limit + ";";
    const start = await CallDatabase(queryString);
    console.log(queryString);


    queryString = "select stop_name, MIN(" + "distance(s.latitude, s.longitude, " + coords[1]["latitude"] + ',' +
      coords[1]["longitude"] + ")) as min_distance from stops s where stop_name != 'Way Point'" +
      " group by stop_name order by min_distance asc limit " + limit + ";";
      //console.log(queryString);
    const end = await CallDatabase(queryString);
   

    var list1 = "(";
    var list2 = "(";
    var list3 = "(";
    for (var i = 0; i < limit; i++) {
      var s = "'" + start[i]["stop_name"] + "'";
      var e = "'" + end[i]["stop_name"] + "'";

      if (s.indexOf('/') !== -1) {
        s = encodeURIComponent(s);
        s = s;
      }
      if (e.indexOf('/') !== -1) {
        e = encodeURIComponent(e);
        e = e;
      }

      list1 +=  s;
      list2 +=  e;
      list3 +=  s + ", " + e;
      if (i != (limit -1)) {
        list1 += ",";
        list2 += ",";
        list3 += ",";
      }
    }
    list1 += ")";
    list2 += ")";
    list3 += ")";
    console.log(list1);
    console.log(list2);
    console.log(list3);
    // Create the needed functions in suggestion.js and import them for here to make it easier to read
    
    
    // console.log("Start\n End");
    // console.log(start)
    // console.log(end);
    
    queryString = "select route_id, route_name, stops " +
    "from( " +
      "select r.route_id, route_name, STRING_AGG(distinct s.stop_name, ', ') as stops, " +
      "SUM(CASE WHEN stop_name IN " + list3 + " THEN 1 ELSE 0 END) AS count3, " +
      "SUM(CASE WHEN stop_name IN " + list1 + " THEN 1 ELSE 0 END) AS count1, " +
      "SUM(CASE WHEN stop_name IN " + list2 + " THEN 1 ELSE 0 END) AS count2  " +
		"from route_stop_bridge b " + 
		"join routes r on r.route_id = b.route_id " +
		"join stops s on b.stop_id = s.stop_id " +
    "where s.stop_name in " + list3 + " " +
		"group by r.route_id " +
    ") temp " +
    "where(count1 < 4 and count1 > 0 and count2 < 4 and count2 > 0 and count3 > 1);";
    
    /*
    select r.route_id, route_name from route_stop_bridge b
    join routes r on r.route_id = b.route_id join stops s 
    on b.stop_id = s.stop_id
    group by r.route_id HAVING 
    count(distinct stop_name IN ('Jones Butler @ Harvey Mitchell', 'Woodsman')) > 1
    AND count (distinct stop_name IN ('MSC')) > 1;
    */


    console.log(queryString);
    const res = await CallDatabase(queryString);
    

    navigation.dispatch(
      CommonActions.navigate({
        name: 'Route Suggestion',
        params: { res },
        }));
    }
  

  return (
    <View style={styles.container}>

      {
        // Google API block
        <MapView
          style={styles.map}
          initialRegion={MSC}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}
          

          onPress= {(e) => {
            var cords = pin ? [coords[0], e.nativeEvent.coordinate] : [e.nativeEvent.coordinate, coords[1]]
            //coords[counter ? 0 : 1] = e.nativeEvent.coordinate;
            console.log("\n trial");
            console.log(e.nativeEvent.coordinate);
            console.log('\n');

            setCoords(cords);
            // coords = cords;
            setPin(!pin);
            // pin = !pin;
        }}
        >
          {coords.map(marker => (
          <Marker
            key = {id++}
            coordinate={marker}
            title={id%2==0 ? "Start" : "End"}
            pinColor={id%2==0 ? "blue" : "red"}
            draggable={true}
          />
          ))}
          
            
          {markers.map(marker => (
            <Marker
              key={id++}

              coordinate={
                {
                  latitude: parseFloat(marker.latitude),
                  longitude: parseFloat(marker.longitude),
                }
              }

              pinColor={marker.timed_stop ? buses[bus_id]["color"] : buses[bus_id]["color"]}

            >
              
              {marker.timed_stop ? <Image source={require("./assets/fast-time.png")} style={{ height: 35, width: 35 }} /> : <Image source={require("./assets/bus-stop.png")} style={{ height: 35, width: 35 }} />}
              <Callout style={{justifyContent: 'center'}}>
                <Text style={{width: 100, textAlign: 'center'}}>{marker.stop_name}</Text>
              </Callout>
            </Marker>
          ))}

          {
            buses_loc.map(bus => (
              <Marker
                key={bus_key++}

                coordinate={
                  {
                    latitude: bus.latitude,
                    longitude: bus.longitude,
                  }
                }

              >
                <Image source={require("./assets/bus.png")} style={{ height: 35, width: 35 }} />
                <Callout>
                  <Text style={{width: 150, textAlign: 'center'}}>{"People on board: " + bus.occupancy + "\n" + Math.round((bus.occupancy / 75) * 100) + "% full"}</Text>
                </Callout>

              </Marker>
            ))
          }
          

          <Polyline
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
    <TouchableOpacity style={styles.mapButton} onPress={suggestRoutes} >
        <Image 
          style={{ width: 40, height: 40, backgroundColor:'#72b2fc', borderRadius:3, }}
          source={require('./assets/test2.png')}/>
      </TouchableOpacity> 
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
            console.log(response);
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
    mapButton: {
      position: 'absolute',
      top:5,
      left:5,
      backgroundColor: '#72b2fc', //#72b2fc
      borderColor: 'black',
      borderBottomColor: 'black',
      borderRadius: 30,
      borderWidth: 1,
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.54,
    },
    map: {
        width: '100%',
        height: '100%',
        marginBottom: 100,
    },
    link: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
      ...Platform.select({
        ios: {
          padding: 20,
          marginHorizontal: 8,
          borderRadius: 10,
        },
        android: {
          padding: 15,
          marginHorizontal: 4,
          borderRadius: 10,
        },
      }),
        
      },
      title: {
        fontSize: 24,
      },
      buttonTitle: {
        ...Platform.select({
          ios: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            marginTop: 20,
          },
          android: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
            marginTop: 10,
          },
        }),
  
      },
      filterbutton: {
        ...Platform.select({
          ios: {

            top: -50,
            left: 200,
          },
          android: {

            padding: 12,
            top: -50,
            left: 190,
          },
        }),
      },
      buttonTable: {
        ...Platform.select({
          ios: {
            position: 'relative',
            zIndex: 2,
            backgroundColor: '#E7E6E1',
            color: '#500000',
            fontWeight: 'bold',
            width: 155,
            height: 45,
            padding: 12,
            top: 40,
            left: 0,
            borderWidth: 1,
          },
          android: {
            position: 'relative',
            zIndex: 2,
            backgroundColor: '#E7E6E1',
            color: '#500000',
            fontWeight: 'bold',
            width: 145,
            height: 45,
            padding: 12,
            top: 40,
            left: 0,
            borderWidth: 1,
          },
        }),
        
        
      },
      question: {
        ...Platform.select({
          ios: {
            position: 'relative',
            zIndex: 1,
            backgroundColor: '#E7E6E1',
            top: -5,
            left: 155,
            width: 45,
            height: 45,
            borderWidth: 1,
            padding: 12,
          },
          android: {
            position: 'relative',
            zIndex: 1,
            backgroundColor: '#E7E6E1',
            padding: 12,
            top: -5,
            left: 145,
            width: 45,
            height: 45,
            borderWidth: 1,
          },
        }),
        
        
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



