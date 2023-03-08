
import * as React from 'react';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

import waypoints2 from './route1.json';
import buses from "./buses.json";

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
});

export function RouteSelection() {
    return (
      <View style={styles.link}>
        <Text>RouteSelection Screen</Text>
      </View>
    );
  }