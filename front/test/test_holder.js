import dynamic from "./12dynamic.json";
import static_time from "./12dynamic.json";
import bus_on from "./bus-on-campus-button.json";
import bus_off from "./bus-off-campus-buttons.json";






export const testing = true;

function print_green(word) {
    console.log("\x1B[32m");
    console.log(word);
    console.log("\x1B[0m")
}

function print_red(word) {
    console.log("\x1B[31m");
    console.log(word);
    console.log("\x1B[0m")
}


export function TimeTableTest(json) {
    if (testing) {
        require(json == route1)
    }
}