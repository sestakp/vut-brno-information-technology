#ifndef ARGUMENT_PARSER_HPP
#define ARGUMENT_PARSER_HPP

#include <iostream>
#include <getopt.h>
#include <string>

using namespace std;

class UserHandler{
    public:
    static bool parseArguments(int argc, 
                               char**argv, 
                               double *probabilityGoToRestaurant, 
                               double *probabilityGetByCar, 
                               double *probabilityToVisitCulture, 
                               double *probabilitySleepOnHotel,
                               string *graphName);
    static void printHelp();
};

#endif