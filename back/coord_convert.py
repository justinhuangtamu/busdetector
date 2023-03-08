from pyproj import Transformer
import requests
import json
r = requests.get('https://transport.tamu.edu/BusRoutesFeed/api/route/35/pattern', auth=('user', 'pass'))
print(r.json()[0])
name = []
longitude = []
latitude = []
timed_stop = []
waypoint = []
info = []
for j in r.json():
    #name.append()
    longitude.append(j.get("Latitude"))
    latitude.append(j.get("Longtitude"))
    stop = j.get("Stop")
    if stop != None:
        timed_stop.append(stop.get("IsTimePoint"))
        waypoint.append(False)
        name.append(stop.get("Name"))
        info.append(stop)
    else:
        timed_stop.append(False)
        waypoint.append(True)

for i in range(len(latitude)):
    transformer = Transformer.from_crs(102100, 4326)
    coords = transformer.transform(latitude[i],longitude[i])

print(info)


def convert_coords(latitude, longitude):
    transformer = Transformer.from_crs(102100, 4326)
    return transformer.transform(latitude[i],longitude[i])

#{'Key': 'aaf1e6cb-f631-4fb6-9d59-d6da20194244', 'Name': 'Way Point', 'Description': '', 
# 'Rank': 2, 'Longtitude': -10724277.987021046, 'Latitude': 3582840.2785187126, 
# 'PointTypeCode': 0, 'RouteHeaderRank': -1}

#{'Key': '2221d07e-578d-42f8-89f3-7e7801935284', 'Name': 'Trigon', 'Description': '', 
# 'Rank': 0, 'Longtitude': -10724376.817715846, 'Latitude': 3582748.339036206,
# 'PointTypeCode': 1, 'Stop': {'Key': '98705eea-7183-484e-9357-ea1c9369618b', 
# 'Rank': 0, 'Name': 'Trigon', 'StopCode': '1201', 'IsTimePoint': True}, 'RouteHeaderRank': 0}


#{'Key': 'd4a01350-9fae-4178-a81f-d68a66ce0014', 'Name': 'MSC'