'''
CSCE 482-933
BusDetector

Script runs very frequently (almost constantly, depending on Google API limitations)
Updates ETA for all buses and pushes to database
'''

from pyproj import Transformer  # coordinate transformations
import requests  # HTTP requests library

url = "https://maps.googleapis.com/maps/api/distancematrix/json?"
key = "AIzaSyAu6nlbhY5f261wk7EGJRDpQosx844VG5Q"
def get_eta(start_point, end_point):

    a = url + "origins="+start_point+"&destinations="+end_point+"&key="+key
    print(a)
    r = requests.get(url)
    print(r.text)


s = "30.6152035662653%2C-96.3374031387212"
d = "30.613800770866902%2C-96.350859782151"
get_eta(s,d)
