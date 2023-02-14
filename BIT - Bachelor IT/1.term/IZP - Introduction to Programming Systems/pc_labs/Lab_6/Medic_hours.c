 
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
BUGGS.. NEED TO FINISH //TODO...

*/

#include <stdio.h>
#include <stdbool.h>
#include <time.h>

struct time_s { int hour; int min; };
typedef struct oh {
  struct time_s start;
  struct time_s finish;
} OfficeHours; // ordinacni hodiny

// DoW = day of week
enum DoW { DOW_PO, DOW_UT, DOW_ST, DOW_CT, DOW_PA, DOW_SO, DOW_NE,
    DOW_COUNT };

// Load from a file officehours
int fload_oh(FILE *f, OfficeHours oh[][2])
{
    for (int i = DOW_PO; i < DOW_COUNT; i++)
    {
        // load moring hours
        if (fscanf(f, "%d:%d %d:%d", &oh[i][0].start.hour, &oh[i][0].start.min, &oh[i][0].finish.hour, &oh[i][0].finish.min) != 4)
            return -1;
        // load afternoon hours
        if (fscanf(f, "%d:%d %d:%d", &oh[i][1].start.hour, &oh[i][1].start.min , &oh[i][1].finish.hour , &oh[i][1].finish.min) != 4)
            return -1;
    }
    return DOW_COUNT;
}

int load_oh(char *filename, OfficeHours oh[][2])
{
    FILE *f = fopen(filename,"r");
    if (f == NULL)
        return -1;
    int code = fload_oh(f, oh);
    fclose(f);
    return code;
}

 //cviceni za domaci ukol
bool is_now_open(OfficeHours oh[][2])
{
    time_t now = time(NULL);
    struct tm *datetime = localtime(&now);

    if(
        oh[datetime->tm_wday -1 % 7][0].start.hour < datetime->tm_hour
    )
        {
            return true;
        }

    if(
        oh[datetime->tm_wday -1 % 7][1].start.hour < datetime->tm_hour
    )
        {
            return true;
        }



         return false;
}

/**
 *example input file hodiny_lekar.txt, -1:0 mean medic isn't in office.
 * terminu neordinuje:
 * 7:00 11:30 13:00 16:30
 * -1:0 -1:0  13:00 16:30
 * 9:00 12:00 14:00 18:00
 * 9:00 12:00 13:00 14:00
 * 9:00 11:30 -1:0 -1:0
 */

int main()
{
    OfficeHours oh[DOW_COUNT][2]; // dva intervaly hodin v jednom dni
    // oh je pole sedmi (DOW_COUNT=7) poli, kde kazdy prvek je pole dvou struktur ordinacnich hodin.

    // nacteni dat ze souboru
    load_oh("hodiny_lekar.txt", oh);

    /* konstrukce lze zobecnit pomoci dat napriklad takto: */
    char *open_str[] = {"zavreno", "otevreno"};
    printf("Lekar ma ted %s.\n", open_str[is_now_open(oh)]);

    /* ale zde citelnejsi zapis je vsak tento: */
   /* if (is_now_open(oh))
        printf("Lekar ma ted otevreno.\n");
    else
        printf("Lekar ma ted zavreno.\n");*/

    return 2;
}