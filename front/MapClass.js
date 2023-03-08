
import * as React from 'react';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

import waypoints2 from './route1.json';

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
                        strokeColor="#500000"
                        fillColor="rgba(255, 0,0,0.75)"
                        strokeWidth={6} />

                </MapView>
            }
            {/* <Text>Open up App.js to start working on your app!</Text> */}
            <StatusBar style="auto" />
        </View>
    );
}

// API connection function
export const getRoutesFromAPI = async () => {
    try {
        // fetch for IOS needs IP so run ipconfig and replace (192.xxx.x.xx:) with that IPV4
        const response = await fetch('http://192.168.1.67:3001/', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });
        const json = await response.json();
        return json.routes;
    } catch (error) {
        console.error(error);
    }

};


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
        <select>
            <option value="someOption">Some option</option>
            <option value="otherOption">Other option</option>
        </select>
        <Text>RouteSelection Screen</Text>
      </View>
    );
  }