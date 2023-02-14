#ifndef PERSON_NORMAL_DAY_HPP
#define PERSON_NORMAL_DAY_HPP

#include <simlib.h>
#include <iostream>
#include "../libraries/CsvReader.hpp"
#include "../libraries/consumerPriceIndex.hpp"
#include "../libraries/ConsumerBasket.hpp"
#include "TimeConstants.hpp"

#define PROBABILITY_GO_BY_TAXI 0.02

class NeedNewClothesGenerator;
class NeedNewFurnitureGenerator;
class NeedPillsGenerator;

class PersonLife : public Process {
  public:
    PersonLife(unsigned long days, 
               double probabilityGoToRestaurant, 
               double probabilityGoByCar, 
               double probabilityToVisitCulture, 
               double probabilitySleepOnHotel);
    void Behavior() override;
    unsigned int foodCoefficient = 0;
    unsigned int transportCoefficient = 0;
    unsigned int cultureCoefficient = 0;
    unsigned int boardingAndAccommodationsCoefficient = 0;
    unsigned int ClothesAndShoesCoefficient = 0;
    unsigned int FurnishingsCoefficient = 0;
    unsigned int HealthCoefficient = 0;
    ~PersonLife() override;

  private:
    /**
     * Number of days to simulate
     */
    unsigned long days;
    double probabilityGoToRestaurant;
    double probabilityGoByCar;
    double probabilityToVisitCulture;
    double probabilitySleepOnHotel;

    NeedNewClothesGenerator *needNewClothesGenerator;
    NeedNewFurnitureGenerator *needNewFurnitureGenerator;
    NeedPillsGenerator * needPillsGenerator;
};

#include "NeedNewClothesGenerator.hpp"
#include "NeedNewFurnitureGenerator.hpp"
#include "NeedPillsGenerator.hpp"

#endif