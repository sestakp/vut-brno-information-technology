/*!
 * @file
 * @brief This file is header for queue for data types
 * queue implemented as Singly linked list
 *
 * @author Lukáš Plevač, xpleva07@stud.fit.vutbr.cz
 */

#ifndef DATA_TYPE_QUEUE_H_ /* include guard */
#define DATA_TYPE_QUEUE_H_
#include "lexical_analyzer.h"
#include <stdbool.h>
#include <stdio.h>

/**
 * data type of data_type_queue
 * @property next - pointer to next item
 * @property type - data type (set by Data_type_queue_enqueue())
 */
typedef struct data_type_queue_item_str {
    struct data_type_queue_item_str *next;
    Data_type_T                      type;
} Data_type_queue_item_T;

/**
 * data type of data_type_queue
 * @property front - pointer to item on front
 * @property tail - pointer to item on tail
 */
typedef struct{
    Data_type_queue_item_T *front;
    Data_type_queue_item_T *tail;
} data_type_queue_T;

/**
 * @brief init queue
 * @return void
 */
extern void Data_type_queue_init();

/**
 * @brief add data type to tail of queue (after last item)
 * @param Data_type_T type to add to queue
 * @pre call Data_type_queue_init() to init queue
 * @return void
 */
extern void Data_type_queue_enqueue(Data_type_T type);

/**
 * @brief get item from from and delete it (first inserted)
 * @pre call Data_type_queue_init() to init queue
 * @return Data_type_T
 */
extern Data_type_T Data_type_queue_dequeue();

/**
 * @brief descruct queue dealoc all items
 * @pre call Data_type_queue_init() to init queue
 * @return void
 */
extern void Data_type_queue_dtor();

#if defined(DEBUG)
extern void Data_type_queue_print();
#else
    #define Data_type_queue_print();
#endif

#endif
