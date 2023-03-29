import React, { Component, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text, View, StyleSheet, ScrollView, Platform} from 'react-native';

import { Table, TableWrapper, Col, Row, Rows } from 'react-native-table-component';
import { useNavigation, CommonActions } from '@react-navigation/native';

import DropDownPicker from 'react-native-dropdown-picker';
import stops from './stops.json';

export function Settings({ navigation, route }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(stops);
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
    
    get_routes = async () => {
        //console.log(value);
        var ids = "";
        if (value != null) {
            for (var i = 0; i < value.length; i++ ) {
                if (i != 0) {
                    ids += ", ";
                }
                ids += "'" + value[i] + "'";
            }
            const queryString = "select r.route_id, route_name from route_stop_bridge b" +
            " join routes r on r.route_id = b.route_id join stops s on b.stop_id = s.stop_id " +
            "where stop_name IN (" + ids + ") group by r.route_id" +
            " having count(distinct stop_name) =" + value.length + ';';

            //console.log(queryString);
            const res = await CallDatabase(queryString);
            //console.log(res);
            navigation.dispatch(
                CommonActions.navigate({
                    name: 'Settings',

                    params: {res},

                })
            )
        }
    }
    DropDownPicker.setMode("BADGE");
    return (
        <View >
            <Text style={styles.label}>Select Bus Stops</Text>
            <TouchableOpacity onPress={get_routes} style={{ alignItems: 'center', height: 45, }} >
                {<Text style={table_style.button}>Selection</Text>}
            </TouchableOpacity>               
                <View style={{zindex:4}}>
                <DropDownPicker
                    multiple={true}
                    autoScroll={true}
                    nestedScrollView={true}
                    min={0}
                    max={2}
                    searchable={true}
                    open={open}
                    value={value}
                    items={routes}
                    containerStyle={{ width: '80%', left: '10%' }}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    showBadgeDot={false}

                    extendableBadgeContainer={true}
                />
            </View>
            <View style={{ zindex: 3 }}>
                
                {create_table2(table_info)} 
            </View>
            
        </View>
    );
}

function create_table2(info) {
    
    if (info.length > 0) {
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
                <View style={{ left: '40%', top: 250 }}>
                    <Text>No Routes Exist</Text>
                </View>
            )
        } else {
            return (
            <View style={{left:'40%', top:250}}>
                <Text>Pending...</Text>
            </View>
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
        marginBottom: 10,
        padding: 10,
        zIndex:1,
    },
    value: {
        fontSize: 16,
        marginBottom: 20,
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


