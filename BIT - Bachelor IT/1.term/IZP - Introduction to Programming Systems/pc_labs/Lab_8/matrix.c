#include <stdio.h>
#include <stdlib.h>

typedef struct matrix
{
    unsigned rows;
    unsigned cols;
    float *data;
}matrix_t;

matrix_t matricConstructor(unsigned rows,unsigned cols)
{
    matrix_t matrix;
    matrix.rows = rows;
    matrix.cols = cols;
    matrix.data = malloc(rows * cols * sizeof(float));
    return matrix;
}

void matrixDestructor(matrix_t *matrix)
{
    free(matrix->data);
}

void set_item(float value,unsigned row, unsigned col,matrix_t *matrix)
{
    matrix->data[matrix->cols*(row) + col] = value;
}

float get_item(unsigned row, unsigned col,matrix_t *matrix)
{
    return matrix->data[matrix->cols*(row) + col];
}

//Initializing a matrix
void init(matrix_t *matrix)
{
    int x = 0;
    for (unsigned i = 0; i < matrix->rows;i++)
    {
        for(unsigned j = 0; j < matrix->cols;j++)
        {
            x++;
            set_item(x,i,j,matrix);
            
        }
    }
}

void print(matrix_t *matrix)
{
    float x;
    for (unsigned i = 0; i < matrix->rows;i++)
    {
        for(unsigned j = 0; j < matrix->cols;j++)
        {
            x = get_item(i,j,matrix);
            printf("%3.0lf, ",x);
        }
        printf("%c",'\n');
    }
}

void fMySwap(float* a,float* b)
{
    float pom = *a;
    *a = *b;
    *b = pom;
}

float *get_itemAdd(unsigned row, unsigned col,matrix_t *matrix)
{
    return &matrix->data[matrix->cols*(row) + col];
}

void matrixSwap(matrix_t *matrix, unsigned row1, unsigned row2)
{
    for(unsigned i = 0; i < matrix->cols;i++)
    //Getting address of two numbers and swap
       fMySwap(get_itemAdd(row1,i,matrix),get_itemAdd(row2,i,matrix));
}

/*
 *Function: MatrixMultiplayer multiply two matrixs. Source  matrix will be OVERWRITED with result
 */
void MatrixMultiplayer(matrix_t* source, matrix_t* destination)
{
    //NOT YET COMPLETED
    
    
    if(source->rows != destination->cols)
    {
        source->cols = -1;
    }
    else
    {
    	float sum = 0;
    	for(unsigned i = 0; i < source->cols;i++)
    	{
        	for (unsigned j = 0; j < destination->rows;j++)
        	{
            		for(unsigned k = 0; k < destination->rows;k++)
            		{
				printf("Sum of item  on pos %d %d = %lf, on pos %d %d = %lf \n",j,k,get_item(j,k,source),k,j,get_item(k,j,destination));
				sum += get_item(j,k,source) * get_item(k,j,destination);	
            		}
			printf("next cell \n");
	    		printf("sum %lf setting on %d %d\n",sum,i,j);
	    		set_item(sum,i,j,source);
	    		sum = 0;
        	}
    	}
    }

    if(source->rows != destination->cols)
    {
        source->cols = -1;
    }
}

int main()
{
    matrix_t matrix = matricConstructor(4,3);
    matrix_t matrix2 = matricConstructor(3,4);
    if(matrix.data == NULL || matrix2.data == NULL)
        return -1;

    printf("Init matrix\n");
    printf("MAT A\n");
    init(&matrix);
    print(&matrix);
    
    printf("\nMAT B\n");
    init(&matrix2);
    print(&matrix2);

    printf("\n Swap rows \n");
    matrixSwap(&matrix,2,3);
    print(&matrix);
    printf("%c",'\n');
    

    MatrixMultiplayer(&matrix,&matrix2);
    printf("\n Multiplyed matrix A * B \n");
    print(&matrix);

    matrixDestructor(&matrix2);
    matrixDestructor(&matrix);
    return 0;
}

