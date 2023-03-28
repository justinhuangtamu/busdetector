'''
CSCE 482-933
BusDetector

Script runs different backend tasks in a synchronized manner to prevent collisions
'''


# import local files
# NO MAIN FUNCTION IN THESE FILES
import db_update_buses
import db_update_eta
import db_update_routes

# import libraries
from datetime import datetime
import time
import schedule


# run at startup
db_update_routes.update_routes()

schedule.every(15).seconds.do(db_update_buses.update_buses())
schedule.every(15).seconds.do(db_update_eta.update_etas())

while True:
    print("Hello")