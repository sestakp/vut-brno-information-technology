#include <stdio.h>
#include <stdlib.h>
#include "data_type_queue.h"
#include "debug_tool.h"
#include "global_variables.h"

int main(){
   fprintf(stderr,"testing data_type_queue\n");

   //init queue
   Data_type_queue_init();

   //try get item
   Data_type_queue_dequeue();

   //push item
   Data_type_T item = DT_INT;
   Data_type_queue_enqueue(item);
   Data_type_queue_print();
   
   //try get item
   item = Data_type_queue_dequeue();
   fprintf(stderr,"I get %d \n", item);
   Data_type_queue_print();

   //push more item
   item = DT_INT;
   Data_type_queue_enqueue(item);
   item = DT_FLOAT;
   Data_type_queue_enqueue(item);
   item = DT_STRING;
   Data_type_queue_enqueue(item);
   Data_type_queue_print();

   //get 2
   item = Data_type_queue_dequeue();
   fprintf(stderr,"I get %d \n", item);
   item = Data_type_queue_dequeue();
   fprintf(stderr,"I get %d \n", item);
   Data_type_queue_print();

   //destruct queue
   Data_type_queue_dtor();
   Data_type_queue_print();

   //try descruct descruted
   Data_type_queue_dtor();

   return 0;
    
}
