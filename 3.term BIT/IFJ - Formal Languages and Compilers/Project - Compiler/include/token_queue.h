/*!
 * @file
 * @brief This file is header for queue for tokens
 * queue implemented as Singly linked list
 *
 * @author Lukáš Plevač, xpleva07@stud.fit.vutbr.cz
 */

#ifndef TOKEN_QUEUE_H_ /* include guard */
#define TOKEN_QUEUE_H_
#include "lexical_analyzer.h"
#include <stdbool.h>
#include <stdio.h>

/**
 * data type of data_type_queue
 * @property next - pointer to next item
 * @property type - data type (set by Data_type_queue_enqueue())
 */
typedef struct token_queue_item_str {
    struct token_queue_item_str *next;
    Token_T                      token;
} Token_queue_item_T;

/**
 * data type of token_queue
 * @property front - pointer to item on front
 * @property tail - pointer to item on tail
 */
typedef struct{
    Token_queue_item_T *front;
    Token_queue_item_T *tail;
} Token_queue_T;

/**
 * @brief init queue
 * @return void
 */
extern void Token_queue_init();

/**
 * @brief add data type to tail of queue (after last item)
 * @param Token_T type to add to queue
 * @pre call Token_queue_init() to init queue
 * @return void
 */
extern void Token_queue_enqueue(Token_T type);

/**
 * @brief get item from from and delete it (first inserted)
 * @pre call Token_queue_init() to init queue
 * @return Token_T
 */
extern Token_T Token_queue_dequeue();

extern int Token_queue_count();

/**
 * @brief descruct queue dealoc all items
 * @pre call Token_queue_init() to init queue
 * @return void
 */
extern void Token_queue_dtor();

#if defined(DEBUG)
extern void Token_queue_print();
#else
    #define Token_queue_print();
#endif

#endif
