
import pymongo
import certifi
import gzip

ca = certifi.where()
class mongoClient():
    
    
    def __init__(self, connectionString):
        self.client   = pymongo.MongoClient(connectionString, tlsCAFile=ca)
        #db=client.test
        self.database = self.client["train_connections"]
        self.canceled = self.database["canceled"]
        self.trains   = self.database["trains"]
        self.stations = self.database["stations"]
        self.files    = self.database["files"]
        self.trainStations    = self.database["trainsStations"]
        self.backup = self.database["backup"]
        #self.stations.create_index( { "Trains.ValidFrom": 1, "Trains.ValidTo": 1 } )
        #self.stations.create_index([('Trains', pymongo.TEXT)], name='trains_index', default_language='english')


    def isMsgExist(self, msgName):
        with self.client.start_session(causal_consistency=True) as session:
            return self.files.count_documents({"_id": msgName}, session=session, limit=1) != 0
        
        return False

    def insertStation(self, station):
        with self.client.start_session(causal_consistency=True) as session:
            self.stations.insert_one(station, session=session)
            return True
        
        return False

    def findStations(self, station):
        return self.stations.find({"_id": {'$regex': station}})

    def insertCanceled(self, canceled):
        with self.client.start_session(causal_consistency=True) as session:
            self.canceled.update_one(
                {"_id": canceled["_id"]},
                {
                    "$push": {
                        "PlannedCalendars": canceled["PlannedCalendar"]
                    }

                },
                upsert=True, 
                session=session)
            return True
        
        return False

    def insertTrains(self, train):
        status = None

        with self.client.start_session(causal_consistency=True) as session:

            status = self.trains.find_one_and_update(
                {"_id": train["_id"], "creationTimestamp": {"$lte": train["creationTimestamp"]}},
                {"$set": { 
                     "_id": train["_id"],
                    "Stations": train["Stations"],
                    "creationTimestamp": train["creationTimestamp"]
                    }
                },                
                session=session
            )

            if status is None:
                if self.trains.count_documents({"_id": train["_id"]}, session=session, limit=1) == 0:
                    status = self.trains.insert_one(train, session=session)
                

        
        return status is not None

    def insertTraintations(self, trainStation):
        with self.client.start_session(causal_consistency=True) as session:
            self.trainStations.insert_one(trainStation, session=session)
            return True
        
        return False

    def insertFiles(self, msgName, xml_data):
        #print("insert file")
        #print(msgName)

        with self.client.start_session(causal_consistency=True) as session:
            self.files.insert_one({"_id":msgName ,"data": gzip.compress(bytes(xml_data, encoding="utf-8"))}, session=session)
            return True
        
        return False
