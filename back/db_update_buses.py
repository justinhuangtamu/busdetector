import psycopg2 as ps  # PostgreSQL db library
from pyproj import Transformer  # coordinate transformations
import requests  # HTTP requests library

# Coordniate Conversion
def convert_coords(latitude, longitude):
    transformer = Transformer.from_crs(102100, 4326)
    return transformer.transform(latitude,longitude)

def update_buses(route_id):
    r = requests.get('https://transport.tamu.edu/BusRoutesFeed/api/route/'+str(route_id) +'/buses/mentor', auth=('user', 'pass'))

    for bus in r.json():
        bus_id = bus.get("Name")
        lat, long = convert_coords(bus.get("GPS").get("Long"), bus.get("GPS").get("Lat"))
        occupancy = bus.get("APC").get("TotalPassenger")
        next_stop_id = bus.get("NextStops")[0].get("StopCode")
        print(bus_id,route_id,lat,long,occupancy,next_stop_id)