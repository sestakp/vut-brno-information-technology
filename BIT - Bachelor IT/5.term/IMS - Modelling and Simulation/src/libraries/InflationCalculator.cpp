#include "./InflactionCalculator.hpp"

vector<double> InflationCalculator::CalculateInflation(vector<ConsumerBasket> ConsumerBaskets, vector<ConsumerPriceIndexes> ConsumerPriceIndexes)
{

  vector<double> personInflation;
      
  for (int i = 0; i < ConsumerBaskets.size() ; i++) // iterate over years
  {

    double inflation;
    inflation = ConsumerBaskets[i].FoodAndNonAlcoholicDrinks * (ConsumerPriceIndexes[i].FoodAndNonAlcoholicDrinks / 100);
    inflation += ConsumerBaskets[i].AlcoholicDrinksAndTabacco * (ConsumerPriceIndexes[i].AlcoholicDrinksAndTabacco / 100);
    inflation += ConsumerBaskets[i].ClothesAndShoes * (ConsumerPriceIndexes[i].ClothesAndShoes / 100);
    inflation += ConsumerBaskets[i].HousingAndEnergy * (ConsumerPriceIndexes[i].HousingAndEnergy / 100);
    inflation += ConsumerBaskets[i].Furnishings * (ConsumerPriceIndexes[i].Furnishings / 100);
    inflation += ConsumerBaskets[i].Health * (ConsumerPriceIndexes[i].Health / 100);
    inflation += ConsumerBaskets[i].Transport * (ConsumerPriceIndexes[i].Transport / 100);
    inflation += ConsumerBaskets[i].PostAndTelecommunication * (ConsumerPriceIndexes[i].PostAndTelecommunication / 100);
    inflation += ConsumerBaskets[i].RecreationAndCulture * (ConsumerPriceIndexes[i].RecreationAndCulture / 100);
    inflation += ConsumerBaskets[i].Education * (ConsumerPriceIndexes[i].Education / 100);
    inflation += ConsumerBaskets[i].BoardingAndAccommodations * (ConsumerPriceIndexes[i].BoardingAndAccommodations / 100);
    inflation += ConsumerBaskets[i].OtherGoodsAndServices * (ConsumerPriceIndexes[i].OtherGoodsAndServices / 100);

    personInflation.push_back(inflation - 100.0);
  }

  return personInflation;
}

vector<ConsumerBasket> InflationCalculator::BasketCoeficients(vector<ConsumerBasket> ConsumerBaskets, PersonLife *PersonLife)
{   

    vector<ConsumerBasket> baskets;


    for (ConsumerBasket basket : ConsumerBaskets) // iterate over years
    {

        double total = basket.BoardingAndAccommodations +
                       basket.ClothesAndShoes +
                       basket.FoodAndNonAlcoholicDrinks +
                       basket.RecreationAndCulture +
                       basket.Transport +
                       basket.Furnishings +
                       basket.Health;


        double totalPrice = PersonLife->boardingAndAccommodationsCoefficient +
                            PersonLife->ClothesAndShoesCoefficient +
                            PersonLife->cultureCoefficient +
                            PersonLife->foodCoefficient +
                            PersonLife->FurnishingsCoefficient +
                            PersonLife->HealthCoefficient +
                            PersonLife->transportCoefficient;
        

        basket.BoardingAndAccommodations = total * PersonLife->boardingAndAccommodationsCoefficient / totalPrice;
        basket.ClothesAndShoes = total * PersonLife->ClothesAndShoesCoefficient / totalPrice;
        basket.RecreationAndCulture = total * PersonLife->cultureCoefficient / totalPrice;
        basket.FoodAndNonAlcoholicDrinks = total * PersonLife->foodCoefficient / totalPrice;
        basket.Furnishings = total * PersonLife->FurnishingsCoefficient / totalPrice;
        basket.Health = total * PersonLife->HealthCoefficient / totalPrice;
        basket.Transport = total * PersonLife->transportCoefficient / totalPrice;

        baskets.push_back(basket);
    }

    return baskets;
}