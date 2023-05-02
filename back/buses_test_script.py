import psycopg2 as ps  # PostgreSQL db library
from db_update_buses import get_bus_data
import time

def query_our_bus_data():
    conn = ps.connect("dbname='busdetector' user='postgres' host='us-lvm1.southcentralus.cloudapp.azure.com' password='Bu$det3ctoR2023'")
    cur = conn.cursor()
    cur.execute('''SELECT bus_id,route_id,occupancy,next_stop FROM public.buses order by route_id;''')
    our_data = cur.fetchall()
    conn.commit()
    conn.close()
    return our_data


def compare_bus_data():
    route_ids = ['01','01-04','03','03-05','04','05','06','07','08','12','15','22','26','27','31','34','35','36','40','47','47-48','48', 'N15']
    live_data = get_bus_data(route_ids)
    
    our_data = query_our_bus_data()
    for bus_index in range(len(our_data)):
        live_row = live_data[bus_index][:2] + live_data[bus_index][4:]
        print(live_row)
        print("---------------------------------------------------------------------------------")
        print(our_data[bus_index], "\n")
        if live_row != our_data[bus_index]:
            print("Bus Data Doesn't Match")
            return False
    return True
    
passed = False
while True:
    passed = compare_bus_data()
    if passed:
        print("Passed Tests - Bus Data Matches")
        exit()