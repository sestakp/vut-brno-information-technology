 
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
Launch example: 
*/
#include <stdio.h>
#include <string.h>
int main(int argc, char *argv[])
{
    char* str1 = "Ahoj";
    char* str2 = "Ahoj";
    //char* str3 = "Ahojky";

    if(argc != 3)
    {
        printf("Bad arguments...\n");
        return 0;
    }
        if((strcmp(argv[1],argv[2])) == 0)
        {
            printf("%s is equals to %s\n",argv[1],argv[2]);
        }
        else
        {
            printf("String are not equals\n");
        }




    return 0;
}