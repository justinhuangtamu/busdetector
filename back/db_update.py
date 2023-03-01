'''
CSCE 482-933
BusDetector

Script updates database periodically with new data pulled from TAMU Transit API
Persistent connection, script is only executed once and remains running until user terminates
'''

import psycopg2 as ps  # PostgreSQL db library
from pyproj import Transformer  # coordinate transformations
import requests  # HTTP requests library


def update_routes():
    print("Hello")

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
cur.execute("""SELECT """)