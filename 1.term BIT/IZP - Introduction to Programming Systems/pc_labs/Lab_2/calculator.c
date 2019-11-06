 
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
*/

#include <stdio.h>

void Soucet(int x, int y);
void Rozdil(int x, int y);
void Soucin(int x, int y);
void Podil(int x, int y);

int main()
{
    int x,y;
    printf("Zadejte cislo 1: ");
    scanf("%d",&x);
    printf("\nZadejte cislo 2: ");
    scanf("%d",&y);

    Soucet(x,y);
    Rozdil(x,y);
    Soucin(x,y);
    Podil(x,y);
}

void Soucet(int x, int y)
{
    x = x + y;
    printf("Soucet: %d\n",x);
}

void Rozdil(int x, int y)
{
    x = x-y;
    printf("Rozdil: %d\n",x);
}
void Soucin(int x, int y)
{
    x = x*y;
    printf("Soucin: %d\n",x);
}
void Podil(int x, int y)
{
    float vys = x/y;
    printf("Podil: %f\n",vys);
}