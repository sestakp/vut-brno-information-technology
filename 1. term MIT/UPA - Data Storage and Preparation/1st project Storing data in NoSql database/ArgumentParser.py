
import dataUpdater
import argparse
from datetime import datetime


def parseArguments(dbClient):
    argParser = argparse.ArgumentParser(description='Vyhladávač vlakových spojení')

    argParser.add_argument('--update', dest='doUpdate', 
        action='store_const', const=True, default=False, 
        help='Provede aktualizaci záznamů spojů v databázi'
    )

    argParser.add_argument('--cut', dest='cut', 
        action='store_const', const=True, default=False, 
        help='Zobrazí pouze zastávky hledané trasy'
    )

    argParser.add_argument('--less', dest='less', 
        action='store_const', const=True, default=False, 
        help='Zobrazí pouze nástupní a výstupní zastávku daného spoje'
    )

    argParser.add_argument('--start',         metavar='stanice',  help='Počáteční stanice cesty')
    argParser.add_argument('--end',           metavar='stanice',  help='Cílová stanice cesty')
    argParser.add_argument('--time',          metavar='čas',      help='Čas zahájení cesty')
    argParser.add_argument('--findStation',   metavar='regex',    help='Najít stanici v DB pomocí regex')

    args = argParser.parse_args()

    if args.doUpdate:
        dataUpdater.updateData(dbClient)

    if args.findStation is not None:
        print("############### Výsledky pro {} ###############".format(args.findStation))
        for st in dbClient.findStations(args.findStation):
            print(st["_id"])
        print()

    if args.start is None or args.end is None or args.time is None:
        print("Žádné argumenty pro heledání spojení. Není co dělat. --help pro nápovědu")
        exit()

    start = args.start
    end   = args.end

    if (args.time.lower() != "now"):
        try:
            dateObj = datetime.strptime(args.time, '%Y-%m-%dT%H:%M')
        except:
            print("Nesprávný formát času. Očekáván %Y-%m-%dT%H:%M")
            exit()
    else:
        dateObj = datetime.now()
    
    date  = int(dateObj.timestamp())

    return (start, end, date, dateObj, args.cut, args.less)