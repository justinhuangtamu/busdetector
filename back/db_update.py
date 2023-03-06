'''
CSCE 482-933
BusDetector

Script updates database periodically with new data pulled from TAMU Transit API
Persistent connection, script is only executed once and remains running until user terminates
'''

import psycopg2 as ps  # PostgreSQL db library
from pyproj import Transformer  # coordinate transformations
import requests  # HTTP requests library

routelist = ["01", "01-04", "03", "03-05", "04", "05", "06", "07", "08", "12", "15", "22", "26", "27", "31", "34", "35", "36", "40", "47", "47-48", "48", "N15"]
def update_routes(cur):
    i = 0
    #cur.execute("""TRUNCATE TABLE stops;""")
    for routename in routelist:
        apirequest = 'https://transport.tamu.edu/BusRoutesFeed/api/route/'+routename+'/pattern'
        #print(apirequest)
        r = requests.get(apirequest, auth=('user', 'pass'))
        print(r.status_code)
        for j in r.json():
            transformer = Transformer.from_crs(102100, 4326)
            (lat, long) = transformer.transform(j.get("Longtitude"), j.get("Latitude"))
            input = ""+str(i)+", "
            input += str(long) + ", "
            input += str(lat) + ", "

            input += j.get("Name") + ", "
            #input += str(j.get("Rank")) + ", "


            if (i %100 == 0):
                print(input)
            i += 1

def update_statictimetable():
    print("Hello")

def update_busesonroute():
    print("Hello")

def update_buslocations():
    print("Hello")

def update_dynamictimes():
    print("Hello")


# establish db connection
try:
    conn = ps.connect("dbname='busdetector' user='postgres' host='us-lvm1.southcentralus.cloudapp.azure.com' password='Bu$det3ctoR2023'")
except:
    print("Error connecting to the database!")
    exit()



cur = conn.cursor()
update_routes(cur)
cur.execute("""select column_name, data_type, character_maximum_length, column_default, is_nullable
from INFORMATION_SCHEMA.COLUMNS where table_name = 'stops';""")

print(cur.fetchall())

conn.close()
