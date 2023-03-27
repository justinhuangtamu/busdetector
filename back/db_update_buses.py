'''
CSCE 482-933
BusDetector

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
            next_stop_id = bus.get("NextStops")[0].get("StopCode")
            if next_stop_id == 3599:
                next_stop_id = 3500
            bus_data.append((bus_id,route_id,lat,long,occupancy,next_stop_id))
    return bus_data
        

def main():

    route_ids = ['01','01-04','03','03-05','04','05','06','07','08','12','15','22','26','27','31','34','35','36','40','47','47-48','48', 'N15']
    bus_data = get_bus_data(route_ids)
    # establish db connection
    try:
        conn = ps.connect("dbname='busdetector' user='postgres' host='us-lvm1.southcentralus.cloudapp.azure.com' password='Bu$det3ctoR2023'")
    except:
        print("Error connecting to the database!")
        exit()


    cur = conn.cursor()
    cur.execute('''DELETE FROM public.buses;''')
    sql = '''INSERT INTO public.buses VALUES (%s,%s,%s,%s,%s,%s);'''
    cur.executemany(sql, bus_data)

    conn.commit()
    conn.close()

# Run Program
main()

