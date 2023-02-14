from datetime import datetime

def calculateDeltaInBitArray(startTimeStamp, endTimeStamp, dateParam, type=""):
    startDate = datetime.fromtimestamp(startTimeStamp)
    endDate = datetime.fromtimestamp(endTimeStamp)
    delta = endDate - startDate
    delta = delta.days

    
    deltaFromStart = dateParam - startDate
    deltaFromStart = deltaFromStart.days


    if deltaFromStart < 0 or deltaFromStart > delta:
        return -1;

    return deltaFromStart


def printTimeTable(train, start, end, cut, less):
    print("################### TIMETABLE ###################")
    print("Train: "+train["_id"]["trainId"])
    i = 1

        
    startVisited = False
    for station in train["Stations"]:
        
        if station["_id"] == start:
            startVisited = True

        if startVisited or not cut:
            if (station["_id"] == start or station["_id"] == end) or not less:
                print("{:03d}. {:<40} (ALA: {:<22}, ALD: {:<22})".format(i, station["_id"], station["Ala"], station["Ald"]))

        if station["_id"] == end and cut:
            break
        i += 1

    print()       

def getKey(id):
    return id["pathId"] +"#"+ id["trainId"]

def parseKey(id):
    ids = id.split("#")
    return {"pathId": ids[0], "trainId": ids[1]}


def findStationsInTrain(stations, start,end):
    startStation = None
    endStation = None

    for trainStation in stations:
        if startStation != None and endStation != None:
            break
        
        if trainStation["_id"] == start:
            startStation = trainStation
        elif trainStation["_id"] == end:
            endStation = trainStation
    
    return(startStation, endStation)

def checkIfItsNotCanceled(canceledTrains, train,dateObj):
    if getKey(train["_id"]) in canceledTrains:
            canceled = canceledTrains[getKey(train["_id"])]
            if canceled:
                continueVar = False
                for calendar in canceled["PlannedCalendars"]:
                    deltaFromStart = calculateDeltaInBitArray(calendar["ValidityPeriod"]["StartDateTime"], calendar["ValidityPeriod"]["EndDateTime"], dateObj, "CANCELED")
                    if deltaFromStart < 0:
                        continue
                    
                    if train["PlannedCalendar"]["BitmapDays"][deltaFromStart] == "1":
                        continueVar = True
                        break
                
                return continueVar
    return False


def checkIfStartStationIsBeforeEndStation(train, start, end):
    (startStationInsideTrain, endStationInsideTrain) = findStationsInTrain(train["Stations"],start,end)
    if startStationInsideTrain == None or endStationInsideTrain == None:
        return False
        
    startAla = startStationInsideTrain["Ala"]
    if startAla == "":
        startAla = startStationInsideTrain["Ald"]

    endAla = endStationInsideTrain["Ala"]
    if endAla == "":
        endAla = endStationInsideTrain["Ald"]

    if startAla == "" or endAla == "":
        return False

    startAla = datetime.strptime(startAla.split("+")[0], '%H:%M:%S.0000000')
    endAla = datetime.strptime(endAla.split("+")[0], '%H:%M:%S.0000000')

    if endAla < startAla: 
        return False

    return True

def checkIfTrainIsInValidInvertal(train,dateObj):
    firstStationOfTrain = train["Stations"][0]

    firstTime =firstStationOfTrain["Ala"] 
    if firstTime == "":
        firstTime = firstStationOfTrain["Ald"]

    lastTime = ""
    index = -1
    while lastTime == "":
        lastStationOfTrain = train["Stations"][index]
        lastTime =lastStationOfTrain["Ala"] 
        if lastTime == "":
            lastTime = lastStationOfTrain["Ald"]
        index -= 1

    dateObjCopy = dateObj.replace(year= 1970, day = 1, month = 1, microsecond =0)

    firstTime = datetime.strptime("1970"+firstTime.split("+")[0], '%Y%H:%M:%S.0000000')
    lastTime = datetime.strptime("1970"+lastTime.split("+")[0], '%Y%H:%M:%S.0000000')

    if  dateObjCopy < firstTime or dateObjCopy > lastTime:
        return False

    deltaFromStart = calculateDeltaInBitArray(train["PlannedCalendar"]["ValidityPeriod"]["StartDateTime"], train["PlannedCalendar"]["ValidityPeriod"]["EndDateTime"], dateObj)

    if deltaFromStart < 0:
        return False

    if train["PlannedCalendar"]["BitmapDays"][deltaFromStart] == "0":
        return False

    return True

def createDictFromCollection(collection, trainIds):
    cursor = collection.find({"_id": {"$in": trainIds}})
    newList = {}
    for object in cursor:
        newList[getKey(object["_id"])] = object
    return newList

def getTrainsIntersectionAndReturnTrainIds(startStation,endStation):
    startStationTrainIds = [getKey(train["_id"]) for train in startStation["Trains"]]
    endStationTrainIds = [getKey(train["_id"]) for train in endStation["Trains"]]

    intersection = set(startStationTrainIds).intersection(endStationTrainIds)

    trainIds = [parseKey(id) for id in intersection]
    return trainIds
