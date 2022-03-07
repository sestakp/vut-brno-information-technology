 #include "NeedNewFurnitureGenerator.hpp"

using namespace std;

NeedNewFurnitureGenerator::NeedNewFurnitureGenerator(PersonLife *personLife, double meanValue) : personLife(personLife)
{
    this->meanValue = meanValue;
    this->personLife = personLife;
}


void NeedNewFurnitureGenerator::Behavior()
{
    Activate(Time+Exponential(this->meanValue));
    this->personLife->FurnishingsCoefficient += Exponential(10000);
}