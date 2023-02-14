#include "UserHandler.hpp"

using namespace std;

    bool UserHandler::parseArguments(int argc, 
                               char**argv, 
                               double *probabilityGoToRestaurant, 
                               double *probabilityGetByCar, 
                               double *probabilityToVisitCulture, 
                               double *probabilitySleepOnHotel,
                               string *graphName){
    
    int opt;
	char *err;
	static const char *sOpts = "r:c:v:h:g:";
	static const struct option lOpts[] = {
		{"prestaurant", required_argument, nullptr, 'r'},
		{"pcar", required_argument, nullptr, 'c'},
		{"pvisitculture", required_argument, nullptr, 'v'},
		{"photel", required_argument, nullptr, 'h'},
        {"gname", required_argument, nullptr, 'g'},
	};

	while ((opt = getopt_long(argc, argv, sOpts, lOpts, nullptr)) != -1)
	{   
		switch (opt)
		{
            case 'g':
                *graphName = optarg;
                break;
            case 'r':
                try{
                    *probabilityGoToRestaurant = strtod(optarg, &err);
                    if (*err != '\0')
                    {
                        throw invalid_argument("Probability is in interval <0;1>");
                    }
                    if(*probabilityGoToRestaurant < 0 || *probabilityGoToRestaurant > 1){
                        throw invalid_argument("Probability is in interval <0;1>");
                    }
                }
                catch(const std::invalid_argument& ia){
                    cerr << "Invalid argument probability go to restaurant: " << ia.what() << endl;
                    return false;
                }
                break;

            case 'c':
                try{
                    *probabilityGetByCar = strtod(optarg, &err);
                    if (*err != '\0')
                    {
                        throw invalid_argument("Probability is in interval <0;1>");
                    }
                    if(*probabilityGetByCar < 0 || *probabilityGetByCar > 1){
                        throw invalid_argument("Probability is in interval <0;1>");
                    }
                }
                catch(const std::invalid_argument& ia){
                    cerr << "Invalid argument probability get by car: " << ia.what() << endl;
                    return false;
                }
                break;
            case 'v':
                try{
                    *probabilityToVisitCulture = strtod(optarg, &err);
                    if (*err != '\0')
                    {
                        throw invalid_argument("Probability is in interval <0;1>");
                    }

                    if(*probabilityToVisitCulture < 0 || *probabilityToVisitCulture > 1){
                        throw invalid_argument("Probability is in interval <0;1>");
                    }
                }
                catch(const std::invalid_argument& ia){
                    cerr << "Invalid argument probability to visit culture: " << ia.what() << endl;
                    return false;
                }
                break;
            case 'h':
                try{
                    *probabilitySleepOnHotel = strtod(optarg, &err);
                    if (*err != '\0')
                    {
                        throw invalid_argument("Probability is in interval <0;1>");
                    }
                    if(*probabilitySleepOnHotel < 0 || *probabilitySleepOnHotel > 1){
                        throw invalid_argument("Probability is in interval <0;1>");
                    }
                }
                catch(const std::invalid_argument& ia){
                    cerr << "Invalid argument probability to visit culture: " << ia.what() << endl;
                    return false;
                }
                break;
			case '?':
			default:
                cerr << "Unknown argument" << endl;
				return false;
		}
	}

    if(argc != 11){
        return false;
    }

	if (optind < argc)
	{
		return false;
	}


    return true;
}

void UserHandler::printHelp(){
    cerr << "SIMULATION PROGRAM" << endl;
    cerr << "This program simulate one year in economic and calculate his personalized inflation" << endl;
    cerr << "Arguments: " << endl;
    cerr << "Probability go to restaurant: -r --prestaurant" << endl;
    cerr << "Probability get by car: -c --pcar" << endl;
    cerr << "Probability to visit culture: -v --pvisitculture" << endl;
    cerr << "Probability sleep on hotel: -h --photel" << endl;
}