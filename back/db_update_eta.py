'''
CSCE 482-933
BusDetector

Script runs very frequently (almost constantly, depending on Google API limitations)
Updates ETA for all buses and pushes to database
'''

from pyproj import Transformer  # coordinate transformations
import requests  # HTTP requests library
import psycopg2 as ps  # PostgreSQL db library
from datetime import datetime
from datetime import timedelta
import math


def update_db(json_, k,bid, route_id):
    # establish db connection
    conn = ps.connect("dbname='busdetector' user='postgres' host='us-lvm1.southcentralus.cloudapp.azure.com' password='Bu$det3ctoR2023'")
    cur = conn.cursor()
    #print(json_)
    #a = {'destination_addresses': ['620 Lamar St, College Station, TX 77840, USA', '620 Lamar St, College Station, TX 77840, USA', '782 Ross St, College Station, TX 77840, USA', 'Reed-McDonald Bldg, 575 Ross St, College Station, TX 77840, USA', 'Water Tower, 191 Asbury St, College Station, TX 77840, USA', 'Heep Center, 474 Olsen Blvd, College Station, TX 77845, USA', 'Parking lot, 133-155 John Kimbrough Blvd, College Station, TX 77840, USA', '730 Olsen Blvd, College Station, TX 77840, USA', 'Cox-McFerrin Center For Basketball, 1558 Olsen Blvd, College Station, TX 77840, USA', 'Reed Arena Lp, College Station, TX 77840, USA', 'Parking lot, 133-155 John Kimbrough Blvd, College Station, TX 77840, USA', '3916 Gene Stallings Blvd, College Station, TX 77844, USA', 'Milner Hall, 425 Ross St, College Station, TX 77840, USA', 'Thompson Hall, College Station, TX 77840, USA', '782 Ross St, College Station, TX 77840, USA', 'Rudder Residence Hall, 770 Mosher Ln, College Station, TX 77840, USA', '595 Lewis St, College Station, TX 77840, USA'], 'origin_addresses': ['30 Asbury St, College Station, TX 77840, USA'], 'rows': [{'elements': [{'distance': {'text': '1.8 km', 'value': 1843}, 'duration': {'text': '5 mins', 'value': 324}, 'status': 'OK'}, {'distance': {'text': '1.8 km', 'value': 1843}, 'duration': {'text': '5 mins', 'value': 324}, 'status': 'OK'}, {'distance': {'text': '1.0 km', 'value': 1019}, 'duration': {'text': '3 mins', 'value': 187}, 'status': 'OK'}, {'distance': {'text': '0.5 km', 'value': 517}, 'duration': {'text': '2 mins', 'value': 135}, 'status': 'OK'}, {'distance': {'text': '0.8 km', 'value': 807}, 'duration': {'text': '3 mins', 'value': 197}, 'status': 'OK'}, {'distance': {'text': '1.3 km', 'value': 1334}, 'duration': {'text': '3 mins', 'value': 187}, 'status': 'OK'}, {'distance': {'text': '1.7 km', 'value': 1658}, 'duration': {'text': '4 mins', 'value': 252}, 'status': 'OK'}, {'distance': {'text': '2.0 km', 'value': 2042}, 'duration': {'text': '5 mins', 'value': 276}, 'status': 'OK'}, {'distance': {'text': '2.2 km', 'value': 2249}, 'duration': {'text': '6 mins', 'value': 341}, 'status': 'OK'}, {'distance': {'text': '2.3 km', 'value': 2257}, 'duration': {'text': '6 mins', 'value': 341}, 'status': 'OK'}, {'distance': {'text': '1.8 km', 'value': 1771}, 'duration': {'text': '5 mins', 'value': 287}, 'status': 'OK'}, {'distance': {'text': '1.4 km', 'value': 1395}, 'duration': {'text': '4 mins', 'value': 210}, 'status': 'OK'}, {'distance': {'text': '0.7 km', 'value': 740}, 'duration': {'text': '3 mins', 'value': 180}, 'status': 'OK'}, {'distance': {'text': '0.5 km', 'value': 514}, 'duration': {'text': '2 mins', 'value': 133}, 'status': 'OK'}, {'distance': {'text': '0.9 km', 'value': 908}, 'duration': {'text': '3 mins', 'value': 204}, 'status': 'OK'}, {'distance': {'text': '1.8 km', 'value': 1753}, 'duration': {'text': '5 mins', 'value': 293}, 'status': 'OK'}, {'distance': {'text': '2.4 km', 'value': 2405}, 'duration': {'text': '6 mins', 'value': 377}, 'status': 'OK'}]}], 'status': 'OK'}
    b = json_['rows'][0]['elements']
    counter = 0
    time = 0
    now = datetime.now()
    for i in b:
        #print(i)
        time += i['duration']['value']
        tdisplay = now + timedelta(seconds=time)
        #display = str(tdisplay.time().replace(microsecond=0))
        display = tdisplay.time().replace(microsecond=0).strftime("%I:%M:%S %p")
        #print(display)
        key,stop_id = k[counter]
        query = "insert into route_stop_bridge (key, bus_id, eta_time, stop_id, route_id, raw_time) values ('"+key+bid+"','"+bid+"','"+str(display)+"','"+stop_id+"','"+route_id+"','"+str(time)+"');"
        #query = 'update route_stop_bridge set eta_time = \''+str(time)+'\' where (key = \''+k[counter]+bid+'\') and (eta_time > \''+str(time)+'\' or (COALESCE(eta_time,\'a\') = \'a\'));'
        counter += 1
        #print(query)
        cur.execute(query)
    conn.commit()
    print("db updated")
    conn.close()


url = "https://maps.googleapis.com/maps/api/distancematrix/json?"
key = 'AIzaSyAu6nlbhY5f261wk7EGJRDpQosx844VG5Q'
def get_eta(bus_list, point_list, route_id):
    print(route_id+"|"+str(len(point_list)))
    for j in bus_list:
        s1,s2,bid = j
        o = str(s1) + ', '+str(s2)
        d = ''
        stop_keys = []

        for i in point_list[:25]:
            lat, long, stop_key, stop_id = i
            d += str(lat) + ', '+str(long)+'|'
            stop_keys.append((stop_key,stop_id))

        d = d[:-1]
        params = {
            'key': key,
            'origins': o,
            'destinations': d
        }
        #print(d)
        r = requests.get(url,params)
        #print(r.text)
        update_db(r.json(), stop_keys,bid, route_id)
    print(route_id+" done")

def get_points(route_id):
    # establish db connection
    conn = ps.connect("dbname='busdetector' user='postgres' host='us-lvm1.southcentralus.cloudapp.azure.com' password='Bu$det3ctoR2023'")
    cur = conn.cursor()
    query = 'select latitude, longitude, key, B.stop_id from route_stop_bridge B inner join stops S on B.stop_id = S. stop_id where (B.route_id = \''+str(route_id)+'\') and (S.stop_name != \'Way Point\') and (COALESCE(B.bus_id,\'b\')=\'b\') order by B.rank;'
    cur.execute(query)
    output = cur.fetchall()
    #print(output)
    return output

def get_bus_location(route_id):
    # establish db connection
    conn = ps.connect("dbname='busdetector' user='postgres' host='us-lvm1.southcentralus.cloudapp.azure.com' password='Bu$det3ctoR2023'")
    cur = conn.cursor()
    query = 'select latitude,longitude,bus_id from buses where (route_id = \'' + str(route_id) + '\');'
    cur.execute(query)
    output = cur.fetchall()
    #print(output)
    return output
def clear_eta():
    # establish db connection
    conn = ps.connect("dbname='busdetector' user='postgres' host='us-lvm1.southcentralus.cloudapp.azure.com' password='Bu$det3ctoR2023'")
    cur = conn.cursor()
    #query = 'update route_stop_bridge set eta_time = \'99999\' from route_stop_bridge B inner join stops S on B.stop_id = S.stop_id where (B.route_id = \'' + str(route_id) + '\') and (S.stop_name != \'Way Point\');'
    query = 'delete from route_stop_bridge where not (COALESCE(bus_id,\'c\') = \'c\');'
    cur.execute(query)
    conn.commit()
    print("eta clear")
    conn.close()
def update_etas():
    //route_ids = ['01']
    route_ids = ['01', '01-04','03','03-05','04','05','06','07','08','12','15','22','26','27','31','34','35','36','40','47','47-48','48']
    clear_eta()
    for id in route_ids:
        #print(id)
        points = get_points(id)
        bus_points = get_bus_location(id)
        get_eta(bus_points, points,id)
