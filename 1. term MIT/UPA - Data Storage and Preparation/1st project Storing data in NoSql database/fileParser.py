import os
import xmltodict
from datetime import datetime
from enum import Enum

class MessageType(Enum):
    Null     = 0
    PA       = 1
    Canceled = 2

class fileParser():
    ##
    # Parse file and upload it to mongo
    # @param dbClient object of class mongoClient
    def __init__(self, dbClient):
        self.dbClient = dbClient

    ##
    # Parse file and upload it to mongo
    # @param xml_data data with xml message
    # @return None
    def parseData(self, xml_data, filename):
        
        data_dict = xmltodict.parse(xml_data)
        # get type and data
        msgType     = MessageType.Null
        creationKey = ""
        if "CZPTTCISMessage" in data_dict:
            message     = data_dict["CZPTTCISMessage"]
            identifiers = message["Identifiers"]
            creationKey = "CZPTTCreation"
            msgType     = MessageType.PA

        elif "CZCanceledPTTMessage" in data_dict:
            message     = data_dict["CZCanceledPTTMessage"]
            identifiers = message
            creationKey = "CZPTTCancelation"
            msgType     = MessageType.Canceled

        else:
            print("Neznamy typ zpravy")
            return
        
        PAObject = [a for a in identifiers["PlannedTransportIdentifiers"] if a["ObjectType"] == "PA"]
        pathId = PAObject[0]["Core"]+PAObject[0]["Variant"]+PAObject[0]["TimetableYear"]

        TRObject = [a for a in identifiers["PlannedTransportIdentifiers"] if a["ObjectType"] == "TR"]
        trainId = TRObject[0]["Core"]+TRObject[0]["Variant"]+TRObject[0]["TimetableYear"]
        creationTimestamp = int(datetime.strptime(message[creationKey], '%Y-%m-%dT%H:%M:%S').timestamp())
        
        id = { "pathId": pathId, "trainId": trainId}
        
        #print(type(retval))
        #print(retval.matched_count)
        #print(retval.modified_count)
        #print(retval.upserted_id)
        #if updated:
        #    pass
            #train was updated, need to find all train records in station and delete... maybe change structure


        # save data to DB
        if  msgType == MessageType.PA:
            
            plannedCalendar =  message["CZPTTInformation"]["PlannedCalendar"]
            
            validStart =plannedCalendar["ValidityPeriod"]["StartDateTime"]
            validEnd = plannedCalendar["ValidityPeriod"]["EndDateTime"]

            validStart = int(datetime.strptime(validStart, '%Y-%m-%dT%H:%M:%S').timestamp())
            validEnd = int(datetime.strptime(validEnd, '%Y-%m-%dT%H:%M:%S').timestamp())

            plannedCalendar["ValidityPeriod"]["StartDateTime"] = validStart
            plannedCalendar["ValidityPeriod"]["EndDateTime"]  = validEnd


            if "RelatedPlannedTransportIdentifiers" in identifiers:
                newPathObj = identifiers["RelatedPlannedTransportIdentifiers"]
                newPathId = newPathObj["Core"]+newPathObj["Variant"]+newPathObj["TimetableYear"]
                self.dbClient.insertCanceled({
                    "_id": {"pathId": newPathId, "trainId": trainId},
                    "PlannedCalendar": plannedCalendar
                })

            

            locations = message["CZPTTInformation"]["CZPTTLocation"]

            stations = []

            for location in locations:

                ala = ""
                ald = ""

                if "TimingAtLocation" in location and "Timing" in location["TimingAtLocation"]:
                    if isinstance(location["TimingAtLocation"]["Timing"], (list)):
                        ala = location["TimingAtLocation"]["Timing"][0]["Time"]
                        ald = location["TimingAtLocation"]["Timing"][1]["Time"]
                    else:
                        if location["TimingAtLocation"]["Timing"]["@TimingQualifierCode"] == "ALA":
                            ala = location["TimingAtLocation"]["Timing"]["Time"]
                        else:
                            ald = location["TimingAtLocation"]["Timing"]["Time"]

                stations.append({
                    "_id": location["Location"]["PrimaryLocationName"],
                    "Creation": creationTimestamp,
                    "Ala": ala,
                    "Ald": ald,
                    "TrainActivity": location.get("TrainActivity")
                })

            
            train = {
                "_id": id,
                "Stations": stations,
                "creationTimestamp": creationTimestamp,
                "PlannedCalendar": plannedCalendar

            }
            
            updated = self.dbClient.insertTrains(train)


            for location in locations:
                ala = ""
                ald = ""

                if "TimingAtLocation" in location and "Timing" in location["TimingAtLocation"]:
                    if isinstance(location["TimingAtLocation"]["Timing"], (list)):
                        ala = location["TimingAtLocation"]["Timing"][0]["Time"]
                        ald = location["TimingAtLocation"]["Timing"][1]["Time"]
                    else:
                        ala = location["TimingAtLocation"]["Timing"]["Time"]
                        ald = ""


                TrainActivityType = ""
                trainActivity = location.get("TrainActivity")
                if trainActivity is not None:
                    if type(trainActivity)==list:
                        TrainActivityType = [a for a in trainActivity if a["TrainActivityType"] == "0001"]
                        TrainActivityType = trainActivity[0]["TrainActivityType"]
                    else:
                        TrainActivityType = trainActivity.get("TrainActivityType")
                    
                    if TrainActivityType is not None:
                        if TrainActivityType != "0001":
                            continue
                    else:
                        continue
                else:
                    continue
                

                self.dbClient.stations.update_one(
                    {"_id": location["Location"]["PrimaryLocationName"]},
                    {
                        "$set":{
                            "_id": location["Location"]["PrimaryLocationName"],
                            "Creation": creationTimestamp,
                        },
                        "$push": { "Trains": {"_id": id, "Creation": creationTimestamp, "ValidFrom": validStart, "ValidTo": validEnd}},
                    },
                    True
                )

             
            message.pop("CZPTTInformation")

            
        elif msgType == MessageType.Canceled:
            
            plannedCalendar = message["PlannedCalendar"]
            
            validStart =plannedCalendar["ValidityPeriod"]["StartDateTime"]
            validEnd = plannedCalendar["ValidityPeriod"]["EndDateTime"]

            validStart = int(datetime.strptime(validStart, '%Y-%m-%dT%H:%M:%S').timestamp())
            validEnd = int(datetime.strptime(validEnd, '%Y-%m-%dT%H:%M:%S').timestamp())

            plannedCalendar["ValidityPeriod"]["StartDateTime"] = validStart
            plannedCalendar["ValidityPeriod"]["EndDateTime"]  = validEnd

            self.dbClient.insertCanceled({
                "_id": id,
                "PlannedCalendar": plannedCalendar
            })
    
        
        self.dbClient.insertFiles(os.path.basename(filename), xml_data)
        
