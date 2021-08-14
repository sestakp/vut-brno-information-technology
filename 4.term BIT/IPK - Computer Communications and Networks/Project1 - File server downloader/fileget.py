#!/usr/local/bin/python3
#launch example fileget -n NAMESERVER -f SURL
import argparse #library to parse arguments
import re #library for regular expressions
import socket #library for communication with server
from time import sleep #import for waiting for response
import sys #import for writing into stderr
from pathlib import Path # Used for creating dirs in sys
import os
import tempfile

EXIT_SUCCESS = 0
EXIT_FAILURE = 1

def ParseArguments():
    global serverIp
    global serverPort
    global surlProtocol
    global surlServerName
    global surlPath

    #parse arguments
    parser = argparse.ArgumentParser(description='Handle arguments')
    parser.add_argument('-n', dest='nameserver', type=str, help='Name of the candidate', required=True)
    parser.add_argument('-f ', dest='surl', type=str, help='Surname of the candidate', required=True)
    args = parser.parse_args()

    nameServer = re.match('(?P<_0>[\d.]+)\:(?P<_1>[\w._-]+)', args.nameserver)

    serverIp = nameServer[1]
    
    serverPort = nameServer[2]

    #regex to parse SURL = PROTOCOL://SERVER_NAME/PATH
    result = re.match('(?P<_0>.+)\://(?P<_1>[\w._-]+)\/(?P<_2>.+)', args.surl)
    surlProtocol = result[1]
    surlServerName = result[2]
    surlPath = result[3]

    if(surlProtocol != "fsp"):
        sys.stderr.write("ERROR> Expect fsp protocol, but server name contains "+surlProtocol+"\n")
        exit(EXIT_FAILURE)

def NameServiceProtocol():
    global fspIp
    global fspPort

    #make message
    packet = bytes("WHEREIS "+surlServerName,'utf-8')
    # Create the socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    # Make the socket multicast-aware, and set TTL.
    sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 20) # Change TTL (=20) to suit
    # Send the data
    sock.sendto(packet, (serverIp, int(serverPort)))
    sock.settimeout(5)

    reply = ''
    try:
        reply = sock.recv(131072)
    except:
        sys.stderr.write("ERROR> Error while communication with NSP server\n")
        exit(EXIT_FAILURE)

    #wait for reply from server
    while not reply: #TODO... check
        reply = sock.recv(131072)
        
    #decode reply to string
    reply = reply.decode('utf-8')

    #close connection
    sock.close()

    #Regex to match reply from NSP
    regexResult = re.match('OK (?P<_0>[\d.]+)\:(?P<_1>[\d]+)', reply)
    
    #Check if was parse success
    if type(regexResult) is type(None):
        sys.stderr.write("ERROR> Name service protocol communication answer \""+reply+"\" for server name \""+surlServerName+"\"\n")
        exit(EXIT_FAILURE)

    fspIp = regexResult[1]
    fspPort = regexResult[2]


def processHeader(header):
    header_str = header.splitlines()
    answer = header_str[0].decode('utf-8')
    dataLength = header_str[1].decode('utf-8')
    regexResult = re.match('FSP/1.0 (?P<_0>.+)', answer)

    #Check if was parse success
    if type(regexResult) is type(None):
        sys.stderr.write("ERROR> FSP communication error for server \""+surlServerName+"\"\n")
        exit(EXIT_FAILURE)
    elif regexResult[1] == "Not Found":
        sys.stderr.write("ERROR> File \""+surlPath+"\" is not on server \""+surlServerName+"\"\n")
        exit(EXIT_FAILURE)
    elif regexResult[1] == "Bad Request":
        sys.stderr.write("ERROR> Syntax error in request for server \""+surlServerName+"\"\n")
        exit(EXIT_FAILURE)

    regexResult = re.match('Length:(?P<_0>.+)', dataLength)
    if(type(regexResult) is type(None)):
        sys.stderr.write("ERROR> FSP communication error for server \""+surlServerName+"\", error with parsing header\n")
        exit(EXIT_FAILURE)
    
    return int(regexResult[1])

def getFilename(filepath):
    if filepath != "":

        return filepath

        if surlPath.find('/') != -1:
            filename = surlPath.rsplit('/', 1)[1] #get last part of string after / from surlpath
            return os.path.join(path_dir, filename)
        else:
            return surlPath
    else:
        return surlPath

def FileServiceProtocol(filepath = ""):

    #Init connection
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    sock.connect((fspIp, int(fspPort)))

    #define packet
    message = ("GET "+surlPath+" FSP/1.0\r\n"
               "Hostname: "+surlServerName+"\r\n"
               "Agent: xsesta07\r\n"
               "\r\n")

    packet = bytes(message,'utf-8')

    #receive answer
    try:    
        # Send data
        sock.sendall(packet)
        
        header = b''
        while b'\r\n\r\n' not in header:
            data = sock.recv(1024)
            header += data

        dataLength = processHeader(header)

        filename = getFilename(filepath)
        f = open(filename, "wb")

        split = header.split(b'\r\n\r\n') #if some data was loaded in header
        f.write(split[1]) #add to file

        while dataLength > 0:
            data = sock.recv(1024)
            
            f.write(data)

            dataLength -= len(data)
        
        f.close()
    except Exception as e:
        print(e) 
        sys.stderr.write("ERROR> Error while communication with FSP server\n")
        exit(EXIT_FAILURE)
    finally:
        sock.close()

    

################ MAIN ################
ParseArguments()
NameServiceProtocol()

if surlPath[-1] == '*':
    
    oldPath = surlPath[:-1] #backup argument and remove star
    surlPath = 'index' #search for index

    tempFile = tempfile.NamedTemporaryFile(delete=False) #create temporary file
    tempFilePath = tempFile.name

    FileServiceProtocol(tempFilePath)
    
    f = open(tempFilePath)
    for path in f.readlines():
        path = path[:-1] #remove \n
        regexResult = re.match('^'+oldPath+'(?P<_0>.+)', path)
        if regexResult is not None: 
            path_dir = Path('')
            
            rr = regexResult[1].split('/')

            if(len(rr) > 1):
                directory = os.path.dirname(regexResult[1])
                path_dir = Path('./'+directory)
                path_dir.mkdir(parents=True,exist_ok=True)

            surlPath = path
            FileServiceProtocol()
    
    f.close()
    os.unlink(tempFilePath) #Remove temporary file
else:

    FileServiceProtocol()

exit(EXIT_SUCCESS)