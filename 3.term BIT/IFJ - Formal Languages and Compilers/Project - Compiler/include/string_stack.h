/*!
 * @file
 * @brief This file contains implementation of stack for pointers to string
 *
 * @author Vojtěch Kulíšek, xkulis03@stud.fit.vutbr.cz
 */


/**
 * @brief push item to stack
 * @param char *pointer_to_string
 * pointer to string
 */
void string_stack_push(char *pointer_to_string);

/**
 * @brief pop item from stack and delete it, empty stack == invalid read !!!
 * @pre string_stack_push
 * @return char*
 */
char *string_stack_pop();

/**
 * @brief free all items in stack 
 */
void string_stack_dtor();
