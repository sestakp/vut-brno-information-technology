 
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
Launch example: ./Age <<name>> <<age>>
just print arguments
*/

#include <stdio.h>
#include <stdlib.h>

                    //dvoj dimenzionalni pole znaku
int main(int argc, char* argv[])
{
    if (argc > 2)
    {
        printf("hallo %s, your age is: %s\n", argv[1],argv[2]);
        return 0;
    }
    else if(argc > 1)
    {
        printf("hallo my friend, your age is: %s\n", argv[1]);
        return 0;
    }
    else
    {
        printf("Hallo, Im sorry your age was not defined\n");
    }
    return 0;
}