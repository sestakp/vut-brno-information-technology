 #include "NeedNewClothesGenerator.hpp"

using namespace std;

NeedNewClothesGenerator::NeedNewClothesGenerator(PersonLife *personLife, double meanValue) : personLife(personLife)
{
    this->meanValue = meanValue;
    this->personLife = personLife;
}


void NeedNewClothesGenerator::Behavior()
{
    Activate(Time+Exponential(this->meanValue));
    this->personLife->ClothesAndShoesCoefficient += Exponential(400);
}