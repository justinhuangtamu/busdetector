import React, { Component} from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import { Table, TableWrapper,Col,  Row, Rows } from 'react-native-table-component';
// import { CallDatabase } from './MapClass.js';



export function sort_times(times) {
    var stops = ['Commons', 'Asbury Water Tower', 'Reed Arena', 'MSC', 'Commons2'];
    var values = [];
    var widthArr = [100];
    var sum = 0;
    console.log("in function?");
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
        sum += 90;
        widthArr.push(90);
    }
    //console.log(values);
    return create_table(values, stops, widthArr);
}


export function create_table(rows, stops, width, sum) {
    flex2 = rows[0].length;
    //console.log(rows);
    return (
        <View style={{paddingTop: 30}}>
        <ScrollView horizontal={true} >
            <Table borderStyle={{borderWidth: 1, borderColor: '#500000'}}>
                <Row 
                    data={['Location ', "Timed Stops", '']} 
                    widthArr={[105, 265, sum]}
                    style={table_style.head}
                    textStyle={table_style.headText} 
                />
                <TableWrapper>
                        <Col
                            data={stops}
                            heightArr={[60, 60, 60, 60, 60]}
                            style={table_style.rowSection}
                            textStyle={table_style.text}
                        />
                        <Rows
                            data={rows}
                            widthArr={width}
                            style={table_style.rowSection}
                            textStyle={table_style.text}
                        />
                </TableWrapper>
                
            </Table>
        </ScrollView>
        </View>
    )
   
}


const table_style = StyleSheet.create({
    container: { padding: 4, paddingTop: 30, },
    rowSection: { height: 60, backgroundColor: '#E7E6E1' },
    head: { height: 44, backgroundColor: '#500' },
    headText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white' },
    text: { margin: 6, fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
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