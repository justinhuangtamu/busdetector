import React, { Component, useState} from 'react';

import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Text, View, ScrollView, LogBox, Platform } from 'react-native';

import { Table, TableWrapper,  Row, Rows } from 'react-native-table-component';
// import { CallDatabase } from './MapClass.js';
LogBox.ignoreAllLogs("Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.");
const ToggleButton = (unfiltered, stops, filtered) => {


    var rowsU = unfiltered;
    var sumU = (rowsU[0].length -4) * 100;
    var widthU = Array(rowsU[0].length - 1).fill(100);
    var len = rowsU[0].length -1;
    widthU.unshift(105);
    if (sumU < 0) {
        sumU = 0;
        widthU = Array(len).fill(300 / (len));
        widthU.unshift(105);
    }

    var headers = ['Location ', "Timed Stops", ''];
    
    return (
        // TERMINAL WILL DISPLAY
        //                      Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.
        // 
        // IGNORE THIS WARNING its an error in the <Rows>.js file but the table is building correctly
        <View style={{ top:0}}>
            
            <ScrollView horizontal={true}  >
                <ScrollView horizontal={false} style={table_style.scroll} nestedScrollEnabled={true}>
                    <View style={table_style.viewContainer} >
                        <Table borderStyle={{borderWidth: 1, borderColor: '#500000'} }  >
                            <Row 
                                data={headers}
                               widthArr={ [105, 300, sumU] }
                                style={table_style.head}
                                textStyle={table_style.headText} 
                            />
                                <TableWrapper>
                                    
                                    <Rows
                                        data={rowsU}
                                        widthArr={widthU}
                                        style={table_style.rowSection}
                                        textStyle={table_style.text}
                                    />
                                </TableWrapper>

                        </Table>
                    </View>
                </ScrollView>
            </ScrollView>
            
        </View>
    );
};

export function sort_times(time_array_static, time_array_eta, dynamic) {
    var stops = ['Commons', 'Asbury Water Tower', 'Reed Arena', 'MSC', 'Commons'];
    var values = [];
    var filtered = [];
    
    try {
        if (dynamic) {
        //     values = sort_eta(time_array_eta);
            values = sort_static(time_array_static);
            values = filter_array(values, stops);
            stops = populate_stops(values);
            filtered = filter_array(values, stops);

        } else {
            
            values = sort_dynamic(time_array_eta);
            
            stops = populate_stops(values);
            console.log("Stops" + stops);
            values = filter_eta(values, stops); 
            filtered = filterTimesBeforeNow(values);
        }
        
        return create_table(values, stops, filtered);
    } catch {
        return;
    }
    
}


export function create_table(unfiltered, stops, filtered) {
    
    return (
        
        ToggleButton(unfiltered, stops, filtered)
    )
}

//Filter times
function filterTimesBeforeNow(timesArray, check) {
    
    if (check) {
        const now = new Date(); // get current time

        // filter out times before current time
        
        const filterNull = timesArray.filter(time => {
            return time != "-- -- --";
        });
        
        const filteredTimes = filterNull.filter(time => {
            const [timeStr, ampm] = time.split(' ');
            const [hourStr, minuteStr] = timeStr.split(':');

            var hour = parseInt(hourStr, 10);
            const minute = parseInt(minuteStr, 10);
            
            if (ampm === 'PM' && hour !== 12) {
                hour += 12;
            }

            const timeObj = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
            return timeObj >= now;
        });
        
        
        return filteredTimes;
    } else {
        const filtered = timesArray.filter(time => {
            return (time != "-- -- --");
        })
        return filtered;
    }
    
}


function makeSubarraysSameLength(arr, length, fillValue) {
    for (let i = 0; i < arr.length; i++) {
        while (arr[i].length < length) {
            arr[i].push(fillValue);
        }
    }
    return arr;
}


function filter_array(values, stops) {
    var filter_hold = [];
    var longest = 0;
    for (var i = 0; i < values.length; i++) {
        var hold = filterTimesBeforeNow(values[i], true);
        if (hold.length >= longest) {
            longest = hold.length;
        }
        hold.unshift(stops[i]);
        filter_hold.push(hold);
    }
    return filtered = makeSubarraysSameLength(filter_hold, longest + 1, "-- -- --");
}

function filter_eta(values, stops) {
    var filter_hold = [];
    var longest = 0;
    for (var i = 0; i < values.length; i++) {
        var hold = filterTimesBeforeNow(values[i], false);
        if (hold.length >= longest) {
            longest = hold.length;
        }
        //hold.unshift(stops[i]);
        filter_hold.push(hold);
    }
    return makeSubarraysSameLength(filter_hold, longest + 1, "-- -- --");
}


function populate_stops(values) {
    var stops = [];
    for (var i = 0; i < values.length; i++) {
        stops.push(values[i][0]);
    }
    return stops; 
}

function sort_static(times) {
    var values = [];
    var curr_row = [];
    var keys = "";
    for (var i = 0; i < times.length; i++) {
        if(times[i]["key"] != keys) {
            if (i != 0) {
                values.push(curr_row);
            }
            keys = times[i]["key"];
            curr_row = [times[i]["stop_name"]];
        }
        var time = times[i]["static_time"];
        if (time == null) {
            curr_row.push("-- -- --");
        } else {
            curr_row.push(times[i]["static_time"]);
        }        
    }
    values.push(curr_row);
    return values;
}

function sort_dynamic(times) {
    var values = [];
    var curr_row = [];
    var keys = "";
    for (var i = 0; i < times.length; i++) {
        if (times[i]["stop_id"] != keys) {
            if (i != 0) {
                values.push(curr_row);
            }
            keys = times[i]["stop_id"];
            curr_row = [times[i]["stop_name"]]; //
        }
        var time = times[i]["eta_time"];
        if (time == null) {
            curr_row.push("-- -- --");
        } else {
            curr_row.push(times[i]["eta_time"]);
        }
    }
    values.push(curr_row);
    return values;
}


const table_style = StyleSheet.create({
    container: { padding: 2, paddingTop: 2},
    rowSection: { height: 60, backgroundColor: '#E7E6E1' },
    head: { height: 44, backgroundColor: '#500' },
    headText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white' },
    text: { margin: 6, fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
    button: {backgroundColor: '#E7E6E1',  color: '#500000', fontWeight: 'bold',  width: 179, padding: 12, zIndex: 2, borderWidth: 1,},
    viewContainer: {flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-start', flex: 1},
    scroll: {
        height: 325,
    },

});


/*

const tableString = "select stop_name, static_time from route_stop_bridge " +
            "inner join stops on route_stop_bridge.stop_id = stops.stop_id " +
            "where(timed_stop and route_id = '" + id + "'); ";
        console.log(tableString);
        CallDatabase(tableString);










for (var i = 0; i < times.length; i++) {
        for (var j = 0; j < stops.length; j++) {

            if (i == 0) { // set i < 0 to disable this portion
                console.log(stops[j]);
                
                values.push([stops[j]]); // add stop names to table
            }
            if (times[i][stops[j]] == null) {
                values[j].push("-- -- --");
            } else {
                values[j].push(times[i][stops[j]]);
            }
            
        }
        
    }




*/
