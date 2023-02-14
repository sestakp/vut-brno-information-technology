from __future__ import print_function
import sys #used for error print

class ErrorHandler:
    """
        This class encapsulate handling error codes

    """
    ERROR_ARGUMENTS = 10
    ERROR_INPUT_FILE = 11

    ERROR_NOT_WELL_FORM = 31
    ERROR_UNEXPECTED_XML = 32
    ERROR_SEMANTIC_REDEFINITION = 52
    ERROR_RUNTIME_WRONG_OPERAND_TYPE = 53
    ERROR_UNDEFINED_VARIABLE = 54
    ERROR_RUNTIME_NOEXIST_FRAME = 55
    ERROR_RUNTIME_MISSING_VALUE = 56
    ERROR_WRONG_OPERAND_VALUE = 57
    ERROR_WORK_WITH_STRING = 58

    ERROR_INTERN = 99

    @staticmethod
    def printError(errorMessage,errorCode):
        """
            Print error message specified by argument on standard error output and exit interpreting with specified errorCode
        """        

        print("ERROR>"+errorMessage,file=sys.stderr)
        exit(errorCode)
    
    @staticmethod
    def printDebug(debugMessage):
        """
            Print debug message on standard error output
        """
        print("DEBUG>"+debugMessage,file=sys.stderr)