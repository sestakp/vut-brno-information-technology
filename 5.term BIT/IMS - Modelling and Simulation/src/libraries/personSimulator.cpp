#include "personSimulator.hpp"

#define SIMULATION_START_TIME 0.0
#define DAYS 365

using namespace std;

//
#define SIMULATION_END_TIME DAYS * 24 //In hours

vector<double> PersonSimulator::simulate(double probabilityGoToRestaurant, 
                               double probabilityGetByCar, 
                               double probabilityToVisitCulture, 
                               double probabilitySleepOnHotel,
                               vector<ConsumerBasket> baskets,
                               vector<ConsumerPriceIndexes> consumerPriceIndexes){
    cerr << "***********************" << endl;
    cerr << "START OF SIMULATION WITH PARAMS" << endl;
    cerr << "Probability go to restaurant: " << probabilityGoToRestaurant << endl;
    cerr << "Probability get by card: " << probabilityGetByCar << endl;
    cerr << "Probability visit culture: " << probabilityToVisitCulture << endl;
    cerr << "Probability sleep on hotel: " << probabilitySleepOnHotel << endl;
    cerr << "***********************" << endl;

    auto personLife = new PersonLife(DAYS, probabilityGoToRestaurant,probabilityGetByCar, probabilityToVisitCulture, probabilitySleepOnHotel);
    Init(SIMULATION_START_TIME, SIMULATION_END_TIME);
    personLife->Activate();
    Run();

    std::cerr << "Food Coefficient: " << personLife->foodCoefficient << std::endl;
    std::cerr << "Transport Coefficient: " << personLife->transportCoefficient << std::endl;
    std::cerr << "Culture Coefficient: " << personLife->cultureCoefficient << std::endl;
    std::cerr << "BoardingAndAccommodations Coefficient: " << personLife->boardingAndAccommodationsCoefficient << std::endl;
    std::cerr << "ClothesAndShoes Coefficient: " << personLife->ClothesAndShoesCoefficient << std::endl;
    std::cerr << "Furnishings Coefficient: " << personLife->FurnishingsCoefficient << std::endl;
    std::cerr << "Health Coefficient: " << personLife->HealthCoefficient << std::endl;
    std::cerr << endl << endl;

    auto newBaskets = InflationCalculator::BasketCoeficients(baskets, personLife);
    auto inflations = InflationCalculator::CalculateInflation(newBaskets, consumerPriceIndexes);
    
    std::cerr << "new basket vs basket" << endl;
    for(int i = 0; i < newBaskets.size(); i++){
        std::cerr <<  "Year: " << newBaskets[i].Year << std::endl;
        std::cerr << "FoodAndNonAlcoholicDrinks: " << newBaskets[i].FoodAndNonAlcoholicDrinks << "  " << baskets[i].FoodAndNonAlcoholicDrinks << endl;
        std::cerr << "AlcoholicDrinksAndTabacco: " << newBaskets[i].AlcoholicDrinksAndTabacco << "  " << baskets[i].AlcoholicDrinksAndTabacco << endl;
        std::cerr << "ClothesAndShoes: " << newBaskets[i].ClothesAndShoes << "  " << baskets[i].ClothesAndShoes << endl;
        std::cerr << "HousingAndEnergy: " << newBaskets[i].HousingAndEnergy << "  " << baskets[i].HousingAndEnergy << endl;
        std::cerr << "Furnishings: " << newBaskets[i].Furnishings << "  " << baskets[i].Furnishings << endl;
        std::cerr << "Health: " << newBaskets[i].Health << "  " << baskets[i].Health << endl;
        std::cerr << "Transport: " << newBaskets[i].Transport << "  " << baskets[i].Transport << endl;
        std::cerr << "PostAndTelecommunication: " << newBaskets[i].PostAndTelecommunication << "  " << baskets[i].PostAndTelecommunication << endl;
        std::cerr << "RecreationAndCulture: " << newBaskets[i].RecreationAndCulture << "  " << baskets[i].RecreationAndCulture << endl;
        std::cerr << "Education: " << newBaskets[i].Education << "  " << baskets[i].Education << endl;
        std::cerr << "BoardingAndAccommodations: " << newBaskets[i].BoardingAndAccommodations << "  " << baskets[i].BoardingAndAccommodations << endl;
        std::cerr << "OtherGoodsAndServices: " << newBaskets[i].OtherGoodsAndServices << "  " << baskets[i].OtherGoodsAndServices << endl;
        std::cerr << "Inflation: " << inflations[i] << endl;
        std::cerr << endl << endl;
    }


    //SIMLIB_statistics.Output();


    
    cerr << "***********************" << endl;
    cerr << "END OF SIMULATION" << endl;
    cerr << "***********************" << endl;

    return inflations;
}