#include "main.hpp"

using namespace std;
int main(int argc, char **argv){
    double probabilityGoToRestaurant = 0; 
    double probabilityGetByCar = 0;
    double probabilityToVisitCulture = 0;
    double probabilitySleepOnHotel = 0;
    string graphName;

    if( ! UserHandler::parseArguments(argc, 
                                      argv, 
                                      &probabilityGoToRestaurant, 
                                      &probabilityGetByCar, 
                                      &probabilityToVisitCulture, 
                                      &probabilitySleepOnHotel, 
                                      &graphName)){
        UserHandler::printHelp();
        return EXIT_FAILURE;
    }

    vector<ConsumerBasket> baskets = CsvReader::readConsumerBasket("./data/consumer_basket.csv");
    vector<ConsumerPriceIndexes> consumerPriceIndexes = CsvReader::readConsumerPriceIndexes("./data/Consumer_indexes.csv");

    auto simulatedInflations = PersonSimulator::simulate(probabilityGoToRestaurant, 
                                                         probabilityGetByCar, 
                                                         probabilityToVisitCulture, 
                                                         probabilitySleepOnHotel, 
                                                         baskets, 
                                                         consumerPriceIndexes);

    
    vector<double> years;
    vector<double> inflations;

    for(ConsumerPriceIndexes index : consumerPriceIndexes){
        years.push_back(index.Year);
        inflations.push_back(index.Total - 100);
    }

    GraphMaker::makeInflationGraph(years, 
                                   inflations, 
                                   simulatedInflations, 
                                   graphName, 
                                   probabilityGoToRestaurant, 
                                   probabilityGetByCar, 
                                   probabilityToVisitCulture, 
                                   probabilitySleepOnHotel);

    std::cerr << "Graph name: " << graphName << std::endl;
    return 0;
}






/*
    CsvReader reader;
    vector<ConsumerPriceIndexes> indexes;

    


    indexes = reader.readConsumerPriceIndexes("./data/inflation_rate_by_month.csv");
    
    vector<double> years;
    vector<double> inflations;

    for(ConsumerPriceIndexes index : indexes){
        years.push_back((double)index.Year + (double)index.Month/12);
        inflations.push_back(index.Total);
    }

    GraphMaker graphMaker;
    graphMaker.makeInflationGraph(years, inflations);
*/