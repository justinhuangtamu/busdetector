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
routeupdate_flag = False  # only update routes once a day

# ctrl-c signal handler
def handler(signum, frame):
    global exit
    exit = True
    print("\n[HANDLER] CTRL-C PRESSED. SAFELY QUITTING!")


# run at startup
print("BusDetector Backend Task Scheduler")
print("CSCE 482-933 Senior Capstone Design")
print("Spring 2023")
signal.signal(signal.SIGINT, handler)
print("\n[" + time.ctime() + "] Updating routes... ", end="", flush=True)
db_update_routes.update_routes()
print("DONE\n")

# periodic updates
while not exit:
    if (time.localtime().tm_hour > 6 or time.localtime().tm_hour < 2):
        routeupdate_flag = False

        print("[" + time.ctime() + "] Updating bus locations... ", end="", flush=True)
        db_update_buses.update_buses()
        print("DONE")

        print("[" + time.ctime() + "] Updating bus ETAs... ", end="", flush=True)
        db_update_eta.update_etas()
        print("DONE")

        time.sleep(15)
    elif (time.localtime().tm_hour < 6 and time.localtime().tm_hour > 2 and routeupdate_flag is not True):
        routeupdate_flag = True

        print("\n[" + time.ctime() + "] Updating routes... ", end="", flush=True)
        db_update_routes.update_routes()
        print("DONE\n")
    else:
        time.sleep(1)