 
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
Reading from standard input. Printing count of chars in standard input.  

Launch example ./read_stdin <file.txt
*/


#include <stdio.h>

int main()
{
    int i = 0;
    while(getchar() != EOF)
        i++;
    printf("%d\n",i);
    return 0;
}