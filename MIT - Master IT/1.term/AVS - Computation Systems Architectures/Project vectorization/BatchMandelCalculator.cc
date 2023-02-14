/**
 * @file BatchMandelCalculator.cc
 * @author FULL NAME <xlogin00@stud.fit.vutbr.cz>
 * @brief Implementation of Mandelbrot calculator that uses SIMD paralelization over small batches
 * @date DATE
 */

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <malloc.h>

#include <stdlib.h>
#include <stdexcept>

#include "BatchMandelCalculator.h"


BatchMandelCalculator::BatchMandelCalculator (unsigned matrixBaseSize, unsigned limit) :
	BaseMandelCalculator(matrixBaseSize, limit, "BatchMandelCalculator")
{
	// @TODO allocate & prefill memory
	MatrixBaseSize = matrixBaseSize;
	

	if(width < blockSizeL1*3){
		blockSizeL1 = width;
	}
	
	_data = (int *)_mm_malloc(height * width * sizeof(int), 64);
	_line = (int *)_mm_malloc(blockSizeL1 * sizeof(int), 64);
	_lineR = (float *)_mm_malloc(blockSizeL1 * sizeof(float), 64);
	_lineRinit = (float *)_mm_malloc(blockSizeL1 * sizeof(float), 64);
	_lineI = (float *)_mm_malloc(blockSizeL1 * sizeof(float), 64);
    _limitInit = (int *)_mm_malloc(blockSizeL1 * sizeof(int), 64);
	_jGlobals = (unsigned int *)_mm_malloc(blockSizeL1 * sizeof(unsigned int),64);

	
	
	/*for (int j = 0; j < height * width; j++)
	{
		_data[j] = limit;
	}*/


	for (int j = 0; j < blockSizeL1; ++j)
	{
		_limitInit[j] = limit;
	}
}

BatchMandelCalculator::~BatchMandelCalculator() {
	// @TODO cleanup the memory
	_mm_free(_data);
	_data = NULL;

	_mm_free(_line);
	_line = NULL;

	_mm_free(_lineR);
	_lineR = NULL;

	_mm_free(_lineI);
	_lineI = NULL;

	_mm_free(_lineRinit);
	_lineRinit = NULL;

	_mm_free(_limitInit);
	_lineRinit = NULL;

	_mm_free(_jGlobals);
	_jGlobals = NULL;


}




int * BatchMandelCalculator::calculateMandelbrot () {
		// @TODO implement the calculator & return array of integers
	if (MatrixBaseSize < blockSizeL3){
		return _calculateMandelbrotSmall();
	}
	else{
		return _calculateMandelbrotBig();
	}
}

/*
classic batching lines
*/
int * BatchMandelCalculator::_calculateMandelbrotSmall(){
	float _x_start = x_start; // minimal real value
	float _y_start = y_start; // minimal imag value
    float _dx = dx; // step of real vaues
	float _dy = dy; // step of imag values
	/*
	Without initialization variables in function aligned pragma not working
	*/
	int *data = _data;
	int *line = _line;
	float *lineR = _lineR;
	float *lineI = _lineI;
	float *lineRinit = _lineRinit;
	int *limitInit = _limitInit;

	__assume_aligned(lineI, 64);
	__assume_aligned(lineR, 64);
	__assume_aligned(line, 64);
	__assume_aligned(data, 64);
	__assume_aligned(lineRinit, 64);
	__assume_aligned(limitInit, 64);


	for (int i = 0; i < height/2; ++i)
	{
		//TODO... calculate just half of matrix
		float im = _y_start + i * _dy;
		

		for(int k = 0; k < width / blockSizeL1; ++k)
		{
			
			int jGlobal = k*blockSizeL1;

			#pragma omp simd linear(lineR, lineI) aligned(lineR, lineI: 64) simdlen(16)
			for (int j = 0; j < blockSizeL1; ++j)
			{
				lineR[j] = _x_start + (jGlobal + j) * _dx;
				lineI[j] = im;
			}

			memcpy(lineRinit, lineR, blockSizeL1 * sizeof(float));
			memcpy(line, limitInit, blockSizeL1 * sizeof(int));

			for (int l = 0; l < limit; ++l)
			{
				float rplusi = 100000.0f;

				#pragma omp simd reduction(min:rplusi) simdlen(16) linear(lineR, lineI, line, lineRinit) \
				aligned(lineR, lineI, line, lineRinit: 64)
				for (int j = 0; j < blockSizeL1; ++j)
				{

					float zReal = lineR[j]; // current real value
					float zImag = lineI[j]; // current imaginary value
					
					float r2 = zReal * zReal;
					float i2 = zImag * zImag;
									
					float r2plusi2 = r2 + i2;

					rplusi = r2plusi2 < rplusi ? r2plusi2 : rplusi;

					line[j] = r2plusi2 > 4.0f && line[j] > l ? l : line[j];
					
					/*if (r2plusi2 > 4.0f && data[i*width + jGlobal + j] > l){
						//line[j] = l;	
						data[i*width + jGlobal + j] = l;
						data[(height - i - 1)*width + jGlobal + j] = l;
					}*/

					lineI[j] = 2.0f * zReal * zImag + im;
					lineR[j] = r2 - i2 + lineRinit[j];
				}

				if (rplusi > 4.0f){
					break;	
				}
			}
			
			memcpy(data + i*width + jGlobal, line, blockSizeL1 * sizeof(int));
			
			memcpy(data + (height - i - 1)*width + jGlobal, line, blockSizeL1 * sizeof(int)); //apply symetry

			}
		
	}

	
	return data;
}



/*
My first implementation where I tried cache blocking. From the measurements, it turned out to be faster on bigger matrices
*/
int * BatchMandelCalculator::_calculateMandelbrotBig(){
	float _x_start = x_start; // minimal real value
	float _y_start = y_start; // minimal imag value
    float _dx = dx; // step of real vaues
	float _dy = dy; // step of imag values
	/*
	Without initialization variables in function aligned pragma not working
	*/
	int *data = _data;
	int *line = _line;
	float *lineR = _lineR;
	float *lineI = _lineI;
	float *lineRinit = _lineRinit;
	unsigned int *jGlobals = _jGlobals;
	int *limitInit = _limitInit;


	__assume_aligned(lineI, 64);
	__assume_aligned(lineR, 64);
	__assume_aligned(line, 64);
	__assume_aligned(data, 64);
	__assume_aligned(lineRinit, 64);
	__assume_aligned(jGlobals, 64);
	__assume_aligned(limitInit, 64);

	// @TODO implement the calculator & return array of integers

	// L3 blocking
	// Split the number of rows of the data matrix a few blocks
		
	for (size_t blockHeightL3 = 0; blockHeightL3 < height / 2 / blockSizeL3; ++blockHeightL3)
	{
		// Split the number of cols of the data matrix into a few blocks
		for (size_t blockWidthL3 = 0; blockWidthL3 < width / blockSizeL3; ++blockWidthL3)
		{
			// L2 blocking
			// Split the number of rows of the data matrix into a few blocks
			for (size_t blockHeightL2 = 0; blockHeightL2 < blockSizeL3 / blockSizeL2; ++blockHeightL2)
			{
				// Split the number of cols of the data matrix into a few blocks
				for (size_t blockWidthL2 = 0; blockWidthL2 < blockSizeL3 / blockSizeL2; ++blockWidthL2)
				{
					// L1 blocking
					// Split the number of rows of the data matrix into a few blocks
					for (size_t blockHeightL1 = 0; blockHeightL1 < blockSizeL2 / blockSizeL1; ++blockHeightL1)
					{
						// Split the number of cols of the data matrix into a few blocks
						for (size_t blockWidthL1 = 0; blockWidthL1 < blockSizeL2 / blockSizeL1; ++blockWidthL1)						{
							/*COMPUTE*/
							for (int i = 0; i < blockSizeL1; ++i)
							{
								
								const size_t iGlobal = blockHeightL3 * blockSizeL3 + blockHeightL2 * blockSizeL2 + blockHeightL1 * blockSizeL1 + i;
								
								//TODO... calculate just half of matrix
								float im = y_start + iGlobal * dy;
								
								#pragma omp simd linear(lineR,lineI, jGlobals) aligned(lineR, lineI, jGlobals : 64)
								for (int j = 0; j < blockSizeL1; ++j)
								{
									jGlobals[j] = blockWidthL3 * blockSizeL3 + blockWidthL2 * blockSizeL2 + blockWidthL1 * blockSizeL1 + j;
									lineR[j] = x_start + jGlobals[j] * dx;
									lineI[j] = im;
								}
								
								memcpy(lineRinit, lineR, blockSizeL1 * sizeof(float));
								memcpy(line, limitInit, blockSizeL1 * sizeof(int));

								
								for (int l = 0; l < limit; ++l)
								{
									float rplusi = 1000.0f;
									
									#pragma omp simd reduction(min:rplusi) linear(lineR,lineI,line) simdlen(16) aligned(lineR, lineI, line, lineRinit: 64)
									for (int j = 0; j < blockSizeL1; ++j)
									{
										float zReal = lineR[j]; // current real value
										float zImag = lineI[j]; // current imaginary value
										
										float r2 = zReal * zReal;
										float i2 = zImag * zImag;
										
										float r2plusi2 = r2 + i2;
										
										rplusi = (r2plusi2 < rplusi) ? r2plusi2 : rplusi;						
										line[j] = (r2plusi2 > 4.0f && line[j] > l) ? l : line[j];

										lineI[j] = 2.0f * zReal * zImag + im;
										lineR[j] = r2 - i2 + lineRinit[j];
									}

									if (rplusi > 4.0f){
										break;	
									}
								}
								
    							memcpy(data + iGlobal * width + jGlobals[0], line, blockSizeL1 * sizeof(int));

    						    memcpy(data + (height - iGlobal - 1)*width + jGlobals[0], line, blockSizeL1 * sizeof(int)); //apply symetry
								
							}
							/*END OF Compute*/
						}
					}// L1 blocking
				}
			}// L2 blocking

		}
	}// L3 blocking



	return data;
}
