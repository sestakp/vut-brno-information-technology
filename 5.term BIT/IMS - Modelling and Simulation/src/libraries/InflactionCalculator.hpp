


#ifndef INFLATION_CALCULATOR_HPP
#define INFLATION_CALCULATOR_HPP

#include <vector>
#include "./ConsumerBasket.hpp"
#include "./consumerPriceIndex.hpp"
#include "../models/PersonLife.hpp"

class InflationCalculator{
    public:
        static vector<double> CalculateInflation(vector<ConsumerBasket> ConsumerBaskets, vector<ConsumerPriceIndexes> ConsumerPriceIndexes);
        static vector<ConsumerBasket> BasketCoeficients(vector<ConsumerBasket> ConsumerBaskets, PersonLife *PersonLife);
};

#endif