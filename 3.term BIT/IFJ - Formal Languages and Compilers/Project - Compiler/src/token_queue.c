/*!
 * @file
 * @brief This file contains implementation of queue for tokens
 *
 * @author Lukáš Plevač, xpleva07@stud.fit.vutbr.cz
 */


#include <stdlib.h>
#include "global_variables.h"
#include "token_queue.h"
#include "debug_tool.h"


#if defined(DEBUG)
void Token_queue_print() {
   
   Token_queue_item_T *item = token_queue.front;
   fprintf(stderr,"[INFO] printing TOKEN queue:  front ->");
   while (item != NULL) {
      fprintf(stderr," %d ", item->token.token_type);

      item = item->next;
   }
   
   fprintf(stderr,"\n");
}
#endif

void Token_queue_init() {
    token_queue.front = NULL;
    token_queue.tail  = NULL;

    DEBUG_PRINT("INIT token_queue\n");
}

int Token_queue_count() {
    int count = 0;

    Token_queue_item_T *item = token_queue.front;
    DEBUG_PRINT("[INFO] get count of TOKEN queue");
    while (item != NULL) {
      count++;
      item = item->next;
    }
   
   return count;
}

void Token_queue_enqueue(Token_T token) {

    DEBUG_PRINT("enqueue %d to token_queue\n", token.token_type);

    Token_queue_item_T *item = malloc(sizeof(Token_queue_item_T));
    if(item == NULL) {
        WARNING_PRINT("malloc fail\n");
        return; 
    }

    item->token = token;
    item->next = NULL;

    if (token_queue.front == NULL) { // nothing in queue
        token_queue.front = item;
        token_queue.tail  = item;
    } else {
        token_queue.tail->next  = item;
        token_queue.tail        = item;
    }
}

Token_T Token_queue_dequeue() {

    Token_T token;

    if (token_queue.front == NULL) { // nothing in queue
        WARNING_PRINT("dequeue from empty queue\n");
        return token; 
    }

    Token_queue_item_T *nextItem = token_queue.front->next;
    token = token_queue.front->token;

    free(token_queue.front);

    token_queue.front = nextItem;
    if (nextItem == NULL) { //not imortant but if some body whant work with it
        token_queue.tail = NULL;
    }

    DEBUG_PRINT("dequeue %d from token_queue\n", token.token_type);

    return token;
}

void Token_queue_dtor() {
    DEBUG_PRINT("destruct token_queue\n");
    
    while (token_queue.front != NULL) {
        Token_queue_dequeue();
    }

}

