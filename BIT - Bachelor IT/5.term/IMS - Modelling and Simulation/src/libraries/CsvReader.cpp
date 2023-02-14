#include "CsvReader.hpp"

using namespace std;

bool invalidChar (char c) 
{  
    return !isprint( static_cast<unsigned char>( c ) );
} 
void stripUnicode(string & str) 
{ 
    str.erase(std::remove_if(str.begin(),str.end(), invalidChar), str.end());  
}


vector<ConsumerPriceIndexes> CsvReader::readConsumerPriceIndexes(string fileName){
    
    vector<ConsumerPriceIndexes> indexes;
	vector<vector<string>> content;
	vector<string> row;
	string line, word;

	fstream file (fileName, ios::in);
	if(file.is_open())
	{
		while(getline(file, line))
		{
            ConsumerPriceIndexes index;
            
			row.clear();
 
			stringstream str(line);

			while(getline(str, word, ';')){
                stripUnicode(word);
				row.push_back(word);
            }

            index.Year = stoi(row[0]);
            index.Total = stod(row[1]);
            index.FoodAndNonAlcoholicDrinks = stod(row[2]);
            index.AlcoholicDrinksAndTabacco = stod(row[3]);
            index.ClothesAndShoes = stod(row[4]);
            index.HousingAndEnergy = stod(row[5]);
            index.Furnishings = stod(row[6]);
            index.Health = stod(row[7]);
            index.Transport = stod(row[8]);
            index.PostAndTelecommunication = stod(row[9]);
            index.RecreationAndCulture = stod(row[10]);
            index.Education = stod(row[11]);
            index.BoardingAndAccommodations = stod(row[12]);
            index.OtherGoodsAndServices = stod(row[13]);


			indexes.push_back(index);
		}
	}
	else{
		cout<<"Could not open the file\n";
    }

    return indexes;
}


vector<ConsumerBasket> CsvReader::readConsumerBasket(string fileName){
    
    vector<ConsumerBasket> indexes;
	vector<vector<string>> content;
	vector<string> row;
	string line, word;

	fstream file (fileName, ios::in);
	if(file.is_open())
	{
		while(getline(file, line))
		{
            ConsumerBasket index;
            
			row.clear();
 
			stringstream str(line);

			while(getline(str, word, ';')){
                stripUnicode(word);
				row.push_back(word);
            }

            index.Year = stoi(row[0]);
            index.FoodAndNonAlcoholicDrinks = stod(row[1]);
            index.AlcoholicDrinksAndTabacco = stod(row[2]);
            index.ClothesAndShoes = stod(row[3]);
            index.HousingAndEnergy = stod(row[4]);
            index.Furnishings = stod(row[5]);
            index.Health = stod(row[6]);
            index.Transport = stod(row[7]);
            index.PostAndTelecommunication = stod(row[8]);
            index.RecreationAndCulture = stod(row[9]);
            index.Education = stod(row[10]);
            index.BoardingAndAccommodations = stod(row[11]);
            index.OtherGoodsAndServices = stod(row[12]);


			indexes.push_back(index);
		}
	}
	else{
		cout<<"Could not open the file\n";
    }

    return indexes;
}