'''
CSCE 482-933
BusDetector

Script runs once every night at midnight approximately
Updates route patterns and scheduled timetable for the day
'''

import psycopg2 as ps  # PostgreSQL db library
from pyproj import Transformer  # coordinate transformations
import requests  # HTTP requests library

# Coordniate Conversion
def convert_coords(latitude, longitude):
    transformer = Transformer.from_crs(102100, 4326)
    return transformer.transform(latitude,longitude)


def update_route_pattern(route_id):
    r = requests.get('https://transport.tamu.edu/BusRoutesFeed/api/route/'+str(route_id)+'/pattern', auth=('user', 'pass'))

    for location in r.json():
        lat, long = convert_coords(location.get("Longtitude"), location.get("Latitude"))
        stop = location.get("Stop")
        if stop != None:
            timed_stop = stop.get("IsTimePoint")
            name = stop.get("Name")
            stop_id = stop.get("StopCode")
            #print("UPDATE public.stops ")
            if timed_stop:
                print(type(stop_id))
        else:
            timed_stop = False