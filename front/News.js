
import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';

import { WebView } from 'react-native-webview';
import RenderHtml from 'react-native-render-html';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';

//import {AsyncStorage} from 

export const theme = StyleSheet.create({
    base: {
        fontFamily: 'Cochin',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    scroll: {
        marginHorizontal: 20,
    },
    view: {
        marginBottom: 10.
    },
    categories: {
        fontSize: 8,
        color: "grey",
        marginTop: 5,
    },
});

function get_Announcements2(news) {
    
    hold = news["Items"];
    var announcements = [];
    announcements.push(<View key={0} style={theme.title}></View>);
    console.log(hold);
    for (var i = 0; i < hold.length; i++) {
        var summary = hold[i]["Summary"]["Text"];

        
        announcements.push(
            <View style={theme.view} key={i + 1}>
                <Text style={theme.title}>{hold[i]["Title"]["Text"]}</Text>
                <Text >{fix_summary(summary)}</Text>
            </View>
        )
    }
    if (hold.length == 0) {
        announcements.push(<View ><Text style={theme.title}>No Current Announcements</Text></View>)
    }
    return announcements;
}


function fix_summary(sum) {
    
    if (sum.includes('</picture>')) {
        var hold = sum.match("img src=\"(.*)\" alt=");
        var pic = hold[1]; 
        hold = sum.split("</picture>");
        hold = hold[1].split("<br />");
        var arr = [];
        arr.push(<Image style={{ width:300, height:300 }} source={{uri: pic}} key={1}/>)
        
        for (var i = 0; i < hold.length; i++) {
            var line = hold[i].replace('&#160;', '') + '\n';
            arr.push(line.trimStart());
        }
        return arr;
    } else {
        return <Text>{sum}</Text>
    }
}




export function Trial() {
    const [news, setNews] = useState([]);
    useEffect( () => {
        const newsArr = async () => {
            try {
                // this still has to be set to the IP using ipConfig
                const fetchString = "https://transport.tamu.edu/BusRoutesFeed/api/Announcements";
                const response = await fetch(fetchString,
                    {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        }
                    });

                var json = null;
                if (response.status === 200) {
                    json = await response.json();
                    
                   // console.log(json);                       // UNCOMMENT TO LOG JSON RESPONSES
                    // waypoints = json;
                } else {
                    console.log(response.status);
                }

                return json;
            } catch (err) {
                console.log(err)
            }
        };
        newsArr().then(setNews);
    }, []);
    console.log(news);
    if (news.length == 0) {
        console.log("News is Undefined");
        return <View style={theme.title}><Text >No Current Announcements</Text></View>;
       
    } else {
        //console.log(news);
        return get_Announcements2(news);
    }
    
}

export function get_Announcements() {
    //console.log(Trial());
    return Trial();   
}