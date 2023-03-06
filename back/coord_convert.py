from pyproj import Transformer
import requests
import json
r = requests.get('https://transport.tamu.edu/BusRoutesFeed/api/route/12/pattern', auth=('user', 'pass'))
print(r.status_code)
longitude = []
latitude = []
for j in r.json():
    longitude.append(j.get("Latitude"))
    latitude.append(j.get("Longtitude"))

for i in range(len(latitude)):
    transformer = Transformer.from_crs(102100, 4326)
    coords = transformer.transform(latitude[i],longitude[i])
    print(coords)