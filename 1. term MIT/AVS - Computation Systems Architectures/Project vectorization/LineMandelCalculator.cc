/**
 * @file LineMandelCalculator.cc
 * @author FULL NAME <xlogin00@stud.fit.vutbr.cz>
 * @brief Implementation of Mandelbrot calculator that uses SIMD paralelization over lines
 * @date DATE
 */
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <malloc.h>

#include <stdlib.h>
#include <cstring>


#include "LineMandelCalculator.h"


LineMandelCalculator::LineMandelCalculator (unsigned matrixBaseSize, unsigned limit) :
	BaseMandelCalculator(matrixBaseSize, limit, "LineMandelCalculator")
{
	// @TODO allocate & prefill memory
	
	
	_data = (int *)_mm_malloc(height * width * sizeof(int), 64);
	_line = (int *)_mm_malloc(width * sizeof(int), 64);
	_lineR = (float *)_mm_malloc(width * sizeof(float), 64);
	_lineRinit = (float *)_mm_malloc(width * sizeof(float), 64);
	_lineI = (float *)_mm_malloc(width * sizeof(float), 64);
    _limitInit = (int *)_mm_malloc(width * sizeof(int), 64);
	
	for (int j = 0; j < width; j++)
	{
		_limitInit[j] = limit;
	}
}

LineMandelCalculator::~LineMandelCalculator() {
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
}

int * LineMandelCalculator::calculateMandelbrot () {
	// @TODO implement the calculator & return array of integers


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

	for (int i = 0; i < height/2; i++)
	{
		//TODO... calculate just half of matrix
		float im = _y_start + i * _dy;
		
		#pragma omp simd  linear(lineR, lineI) aligned(lineR, lineI: 64)
		for (int j = 0; j < width; j++)
		{
			lineR[j] = _x_start + j * _dx;
			lineI[j] = im;
		}

		memcpy(lineRinit, lineR, width * sizeof(float));
    	memcpy(line, limitInit, width * sizeof(int));

		for (int l = 0; l < limit; ++l)
		{
			float rplusi = 100000.0f;

			#pragma omp simd reduction(min:rplusi) linear(lineR, lineI, line, lineRinit) aligned(lineR, lineI, line, lineRinit: 64)
			for (int j = 0; j < width; j++)
			{
				float zReal = lineR[j]; // current real value
				float zImag = lineI[j]; // current imaginary value
				
				float r2 = zReal * zReal;
				float i2 = zImag * zImag;
								
				float r2plusi2 = r2 + i2;

				
				//rplusi = r2plusi2 < rplusi ? r2plusi2 : rplusi;

				//line[j] = r2plusi2 > 4.0f && line[j] > l ? l : line[j];
				
				if(r2plusi2 < rplusi){
					rplusi = r2plusi2;
				}

				if (r2plusi2 > 4.0f && line[j] > l){
					line[j] = l;
				}

				lineI[j] = 2.0f * zReal * zImag + im;
				lineR[j] = r2 - i2 + lineRinit[j];
			}

			if (rplusi > 4.0f){
				break;	
			}
		}
		
    	memcpy(data + i*width, line, width * sizeof(int));
		
    	memcpy(data + (height - i - 1)*width, line, width * sizeof(int)); //apply symetry
	}

	
	return data;
}
