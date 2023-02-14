import re
from include.interpret.ErrorHandler import ErrorHandler
import sys
from enum import Enum

class Argument:
    """
    A class used to represent an Argument of instruction

    ...

    Attributes
    ----------
    Type : ArgumentType
        Type of argument (UNSET if is defined, but not initialized)
    Value : str|float|int|bool|None 
        Value depends on argument type

    Methods
    -------
    __init__(_type, value)
        Constructor of argument used to initialized argument

    isVar(soft=False)
        Check if current argument is variable
    
    isSymb()
        Check if current argument is symbol 

    isLabel()
        Check if current argument is label

    isType()
        Check if current argument is Type
    """

    def __init__(self, _type, value):
        """
        Initialization of argument, setting Type and casting value to specific type
        """    
        self.Type = _type
        self.Value = value

        if isinstance(_type,str):
            self.Type = self._setType(_type)
            self.Value = "" if value is None else value
        else:
            return #Its from stack
            
        if self.Type == ArgumentType.VAR:
            value = value.split("@")
            if len(value) != 2:
                ErrorHandler.printError("Wrong format of variable "+self.Value, ErrorHandler.ERROR_SEMANTIC_REDEFINITION)
            self.Type = self._setType(value[0])
            self.Value = value[1]

        elif self.Type == ArgumentType.STRING:
            def replace(match):
                try:
                    match = match.group()
                    return chr(int(match[1:]))   
                except:
                    ErrorHandler.printError("Error while escaping special sequences in string", ErrorHandler.ERROR_RUNTIME_WRONG_OPERAND_TYPE)
            self.Value = re.sub(r'\\\d{3}',replace, self.Value)
            
        elif self.Type == ArgumentType.BOOL:
            self.Value = True if value == "true" else False

        elif self.Type == ArgumentType.NIL:
            self.Value = None

        elif self.Type == ArgumentType.INT:
            try:
                self.Value = int(value)
            except:
                ErrorHandler.printError("Unexpected value for int", ErrorHandler.ERROR_RUNTIME_WRONG_OPERAND_TYPE)

        elif self.Type == ArgumentType.FLOAT:
            self.Value = float.fromhex(value)
            if not isinstance(self.Value, float):
                ErrorHandler.printError("Unexpected value for float", ErrorHandler.ERROR_RUNTIME_WRONG_OPERAND_TYPE)

    def isVar(self,soft=False):
        """
            Function check if current argument is variable
            
            If argument is not var and soft is set to True function return false, else exit interpret with correct exit code        
        """
        retval = True
        if (
           self.Type != ArgumentType.STACK and
           self.Type != ArgumentType.GF and
           self.Type != ArgumentType.TF and
           self.Type != ArgumentType.LF
        ):
           retval = False
        
        if self.Value is not None:
            if isinstance(self.Value,str) and len(self.Value) > 0:
                reResult = re.search(r"[a-zA-Z\_\-\$\&\%\*\!\?]", self.Value[0])
                if (reResult is None):
                    retval = False

        if retval == False:
            if soft == True:
                return False
            else:
                print(self.Type,self.Value, file=sys.stderr)
                ErrorHandler.printError("Expected variable", ErrorHandler.ERROR_UNEXPECTED_XML)
        return True

    def isSymb(self):
        """
            Function check if current argument is Symbol

            If argument is not Symbol exit interpret with correct exit code        
        """
        if self.isVar(True):
            return True        

        if self.Type == ArgumentType.NIL:
            if self.Value != None:
                ErrorHandler.printError("Unexpected value for type nil")
       
        elif self.Type == ArgumentType.BOOL:
            if not isinstance(self.Value,bool):
                ErrorHandler.printError("Unexpected value for type bool") 
        
        elif self.Type == ArgumentType.INT:
            if not isinstance(self.Value,int):
                ErrorHandler.printError("Unexpected value for type int")
        
        elif self.Type == ArgumentType.FLOAT:
            if not isinstance(self.Value,float):
                ErrorHandler.printError("Unexpected value for type int")
    
        elif self.Type == ArgumentType.UNSET:
            print("Value: ", self.Value,file=sys.stderr)
            ErrorHandler.printError("Unexpected symbol type", ErrorHandler.ERROR_UNEXPECTED_XML)
  
    def isLabel(self):
        """
            Check if current argument is label

            If it's not a label exit interpreter
        """
        if self.Type != ArgumentType.LABEL:
            ErrorHandler.printError("Label require Label argument", ErrorHandler.ERROR_UNEXPECTED_XML)

    def isType(self):
        """
            Check if current argument is Type

            If it's not a type exit interpreter
        """
        if(self.Value != "int" and self.Value != "bool" and self.Value != "string" and self.Value != "float"):
            ErrorHandler.printError("Expected type", ErrorHandler.ERROR_UNEXPECTED_XML)
        return True

    def _setType(self, _type):
        """
            Associate string type with enum ArgumentType
            
            return ArgumentType
        """
        if _type == "int":
            return ArgumentType.INT

        elif _type == "bool":
            return ArgumentType.BOOL

        elif _type == "string":
            return ArgumentType.STRING

        elif _type == "nil":
            return ArgumentType.NIL
        
        elif _type == "label":
            return ArgumentType.LABEL
        
        elif _type == "type":
            return ArgumentType.TYPE
        
        elif _type == "var":
            return ArgumentType.VAR
        
        elif _type == "GF":
            return ArgumentType.GF
        
        elif _type == "TF":
            return ArgumentType.TF
        
        elif _type == "LF":
            return ArgumentType.LF

        elif _type == "float":
            return ArgumentType.FLOAT

        else:
            return ArgumentType.UNSET

class ArgumentType(Enum):
     UNSET = 0
     INT = 1
     BOOL = 2
     STRING = 3
     NIL = 4
     LABEL = 5
     TYPE = 6
     VAR = 7
     GF = 8
     LF = 9
     TF = 10
     FLOAT = 11
     STACK = 12

"""
    Enum with types of arguments
"""
