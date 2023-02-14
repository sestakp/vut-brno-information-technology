
from fileDownloader import fileDownloader
from fileParser import fileParser
import config

def updateData(dbClient):
    fileParse    = fileParser(dbClient)
    fileDownload = fileDownloader(config.SERVER_NAME, config.SERVER_DIR, fileParse, dbClient)

    fileDownload.downloadFiles()