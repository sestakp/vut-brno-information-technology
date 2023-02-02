from mongoClient import mongoClient
import timeit
import sys
import utils
import ArgumentParser

dbClient = mongoClient("mongodb+srv://developer:fejCFz0KFHfadxZh@cluster0.bytbtom.mongodb.net/?retryWrites=true&w=majority")

(start, end, date, dateObj, cut, less) = ArgumentParser.parseArguments(dbClient)

startTimer = timeit.default_timer()

startStation =  dbClient.stations.find_one({"_id": start})
endStation = dbClient.stations.find_one({"_id": end})

if startStation is not None and endStation is not None:

    trainIds = utils.getTrainsIntersectionAndReturnTrainIds(startStation,endStation)

    canceledTrains = utils.createDictFromCollection(dbClient.canceled, trainIds)
    trains = utils.createDictFromCollection(dbClient.trains, trainIds)

    for train in trains.values():
        
        if utils.checkIfItsNotCanceled(canceledTrains, train, dateObj):
            continue
            
        if not utils.checkIfStartStationIsBeforeEndStation(train, start, end):
            continue

        if not utils.checkIfTrainIsInValidInvertal(train,dateObj):
            continue
        
        utils.printTimeTable(train, start, end, cut, less)

stopTimer = timeit.default_timer()

print('Time: ', stopTimer - startTimer, file=sys.stderr) 
