/*!
 * @file
 * @brief This file contains implementation of queue for data types
 *
 * @author Lukáš Plevač, xpleva07@stud.fit.vutbr.cz
 */


#include <stdlib.h>
#include "global_variables.h"
#include "data_type_queue.h"
#include "debug_tool.h"


#if defined(DEBUG)
void Data_type_queue_print() {
   
   Data_type_queue_item_T *item = data_type_queue.front;
   fprintf(stderr,"[INFO] printing DATA_TYPES queue:  front ->");
   while (item != NULL) {
      fprintf(stderr," %d ", item->type);

      item = item->next;
   }
   
   fprintf(stderr,"\n");
}
#endif

void Data_type_queue_init(){
    data_type_queue.front = NULL;
    data_type_queue.tail  = NULL;

    DEBUG_PRINT("INIT data_type_queue\n");
}

void Data_type_queue_enqueue(Data_type_T type) {

    DEBUG_PRINT("enqueue %d to data_type_queue\n", type);

    Data_type_queue_item_T *item = malloc(sizeof(Data_type_queue_item_T));
    if(item == NULL) {
        WARNING_PRINT("malloc fail\n");
        return; 
    }

    item->type = type;
    item->next = NULL;

    if (data_type_queue.front == NULL) { // nothing in queue
        data_type_queue.front = item;
        data_type_queue.tail  = item;
    } else {
        data_type_queue.tail->next  = item;
        data_type_queue.tail        = item;
    }
}

Data_type_T Data_type_queue_dequeue() {

    Data_type_T type;

    if (data_type_queue.front == NULL) { // nothing in queue
        WARNING_PRINT("dequeue from empty queue\n");
        return type; 
    }

    Data_type_queue_item_T *nextItem = data_type_queue.front->next;
    type = data_type_queue.front->type;

    free(data_type_queue.front);

    data_type_queue.front = nextItem;
    if (nextItem == NULL) { //not imortant but if some body whant work with it
        data_type_queue.tail = NULL;
    }

    DEBUG_PRINT("dequeue %d from data_type_queue\n", type);

    return type;
}

void Data_type_queue_dtor() {
    DEBUG_PRINT("destruct data_type_queue\n");
    
    while (data_type_queue.front != NULL) {
        Data_type_queue_dequeue();
    }

}

