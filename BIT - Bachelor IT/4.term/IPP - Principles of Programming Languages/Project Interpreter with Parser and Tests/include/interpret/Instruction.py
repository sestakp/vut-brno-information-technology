from include.interpret.ErrorHandler import ErrorHandler
from include.interpret.Argument import Argument
import sys

class Instruction:
    """
        Encapsulate instruction

        Properties
        ----------
        Opcode - Operation code
        Args - Array of arguments with fixed length 3
        Order - Order in source code
        HotCounter - Counter for statistics which count executing of current instruction
        ArgCount - Number of arguments for fix indexing in array Args

        Methods
        -------
        setOpcode(opcode)
            Set value to opcode and set string to upper case

        getOpcode()
            Return current opcode
        
        setOrder(order)
            Check if current order is valid and set
        
        getOrder()
            return current order

        getArgCount()
            Return current number of arguments

        GetArg(index)
            Get argument in array on postion index-1. index must be in interval <1;3>
            
            Exception
            ---------
            IndexError when wrong index is inserted 

        SetArg(index,value)
            Set value to argument on position index-1

    """
    def __init__(self):
        self.Opcode = ""
        self.Args = [Argument]*3
        self.Order = -1
        self.HotCounter = 0
        self.ArgCount = 0

    def setOpcode(self,opcode):
        self.Opcode = opcode.upper()
    
    def getOpcode(self):
        return self.Opcode
    
    def setOrder(self,order):
        try:
            self.Order = int(order)
            
            if(self.Order < 0):
                ErrorHandler.printError("Instruction order must be positive number",ErrorHandler.ERROR_UNEXPECTED_XML)

        except:
            ErrorHandler.printError("Instruction order must be number", ErrorHandler.ERROR_UNEXPECTED_XML)

    def getOrder(self):
        return self.Order

    def getArgCount(self):
        return self.ArgCount

    def getArg(self,index):
        return self.Args[index-1]

    def setArg(self,index,arg):
        try:
            index = int(index)
            if index > self.ArgCount:
                self.ArgCount = index

            self.Args[index-1] = arg

        except ValueError:
            ErrorHandler.printError("Argument index must be number", ErrorHandler.ERROR_UNEXPECTED_XML)
        except:
            ErrorHandler.printError("Argument index must be in range (1..3)",ErrorHandler.ERROR_UNEXPECTED_XML)