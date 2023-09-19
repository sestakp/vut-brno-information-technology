# Turing Machine simulator in Prolog
This program get filename from stdin which contains rules for Turing machine and input tape. Then confiogrations of Turing Machine are printed to stdout.

Author: Pavel Šesták (xsesta07)
Year: 2023

# Instructions for use
Example of inputs are in test files with suffix .in. Program can be launched using interpret swipl. Example of launch with arguments is in Makefile.

# Algorithm describe
Program read from arguments filename. Then this file is opened and read to array of strings which are split by newline symbol. Then this array is splitted to last line and rest to separe rules and input tape for Turing machine. Rules are parsed by sub_atom function and then stored in prolog database with command assert. This function is recursive to parse all rules. After that file is closed and Input tape returned into main (rules are in prolog database). After that simulation of turing machine can begin. Turing machine get input and return list of configurations. To avoid infinite runs there is steps limit for Turing machine. Function for Turing machine step has separely handled access to position -1 with head and reach limit of steps. Reaching final state is also in separed function. Rest of turing machine logic is in last function, which read current symbol on tape and find rule for current state and symbol. Then function decrement number of steps and base on new symbol modify tape and head position and recursively call turing machine step function. In main is finally printed final configuration.

# Tests
Tests can be run from makefile, target name is test. Each test has 3 files. File with in extension is input, out is expected output and plout is real output.