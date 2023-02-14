
from ftpretty import ftpretty
import os
import gzip
import tempfile
import zipfile

class fileDownloader:
    def __init__(self, serverName, serverDir, fileParse, dbClient):
        self.serverName = serverName
        self.serverDir  = serverDir
        self.fileParser = fileParse
        self.dbClient   = dbClient

    ## print progress bar by counter value
    #
    # @param self object
    # @param prefix text before bar (default is '')
    # @param length length of progress bar
    # @param fill complete fill with symbol
    # @return int value of counter
    def printProgressBar(self, value, total, prefix = '', length = 35, fill = '█'):
        percent = ("{0:.1f}").format(100 * (value / total))
        filledLength = int(length * value // total)
        bar = fill * filledLength + '-' * (length - filledLength)
        print('\r%s |%s| %s%%' % (prefix, bar, percent), end = '\r')
        # Print New Line on Complete
        if value == total:
            print()

    def downloadFiles(self, count = None):

        downloaded = 0
        ftpClient  = ftpretty(self.serverName, 'anonymous', 'anonymous')
        datesDirs  = ftpClient.list(self.serverDir)
        
        filtered = [date for date in datesDirs if date.endswith('.zip')]

        for date in filtered:
            #create tmp file
            localZip = tempfile.NamedTemporaryFile(delete=False)     

            #download
            ftpClient.get(date, localZip.name)
            
            with tempfile.TemporaryDirectory() as tmpdirname:
                with zipfile.ZipFile(localZip.name, 'r') as zip_ref:
                    zip_ref.extractall(tmpdirname)
                
                files = os.listdir(tmpdirname)
                filesCount = len(files)
                fileI = 0
                for filename in files:
                    fileI += 1
                    self.printProgressBar(fileI, filesCount, date)

                    fileAbsolutePath = os.path.join(tmpdirname, filename)
                    
                    if os.path.isfile(fileAbsolutePath):
                        if not self.dbClient.isMsgExist(filename):
                            with open(fileAbsolutePath, 'r', encoding="utf8") as f:
                                self.fileParser.parseData(f.read(), filename)

            #remove temp
            os.unlink(localZip.name)

            #update connection
            ftpClient = ftpretty(self.serverName, 'anonymous', 'anonymous')

        datesDirs = ftpClient.list(self.serverDir)

        for date in datesDirs:
            
            if not date.endswith('.zip'): # skip zip files in root

                dateFiles = ftpClient.list(date)
                 
                filesCount = len(dateFiles)
                fileI = 0

                for msgFile in dateFiles:
                    fileI += 1
                    self.printProgressBar(fileI, filesCount, date)

                    if not self.dbClient.isMsgExist(os.path.basename(msgFile)):
                        # gzip
                        try:
                            #read file from server
                            File = ftpClient.get(msgFile)

                            #extract gzip
                            File = gzip.decompress(File)

                            #parse file and upload to DB
                            self.fileParser.parseData(File.decode("utf-8"), msgFile)

                        except gzip.BadGzipFile as err: # zip
                            #create tmp file
                            localZip = tempfile.NamedTemporaryFile(delete=False)     
                                
                            #download
                            ftpClient.get(msgFile, localZip.name)
                                
                            with tempfile.TemporaryDirectory() as tmpdirname:
                                with zipfile.ZipFile(localZip.name, 'r') as zip_ref:
                                    zip_ref.extractall(tmpdirname)
                                        
                                files = os.listdir(tmpdirname)
                                    
                                for filename in files:
                                    fileAbsolutePath = os.path.join(tmpdirname, filename)
                                        
                                    if os.path.isfile(fileAbsolutePath):
                                        with open(fileAbsolutePath, 'r', encoding="utf8") as f:
                                            self.fileParser.parseData(f.read(), filename)

                            #remove tempy
                            os.unlink(localZip.name)

                        downloaded += 1
                        if ((count is not None) and (downloaded >= count)):
                            return

                    #update connection
                    ftpClient = ftpretty(self.serverName, 'anonymous', 'anonymous')
