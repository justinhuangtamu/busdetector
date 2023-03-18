from pyproj import Transformer  # coordinate transformations
import requests  # HTTP requests library
import psycopg2 as ps  # PostgreSQL db library

url = "https://maps.googleapis.com/maps/api/distancematrix/json?"
key = 'AIzaSyAu6nlbhY5f261wk7EGJRDpQosx844VG5Q'
def get_eta(point_list):
    s1,s2 = point_list[0]
    o = str(s1) + ', '+str(s2)
    d = ''
    for i in point_list[1:]:
        lat, long = i
        d += str(lat) + ', '+str(long)+'|'

    d = d[:-1]
    params = {
        'key': key,
        'origins': o,
        'destinations': d
    }
    #a = url + "origins="+start_point+"&destinations="+end_point+"&key="+key
    print(d)
    r = requests.get(url,params)
    print(r.text)

def get_points(route_id):
    # establish db connection
    try:
        conn = ps.connect("dbname='busdetector' user='postgres' host='us-lvm1.southcentralus.cloudapp.azure.com' password='Bu$det3ctoR2023'")
    except:
        print("Error connecting to the database!")
        exit()
    cur = conn.cursor()
    query = 'select latitude, longitude from route_stop_bridge B inner join stops S on B.stop_id = S. stop_id where (B.route_id = \''+str(route_id)+'\');'
    cur.execute(query)
    output = cur.fetchall()
    print(output)
    return output



s = '30.6152035662653,-96.3374031387212'
d = '30.613800770866902,-96.350859782151'
#get_eta(s,d)
route_ids = ['01']
#route_ids = ['01', '01-04','03','03-05','04','05','06','07','08','12','15','22','26','27','31','34','35','36','40','47','47-48','48', 'N15']
for id in route_ids:
    #print(id)
    points = get_points(id)
get_eta(points)
