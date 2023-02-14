 #include "NeedPillsGenerator.hpp"

using namespace std;

NeedPillsGenerator::NeedPillsGenerator(PersonLife *personLife, double meanValue) : personLife(personLife)
{
    this->meanValue = meanValue;
    this->personLife = personLife;
}


void NeedPillsGenerator::Behavior()
{
    Activate(Time+Exponential(this->meanValue));
    this->personLife->HealthCoefficient += Exponential(600);
}