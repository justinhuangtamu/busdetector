'''
CSCE 482-933
BusDetector

Script runs very frequently (almost constantly)
Updates bus location and passenger load and pushes to database
'''

import psycopg2 as ps  # PostgreSQL db library
from pyproj import Transformer  # coordinate transformations
import requests  # HTTP requests library

# Coordniate Conversion
def convert_coords(latitude, longitude):
    transformer = Transformer.from_crs(102100, 4326)
    return transformer.transform(latitude,longitude)

def get_bus_data(route_ids):
    bus_data = []
    for route_id in route_ids:
        r = requests.get('https://transport.tamu.edu/BusRoutesFeed/api/route/'+str(route_id) +'/buses/mentor', auth=('user', 'pass'))
        for bus in r.json():
            bus_id = bus.get("Name")
            lat, long = convert_coords(bus.get("GPS").get("Long"), bus.get("GPS").get("Lat"))
            occupancy = bus.get("APC").get("TotalPassenger")
            next_stops = bus.get("NextStops")
            if next_stops != None:
                next_stop_name = next_stops[0].get("Name")
            else:
                next_stop_name = ''
            bus_data.append((bus_id,route_id,lat,long,occupancy,next_stop_name))
    return bus_data
        

def update_buses():

    route_ids = ['01','01-04','03','03-05','04','05','06','07','08','12','15','22','26','27','31','34','35','36','40','47','47-48','48', 'N15']
    bus_data = get_bus_data(route_ids)
    # establish db connection
    conn = ps.connect("dbname='busdetector' user='postgres' host='us-lvm1.southcentralus.cloudapp.azure.com' password='Bu$det3ctoR2023'")


    cur = conn.cursor()
    # Remove all buses from the table so only active buses are present
    cur.execute('''DELETE FROM public.buses;''')

    # Insert all buses into table
    sql = '''INSERT INTO public.buses VALUES (%s,%s,%s,%s,%s,%s);'''
    cur.executemany(sql, bus_data)
    conn.commit()
    conn.close()

# Run Program
# update_buses()  # DEBUG purposes, leave commented out when not testing

