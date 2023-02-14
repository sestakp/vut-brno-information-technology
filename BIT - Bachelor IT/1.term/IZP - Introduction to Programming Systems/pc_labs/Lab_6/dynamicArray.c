#include <stdio.h>
#include <stdlib.h>

int *Allocate(int size)
{
    int *p = malloc(size*sizeof(int));
    if(p != NULL)
        return p;
    else
    {
        printf("Chyba alokace \n");
        return NULL;
    }

}

void Deallocate(int *p)
{
    free(p);
}

void fill_array(FILE *pFile, int *array, int size)
{

}

/*
EXAMPLE OF array.txt:
212
22
121
1
11
1212
13
12
3
*/

int main()
{

    int mysize;
    FILE *f;
    f = fopen("/array.txt","r");
    fscanf(f,"%d",&mysize);

    int size = 20;
    int *p = Allocate(size);
    p[0] = 1;
    Deallocate(p);
    return 0;
}