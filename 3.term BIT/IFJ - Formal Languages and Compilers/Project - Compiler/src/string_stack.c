/*!
 * @file
 * @brief This file contains implementation of stack for pointers to string
 *
 * @author Vojtěch Kulíšek, xkulis03@stud.fit.vutbr.cz
 */

#include "error_codes.h"
#include <stdlib.h>
#include <stdio.h>

typedef struct string_stack_item_str {
    struct string_stack_item_str *prev;
    char *string;
} String_stack_item_T;

static String_stack_item_T *stack = NULL;

void string_stack_push(char *pointer_to_string){
	
	// malloc new item
	String_stack_item_T *new_item = malloc(sizeof(String_stack_item_T));
	if(new_item == NULL){
		fprintf(stderr, "compiler error: out of memory\n");
		exit(ERROR_COMPILER);
	}
	
	// add new item
	new_item->string = pointer_to_string;
	new_item->prev = stack;
	stack = new_item;
	
}

char *string_stack_pop(){
	
	String_stack_item_T *old_stack = stack;
	char *string = stack->string;
	
	stack = stack->prev;
	free(old_stack);
	
	return string;
}

void string_stack_dtor(){
	
	String_stack_item_T *old_stack;
	
	while(stack != NULL){
		old_stack = stack;
		stack = stack->prev;
		free(old_stack);
	}
	
}
