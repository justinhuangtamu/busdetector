
import React, {useState} from 'react';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';

import waypoints2 from './route1.json';
import buses from "./buses.json";
import bus_buttons from "./bus-button.json";

const MSC = {
    latitude: 30.6123,
    longitude: -96.3415,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
}



export function Map({ navigation }) {
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
                        coordinates={waypoints2}
                        
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
async function CallDatabase() {
    try {
        const response = await fetch('http://10.229.30.189:3001/',
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
            console.log(json);
        }

        return json;
    } catch (err) {
        console.log(err)
    }

}
export const styles = StyleSheet.create({
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
    <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
      <Text style={[styles.title, {color: textColor}]}>{item.id}</Text>
    </TouchableOpacity>
  );

export function RouteSelection() {
    const [selectedId, setSelectedId] = useState();
  
    const renderItem = ({item}) => {
        const backgroundColor = item.id === selectedId ? '#dcdcdc' : item.color;
        const color = item.id === selectedId ? 'black' : 'white';
    
        return (
          <Item
            item={item}
            onPress={() => setSelectedId(item.id)}
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
            data={bus_buttons}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            extraData={selectedId}
          />
          <Text style={[styles.buttonTitle]}>Off Campus Routes</Text>
        </SafeAreaView>
      );
  }


  