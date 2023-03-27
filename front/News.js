
import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, View, Image } from 'react-native';
//import news_ex from './temp/announcements.json';


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
    info: {
        marginTop: 20,
        marginHorizontal: 20,
    },
    infoText:{
        fontSize: 16,
        marginBottom: 20,
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
        announcements.push(<View key={1}><Text style={theme.title}>No Current Announcements</Text></View>)
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



export function Information() {
    return (
        <View style={theme.info}>

            <Text style={theme.title}>
                Static VS ETA Times</Text>
            <Text style={theme.infoText }>
                Static times are scheduled times provided by A&M. These are times that the bus will wait for at each stop. 
                Some stops do not have a scheduled time.
            </Text>
            <Text style={theme.infoText}>
                ETA Times are create using google maps and are intended to be more accurate stop times. 
                These times are calculated every minute to ensure they are updated. 
                The ETA table also provides predicted times for stops along each bus route that are not scheduled stops. 
            </Text>
            <Text style={theme.title}>
                Credits
            </Text>
            <Text style={theme.infoText}>
            Icons made by Freepik from www.flaticon.com
            </Text>
        </View>
    );
}
