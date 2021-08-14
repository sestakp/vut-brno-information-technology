import xml.etree.ElementTree as ET #library to parse XML
from include.interpret.ErrorHandler import ErrorHandler
from include.interpret.Instruction import Instruction
from include.interpret.Argument import Argument
import sys #import for writing into stderr
import re

class xmlParser:
    """
    Encapsulate work with XML and fill interpreter structures for working with source code

    Methods
    -------
    
    __init__(inputFile)
        If inputFile is not specified standard input is analyzed
        else analyze inputFile

    getInstructions()
        return array of instructions sorted by order
    """

    def __init__(self, inputFile):
        try:
            if(inputFile == ""):
                self.tree = ET.parse(sys.stdin)
            else:
                self.tree = ET.parse(inputFile)
        except ET.ParseError:
            ErrorHandler.printError("Input xml file is not well formed",ErrorHandler.ERROR_NOT_WELL_FORM)

    def getRoot(self):
        """
            Get root element of current XML tree
        """
        return self.tree.getroot()
    
    def checkHeader(self):
        """
            Check header of XML source code if is syntax correct
        """
        root = self.getRoot()
        if root.tag != "program":
            ErrorHandler.printError("Missing root tag program",ErrorHandler.ERROR_UNEXPECTED_XML)
        
        #strip remove whitespace
        if(root.text != None and root.text.strip() != ""):
            print(root.text)
            ErrorHandler.printError("Root tag program contains text",ErrorHandler.ERROR_UNEXPECTED_XML)

        for attr in root.attrib:
            if attr == "language":
                if root.attrib["language"] != "IPPcode21":
                    ErrorHandler.printError("Unsuported language, expected IPPcode21",ErrorHandler.ERROR_UNEXPECTED_XML)

            elif attr != "name" and attr != "description":
                ErrorHandler.printError("Unknown attribut "+attr+" for program element",ErrorHandler.ERROR_UNEXPECTED_XML)

    def getInstructions(self):

        root = self.getRoot()

        instructions_arr = []

        for instruction in root:
            
            if instruction.tag != "instruction":
                ErrorHandler.printError("Unknown element in program",ErrorHandler.ERROR_UNEXPECTED_XML)

            inst = Instruction()
            try:
                inst.setOpcode(instruction.attrib["opcode"])
            except:
                ErrorHandler.printError("Missing opcode attribute for instruction",ErrorHandler.ERROR_UNEXPECTED_XML)

            try:
                inst.setOrder(instruction.attrib["order"])
            except:
                ErrorHandler.printError("Missing order attribute for instruction",ErrorHandler.ERROR_UNEXPECTED_XML)


            for arg in instruction:
                reResult = re.findall(r"^arg\d$", arg.tag)
                if (reResult):
                    argIndex = arg.tag[3]
                else:
                    ErrorHandler.printError("Unknown child for instruction"+inst.getOpcode(),ErrorHandler.ERROR_UNEXPECTED_XML)
                
                try:
                    argument = Argument(arg.attrib["type"], arg.text)
                except:
                    ErrorHandler.printError("Missing type attribute for instruction "+inst.getOpcode()+" argument",ErrorHandler.ERROR_UNEXPECTED_XML)

                inst.setArg(argIndex,argument)

            #check if exist instruction with same order
            if any(x.Order == inst.Order for x in instructions_arr):
                ErrorHandler.printError("Duplicity in order attribute",ErrorHandler.ERROR_UNEXPECTED_XML)
            
            if inst.Order < 1:
                ErrorHandler.printError("Order attribute must be positive number",ErrorHandler.ERROR_UNEXPECTED_XML)

            instructions_arr.append(inst)
        
        instructions_arr = sorted(instructions_arr, key=lambda x: x.Order)
        return instructions_arr