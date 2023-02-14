#!/usr/local/bin/python3
import argparse #library to parse arguments
import re #library for regular expressions
from include.interpret.Interpreter import Interpreter
from include.interpret.ErrorHandler import ErrorHandler
from include.interpret.Statistics import Statistics
import sys

EXIT_SUCCESS = 0

def ParseArguments():
    
    parser = argparse.ArgumentParser(description='Handle arguments')
    parser.add_argument('--source', dest='source', type = str, help='Source file with xml')
    parser.add_argument('--input', dest='input', type = str, help='Input file with inputs for interpretation')
    parser.add_argument('--stats', dest='stats', type = str, help='')
    parser.add_argument('--insts', dest='insts',  help='', action='store_true')
    parser.add_argument('--hot', dest='hot',  help='', action='store_true')
    parser.add_argument('--vars', dest='vars',  help='', action='store_true')
    global args
    try:
        args = parser.parse_args()
    except SystemExit:
        if len(sys.argv) == 2 and (sys.argv[1] == "-h" or sys.argv[1] == "--help"):
            exit(0)

        ErrorHandler.printError("Invalid argument,  --help for help",ErrorHandler.ERROR_ARGUMENTS)

    if args.input is None and args.source is None:
        ErrorHandler.printError("source or input parameter must be inserter, type --help for help",ErrorHandler.ERROR_INPUT_FILE)
    elif args.source is None:
        args.source = sys.stdin 

    if args.insts or args.hot or args.vars:
        if not args.stats:
            ErrorHandler.printError("Statistic argument without --stats, type --help for help",ErrorHandler.ERROR_ARGUMENTS)

############# MAIN #############

ParseArguments()

statistics = None
if args.stats is not None:
    statistics = Statistics()

interpreter = Interpreter(args.source, args.input, statistics)
interpreter.InterpretFile()

if args.stats is not None:
    statistics.printStats(args.stats,len(sys.argv),sys.argv)


exit(EXIT_SUCCESS)