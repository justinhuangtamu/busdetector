import psycopg2 as ps  # PostgreSQL db library
from pyproj import Transformer  # coordinate transformations
import requests  # HTTP requests library

# Coordniate Conversion
def convert_coords(latitude, longitude):
    transformer = Transformer.from_crs(102100, 4326)
    return transformer.transform(latitude,longitude)


def get_route_pattern(route_ids):
    route_data = []
    route_bridge = []
    visited_stops = {}
    #bridge_key = 0
    for route_id in route_ids:
        r = requests.get('https://transport.tamu.edu/BusRoutesFeed/api/route/'+str(route_id)+'/pattern', auth=('user', 'pass'))
        for location in r.json():
            bridge_key = str(location.get("Key"))
            lat, long = convert_coords(location.get("Longtitude"), location.get("Latitude"))
            stop = location.get("Stop")
            rank = location.get("Rank")
            # Handles two erroneous points in the Bus API
            if bridge_key == "29e91b30-4fe2-436c-bec0-dd8f02c56a07" or bridge_key == "2ffc52fe-c589-463e-b3a5-e6e9a55c8b22":
                continue
            if stop != None:
                stop_name = stop.get("Name")
                stop_id = stop.get("StopCode")
                if visited_stops.get(stop_id) == None:
                    visited_stops[stop_id] = True
                    timed_stop = stop.get("IsTimePoint")
                    route_data.append((stop_id,stop_name, lat, long, timed_stop))
                route_bridge.append((bridge_key,route_id, stop_id,rank))
            else:
                timed_stop = False
                stop_name = 'Way Point'
                stop_id = location.get("Key")
                route_data.append((stop_id,stop_name, lat, long, timed_stop))
                route_bridge.append((bridge_key, route_id, stop_id,rank))
    return (route_data, route_bridge)

def get_static_timetable(route_ids):
    time_index = 1
    static_times = []
    for route_id in route_ids:
        r = requests.get('https://transport.tamu.edu/BusRoutesFeed/api/Route/'+ str(route_id) +'/TimeTable', auth=('user', 'pass'))
        for group in r.json():
            for key, time in group.items():
                if key == ' ' or time == "No Service Is Scheduled For This Date":
                    continue
                name = key[36:]
                key = key[:36]
                static_times.append((time_index, key, str(route_id), name, time))
                time_index += 1
    return static_times


def update_routes():

    route_ids = ["01","01-04","03","03-05","04","05","06","07","08","12","15","22","26","27","31","34","35","36","40","47","47-48","48", "N15"]
    route_names = ['Bonfire', 'Nights & Weekends', 'Yell Practice', 'Nights & Weekends', 'Gig Em', 'Bush School', '12th Man', 'Airport', 'Howdy', 
                   'Reveille', 'Old Army', 'Excel', 'Rudder', 'Ring Dance', 'E-Walk', 'Fish Camp', 'Hullabaloo', 'Matthew Gaines', 'Century Tree', 
                   'RELLIS', 'Nights & Weekends', 'RELLIS Circulator', 'Thursday & Friday']
    route_pattern, route_bridge = get_route_pattern(route_ids)

    static_times = get_static_timetable(route_ids)
    # establish db connection
    try:
        conn = ps.connect("dbname='busdetector' user='postgres' host='us-lvm1.southcentralus.cloudapp.azure.com' password='Bu$det3ctoR2023'")
    except:
        print("Error connecting to the database!")
        exit()


    cur = conn.cursor()

    # Clear All Tables to meet constraints
    cur.execute('''DELETE FROM public.static_table;''')
    cur.execute('''DELETE FROM public.route_stop_bridge;''')
    cur.execute('''DELETE FROM public.buses;''')
    cur.execute('''DELETE FROM public.routes;''')
    cur.execute('''DELETE FROM public.stops;''')
    
    

    # Update Routes Tables
    for id, name in zip(route_ids, route_names):
        cur.execute('''INSERT INTO public.routes 
            VALUES (%s,%s);
            ''',
            (id, name))

    # Update Stops Table
    sql = '''INSERT INTO public.stops VALUES (%s,%s,%s,%s,%s)'''
    cur.executemany(sql, route_pattern)
    
    # Update Bridge Table
    bridge_sql = '''INSERT INTO public.route_stop_bridge (key, route_id, stop_id, rank) VALUES (%s,%s,%s,%s)'''
    cur.executemany(bridge_sql, route_bridge)

    # Update Static Time Table Values in Bridge Table
    static_time_sql = '''INSERT INTO public.static_table (index, key, route_id, stop_name, static_time) VALUES (%s,%s,%s,%s,%s)'''
    cur.executemany(static_time_sql, static_times)
    conn.commit()
    conn.close()
    
# Run Program
# update_routes()