/*!
 * @file
 * @brief This file contains implementation of special Stack for precedence Operator-precedence grammar
 *
 * @author Lukáš Plevač, xpleva07@stud.fit.vutbr.cz
 * @author Pavel Šesták, xsesta07@stud.fit.vutbr.cz
 */


#include <stdlib.h>
#include "global_variables.h"

void Precedence_stack_push_top(Precedence_stack_item_T *item) {
    
    if (item == NULL) {
        fprintf(stderr,"WARNING: calling Precedence_stack_push_top with null item\n");
        return;
    }

	item->next     = NULL;
	item->previous = precedence_stack.top;

	if (item->previous != NULL) {
        item->previous->next = item;
    }

	precedence_stack.top = item;
}

void Precedence_stack_init(){

    precedence_stack.top = NULL;
    precedence_stack.lastPrecedence = NULL;

    //push $

    Precedence_stack_item_T *item = malloc(sizeof(Precedence_stack_item_T));
    if(item == NULL) {
        fprintf(stderr,"WARNING: function Stack_pop memory allocation error\n");
        return; 
    }

    Token_T                     EOF_token;
    EOF_token.token_type      = T_EOF;
    item->token               = EOF_token;
    item->terminal            = true;

    Precedence_stack_push_top(item);

    precedence_stack.lastTerminal = item;
}

void Precedence_stack_push_after(Precedence_stack_item_T *after, Precedence_stack_item_T *item) {
	if (after != NULL && item != NULL) {
		item->previous = after;
		item->next     = after->next;

		after->next = item;

		if (item->next != NULL) {
            item->next->previous = item;
        } else {
            precedence_stack.top = item;
        }
	}
}

void Precedence_stack_push_token_normal(){

    Precedence_stack_item_T *item = malloc(sizeof(Precedence_stack_item_T));
    if(item == NULL) {
        fprintf(stderr,"WARNING: function Stack_pop memory allocation error\n");
        return; 
    }

    item->token          = token;
    item->terminal       = true;

    precedence_stack.lastTerminal  = item; 

    Precedence_stack_push_top(item);
}

void Precedence_stack_push_token_precedence(){

    //now push <
    Precedence_stack_item_T *item = malloc(sizeof(Precedence_stack_item_T));
    if(item == NULL) {
        fprintf(stderr,"WARNING: function Stack_pop memory allocation error\n");
        return; 
    }

    //its is precedence
    Token_T                     precedence_token;
    precedence_token.token_type  = T_PRECEDENCE;
    item->token                  = precedence_token;
    item->terminal               = false;

    precedence_stack.lastPrecedence     = item;

    Precedence_stack_push_after(precedence_stack.lastTerminal, item);
    Precedence_stack_push_token_normal(); //push token
}

void Precedence_stack_reduce() {
    
    if (precedence_stack.lastPrecedence == NULL) {
        fprintf(stderr,"WARNING: calling reduce for stack without precedence\n");
        return; 
    }

    while (precedence_stack.lastPrecedence != precedence_stack.top) {
        Precedence_stack_pop();
    }

    //pop < too
    Precedence_stack_pop();

    //now push E 
    Precedence_stack_item_T *item = malloc(sizeof(Precedence_stack_item_T));
    if(item == NULL) {
        fprintf(stderr,"WARNING: function Stack_pop memory allocation error\n");
        return; 
    }

    Token_T                 e_token;
    e_token.token_type    = T_PRECEDENCE_E;
    item->token           = e_token;
    item->terminal        = false;

    Precedence_stack_push_top(item);

    //find new precedence and terminal
    precedence_stack.lastPrecedence = NULL;
    precedence_stack.lastTerminal   = NULL;

    item = precedence_stack.top;
    while (item != NULL) {
        if (item->token.token_type == T_PRECEDENCE) {
            precedence_stack.lastPrecedence = item;
            break;
        }

        item = item->previous;
    }

    item = precedence_stack.top;
    while (item != NULL) {
        if (item->terminal) {
            precedence_stack.lastTerminal = item;
            break;
        }

        item = item->previous;
    }

}

Token_T Precedence_stack_pop(){
    Precedence_stack_item_T *item;
   
    if(precedence_stack.top == NULL){
        fprintf(stderr,"WARNING: calling Stack_pop with empty stack\n");
        return item->token; 
    }

    item = precedence_stack.top;
    
    precedence_stack.top       = precedence_stack.top->previous;

    if (precedence_stack.top != NULL)
        precedence_stack.top->next = NULL;

    Token_T token = item->token;

    free(item);

    return token;
}


bool Precedence_stack_is_empty(){
    return precedence_stack.top == NULL;
}

void Precedence_stack_dtor(){
    while(!Precedence_stack_is_empty()){
        Precedence_stack_pop();
    }

}

