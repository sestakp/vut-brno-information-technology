#ifndef PRECEDENCE_STACK_H_ /* include guard */
#define PRECEDENCE_STACK_H_
#include "lexical_analyzer.h"
#include <stdbool.h>
#include <stdio.h>

/* DEFINED STACK IMPLEMENTED LIKE A LINKED LIST */

/** @struct Stack_item_t
 *  @brief This structure represent element in stack
 *  @var Data_t::data 
 *  Member 'data' represent data in stack item
 *  @var Stack_item_t::next
 *  Member 'succ' represent pointer to next element in stack
 *  @var Stack_item_t::previous
 */
typedef struct recedence_stack_item_str{
    struct recedence_stack_item_str *next;
    struct recedence_stack_item_str *previous;
    Token_T token;
    bool    terminal;
} Precedence_stack_item_T;


/** @struct Precedence_stack_T
 *  @brief This structure represent stack
 *  @var Stack_item_t::top 
 *  Member 'top' represent top of the stack
 */
typedef struct{
    Precedence_stack_item_T *top;
    Precedence_stack_item_T *lastTerminal;
    Precedence_stack_item_T *lastPrecedence;
} Precedence_stack_T;

/** @brief this function initialize stack
 *  @param stack::Stack_t
 *  pointer to stack to initialize
 *  @pre allocated memory for stack, function expected stack != null
 *  @post Stack_dtor(stack);
 */
extern void Precedence_stack_init();

/** @brief this function push data to stack
 *  @param stack::Precedence_stack_T
 *  pointer to stack
 *  @param token::Token_T
 *  data for push to stack
 *  @pre Stack_init(stack)
 */
extern void Precedence_stack_push_token_normal();

/** @brief this function push data to top of stack and put < after last terminal 
 *  @param stack::Precedence_stack_T
 *  pointer to stack
 *  @param token::Token_T
 *  token push to stack
 *  @pre Stack_init(stack)
 */
extern void Precedence_stack_push_token_precedence();


/** @brief this function remove all from stack from last < to top of stack and push E to stack
 *  @param stack::Precedence_stack_T
 *  pointer to stack
 *  @pre Stack_init(stack)
 */
extern void Precedence_stack_reduce();

/** @brief this function get data from stack 
 *  please use stack->lastPrecedence stack->lastTerminal and Precedence_stack_reduce
 *  @param stack::Precedence_stack_T
 *  pointer to stack
 *  @pre Stack_init(stack)
 *  @pre Is_empty(stack) == false
 *  @return data::Data_t
 */
extern Token_T Precedence_stack_pop();

/** @brief this function check if stack is empty
 *  @param stack::Precedence_stack_T
 *  pointer to stack
 *  @pre Stack_init(stack)
 *  @return if stack is empty
 */
extern bool Precedence_stack_is_empty();

/** @brief this function free memory and empty stack
 *  @param stack::Precedence_stack_T
 *  pointer to stack
 *  @pre Stack_init(stack)
 */
extern void Precedence_stack_dtor();

#endif
