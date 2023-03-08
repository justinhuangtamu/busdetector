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
        rows.append((bus_id,route_id,lat,long,occupancy,next_stop_id))
    return rows

def main():

    route_ids = ['1','1-4','3','4','5','6','7','8','12','15','22','26','27','31','34','35','36','40','47','48', 'N15']
    bus_data = []
    for id in route_ids:
        bus_data.append(update_buses(id))
    print(bus_data)
    # establish db connection
    # try:
    #     conn = ps.connect("dbname='busdetector' user='postgres' host='us-lvm1.southcentralus.cloudapp.azure.com' password='Bu$det3ctoR2023'")
    # except:
    #     print("Error connecting to the database!")
    #     exit()


    # cur = conn.cursor()
    # # for route_id, name in zip(ids, names):
    # #     cur.execute('''INSERT INTO public.routes 
    # #     VALUES (%s,%s);
    # #     ''',
    # #     (route_id, name))
    # #cur.execute('''SELECT * FROM public.routes ORDER BY route_id ASC; ''')
    # #output = cur.fetchall()
    # #print(output)

    # conn.commit()
    # conn.close()

# Run Program
main()

