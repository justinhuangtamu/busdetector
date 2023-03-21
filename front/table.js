import React, { Component, useState} from 'react';

import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Text, View, ScrollView, LogBox } from 'react-native';

import { Table, TableWrapper,Col,  Row, Rows } from 'react-native-table-component';
// import { CallDatabase } from './MapClass.js';
LogBox.ignoreLogs(["Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`."]);

const ToggleButton = (unfiltered, stops, filtered) => {
    const [toggleState, setToggleState] = useState(false);

    var rowsU = unfiltered;
    var sumU = (rowsU[0].length -4) * 90;
    var widthU = Array(rowsU[0].length - 1).fill(90);
    widthU.unshift(105);

    var rowsF = filtered;
    var sumF = (rowsF[0].length - 4) * 90;
    var len = rowsF[0].length - 1;
    var widthF = Array(len).fill(90);
    widthF.unshift(105);

    if (sumF < 0) {
        sumF = 0; 
        widthF = Array(len).fill(270/(len));
        widthF.unshift(105);
    }

    const handleToggle = () => {
        setToggleState(!toggleState);
        console.log("Here: " + toggleState);
        
    };
    var headers = ['Location ', "Timed Stops", ''];

    console.log("IGNORE:  Warning: Failed prop type: Invalid prop `textStyle` ... ")
    return (
        // TERMINAL WILL DISPLAY
        //                      Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.
        // 
        // IGNORE THIS WARNING its an error in the <Rows>.js file but the table is building correctly
        <View style={{ paddingTop: 30 }}>
            <TouchableOpacity onPress={handleToggle} >
                {<Text style={table_style.button}>{toggleState ? 'Hide Expired Times' : 'Show Expired Times'}</Text>}
            </TouchableOpacity>
            <ScrollView horizontal={true} >
                
                <Table borderStyle={{borderWidth: 1, borderColor: '#500000'}}>
                    <Row 
                        data={headers} 
                        widthArr={toggleState ? [105, 270, sumU] : [105, 270, sumF]}
                        style={table_style.head}
                        textStyle={table_style.headText} 
                    />
                    <TableWrapper>
                            {/* <Col
                                data={stops}
                                heightArr={[60, 60, 60, 60, 60]}
                                style={table_style.rowSection}
                                textStyle={table_style.text}
                            /> */}
                            <Rows
                                data={toggleState ? rowsU : rowsF}
                                widthArr={toggleState ? widthU : widthF}
                                style={table_style.rowSection}
                                textStyle={table_style.text}
                            />
                    </TableWrapper>
                    
                </Table>
            </ScrollView>
        </View>
    );
};




export function sort_times(times) {
    var stops = ['Commons', 'Asbury Water Tower', 'Reed Arena', 'MSC', 'Commons2'];
    var values = [];
    var filtered = [];
    // console.log("sorting times");

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
    // console.log("Now filtering");
    var filter_hold = [];
    var longest = 0;
    for (var i = 0; i < values.length; i++) {
        var hold = filterTimesBeforeNow(values[i]);
        if (hold.length >= longest) {
            longest = hold.length;
        }
        hold.unshift(stops[i]);
        filter_hold.push(hold);
       
        
    }
    console.log(longest);
    filtered = makeSubarraysSameLength(filter_hold, longest + 1, "-- -- --");
    return create_table(values, stops, filtered);
}


export function create_table(unfiltered, stops, filtered) {
    return (
        ToggleButton(unfiltered, stops, filtered)
    )
}




//Filter times
function filterTimesBeforeNow(timesArray) {
    // console.log("filtering times");
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
}


function makeSubarraysSameLength(arr, length, fillValue) {
    for (let i = 0; i < arr.length; i++) {
        while (arr[i].length < length) {
            arr[i].push(fillValue);
        }
    }
    return arr;
}





const table_style = StyleSheet.create({
    container: { padding: 4, paddingTop: 30, },
    rowSection: { height: 60, backgroundColor: '#E7E6E1' },
    head: { height: 44, backgroundColor: '#500' },
    headText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white' },
    text: { margin: 6, fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
    button: {backgroundColor: '#E7E6E1',  color: '#500000', fontWeight: 'bold',  width: 175, padding: 12,},
});




/*


export function table_view() {
    
    return (
    <View>
        {sort_times(times)}
    </View>
    );
    
}



const tableString = "select stop_name, static_time from route_stop_bridge " +
            "inner join stops on route_stop_bridge.stop_id = stops.stop_id " +
            "where(timed_stop and route_id = '" + id + "'); ";
        console.log(tableString);
        CallDatabase(tableString);


*/