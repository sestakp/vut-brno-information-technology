#ifndef GLOBAL_VARIABLES_H_ /* include guard */
#define GLOBAL_VARIABLES_H_

#include "symtable.h"
#include "lexical_analyzer.h"
#include "precedence_stack.h"
#include "data_type_queue.h"
#include "token_queue.h"

/* current proccessed token */
extern Token_T token;

extern symtable_T symtable;

extern Precedence_stack_T precedence_stack;

extern data_type_queue_T data_type_queue;

extern Token_queue_T token_queue;


#endif
