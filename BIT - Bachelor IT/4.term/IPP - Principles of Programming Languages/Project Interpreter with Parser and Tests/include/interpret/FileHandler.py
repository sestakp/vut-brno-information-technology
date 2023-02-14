from include.interpret.ErrorHandler import ErrorHandler
import sys
class FileHandler:
    """
        FileHandled encapsulate working with standard input and input files

        Methods
        -------

        GetLine()
            Get line from file or call input if input file is not specified

            Exception
            ---------
            Raise EOFError when reading from empty file
    """
    def __init__(self,file):
        """
        If file is specified, load data into array

        arguments
        ---------
        file - name of file used for standard input for interpreting
        """

        if file is not None:
            self.isStdin = False
            try:
                fp = open(file,"r")
                self.lines = []
                for line in fp:
                    line = line.replace("\n",'')
                    self.lines.append(line)
                fp.close()
            except:
                ErrorHandler.printError("Error with opening file",ErrorHandler.ERROR_INPUT_FILE)
        else:
            self.isStdin = True
        
    def getLine(self):
        """
            Return one line of file which was specified by parameter --input or call input() when stdin is used.

            Exceptions
            ----------
            Raise EOFError when reading from empty file
        """
        if not self.isStdin:
            try:
                return self.lines.pop(0)
            except:
                raise EOFError()
        else:
            return input()