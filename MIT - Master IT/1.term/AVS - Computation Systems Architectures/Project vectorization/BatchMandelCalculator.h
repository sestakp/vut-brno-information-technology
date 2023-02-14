/**
 * @file BatchMandelCalculator.h
 * @author FULL NAME <xlogin00@stud.fit.vutbr.cz>
 * @brief Implementation of Mandelbrot calculator that uses SIMD paralelization over small batches
 * @date DATE
 */
#ifndef BATCHMANDELCALCULATOR_H
#define BATCHMANDELCALCULATOR_H

#include <BaseMandelCalculator.h>

#include <cstring>

class BatchMandelCalculator : public BaseMandelCalculator
{
public:
    BatchMandelCalculator(unsigned matrixBaseSize, unsigned limit);
    ~BatchMandelCalculator();
    int * calculateMandelbrot();

private:
    // @TODO add all internal parameters

    size_t blockSizeL1 = 256;
	const size_t blockSizeL2 = /*256*/512;
	const size_t blockSizeL3 = /*1024*/1024;


    
    int *_data;
    int *_line;
	float *_lineR;
	float *_lineRinit;
	float *_lineI;
	unsigned int *_jGlobals;
    int *_limitInit;
    int MatrixBaseSize;
    
    int * _calculateMandelbrotSmall();
    int * _calculateMandelbrotBig();
    
};

#endif
