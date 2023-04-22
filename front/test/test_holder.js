import dynamic from "./1dynamic.json";
import static_time from "./1static.json";
import bus_on from "./bus-on-campus-button.json";
import bus_off from "./bus-off-campus-buttons.json";
import route1 from "./route1_waypoints_unit.json";
import stops1 from "./route1_stops_unit.json";






const testing = true;

function print_green(title, word) {
    console.log("\x1B[32m" + String(title) + "\x1B[0m" + String(word));
}

function print_red(title, word) {
    console.log("\x1B[31m" + String(title) + "\x1B[0m" + String(word));
}

export function stopsTest(givenStops) {
    if(testing) {
        let test = givenStops.length === stops1.length; //&& (stops1.every((element, index) => element === givenStops[index]));

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

export function TimeTableTest(stops, eta) {
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
            print_green("TimeTableTest:", " The corrent stops are being displayed in the table");
        } else {
            print_red("TimeTableTest:"," The stops currently in the table do not match with Route1 test stops");
        }
    }
}