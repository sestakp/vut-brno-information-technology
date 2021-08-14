from __future__ import print_function
from include.interpret.xmlParser import xmlParser
from include.interpret.Argument import ArgumentType, Argument
from include.interpret.ErrorHandler import ErrorHandler
from include.interpret.Instruction import Instruction
from include.interpret.FileHandler import FileHandler
import sys

class Interpreter:

    def __init__(self, sourceFile,inputFile, statistics):
        self.XmlParser = xmlParser(sourceFile) #Instanc to XML Parser to parse input file
        self.InputFile = FileHandler(inputFile) #Instanc of class to handle file
        self.Instructions = self.XmlParser.getInstructions() #List of instructions of current source code
        self.Statistics = statistics #Class with statistics
        self.GF = {} #Global Frame
        self.TF = None #Temporary Frame
        self.LF = None #current Local Frame
        self.LABELS = {} #Existing labels, which is filled while preprocessing
        self.StackLF = [] #Stack of Local frames
        self.CallStack = [] #Stack of return addresses filled by call and poped by return
        self.DataStack = [] #User stack used for instructions PUSHS and POPS
        self.ProgramCounter = 0 #Program counter represent index of next instruction to load
        self.Instruction = Instruction() #Current instruction
        self.TFisCreated = False #If TF is created by instruction CREATEFRAME
        self.ItsStackOperation = False #Check if its stack operation

    def equal(self,arg1,arg2):

        arg1_dict = self.GetValue(arg1)
        arg2_dict = self.GetValue(arg2)

        if arg1_dict["type"] != arg2_dict["type"]:

            if arg1_dict["type"] != ArgumentType.NIL and arg2_dict["type"] != ArgumentType.NIL:
                self.TypeErrorWithVariableOrNot(arg1,arg2,"Comparing "+str(arg1_dict["type"])+" with "+str(arg2_dict["type"]))
            else:
                return False

        if arg1_dict["value"] != arg2_dict["value"]:
            return False

        return True   

    def checkLabel(self, labelName):
        if labelName not in self.LABELS.keys():
           ErrorHandler.printError("Jump to undefined label",ErrorHandler.ERROR_SEMANTIC_REDEFINITION)

    def isPreprocessed(self):
        if self.Instruction.Opcode == "LABEL":
            return True
        else:
            return False
    
    def SetVariable(self,varFrame,varName,toStore, Access = True):
        argValue = toStore["value"]
        argType = toStore["type"]

        if varFrame == ArgumentType.STACK:
            self.DataStack.append({"type" : argType, "value": argValue})
            

        elif varFrame == ArgumentType.GF:
            if Access and (varName not in self.GF.keys()):
                ErrorHandler.printError("Access to undefined variable "+str(varName)+" on "+str(varFrame)+" frame", ErrorHandler.ERROR_UNDEFINED_VARIABLE)
            elif not Access and (varName in self.GF.keys()):
                ErrorHandler.printError("Redeclaring variable "+str(varName)+" on "+str(varFrame)+" frame",ErrorHandler.ERROR_SEMANTIC_REDEFINITION) 
            self.GF[varName] = toStore

        elif varFrame == ArgumentType.LF:
            if self.LF == None:
                ErrorHandler.printError("Access to undefined frame", ErrorHandler.ERROR_RUNTIME_NOEXIST_FRAME)
            elif Access and (varName not in self.LF.keys()):
                ErrorHandler.printError("Access to undefined variable "+str(varName)+" on "+str(varFrame)+" frame",ErrorHandler.ERROR_UNDEFINED_VARIABLE)
            elif not Access and (varName in self.LF.keys()):
                ErrorHandler.printError("Redeclaring variable "+str(varName)+" on "+str(varFrame)+" frame",ErrorHandler.ERROR_SEMANTIC_REDEFINITION) 
            self.LF[varName] = toStore

        elif varFrame == ArgumentType.TF:
            if self.TF == None:
                ErrorHandler.printError("Access to undefined frame", ErrorHandler.ERROR_RUNTIME_NOEXIST_FRAME)
            elif Access and (varName not in self.TF.keys()):
                ErrorHandler.printError("Access to undefined variable "+str(varName)+" on "+str(varFrame)+" frame",ErrorHandler.ERROR_UNDEFINED_VARIABLE)
            elif not Access and (varName in self.TF.keys()):
                ErrorHandler.printError("Redeclaring variable "+str(varName)+" on "+str(varFrame)+" frame",ErrorHandler.ERROR_SEMANTIC_REDEFINITION) 
            self.TF[varName] = toStore

    def GetVariable(self,frame,name,isType = False):
        try:
            var = None
            if frame == ArgumentType.GF:
                var = self.GF[name]
            elif frame == ArgumentType.LF:
                var = self.LF[name]
            elif frame == ArgumentType.TF:
                var = self.TF[name]

            if var["type"] == ArgumentType.UNSET and isType == False:
                ErrorHandler.printError("Getting uninitialized variable", ErrorHandler.ERROR_RUNTIME_MISSING_VALUE)
            
            return var

        except KeyError: #Undefined variable

            if (frame == ArgumentType.TF and self.TF == None) or (frame == ArgumentType.LF and self.LF == None):
                ErrorHandler.printError("Reading from nonexisting frame",ErrorHandler.ERROR_RUNTIME_NOEXIST_FRAME)
            else:
                ErrorHandler.printError("Undefined variable "+str(name)+ " on "+str(frame), ErrorHandler.ERROR_UNDEFINED_VARIABLE)
        
        except TypeError: #Frame is None
            ErrorHandler.printError("Access to undefined frame", ErrorHandler.ERROR_RUNTIME_NOEXIST_FRAME)
        
    def GetValue(self,argument, isType = False):
        if argument.isVar(True):
            return self.GetVariable(argument.Type,argument.Value, isType)
        else:
            return {"type" : argument.Type, "value" : argument.Value}

    def SetLabel(self,labelName):
        
        if labelName in self.LABELS.keys():
            ErrorHandler.printError("Redefined label "+labelName,ErrorHandler.ERROR_SEMANTIC_REDEFINITION)
        
        self.LABELS[labelName] = self.Instructions.index(self.Instruction)
    
    def Jump(self,labelName):
        self.checkLabel(labelName)
        self.ProgramCounter = self.LABELS[labelName]

    def CheckArgumentCount(self,count,expected, opcode):
        if count != expected:
            ErrorHandler.printError("Wrong format of "+opcode+" instruction",ErrorHandler.ERROR_UNEXPECTED_XML)
    
    def InterpretDefvar(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 1, "DEFVAR")

        arg1 = instruction.getArg(1)
        arg1.isVar()

        self.SetVariable(arg1.Type,arg1.Value,{"type":ArgumentType.UNSET, "value":None}, Access = False)
        
        if self.Statistics is not None:
            self.Statistics.SetStatisticVars(self.LF,self.StackLF,self.GF)

    def InterpretMove(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 2, "MOVE")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        
        self.SetVariable(arg1.Type, arg1.Value, self.GetValue(arg2))
        
    def InterpretCreateFrame(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 0, "CREATEFRAME")
        self.TF = {}
        self.TFisCreated = True

    def InterpretPushFrame(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 0, "PUSHFRAME")
        
        if(self.TFisCreated == False):
            ErrorHandler.printError("Pushing non existing frame",ErrorHandler.ERROR_RUNTIME_NOEXIST_FRAME)
        
        self.StackLF.append(self.LF)
        self.LF = self.TF
        self.TF = None
        self.TFisCreated = False

    def InterpretPopFrame(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 0, "POPFRAME")

        try:
            self.TF = self.LF
            self.LF = self.StackLF.pop()
        except IndexError:
            ErrorHandler.printError("Poping non existing frame",ErrorHandler.ERROR_RUNTIME_NOEXIST_FRAME)

    def InterpretCall(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 1, "CALL")
        arg1 = instruction.getArg(1)
        arg1.isLabel()

        self.CallStack.append(self.ProgramCounter)
        self.Jump(arg1.Value)

    def InterpretReturn(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 0, "RETURN")
        try:
            self.ProgramCounter = self.CallStack.pop()
        except:
            ErrorHandler.printError("Return with empty call stack",ErrorHandler.ERROR_RUNTIME_MISSING_VALUE)

    def InterpretPushs(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 1, "PUSHS")
        arg1 = instruction.getArg(1)
        arg1.isSymb()

        arg1 = self.GetValue(arg1)

        self.DataStack.append({"type" : arg1["type"], "value": arg1["value"]})

    def InterpretPops(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 1, "POPS")
        arg1 = instruction.getArg(1)
        arg1.isVar()

        try:
            self.SetVariable(arg1.Type,arg1.Value,self.DataStack.pop())
        except IndexError:
            ErrorHandler.printError("Try to pop from empty data stack",ErrorHandler.ERROR_RUNTIME_MISSING_VALUE)

    def TypeErrorWithVariableOrNot(self,arg1,arg2, message):
        if not arg1.isVar(soft=True) and not arg2.isVar(soft=True):
            ErrorHandler.printError(message,ErrorHandler.ERROR_UNEXPECTED_XML)
        else:
            ErrorHandler.printError(message,ErrorHandler.ERROR_RUNTIME_WRONG_OPERAND_TYPE)

    def InterpretAdd(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "ADD")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()
        
        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)
        
        if not ((arg2Value["type"] == ArgumentType.INT and arg3Value["type"] == ArgumentType.INT) or (arg2Value["type"] == ArgumentType.FLOAT and arg3Value["type"] == ArgumentType.FLOAT)):
            self.TypeErrorWithVariableOrNot(arg2,arg3, "Operation ADD, only integers can be added")
        
        self.SetVariable(arg1.Type, arg1.Value, {"type" : arg2Value["type"], "value": arg2Value["value"] + arg3Value["value"]})

    def InterpretSub(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "SUB")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()
        
        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)

        if not ((arg2Value["type"] == ArgumentType.INT and arg3Value["type"] == ArgumentType.INT) or (arg2Value["type"] == ArgumentType.FLOAT and arg3Value["type"] == ArgumentType.FLOAT)):
            self.TypeErrorWithVariableOrNot(arg2,arg3, "Operation SUB, only integers can be subtracted")

        self.SetVariable(arg1.Type, arg1.Value,{"type" : arg2Value["type"], "value": arg2Value["value"] - arg3Value["value"]})

    def InterpretMul(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "MUL")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()
        
        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)

        if not ((arg2Value["type"] == ArgumentType.INT and arg3Value["type"] == ArgumentType.INT) or (arg2Value["type"] == ArgumentType.FLOAT and arg3Value["type"] == ArgumentType.FLOAT)):
            self.TypeErrorWithVariableOrNot(arg2,arg3, "Operation MUL, only integers can be multiplied")
        
        self.SetVariable(arg1.Type, arg1.Value,{"type" : arg2Value["type"], "value": arg2Value["value"] * arg3Value["value"]})

    def isClose(self,a, b, rel_tol=1e-09, abs_tol=0.0):
        return abs(a-b) <= max(rel_tol * max(abs(a), abs(b)), abs_tol)

    def InterpretIdiv(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "IDIV")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()
        
        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)

        if (arg2Value["type"] != ArgumentType.INT or arg3Value["type"] != ArgumentType.INT):
            self.TypeErrorWithVariableOrNot(arg2,arg3, "Operation IDIV, only integers can be divided")
        
        if arg3Value["value"] == 0:
            ErrorHandler.printError("Operation IDIV, Dividing by zero",ErrorHandler.ERROR_WRONG_OPERAND_VALUE)

        self.SetVariable(arg1.Type, arg1.Value,{"type" : ArgumentType.INT, "value": arg2Value["value"] // arg3Value["value"]})

    def InterpretDiv(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "DIV")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()
        
        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)

        if (arg2Value["type"] != ArgumentType.FLOAT or arg3Value["type"] != ArgumentType.FLOAT):
            self.TypeErrorWithVariableOrNot(arg2,arg3, "Operation DIV, only floats can be divided")
        
        if self.isClose(arg3Value["value"], 0):
            ErrorHandler.printError("Operation DIV, Dividing by zero",ErrorHandler.ERROR_WRONG_OPERAND_VALUE)

        self.SetVariable(arg1.Type, arg1.Value,{"type" : ArgumentType.FLOAT, "value": arg2Value["value"] / arg3Value["value"]})
    
    def InterpretLt(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "LT")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()

        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)

        if arg2Value["type"] == ArgumentType.NIL or arg3Value["type"] == ArgumentType.NIL:
            self.TypeErrorWithVariableOrNot(arg2,arg3, "Lt, operands cannot be nil")
        
        if arg2Value["type"] != arg3Value["type"]:
            self.TypeErrorWithVariableOrNot(arg2,arg3, "Lt, comparing arguments with different type")
        
        self.SetVariable(arg1.Type, arg1.Value,{"type" : ArgumentType.BOOL, "value": arg2Value["value"] < arg3Value["value"]})
    
    def InterpretGt(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "GT")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()

        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)

        if arg2Value["type"] == ArgumentType.NIL or arg3Value["type"] == ArgumentType.NIL:
            self.TypeErrorWithVariableOrNot(arg2,arg3, "Gt, operands cannot be nil")
        
        if arg2Value["type"] != arg3Value["type"]:
            self.TypeErrorWithVariableOrNot(arg2,arg3, "Gt, comparing arguments with different type")
        
        self.SetVariable(arg1.Type, arg1.Value,{"type" : ArgumentType.BOOL, "value": arg2Value["value"] > arg3Value["value"]})

    def InterpretEq(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "EQ")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()

        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)

        if arg2Value["type"] == arg3Value["type"]:
            self.SetVariable(arg1.Type, arg1.Value,{"type" : ArgumentType.BOOL, "value": arg2Value["value"] == arg3Value["value"]})

        elif arg2Value["type"] != arg3Value["type"] and arg2Value["type"] != ArgumentType.NIL and arg3Value["type"] !=  ArgumentType.NIL:
            self.TypeErrorWithVariableOrNot(arg2,arg3, "Eq, comparing arguments with different type")
        
        elif arg2Value["type"] == ArgumentType.NIL or arg3Value["type"] == ArgumentType.NIL:
            self.SetVariable(arg1.Type, arg1.Value,{"type" : ArgumentType.BOOL, "value": False})

    def InterpretAnd(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "AND")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()

        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)

        if arg2Value["type"] != ArgumentType.BOOL or arg3Value["type"] != ArgumentType.BOOL:
            self.TypeErrorWithVariableOrNot(arg2,arg3, "AND, operands have to be bool")
        
        self.SetVariable(arg1.Type,arg1.Value, {"type" : ArgumentType.BOOL, "value": (arg2Value["value"] and arg3Value["value"])})
    
    def InterpretOr(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "OR")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()

        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)
        
        if arg2Value["type"] != ArgumentType.BOOL or arg3Value["type"] != ArgumentType.BOOL:
            self.TypeErrorWithVariableOrNot(arg2,arg3,"OR, operands have to be bool")

        self.SetVariable(arg1.Type,arg1.Value, {"type" : ArgumentType.BOOL, "value": arg2Value["value"] or arg3Value["value"]})
    
    def InterpretNot(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 2, "NOT")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        
        arg2Value = self.GetValue(arg2)

        if arg2Value["type"] != ArgumentType.BOOL:
            self.TypeErrorWithVariableOrNot(arg2,arg2,"NOT, operand have to be bool")
        
        self.SetVariable(arg1.Type,arg1.Value, {"type" : ArgumentType.BOOL, "value": not arg2Value["value"]})

    def InterpretInt2Char(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 2, "INT2CHAR")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()

        arg2Value = self.GetValue(arg2)

        try:
            
            if arg2Value["type"] != ArgumentType.INT:
                self.TypeErrorWithVariableOrNot(arg2,arg2,"INT2CHAR, Invalid unicode value, expected number in range(0 to 1,114,111)")

            value = int(arg2Value["value"])
                        

            if value not in range(0,1_114_112):
                ErrorHandler.printError("INT2CHAR, Invalid unicode value, expected number in range(0 to 1,114,111)",ErrorHandler.ERROR_WORK_WITH_STRING)
            
            value = chr(value)
            self.SetVariable(arg1.Type, arg1.Value,{"type" : ArgumentType.STRING, "value": value})
        
        except ValueError:
            self.TypeErrorWithVariableOrNot(arg1,arg2,"INT2CHAR expected integer to convert")
  
    def InterpretStri2Int(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "STRI2CHAR")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()

        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)

        if arg2Value["type"] != ArgumentType.STRING:
            self.TypeErrorWithVariableOrNot(arg2,arg3,"STRI2INT, Second urgument expected string")

        if arg3Value["type"] != ArgumentType.INT:
            self.TypeErrorWithVariableOrNot(arg2,arg3,"STRI2INT, Third argument expected int")

        try:
            position = arg3Value["value"]
            if len(arg2Value["value"]) -1 < position or position < 0:
                ErrorHandler.printError("STRI2INT, Indexing error", ErrorHandler.ERROR_WORK_WITH_STRING)
        
            value = ord(arg2Value["value"][position])
            self.SetVariable(arg1.Type,arg1.Value,{"type" : ArgumentType.INT, "value": value})
        except IndexError:
            ErrorHandler.printError("STRI2INT, Indexing error", ErrorHandler.ERROR_WORK_WITH_STRING)

    def InterpretRead(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 2, "READ")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        
        arg2.isType()
        arg2Value = self.GetValue(arg2)

        try:
            value = self.InputFile.getLine()
        except EOFError:
            arg2Value["value"] == "nil"
            pass
        
        try:
            if arg2Value["value"] == "int":
                self.SetVariable(arg1.Type, arg1.Value, {"type" : ArgumentType.INT, "value": int(value)})
            
            elif arg2Value["value"] == "string":
                self.SetVariable(arg1.Type, arg1.Value, {"type" : ArgumentType.STRING, "value": str(value)})
            
            elif arg2Value["value"] == "float":
                self.SetVariable(arg1.Type, arg1.Value, {"type" : ArgumentType.FLOAT, "value": float.fromhex(value)})

            elif arg2Value["value"] == "bool":
                if(str.lower(value) == "true"):
                    self.SetVariable(arg1.Type, arg1.Value, {"type" : ArgumentType.BOOL, "value": True})
                else:
                    self.SetVariable(arg1.Type, arg1.Value, {"type" : ArgumentType.BOOL, "value": False})

            else:
                    self.SetVariable(arg1.Type, arg1.Value, {"type" : ArgumentType.NIL, "value": None})
        except:
            self.SetVariable(arg1.Type, arg1.Value, {"type" : ArgumentType.NIL, "value": None})
        
    def InterpretWrite(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 1, "WRITE")
        arg1 = instruction.getArg(1)
        arg1.isSymb()

        arg1 = self.GetValue(arg1)

        if arg1["type"] == ArgumentType.BOOL:
            if arg1["value"]:
                print('true',end='')
            else:
                print('false',end='')
            
        elif arg1["type"] == ArgumentType.NIL:
            print("",end='')

        elif arg1["type"] == ArgumentType.FLOAT:
            print(float.hex(arg1["value"]),end='')

        else:
            print(arg1["value"],end='')
        
    def InterpretConcat(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "CONCAT")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()

        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)

        if arg2Value["type"] != ArgumentType.STRING or arg3Value["type"] != ArgumentType.STRING:
            self.TypeErrorWithVariableOrNot(arg2,arg3,"Error while concatenation, string arguments expected")

        value = arg2Value["value"]+arg3Value["value"]
        self.SetVariable(arg1.Type,arg1.Value,{"type" : ArgumentType.STRING, "value": value})
                   
    def InterpretStrlen(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 2, "STRLEN")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()

        arg2Value = self.GetValue(arg2)

        if arg2Value["type"] != ArgumentType.STRING:
            self.TypeErrorWithVariableOrNot(arg2,arg2,"STRLEN, string argument expected")

        self.SetVariable(arg1.Type,arg1.Value, {"type" : ArgumentType.INT, "value": len(arg2Value["value"])})

    def InterpretGetChar(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "GETCHAR")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()

        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)

        if arg2Value["type"] != ArgumentType.STRING:
            self.TypeErrorWithVariableOrNot(arg2,arg3,"GETCHAR, Second urgument expected string")

        if arg3Value["type"] != ArgumentType.INT:
            self.TypeErrorWithVariableOrNot(arg2,arg3,"GETCHAR, Third argument expected int")
            
        try:
            value = arg2Value["value"]
            position = arg3Value["value"]
            if len(value) -1 < position or position < 0:
                ErrorHandler.printError("SETCHAR, Indexing error", ErrorHandler.ERROR_WORK_WITH_STRING)
        
            value = value[position]
            self.SetVariable(arg1.Type,arg1.Value,{"type" : ArgumentType.STRING, "value": value})
        except IndexError:
            ErrorHandler.printError("GETCHAR, Indexing error", ErrorHandler.ERROR_WORK_WITH_STRING)

    def InterpretSetChar(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "SETCHAR")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()

        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)

        if arg2Value["type"] != ArgumentType.INT:
            self.TypeErrorWithVariableOrNot(arg2,arg3,"SETCHAR, Second urgument expected int")

        if arg3Value["type"] != ArgumentType.STRING:
            self.TypeErrorWithVariableOrNot(arg2,arg3,"SETCHAR, Third argument expected string")

        try:
            value = self.GetVariable(arg1.Type,arg1.Value)
            
            if value["type"] != ArgumentType.STRING:
                self.TypeErrorWithVariableOrNot(arg1,arg2,"SETCHAR, First argument expected string variable")
            
            position = arg2Value["value"]
            if len(value["value"]) -1 < position or position < 0:
                ErrorHandler.printError("SETCHAR, Indexing error", ErrorHandler.ERROR_WORK_WITH_STRING)
            
            value["value"] = value["value"][:position] + arg3Value["value"][0] + value["value"][position + 1 : ]

            self.SetVariable(arg1.Type,arg1.Value,value)
        except IndexError:
            ErrorHandler.printError("SETCHAR, Indexing error", ErrorHandler.ERROR_WORK_WITH_STRING)

    def InterpretType(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 2, "TYPE")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()

        arg2Value = self.GetValue(arg2,True)

        if arg2Value["type"] == ArgumentType.INT:
            value = "int"
        elif arg2Value["type"] == ArgumentType.BOOL:
            value = "bool"
        elif arg2Value["type"] == ArgumentType.NIL:
            value = "nil"
        elif arg2Value["type"] == ArgumentType.UNSET:
            value = ""
        elif arg2Value["type"] == ArgumentType.STRING:
            value = "string"

        self.SetVariable(arg1.Type, arg1.Value, {"type" : ArgumentType.STRING, "value": value})
     
    def InterpretLabel(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 1, "LABEL")
        arg1 = instruction.getArg(1)
        arg1.isLabel()
        self.SetLabel(arg1.Value)

    def InterpretJump(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 1, "JUMP")
        arg1 = instruction.getArg(1)
        arg1.isLabel()
        self.Jump(arg1.Value)

    def InterpretJumpIfEq(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "JUMPIFEQ")
        arg1 = instruction.getArg(1)
        arg1.isLabel()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()

        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)

        self.checkLabel(arg1.Value)  
        if self.equal(arg2,arg3):
            self.Jump(arg1.Value)
  
    def InterpretJumpIfNeq(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 3, "JUMPIFNEQ")
        arg1 = instruction.getArg(1)
        arg1.isLabel()
        arg2 = instruction.getArg(2)
        arg2.isSymb()
        arg3 = instruction.getArg(3)
        arg3.isSymb()

        arg2Value = self.GetValue(arg2)
        arg3Value = self.GetValue(arg3)

        self.checkLabel(arg1.Value)
        if not self.equal(arg2,arg3):
            self.Jump(arg1.Value)

    def InterpretExit(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 1, "EXIT")
        arg1 = instruction.getArg(1)
        arg1.isSymb()

        arg1Value = self.GetValue(arg1)

        if arg1Value["type"] != ArgumentType.INT:
            self.TypeErrorWithVariableOrNot(arg1,arg1,"EXIT, expected integer argument")

        if arg1Value["value"] not in range(0,50):
            ErrorHandler.printError("EXIT, wrong exit code",ErrorHandler.ERROR_WRONG_OPERAND_VALUE)

        exit(arg1Value["value"])

    def printDebug(self, message):
         print("DEBUG>"+message,file=sys.stderr)

    def InterpretDprint(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 1, "DPRINT")
        arg1 = instruction.getArg(1)
        arg1.isSymb()
        
        self.printDebug(self.GetValue(arg1)["value"])

    def InterpretBreak(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 0, "BREAK")
        print("DEBUG>Start of debug output",file=sys.stderr)
        print("DEBUG>Position in code: ",self.ProgramCounter+1,"/",len(self.Instructions),file=sys.stderr)
        
        self.printDebug("Stack of calling:")
        for val in self.CallStack:
            print (val,file=sys.stderr)

        self.printDebug("User Data stack:")
        for val in self.DataStack:
            print (val["value"],"(",val["type"],")",file=sys.stderr)

        self.printDebug("Global frame:")
        for val in self.GF:
            print(self.GF[val]["type"]," ",val," = ",self.GF[val]["value"],file=sys.stderr)
            
        self.printDebug("Local frame:")
        for val in self.LF:
            print(self.LF[val]["type"]," ",val," = ",self.LF[val]["value"],file=sys.stderr)
        
        self.printDebug("Temporary frame:")
        for val in self.TF:
            print(self.TF[val]["type"]," ",val," = ",self.TF[val]["value"],file=sys.stderr)

        print("DEBUG>End of debug output",file=sys.stderr)

    def InterpretInt2Float(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 2, "INT2FLOAT")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()

        arg2Value = self.GetValue(arg2)

        if arg2Value["type"] != ArgumentType.INT:
            self.TypeErrorWithVariableOrNot(arg2,arg2,"INT2FLOAT, Second urgument expected int")

        try:
            value = float(arg2Value["value"])
            self.SetVariable(arg1.Type,arg1.Value,{"type" : ArgumentType.FLOAT, "value": value})
        except ValueError:
            ErrorHandler.printError("INT2FLOAT, error", ErrorHandler.ERROR_RUNTIME_MISSING_VALUE)
    
    def InterpretFloat2Int(self, instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 2, "FLOAT2INT")
        arg1 = instruction.getArg(1)
        arg1.isVar()
        arg2 = instruction.getArg(2)
        arg2.isSymb()

        arg2Value = self.GetValue(arg2)

        if arg2Value["type"] != ArgumentType.FLOAT:
            self.TypeErrorWithVariableOrNot(arg2,arg2,"FLOAT2INT, Second urgument expected float")

        try:
            value = int(arg2Value["value"])
            self.SetVariable(arg1.Type,arg1.Value,{"type" : ArgumentType.INT, "value": value})
        except ValueError:
            ErrorHandler.printError("FLOAT2INT, error", ErrorHandler.ERROR_RUNTIME_MISSING_VALUE)

    def InterpretClears(self,instruction):
        self.DataStack = []

    def InterpretStackInstructionWith1Arguments(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 0, instruction.Opcode)
        
        try:
            arg1 = self.DataStack.pop()

            inst = Instruction()
            
            inst.setArg(1, Argument(ArgumentType.STACK, None))
            inst.setArg(2, Argument(arg1["type"], arg1["value"]))
            inst.Opcode = instruction.Opcode[:-1] #remove last char
            
            self.InstructionMapper(inst)

        except IndexError: #todo.. access to empty stack
            ErrorHandler.printError("Try to pop from empty data stack",ErrorHandler.ERROR_RUNTIME_MISSING_VALUE)

    def InterpretStackInstructionWith2Arguments(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 0, instruction.Opcode)
        try:
            arg2 = self.DataStack.pop()
            arg1 = self.DataStack.pop()

            inst = Instruction()
            
            inst.setArg(1, Argument(ArgumentType.STACK, None))
            inst.setArg(2, Argument(arg1["type"], arg1["value"]))
            inst.setArg(3, Argument(arg2["type"], arg2["value"]))
            inst.Opcode = instruction.Opcode[:-1] #remove last char
            
            self.InstructionMapper(inst)
            
        except IndexError:
            ErrorHandler.printError("Try to pop from empty data stack",ErrorHandler.ERROR_RUNTIME_MISSING_VALUE)

    def InterpretStackInstructionWith3Arguments(self,instruction):
        self.CheckArgumentCount(instruction.getArgCount(), 1, instruction.Opcode)
        try:
            arg2 = self.DataStack.pop()
            arg1 = self.DataStack.pop()

            inst = Instruction()
            inst.setArg(1, instruction.getArg(1))
            inst.setArg(2, Argument(arg1["type"], arg1["value"]))
            inst.setArg(3, Argument(arg2["type"], arg2["value"]))
            inst.Opcode = instruction.Opcode[:-1] #remove last char

            self.InstructionMapper(inst)
            
        except IndexError:
            ErrorHandler.printError("Try to pop from empty data stack",ErrorHandler.ERROR_RUNTIME_MISSING_VALUE)

    mapper = {
            "DEFVAR": InterpretDefvar,
            "MOVE"  : InterpretMove,
            "CREATEFRAME" : InterpretCreateFrame,
            "PUSHFRAME" : InterpretPushFrame,
            "POPFRAME"  : InterpretPopFrame,
            "CALL" : InterpretCall,
            "RETURN" : InterpretReturn,
            "PUSHS" : InterpretPushs,
            "POPS" : InterpretPops,
            "ADD" : InterpretAdd,
            "SUB" : InterpretSub,
            "MUL" : InterpretMul,
            "IDIV" : InterpretIdiv,
            "DIV" : InterpretDiv,
            "LT" : InterpretLt,
            "GT" : InterpretGt,
            "EQ" : InterpretEq,
            "AND" : InterpretAnd,
            "OR" : InterpretOr,
            "NOT" : InterpretNot,
            "INT2CHAR" : InterpretInt2Char,
            "STRI2INT" : InterpretStri2Int,
            "READ" : InterpretRead,
            "WRITE" : InterpretWrite,
            "CONCAT" : InterpretConcat,
            "STRLEN" : InterpretStrlen,
            "GETCHAR" : InterpretGetChar,
            "SETCHAR" : InterpretSetChar,
            "TYPE" : InterpretType,
            "LABEL" : InterpretLabel,
            "JUMP" : InterpretJump,
            "JUMPIFEQ" : InterpretJumpIfEq,
            "JUMPIFNEQ" : InterpretJumpIfNeq,
            "EXIT" : InterpretExit,
            "BREAK" : InterpretBreak,
            "DPRINT" : InterpretDprint,
            "INT2FLOAT" : InterpretInt2Float,
            "FLOAT2INT" : InterpretFloat2Int,
            "CLEARS" : InterpretClears,
            "ADDS" : InterpretStackInstructionWith2Arguments,
            "SUBS" : InterpretStackInstructionWith2Arguments,
            "MULS" : InterpretStackInstructionWith2Arguments,
            "DIVS" : InterpretStackInstructionWith2Arguments,
            "IDIVS" : InterpretStackInstructionWith2Arguments,
            "LTS" : InterpretStackInstructionWith2Arguments,
            "GTS" : InterpretStackInstructionWith2Arguments,
            "EQS" : InterpretStackInstructionWith2Arguments,
            "ANDS" : InterpretStackInstructionWith2Arguments,
            "ORS" : InterpretStackInstructionWith2Arguments,
            "NOTS" : InterpretStackInstructionWith1Arguments,
            "INT2CHARS" : InterpretStackInstructionWith1Arguments,
            "STRI2INTS" : InterpretStackInstructionWith2Arguments,
            "INT2FLOATS" : InterpretStackInstructionWith1Arguments,
            "FLOAT2INTS" : InterpretStackInstructionWith1Arguments,
            "JUMPIFEQS" : InterpretStackInstructionWith3Arguments,
            "JUMPIFNEQS" : InterpretStackInstructionWith3Arguments
        }

    def InstructionMapper(self, instruction):
        func = self.mapper.get(instruction.Opcode)
        if func is not None:        
            return func(self,instruction)
        else:
            ErrorHandler.printError("Unknown instruction "+instruction.Opcode,ErrorHandler.ERROR_UNEXPECTED_XML)

    def InterpretFile(self):
        self.XmlParser.checkHeader()
        #Preprocessing
        for self.Instruction in self.Instructions:
            if self.isPreprocessed():            
                self.InstructionMapper(self.Instruction)

        #Interpretation
        while self.ProgramCounter < len(self.Instructions):
            self.Instruction = self.Instructions[self.ProgramCounter]
            
            if not self.isPreprocessed():
                if self.Statistics is not None:
                    self.Statistics.InstructionExecutedIncrement(self.Instruction)
                self.Instruction.HotCounter += 1
                self.InstructionMapper(self.Instruction)
            
            self.ProgramCounter += 1

        if self.Statistics is not None:
            self.Statistics.SetStatisticHot(self.Instructions)
