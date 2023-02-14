#include "PersonLife.hpp"

using namespace std;


PersonLife::PersonLife(unsigned long days, 
                       double probabilityGoToRestaurant, 
                       double probabilityGoByCar, 
                       double probabilityToVisitCulture, 
                       double probabilitySleepOnHotel){
    this->days = days;
    this->probabilityGoToRestaurant = probabilityGoToRestaurant;
    this->probabilityGoByCar = probabilityGoByCar + 0.01;
    this->probabilityToVisitCulture = probabilityToVisitCulture;
    this->probabilitySleepOnHotel = probabilitySleepOnHotel;
    this->needNewClothesGenerator = new NeedNewClothesGenerator(this, 2 WEEK);
    this->needNewFurnitureGenerator = new NeedNewFurnitureGenerator(this, 6 MONTH);
    this->needPillsGenerator = new NeedPillsGenerator(this, 4 MONTH);
}

void PersonLife::Behavior(){
    
    this->needNewClothesGenerator->Activate();
    this->needNewFurnitureGenerator->Activate();
    this->needPillsGenerator->Activate();

    double rand = 0;

    for(int i = 0; i < this->days; i++){
        
        rand = Random();
    
        if(rand < this->probabilityGoToRestaurant){ //Restaurant
            this->boardingAndAccommodationsCoefficient += Exponential(200);
        }
        else{ //Eat at home
            this->foodCoefficient += Exponential(100);
        }

        //Eating
		Wait(Exponential(1));


        rand = Random();
        if(rand < PROBABILITY_GO_BY_TAXI){ // Go by taxi
            this->transportCoefficient += Exponential(550);
        }
        else if(rand < (this->probabilityGoByCar)){ // Go by car
            this->transportCoefficient += Exponential(150);
        }
        else{ // Go by bycicle

        }
        
        //Transport to work
        Wait(Exponential(1));

        //Work
        Wait(8);

        //Transport to home
        Wait(Exponential(1));

        rand = Random();
        if(rand < this->probabilityToVisitCulture){ //He visit culture
            this->cultureCoefficient += Exponential(200);
        }

        //Free time
        Wait(5);

        rand = Random();
        if(rand < this->probabilitySleepOnHotel){
            this->boardingAndAccommodationsCoefficient += Exponential(800);
        }

        //Sleep
        Wait(8);

    }
}


PersonLife::~PersonLife(){
    delete this->needNewClothesGenerator;
    delete this->needNewFurnitureGenerator;
    delete this->needPillsGenerator;
    
}