
import * as React from 'react';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

import waypoints2 from './route1.json';
import * as SQLite from 'expo-sqlite';

const MSC = {
    latitude: 30.6123,
    longitude: -96.3415,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
}

const MSC2 = {
    latitude: 30.6125,
    longitude: -96.3420,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
}
const waypoints = [
    {latitude: 30.6152035662653, longitude: -96.3374031387212, },

    {latitude: 30.6167807052601, longitude: -96.3350937566217, },

    {latitude: 30.6169081101959, longitude: -96.3351178965043, },

    {latitude: 30.617004669726196, longitude: -96.335121919818, },

    {latitude: 30.617118663616107, longitude: -96.33509643883089, },

    {latitude: 30.61722595198309, longitude: -96.335060229007, },
];

/*const createConnectionPool = require('@databases/pg');

const db = createConnectionPool({
  user: 'postgres', // e.g. 'my-user'
  password: 'Bu$det3ctoR2023', // e.g. 'my-user-password'
  database: 'busdetector', // e.g. 'my-database'
  host: 'lus-lvm1.southcentralus.cloudapp.azure.com',
});*/
//const Pool = require('pg').Pool;
/*const pool = new Pool({
    user: 'postgres',
    host: 'lus-lvm1.southcentralus.cloudapp.azure.com',
    database: 'busdetector',
    password: 'Bu$det3ctoR2023',
    port: 5432,
  });
  */

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