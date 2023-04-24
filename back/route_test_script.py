import psycopg2 as ps  # PostgreSQL db library
from db_update_routes import get_route_pattern
from db_update_routes import get_static_timetable

def query_our_timetable():
    conn = ps.connect("dbname='busdetector' user='postgres' host='us-lvm1.southcentralus.cloudapp.azure.com' password='Bu$det3ctoR2023'")
    cur = conn.cursor()
    cur.execute('''SELECT index, key, route_id, stop_name, static_time from static_table''')
    our_timeTable = cur.fetchall()
    conn.commit()
    conn.close()
    return our_timeTable

def query_our_route_pattern():
    conn = ps.connect("dbname='busdetector' user='postgres' host='us-lvm1.southcentralus.cloudapp.azure.com' password='Bu$det3ctoR2023'")
    cur = conn.cursor()
    cur.execute('''SELECT s.stop_id, stop_name, latitude, longitude, timed_stop from stops s inner join route_stop_bridge b on s.stop_id = b.stop_id order by b.route_id, b.rank''')
    our_stops = cur.fetchall()
    cur.execute('''SELECT key, route_id, stop_id, rank from route_stop_bridge order by route_id, rank''')
    our_route_pattern = cur.fetchall()
    conn.commit()
    conn.close()
    return (our_stops, our_route_pattern)


def compare_timetable():
    route_ids = ['01','01-04','03','03-05','04','05','06','07','08','12','15','22','26','27','31','34','35','36','40','47','47-48','48', 'N15']
    live_data = get_static_timetable(route_ids)
    
    our_data = query_our_timetable()
    for index in range(len(live_data)):
        if live_data[index] != our_data[index]:
            print("Time Table Data Doesn't Match")
            print(live_data[index])
            print("_____________________")
            print(our_data[index])
            return False
    return True


def compare_stops_pattern():
    route_ids = ['01','01-04','03','03-05','04','05','06','07','08','12','15','22','26','27','31','34','35','36','40','47','47-48','48', 'N15']
    live_stops, live_bridge = get_route_pattern(route_ids)
    
    our_stops, our_bridge = query_our_route_pattern()
    for index in range(len(live_stops)):
        print(live_stops[index])
        print("_____________________")
        print(our_stops[index])
        if live_stops[index] != our_stops[index]:
            print("Stop Data Doesn't Match")
            
            return False
    for index in range(len(live_bridge)):
        print(live_bridge[index])
        print("_____________________")
        print(our_bridge[index])
        if live_bridge[index] != our_bridge[index]:
            print("Stop Data Doesn't Match")
            
            return False
    return True

passed_times = compare_timetable()
if passed_times:
    print("All times match live data")
else:
    print("Time values don't match live data")

passed_stops_pattern = compare_stops_pattern()
if passed_stops_pattern:
    print("All stop / pattern data matches live data")
else:
    print("Stop / pattern data don't match live data")