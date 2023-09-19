/*
 * PRL Project
 * VUT FIT BRNO
 * 2023
 * Author: Pavel Šesták
 * */

#include "mpi.h"

#define ROOT 0
#define FILENAME "./numbers"
#define EOF_UNSIGNED 255
#define ERROR 1
#define SUCCESS 0
#define K 4
#include <math.h>
#include <stdint.h>
#include <float.h>


int throwError(const char* message, int* error){
	fprintf(stderr, "%s\n",message);
	(*error) = true;
	return ERROR;
}

void printArray(const char* arrayName, int* array, int length){
	printf("%s ",arrayName);
		for(int i = 0; i < length; i++){
			printf("%d", array[i]);
			if(i+1 < length){
				printf(", ");
			}
		}
		printf("\n");
}

double get_distance(unsigned char x, unsigned char center) {
    return abs(x - center);
}

int main (int argc, char **argv){
    
    MPI_Init(&argc, &argv);
		
	int rank, size;

	MPI_Comm_rank(MPI_COMM_WORLD, &rank);
	MPI_Comm_size(MPI_COMM_WORLD, &size);

	
    float centers[4];
    float oldCenters[4];
    int centerCounts[4];
    int sums[4];

    uint8_t elementCount = 0;
	uint8_t * numberArray = NULL;
	int error = false;

    if(rank == ROOT){
        FILE *fp = fopen(FILENAME, "rb");
		if(fp == NULL){ throwError("CANNOT OPEN FILE",&error); }
		
		//calculate number of elements in file, because each char represent one number
		fseek(fp, 0L, SEEK_END);
		elementCount = ftell(fp);
		rewind(fp);

		numberArray = (unsigned char*)malloc(elementCount);

		if(numberArray == NULL){
			if(fclose(fp) == EOF){ throwError("CANNOT CLOSE FILE",&error); }
			return throwError("CANNOT ALLOCATE MEMORY",&error);
		}

        int c;
		int i = 0;
		fprintf(stderr,"Array: ");
		
		while((c = fgetc(fp)) != EOF){

        	fprintf(stderr,"%d,", c);
			numberArray[i++] = (uint8_t)c;
		}
		fprintf(stderr,"\n");

        if(i < size){ throwError("Less numbers than processors", &error); }

        if(i % K != 0 || i > 32){ throwError("This program support from 4 to 32 numbers", &error); }

        for(int i = 0; i < K; i++){ centers[i] = numberArray[i]; }

        if(fclose(fp) == EOF){ throwError("CANNOT CLOSE FILE",&error); }
    }

	uint8_t myNumber;
	MPI_Scatter(numberArray, 1, MPI_UINT8_T, &myNumber, 1, MPI_UINT8_T, ROOT, MPI_COMM_WORLD);
	MPI_Bcast(&error, 1, MPI_INT, ROOT, MPI_COMM_WORLD);
	if(error){
		MPI_Finalize();
		return ERROR;
	}

	int same = false;
	while(!same) {

		MPI_Bcast(centers, 4, MPI_FLOAT, ROOT, MPI_COMM_WORLD);

		int myCenterCounts[4] = {0};
		int mySums[4] = {0};

		float minDistance = FLT_MAX;
		int minDistanceIndex = -1;
		for(int i = 0; i < K; i++){
			float dist = get_distance(myNumber, centers[i]);
			if(dist < minDistance){
				minDistance = dist;
				minDistanceIndex = i;
			}
		}
		myCenterCounts[minDistanceIndex] = myCenterCounts[minDistanceIndex] + 1.0;
		mySums[minDistanceIndex] = myNumber;

		//MPI_Reduce(void* send_data, void* recv_data, int count, MPI_Datatype datatype, MPI_Op op, int root, MPI_Comm communicator)
		MPI_Reduce(myCenterCounts, centerCounts, K, MPI_INT, MPI_SUM, ROOT, MPI_COMM_WORLD);
		MPI_Reduce(mySums, sums, K, MPI_INT, MPI_SUM, ROOT, MPI_COMM_WORLD);

		if(rank == ROOT){

			same = true;
			for(int i = 0; i < K; i++){
				centers[i] = sums[i]/(float)centerCounts[i];
				if(oldCenters[i] != centers[i]){
					same = false;
				}
				oldCenters[i] = centers[i];
			}

			if(same){
				int result[K][elementCount];
				memset(result, 0, sizeof(result));

				int resultIndexes[K] = {0};
				
				for(int i = 0; i < elementCount; i++){
					float minDistance = FLT_MAX;
					int minDistanceIndex = -1;
					for(int j = 0; j < K; j++){
						float dist = get_distance(numberArray[i], centers[j]);
						if(dist < minDistance){
							minDistance = dist;
							minDistanceIndex = j;
						}
					}
					result[minDistanceIndex][resultIndexes[minDistanceIndex]] = numberArray[i];
					resultIndexes[minDistanceIndex] +=1;
				}
				
				for(int i = 0; i < K; i++){
					char label[42];
					sprintf(label, "[%g]", centers[i]);
					printArray(label,result[i], resultIndexes[i]);
				}
				
			}
		}

		MPI_Bcast(&same, 1, MPI_INT, ROOT, MPI_COMM_WORLD);
	}


	MPI_Finalize();
    return SUCCESS;
}