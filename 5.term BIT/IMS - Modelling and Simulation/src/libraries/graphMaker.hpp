
#include "supportLib.hpp"
#include "pbPlots.hpp"
#include <vector>

using namespace std;

#ifndef GRAPH_MAKER_HPP
#define GRAPH_MAKER_HPP
class GraphMaker{
    public:
        static bool makeInflationGraph(vector<double> years, 
                                       vector<double> realInflations, 
                                       vector<double> calculatedInflations,
                                       string graphName,
                                       double probabilityGoToRestaurant, 
                                       double probabilityGetByCar, 
                                       double probabilityToVisitCulture, 
                                       double probabilitySleepOnHotel);
};

#endif