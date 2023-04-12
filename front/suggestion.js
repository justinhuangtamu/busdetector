import React, { Component, useState } from 'react';


import { Text, View, StyleSheet, ScrollView, Platform} from 'react-native';

import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';





export function Settings({ navigation, route }) {
    
    
    var table_info;


    if (route.params === undefined) {
        table_info = [];
    } else {
        table_info = route.params['res'];
    }
    
    

    //DropDownPicker.setMode("BADGE");
    return ( create_table2(table_info) );
            
}

function create_table2(info) {
   // console.log(info);
    if (info) {
        
        if (info.length === 0) {
            return (
                <View>
                    <Text style={styles.label}>No Routes Found</Text>
                    <Text style={{ fontSize: 18, padding: 12 }}>Tap on the map to place a start point. Tapping again will place an end marker.</Text>
                    <Text style={{ fontSize: 13, padding: 3, textAlign: 'center' }}>(Pressing the screen again will restart the pattern.)</Text>
                    <Text style={{ fontSize: 18, padding: 12 }}>Press the Route Suggestion button and a table will appear here with possible routes</Text>
                    <Text style={{ fontSize: 18, padding: 12 }}>If no routes appear it means that the closest stops to the locations selected do not share a route.</Text>
                </View>

            );
        } else {
            var rows = [];
            var wid = Platform.select({ios: {width: 232}, android: {width: 223}})
            var row_width = [60, 100, wid["width"]];
            var headers = ["Route #", "Name", "Stops on Route"];
            for (var i = 0; i < info.length; i++) {
                var check = info[i]["stops"].split(',');
                if (check.length > 1) {
                    rows.push([info[i]["route_id"], info[i]["route_name"], info[i]["stops"]]);
                }

            }
            return (
                <View style={{ zindex: 3 }}>
                    <Text style={styles.label}>Suggested Routes</Text>
                    <ScrollView horizontal={false} nestedScrollView={true} style={table_style.scroll}>
                        <View style={table_style.viewContainer}>
                            <Table borderStyle={{ borderWidth: 1, width: 300, borderColor: '#500000' }}   >
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
                </View>
            );
        }
        
    } else {
        return (
            <View>
                <Text style={styles.label}>How to use Route Suggestion</Text>
                <Text style={{ fontSize: 18, padding: 12 }}>Tap on the map to place a start point. Tapping again will place an end marker.</Text>
                <Text style={{ fontSize: 13, padding: 3, textAlign: 'center' }}>(Pressing the screen again will restart the pattern.)</Text>
                <Text style={{ fontSize: 18, padding: 12 }}>Press the Route Suggestion button and a table will appear here with possible routes</Text>
                <Text style={{ fontSize: 18, padding: 12 }}>If no routes appear it means that the closest stops to the locations selected do not share a route.</Text>
            </View>

        );
    }   
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 0,
        padding: 10,
        zIndex:1,
    },
    value: {
        fontSize: 16,
        marginBottom: 0,
    },
});
const table_style = StyleSheet.create({
    container: { padding: 4, paddingTop: 30, },
    rowSection: { height: 60, backgroundColor: '#E7E6E1' },
    head: { height: 44, backgroundColor: '#500' },
    headText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'white' },
    text: { margin: 6, fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
    button: {
        backgroundColor: '#E7E6E1', color: '#500000', fontWeight: 'bold', width: 179,
        padding: 12, borderWidth: 1, top: 0, textAlign: 'center',
    },
    viewContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', height: '100%' },
    scroll: {
        ...Platform.select({
            android: {
                height: 650,
                
            }
        }),
        height: 650,
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




