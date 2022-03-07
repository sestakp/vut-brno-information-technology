#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <sstream>
#include "consumerPriceIndex.hpp"
#include "ConsumerBasket.hpp"
#include <algorithm>
#include <string.h>

using namespace std;

#ifndef CSV_READER_HPP
#define CSV_READER_HPP

class CsvReader{
    public:
    static vector<ConsumerPriceIndexes> readConsumerPriceIndexes(string fileName);  
    static vector<ConsumerBasket> readConsumerBasket(string fileName);
};

#endif /* CSV_READER_HPP */


