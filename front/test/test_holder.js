import dynamic from "./1dynamic.json";
import static_time from "./1static.json";
import bus_on from "./bus-on-campus-button.json";
import bus_off from "./bus-off-campus-buttons.json";






const testing = false;

function print_green(title, word) {
    console.log("\x1B[32m" + String(title) + "\x1B[0m" + String(word));
}

function print_red(title, word) {
    console.log("\x1B[31m" + String(title) + "\x1B[0m" + String(word));
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