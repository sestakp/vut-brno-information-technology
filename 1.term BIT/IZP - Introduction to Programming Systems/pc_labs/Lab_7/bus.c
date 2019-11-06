 
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
Launch example: ./app bus_stop actual_hour actual_minute 
Application load from file jizdnirad.txt
information about bus route
File example:
5 #number of stops
zas1 0  #zas1 is  name of bus stop, number is time in minute. Its delay from first stop for example. If bus start at 8:30 on zas5 will be in 9:02
zas2 4
zas3 8
zas4 16
zas5 32
3 #number of routes per day
8hod 30min #time, when bus is on first stop
9hod 23min
10hod 35min
#before using this file remove all comments with #

App can read file, write file and write you next time when bus will be stop on your stop.
*/


#include <stdio.h>
#include <stdlib.h>

struct cas_t
{
    int hour;
    int min;
};

typedef struct
{
    int stopc;
    char **stop;
    int *cas_jizdy;
    int pocet_spoju;
    struct cas_t *odjezdy;
}bus_t;


char **alloc_sparse_matrix(int rows, int cols)
{
    char **matrix;
    matrix = malloc(rows * sizeof(char*)); // vysvětlete velikost
    if (matrix == NULL)
        return NULL;
    int i;
    for (i = 0; i < rows; i++)
    {
        matrix[i] = malloc(cols * sizeof(float)); // vysvětlete velikost
        if (matrix[i] == NULL)
        {
            for (; i >= 0; i--)
                free(matrix[i]); // vysvětlete důvod
            free(matrix); // vysvětlete důvod
            return NULL;
        }
    }
    return matrix;
}

bus_t load()
{
    bus_t bus;
    FILE * jizdnirad = fopen("jizdnirad.txt","r");

    fscanf(jizdnirad,"%d",&bus.stopc);

    bus.stop = alloc_sparse_matrix(bus.stopc,11);
    bus.cas_jizdy = malloc(sizeof(int)*bus.stopc);

    for(int i = 0; i < bus.stopc;i++)
        fscanf(jizdnirad,"%10s %d",bus.stop[i],&bus.cas_jizdy[i]);

    fscanf(jizdnirad,"%d",&bus.pocet_spoju);

    bus.odjezdy = malloc(sizeof(struct cas_t)*bus.pocet_spoju);

    for(int i = 0; i < bus.pocet_spoju;i++)
        fscanf(jizdnirad,"%dhod %dmin",&bus.odjezdy[i].hour,&bus.odjezdy[i].min);

    return bus;
}

void print(bus_t bus)
{
    printf("%d\n",bus.stopc);

    for(int i = 0; i < bus.stopc;i++)
       printf("%s %d\n",bus.stop[i],bus.cas_jizdy[i]);

    printf("%d\n",bus.pocet_spoju);

    for(int i = 0; i < bus.pocet_spoju;i++)
        printf("%dhod %dmin\n",bus.odjezdy[i].hour,bus.odjezdy[i].min);
}

void print_spoje(char* stop,struct cas_t cas, bus_t bus)
{
    int actual_time;
    int bus_time;
    actual_time = cas.hour*60 + cas.min;
    int delay;

    for(int i = 0; i < bus.stopc;i++)
        if(bus.stop[i] == stop)
        {
            delay = bus.cas_jizdy[i];
            break;
        }

    for(int i = 0; i < bus.pocet_spoju;i++)
    {
        bus_time = (bus.odjezdy[i].hour*60 + bus.odjezdy[i].min)+delay;
        if (actual_time < bus_time)
            printf("dalsi bus jede v: %dhod %dmin\n",bus.odjezdy[i].hour,bus.odjezdy[i].min);
    }
}

void FreeMem()
{
    //TODO....
}

int main(int argc, char *argv[])
{
    struct cas_t cas;
    if(argc != 4)
        {
            printf("ARGUMENTS 1] stop, 2]hour 3]min\n");
            return -1;
        }
    char *zastavka = argv[1];
    cas.hour = atoi(argv[2]);
    cas.min =  atoi(argv[3]);
    bus_t bus = load();
    print(bus);
    print_spoje(zastavka,cas,bus);
    return 0;
}