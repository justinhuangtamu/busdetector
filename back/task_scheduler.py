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
import time
import signal

# global vars
exit = False


# ctrl-c signal handler
def handler(signum, frame):
    global exit
    exit = True
    print("[HANDLER] CTRL-C PRESSED. SAFELY QUITTING!")


# run at startup
signal.signal(signal.SIGINT, handler)
print("[" + time.localtime() + "] Updating routes... ", end="")
db_update_routes.update_routes()
print("DONE\n")

# periodic updates
routeupdate_flag = False  # only update routes once a day
while not exit:
    if (time.localtime().tm_hour > 6 or time.localtime().tm_hour < 2):
        routeupdate_flag = False

        print("[" + time.localtime() + "] Updating bus locations... ", end="")
        db_update_buses.update_buses()
        print("DONE")

        print("[" + time.localtime() + "] Updating bus ETAs... ", end="")
        db_update_eta.update_etas()
        print("DONE")

        time.sleep(15)
    elif (time.localtime().tm_hour < 6 and time.localtime().tm_hour > 2 and routeupdate_flag is not True):
        routeupdate_flag = True

        print("[" + time.localtime() + "] Updating routes... ", end="")
        db_update_routes.update_routes()
        print("DONE\n")
    else:
        time.sleep(1)