#include "graphMaker.hpp"

using namespace std;

bool GraphMaker::makeInflationGraph(vector<double> years, 
									vector<double> realInflations, 
									vector<double> calculatedInflations, 
									string graphName,
                                    double probabilityGoToRestaurant, 
                                    double probabilityGetByCar, 
                                    double probabilityToVisitCulture, 
                                    double probabilitySleepOnHotel){
  bool success;
    StringReference *errorMessage = new StringReference();
	RGBABitmapImageReference *imageReference = CreateRGBABitmapImageReference();

	ScatterPlotSeries *series = GetDefaultScatterPlotSeriesSettings();
	series->xs = &years;
	series->ys = &realInflations;
	series->linearInterpolation = true;
	//series->lineType = toVector(L"dashed");
	series->lineThickness = 2;
	series->color = CreateRGBAColor(0,0,1,0.7);

	ScatterPlotSeries *series2 = GetDefaultScatterPlotSeriesSettings();
	series2->xs = &years;
	series2->ys = &calculatedInflations;
	series2->linearInterpolation = true;
	//series2->lineType = toVector(L"dashed");
	series2->lineThickness = 2;
	series2->color = CreateRGBAColor(1,0,0,1);

	
	ScatterPlotSettings *settings = GetDefaultScatterPlotSettings();
	settings->width = 1000;
	settings->height = 700;
	settings->autoBoundaries = true;
	settings->autoPadding = true;
	wstring title = L"Inflation (r: "+to_wstring(probabilityGoToRestaurant)+L", c: "+to_wstring(probabilityGetByCar)+L", v: "+to_wstring(probabilityToVisitCulture)+L", h: "+to_wstring(probabilitySleepOnHotel)+L")";
	settings->title = toVector(title.c_str());
	settings->xLabel = toVector(L"Years");
	settings->yLabel = toVector(L"Inflation rate");

	settings->scatterPlotSeries->push_back(series);
	settings->scatterPlotSeries->push_back(series2);

	success = DrawScatterPlotFromSettings(imageReference, settings, errorMessage);


    if(success){
        vector<double> *pngdata = ConvertToPNG(imageReference->image);
        WriteToFile(pngdata, "generatedData/"+graphName+".png");
        DeleteImage(imageReference->image);
	}else{
	    cerr << "Error: ";
        for(wchar_t c : *errorMessage->string){
            wcerr << c;
        }
        cerr << endl;
	}

	return !success;
}