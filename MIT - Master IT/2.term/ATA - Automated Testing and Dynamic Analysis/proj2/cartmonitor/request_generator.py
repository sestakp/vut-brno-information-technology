#!/usr/bin/env python3
import sys
import random
def main():
    STATIONS = ['A', 'B', 'C', 'D']
    WEIGHT_LIMIT = 150
    MATERIALS = [
        'leather',
        'chainmail',
        'plate',
        'steel',
        'iron',
        'mithril',
        'adamantine',
        'bronze',
        'copper',
        'silver',
        'gold',
        'titanium',
        'obsidian',
        'dragonhide',
        'scalemail',
        'silk',
        'velvet',
        'suede',
        'wool',
        'linen',
        'fur',
        'hide',
        'bone',
        'ivory',
        'amber',
        'crystal',
        'diamond',
        'emerald',
        'ruby',
        'sapphire',
        'topaz',
        'amethyst',
        'garnet',
        'moonstone',
        'opal',
        'pearl',
        'quartz',
        'turquoise',
        'zircon',
        'agate',
        'jade',
        'malachite',
        'onyx',
        'peridot'
    ]
    numberOfRequests = 4
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        number = int(sys.argv[1])
        numberOfRequests = number

    possibleTimes = list(range(1, numberOfRequests*20))
    with open('requests.csv', 'w') as file:
        while numberOfRequests >= 0:
            requestTime = random.choice(possibleTimes)
            possibleTimes.remove(requestTime)
            startStation = random.choice(STATIONS)
            endStation = random.choice([x for x in STATIONS if x != startStation])
            requestMaterial = random.choice(MATERIALS) + "_" + str(numberOfRequests)
            requestWeight = random.randint(1, WEIGHT_LIMIT)
            file.write('{},{},{},{},{}\n'.format(requestTime, startStation, endStation, requestWeight, requestMaterial))
            numberOfRequests -= 1

if __name__ == "__main__":
    main()

