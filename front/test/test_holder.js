import dynamic from "./1dynamic.json";
import static_time from "./1static.json";
import route1 from "./route1_waypoints_unit.json";
import stops1 from "./route1_stops_unit.json";
import suggestion from "./route7suggest.json";

/* UNIT TEST

import suggestion from "./route7suggest.json";
import dynamic_stops from "./1dynamic.json";
import static_stops from "./1static.json";
import announcements from "./announcements.json"
import static_times from "./route1.json"
import route1 from "./route1_waypoints_unit.json";
import stops1 from "./route1_stops_unit.json";
import bus40 from "./route40_bus_location_unit.json"
*/




export const testing = false;

function print_green(title, word) {
    console.log("\x1B[32m" + String(title) + "\x1B[0m" + String(word));
}

function print_red(title, word) {
    console.log("\x1B[31m" + String(title) + "\x1B[0m" + String(word));
}

export function stopsTest(givenStops) {
    if(testing) {
        let test = givenStops.length === stops1.length; 

        if(givenStops != undefined) {
            for(let i = 0; i < givenStops.length; i++) {
                givenLat = givenStops[i].latitude;
                givenLong = givenStops[i].longitude;
    
                lat1 = stops1[i].latitude;
                long1 = stops1[i].longitude;
    
                if((givenLat != lat1) && (givenLong != long1)) {
                    test = false;
                    break;
                }
            }
        }
        
        
        if(test) {
            print_green("stopsTest: " , "the given stops matches route 1");
        }
        else {
            print_red("stopsTest: " , "the given stops do not matches route 1");
        }
    }
}

export function routeTest(given_route) {
    if(testing) {

        let test = given_route.length === route1.length;

        if(given_route != undefined) {
            for(let i = 0; i < given_route.length; i++) {
                givenLat = given_route[i].latitude;
                givenLat = given_route[i].longitude;
    
                lat1 = route1[i].latitude;
                long1 = route1[i].longitude;
    
                if((givenLat != lat1) && (givenLat != long1)) {
                    test = false;
                    break;
                }
            }
        }

        
        if(test) {
            print_green("routeTest: " , "the given route matches route 1");
        }
        else {
            print_red("routeTest: ", "the given route does not match route 1");
        }
    }
}

export function StopsTableTest(stops, eta) {
    if (testing) {
        var tests = eta ? static_time : dynamic;
        var test_stops = [];


        for (var i = 0; i < tests.length; i++) {
            test_stops.push(tests[i]["name"]);
        }
        stops.sort();
        test_stops.sort();

        var test = stops.length === test_stops.length && (stops.every((element, index) => element === test_stops[index]))
       
        
        if (test) {
            print_green("TimeTableTest:", " The current stops are being displayed in the table");
        } else {
            print_red("TimeTableTest:"," The stops currently in the table do not match with Route1 test stops");
        }
    }
}


export function TimeTableTest(times) {
    if (testing) {
        var test = true;
        for (var i = 0; i < times.length; i++) {
            test = test && (times[i][1] != "-- -- --")
        }
        if (test) {
            print_green("TimeTableTest:", " Times are being displayed in the table");
        } else {
            print_red("TimeTableTest:", " Times displayed in tabel are currently null");
        }
    }
}
export function TestRouteSuggest() {
    
    suggestRoutes = async () => {
        // Write 
        var des2 = { "latitude": 30.589648929108684, "longitude": -96.35869438626334 }; 
        var des1 = { "latitude": 30.61041537072084, "longitude": -96.3416973860094};

        var limit = 5;
        

        var queryString = "select stop_name, MIN(" + "distance(s.latitude, s.longitude, " + des1["latitude"] + ',' +
            des1["longitude"] + ")) as min_distance from stops s where stop_name != 'Way Point'" +
            " group by stop_name order by min_distance asc limit " + limit + ";";
        const start = await CallDatabase(queryString);
        //console.log(queryString);


        queryString = "select stop_name, MIN(" + "distance(s.latitude, s.longitude, " + des2["latitude"] + ',' +
            des2["longitude"] + ")) as min_distance from stops s where stop_name != 'Way Point'" +
            " group by stop_name order by min_distance asc limit " + limit + ";";
        //console.log(queryString);
        const end = await CallDatabase(queryString);


        var list1 = "(";
        var list2 = "(";
        var list3 = "(";
        for (var i = 0; i < limit; i++) {
            var s = "'" + start[i]["stop_name"] + "'";
            var e = "'" + end[i]["stop_name"] + "'";


            list1 += s;
            list2 += e;
            list3 += s + ", " + e;
            if (i != (limit - 1)) {
                list1 += ",";
                list2 += ",";
                list3 += ",";
            }
        }
        list1 += ")";
        list2 += ")";
        list3 += ")";
        

        queryString = "select route_id, route_name, stops " +
            "from( " +
            "select r.route_id, route_name, STRING_AGG(distinct s.stop_name, ', ') as stops, " +
            "SUM(CASE WHEN stop_name IN " + list3 + " THEN 1 ELSE 0 END) AS count3, " +
            "SUM(CASE WHEN stop_name IN " + list1 + " THEN 1 ELSE 0 END) AS count1, " +
            "SUM(CASE WHEN stop_name IN " + list2 + " THEN 1 ELSE 0 END) AS count2  " +
            "from route_stop_bridge b " +
            "join routes r on r.route_id = b.route_id " +
            "join stops s on b.stop_id = s.stop_id " +
            "where s.stop_name in " + list3 + " " +
            "group by r.route_id " +
            ") temp " +
            "where(count1 > 0 and count2 > 0 and count3 > 1);";





        const res = await CallDatabase(queryString);

        var test = true;
        
        for (var i = 0; i < res.length; i++) {
            test = test && (res[i]["route_id"] == suggestion[i]["route_id"]);
            test = test && (res[i]["route_name"] == suggestion[i]["route_name"]);
            test = test && (res[i]["stops"] == suggestion[i]["stops"]);
        }
        if (test) {
            print_green("Route Suggest:", " routes suggestion feature is functioning as expected");
        } else {
            print_red("Route Suggest:", " Error in route suggestion. Check '/' bug and coordinate locations");
        }
        return "Finished";
    }

    if (testing) {
        suggestRoutes();
    }
}

export function AnnouncementsTest(news) {
    var test = news.length > 0;
    var test2 = news.length == 0;
    if (test) {
        print_green("Announcements:", " all announcements are being recieved");
    } else if (test2) {
        print_green("Announcementes:", " There are no announcements,  test announcements being displayed");
    } else {
        print_green("Announcementes:", " Announcements are not being retrieved");
    }
    return (testing && test2);
}

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
        } 

        return json;
    } catch (err) {
        console.log(err)
    }

}

