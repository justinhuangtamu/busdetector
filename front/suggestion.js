import React, { Component, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text, View, StyleSheet, ScrollView, Platform} from 'react-native';

import { Table, TableWrapper, Col, Row, Rows } from 'react-native-table-component';
import { useNavigation, CommonActions } from '@react-navigation/native';

import DropDownPicker from 'react-native-dropdown-picker';
import stops from './stops.json';

export function Settings({ navigation, route }) {
    
    var routes = [];
    var table_info;


    if (route.params === undefined) {
        table_info = [];
    } else {
        table_info = route.params['res'];
    }
    var prev_label ="";
    for (var i = 0; i < stops.length; i++) {
        if (stops[i]["label"] != prev_label) {
            routes.push(
                {
                    "value": stops[i]["label"],
                    "label": stops[i]["label"],
                }
            )
            prev_label = stops[i]["label"];
        }
    }
    

    //DropDownPicker.setMode("BADGE");
    return (
        <View >
            <Text style={styles.label}>Select Bus Stops</Text>
            <View style={{ zindex: 3 }}>
                {create_table2(table_info)} 
            </View>
            
        </View>
    );
}

function create_table2(info) {
    console.log(info);
    if (info) {
        var rows = [];
        var row_width = [150,150];
        var headers = ["Route Number", "Route Name"];
        for(var i = 0; i < info.length; i++) {
            rows.push([info[i]["route_id"], info[i]["route_name"]]);
        }
        return (
                <ScrollView horizontal={false}  nestedScrollView={true} style={table_style.scroll}>
                    <View style={table_style.viewContainer}>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#500000'}}   >
                            <Row
                                data={headers}
                                widthArr={row_width}
                                style={table_style.head}
                                textStyle={table_style.headText}
                            />
                            <TableWrapper>
                                <Rows
                                    data={rows}
                                    widthArr={row_width}
                                    style={table_style.rowSection}
                                    textStyle={table_style.text}
                                />
                            </TableWrapper>

                        </Table>
                    </View>
                </ScrollView>
        );
    } else {
        if (info == undefined ||  info.length == 0) {
            return (
                <Text style={{top:300}}>Tap on the map to place a start marker and tap again to place an end marker. This pattern will repeat everytime you press the screen. Press the Route Suggestion button and a table will appear with possible routes</Text>
            )
        } else {
            return (
                <Text>Pending...</Text>
        )
        }
        
    }
    
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: -200,
        padding: 10,
        zIndex:1,
    },
    value: {
        fontSize: 16,
        marginBottom: 0,
    },
});


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

const table_style = StyleSheet.create({
    container: { padding: 4, paddingTop: 30, },
    rowSection: { height: 60, backgroundColor: '#E7E6E1' },
    head: { height: 44, backgroundColor: '#500' },
    headText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white' },
    text: { margin: 6, fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
    button: { backgroundColor: '#E7E6E1', color: '#500000', fontWeight: 'bold', width: 179, 
              padding: 12, borderWidth: 1, top:0, textAlign:'center',
            },
    viewContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', height: '100%'},
    scroll: { 
        ...Platform.select({
            ios: {
                left: 45,
                height: 350,

            },
            android: {
                left: 30,
                height: 285,
            }
        }),
        
        top: 200,
       // height: 370,
    },
});


