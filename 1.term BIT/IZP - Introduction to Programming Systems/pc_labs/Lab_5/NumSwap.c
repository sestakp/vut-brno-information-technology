 
    /************************************************/
    /*                                              */		
    /*              gitlab.com/sestak               */
    /*                                              */          
    /*              github.com/alepir               */
    /*                                              */
    /*          Pavel Sestak (xsesta07)             */
    /*                                              */
    /*              7. 10. 2019                     */
    /*                                              */
    /*      Introduction to Programming Systems     */
    /*                                              */
    /*              1st year BITP                   */
    /*                                              */
    /*      VUT Faculty of Information Technology   */
    /*                                              */
    /************************************************/ 
    
/*
Swaping two numbers in array with pointers. Two functions, one need third variable, second is slower, 
because CPU need to calculate it. You can try it, by calculating in loop with command time (Linux).
*/
#include <stdio.h>

void mySwapCPU(int *a,int *b);
void mySwapRAM(int *a,int *b);

int main()
{
    int pole[5] = {40,-2,2,1,5};
    printf("Druhy prvek: %d, tretiprvek: %d\n",pole[1],pole[2]);
    mySwapCPU(&pole[1],&pole[2]);
    printf("Po prohozeni\nDruhy prvek: %d, tretiprvek: %d\n",pole[1],pole[2]);
    return 0;
}


/*
*   Function for swaping numbers without third variable
*/
void mySwapCPU(int *a, int *b)
{
    *a = *a + *b;  // a = a + b
    *b = *a - *b;  // b = a - b
    *a = *a - *b;  // a = a - b
}

void mySwapRAM(int *a, int *b)
{
    int pom = *a;
    *a = *b;
    *b = pom;
}