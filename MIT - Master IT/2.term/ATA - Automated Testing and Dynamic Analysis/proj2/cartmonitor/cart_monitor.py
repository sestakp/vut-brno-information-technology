#!/usr/bin/env python3
"""
Dynamic analyser of a cart controller.
"""
CART_WEIGHT_LIMIT = 150
CART_SLOTS = 4
STATIONS = 4
CART_CURRENT_WEIGHT = 0
CART_CURRENT_SLOTS = CART_SLOTS * [False]

COVERAGE = [[False for _ in range(STATIONS)] for _ in range(CART_SLOTS)]
REQUESTS = {}

DEBUG = 0

def posToIndex(pos):
    if(pos == "A"):
        return 0
    elif (pos == "B"):
        return 1
    elif (pos == "C"):
        return 2
    elif (pos == "D"):
        return 3
    else:
        print("ERROR in index")
        return -1

def indexToPos(index):
    if(index == 0):
        return "A"
    elif (index == 1):
        return "B"
    elif (index == 2):
        return "C"
    elif (index == 3):
        return "D"
    else:
        print("ERROR in index")
        return ""

def report_coverage():
    "Coverage reporter"
    # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    # Zde nahradte vypocet/vypis aktualne dosazeneho pokryti
    global COVERAGE, CART_SLOTS, STATIONS

    covered = 0
    for line in COVERAGE:
        for item in line:
            if item:
                covered = covered + 1

    print('CartCoverage %d%%' % ((covered/(CART_SLOTS*STATIONS))*100))

def onmoving(time, pos1, pos2):
    "priklad event-handleru pro udalost moving"
    # Podobnou funkci muzete i nemusite vyuzit, viz onevent().
    # Vsechny parametry jsou typu str; nektere muze byt nutne pretypovat.
    global REQUESTS, CART_CURRENT_SLOTS

    time = int(time)
    if DEBUG:
        print('%d:debug: got moving from %s to %s' % (time, pos1, pos2))

    for key in REQUESTS:

        #monitor property 3
        if REQUESTS[key][1] == pos1 and len([slot for slot in CART_CURRENT_SLOTS if slot == key]) != 0:
            print(f'{time}:error: Cart dont unload {key} on pos {pos1}')

    

def onloading(time, pos, content, w, slot):
    global COVERAGE, CART_CURRENT_WEIGHT, CART_CURRENT_SLOTS, REQUESTS
    pos = posToIndex(pos)
    slot = int(slot)
    if DEBUG:
        print(f'{time}:debug: loading: {indexToPos(pos)}, {content}, {w}, {slot}')
    if(pos != -1):
        COVERAGE[pos][slot] = True
    
    #monitor property 6
    if slot < 0 or slot > (CART_SLOTS - 1):
        print(f'{time}:error: Cart loading on wrong slot')

    #monitor property 5
    if len([request for request in REQUESTS if request[0] == pos]) != 0:
        print(f'{time}:error: Cart loading material {content} which was not requested in station {indexToPos(pos)}')


    #monitor property 1
    #monitor property 6
    if(CART_CURRENT_SLOTS[slot] != False):
        print(f'{time}:error: Cart loading material on occupied slot {slot}')

    CART_CURRENT_SLOTS[slot] = content

    #monitor property 7
    CART_CURRENT_WEIGHT = CART_CURRENT_WEIGHT + int(w)
    if(CART_CURRENT_WEIGHT > CART_WEIGHT_LIMIT):
        print(f'{time}:error: Cart weight limit exceeded')

def onunloading(time, pos, content, w, slot):
    global CART_CURRENT_WEIGHT, CART_CURRENT_SLOTS, REQUESTS
    
    REQUESTS.pop(content, None)
    if DEBUG:
        print(f'{time}:debug: unloading: {pos}, {content}, {w}, {slot}')
    slot = int(slot)

    #monitor property 2
    if(CART_CURRENT_SLOTS[slot] == False):
        print(f'{time}:error: Cart unloading material from free slot {slot}')

    CART_CURRENT_SLOTS[slot] = False    
    CART_CURRENT_WEIGHT = CART_CURRENT_WEIGHT - int(w)

def onrequesting(time, start, end, content, weight):
    global REQUESTS
    REQUESTS[content] = (start,end)
    if DEBUG:
        print(f'{time}:debug: Added into requests {REQUESTS}')

def onstop(time):
    global REQUESTS, CART_CURRENT_SLOTS
    if DEBUG:
        print(f'{time}:debug: Cart stop')

    #monitor property 4 and 9
    if len(REQUESTS.keys()) != 0:
        print(f'{time}:error: Cart not handle all requests. Rest: {REQUESTS}')

    #monitor property 8
    #this work in combination with property 4
    if len([slot for slot in CART_CURRENT_SLOTS if slot != False]) != 0:
        print(f'{time}:error: Cart has material in slots')

def onidle(time, pos):
    if DEBUG:
        print(f'{time}:debug: Cart idle on pos {pos}')

def onevent(event):
    "Event handler. event = [TIME, EVENT_ID, ...]"
    # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    # ZDE IMPLEMENTUJTE MONITORY
    #print(event)


    # vyjmeme identifikaci udalosti z dane n-tice
    event_id = event[1]
    #print(f'EVENT LOADED {event_id}')
    del(event[1])
    # priklad predani ke zpracovani udalosti moving
    if event_id == 'moving':
        # predame n-tici jako jednotlive parametry pri zachovani poradi
        onmoving(*event)
    elif event_id == 'loading':
        onloading(*event)
    elif event_id == 'unloading':
        onunloading(*event)
    elif event_id == 'requesting':
        onrequesting(*event)
    elif event_id == 'stop':
        onstop(*event)
    elif event_id == 'idle':
        onidle(*event)
    #elif event_id == '....':
    #    ...

###########################################################
# Nize netreba menit.

def monitor(reader):
    "Main function"
    for line in reader:
        line = line.strip()
        onevent(line.split())
    report_coverage()

if __name__ == "__main__":
    import sys
    monitor(sys.stdin)
