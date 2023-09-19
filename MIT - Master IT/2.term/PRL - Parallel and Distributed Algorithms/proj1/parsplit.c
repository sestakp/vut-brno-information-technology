/*
 * PRL Project
 * VUT FIT BRNO
 * 2023
 * Author: Pavel Šesták
 * */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <math.h>
#include "mpi.h"

#define ROOT 0
#define FILENAME "./numbers"
#define EOF_UNSIGNED 255
#define ERROR 1
#define SUCCESS 0


int throwError(const char* messgae){
	fprintf(stderr, "%s\n",messgae);
	MPI_Finalize();
	return ERROR;
}

void printArray(const char* arrayName, int* array, int length){
	printf("%s: ",arrayName);
		for(int i = 0; i < length; i++){
			printf("%d", array[i]);
			if(i+1 < length){
				printf(", ");
			}
		}
		printf("\n");
}

int main (int argc, char **argv){

	MPI_Init(&argc, &argv);
		
	int rank, size;

	MPI_Comm_rank(MPI_COMM_WORLD, &rank);
	MPI_Comm_size(MPI_COMM_WORLD, &size);

	uint elementCount = 0;
	unsigned char* numberArray = NULL;

	unsigned char median;
	int lLengths[size];
	int eLengths[size];
	int gLengths[size];
	
	int preLLengths[size] = {0};
	int preELengths[size] = {0};
	int preGLengths[size] = {0};

	int* L = NULL;
	int* E = NULL;
	int* G = NULL;

	if(rank == ROOT){
		
		FILE *fp = fopen(FILENAME, "rb");
		if(fp == NULL){ return throwError("CANNOT OPEN FILE"); }
		
		//calculate number of elements in file, because each char represent one number
		fseek( fp , 0L , SEEK_END);
		elementCount = ftell( fp );
		rewind( fp );

		numberArray = (unsigned char*)malloc(elementCount);

		if(numberArray == NULL){
			if(fclose(fp) == EOF){ return throwError("CANNOT CLOSE FILE"); }
			return throwError("CANNOT ALLOCATE MEMORY");
		}

		unsigned char c;
		int i = 0;
		fprintf(stderr,"Array: ");
		while((c = fgetc(fp)) != EOF_UNSIGNED){
        	fprintf(stderr,"%d,", c);
			numberArray[i++] = c;
		}
		fprintf(stderr,"\n");

		median = numberArray[(int)ceil(elementCount/2.0) - 1];
		
		if(fclose(fp) == EOF){ 
			free(numberArray);
			return throwError("CANNOT CLOSE FILE"); 
		}


		L = (int*)malloc(size*sizeof(int));
		if(L == NULL){
			free(numberArray);
			return throwError("CANNOT ALLOCATE MEMORY");
		}

		E = (int*)malloc(size*sizeof(int));
		if(E == NULL){
			free(L);
			free(numberArray);
			return throwError("CANNOT ALLOCATE MEMORY");
		}

		G = (int*)malloc(size*sizeof(int));
		if(G == NULL){
			free(E);
			free(L);
			free(numberArray);
			return throwError("CANNOT ALLOCATE MEMORY");
		}
	}

	//Broadcast informations about number of elements and median
	MPI_Bcast(&elementCount, 1, MPI_INT, ROOT, MPI_COMM_WORLD);
	MPI_Bcast(&median, 1, MPI_CHAR, ROOT, MPI_COMM_WORLD);

	// Allocate memory for sub_array
	int subArraySize = elementCount/size;
    unsigned char *sub_array = (unsigned char*) malloc(subArraySize);
	
	if(sub_array == NULL){ 
		if(rank == ROOT){
			free(G);
			free(E);
			free(L);
			free(numberArray);
		}
		return throwError("CANNOT ALLOCATE MEMORY"); 
	}

	//Problem partitioning and distributing to subprocess
	MPI_Scatter(numberArray, subArraySize, MPI_CHAR, sub_array, subArraySize, MPI_CHAR, ROOT, MPI_COMM_WORLD);

	int lLength = 0, eLength = 0, gLength = 0;

	for(int i = 0; i < subArraySize; i++){
		if(sub_array[i] < median){ lLength++; }
		else if (sub_array[i] > median){ gLength++; }
		else{ eLength++; }
	}

	char Lp[lLength] = {0}, Ep[eLength] = {0}, Gp[gLength] = {0};

	int lIndex = 0, eIndex = 0, gIndex = 0;

	for(int i = 0; i < subArraySize; i++){
		if(sub_array[i] < median){ Lp[lIndex++] = sub_array[i]; }
		else if (sub_array[i] > median){ Gp[gIndex++] = sub_array[i]; }
		else{ Ep[eIndex++] = sub_array[i]; }
	}
	

	//Share lengths of arrays L,E,G between processes
	MPI_Allgather(&lLength, 1, MPI_INT, lLengths, 1, MPI_INT, MPI_COMM_WORLD);
	MPI_Allgather(&eLength, 1, MPI_INT, eLengths, 1, MPI_INT, MPI_COMM_WORLD);
	MPI_Allgather(&gLength, 1, MPI_INT, gLengths, 1, MPI_INT, MPI_COMM_WORLD);
	
	int preLLength = 0, preELength = 0, preGLength = 0;

	//calculate sum of prefixes
	for(int i = 0; i < rank; i++){
		preLLength += (int)lLengths[i];
		preELength += (int)eLengths[i];
		preGLength += (int)gLengths[i];
	}

	//share sum of prefixes for length
	MPI_Allgather(&preLLength, 1, MPI_INT, preLLengths, 1, MPI_INT, MPI_COMM_WORLD);
	MPI_Allgather(&preELength, 1, MPI_INT, preELengths, 1, MPI_INT, MPI_COMM_WORLD);
	MPI_Allgather(&preGLength, 1, MPI_INT, preGLengths, 1, MPI_INT, MPI_COMM_WORLD);
	

	//send L,E,G list of each process to root main lists
	MPI_Gatherv(Lp, lLength, MPI_INT, L, lLengths, preLLengths, MPI_INT, ROOT, MPI_COMM_WORLD);
	MPI_Gatherv(Ep, eLength, MPI_INT, E, eLengths, preELengths, MPI_INT, ROOT, MPI_COMM_WORLD);
	MPI_Gatherv(Gp, gLength, MPI_INT, G, gLengths, preGLengths, MPI_INT, ROOT, MPI_COMM_WORLD);

	if(rank == ROOT){

		lLength = 0;
		eLength = 0;
		gLength = 0;

		for(int i = 0; i < size; i++){
			lLength += lLengths[i];
			eLength += eLengths[i];
			gLength += gLengths[i];
		}
	
		printArray("L", L, lLength);
		printArray("E", E, eLength);
		printArray("G", G, gLength);


		
		free(G);
		free(E);
		free(L);
		free(numberArray);
	}
	
	free(sub_array);
	MPI_Finalize();
	return SUCCESS;
}
