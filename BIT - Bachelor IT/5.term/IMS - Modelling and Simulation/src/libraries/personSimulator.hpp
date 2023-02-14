#ifndef PERSON_SIMULATOR_HPP
#define PERSON_SIMULATOR_HPP

#include <simlib.h>
#include <iostream>
#include "../models/PersonLife.hpp"
#include "./InflactionCalculator.hpp"
#include "./graphMaker.hpp"

class PersonSimulator{
    public:
        static vector<double> simulate(double probabilityGoToRestaurant, 
                             double probabilityGetByCar, 
                             double probabilityToVisitCulture, 
                             double probabilitySleepOnHotel,
                             vector<ConsumerBasket> baskets,
                             vector<ConsumerPriceIndexes> consumerPriceIndexes);
};

#endif