#ifndef CODE_GENERATOR_H_ /* include guard */
#define CODE_GENERATOR_H_

#include "lexical_analyzer.h"
#include <stdbool.h>

/** Check if func require createframe
 */
extern bool require_createframe(char* func_name);

extern void code_generator_prolog();

/**
 * generate new if header
 * @param Token_type_T relational_operator
 * if relational operator
 * @param unsigned if_id
 * if identifier
 */
extern void code_generator_if_header(Token_type_T relational_operator, unsigned if_id);

/**
 * generate if true branch end
 * @param unsigned if_id
 * if identifier
 */
extern void code_generator_if_true_end(unsigned if_id);

/**
 * generate if else branch end
 * @param unsigned if_id
 * if identifier
 */
extern void code_generator_if_else_end(unsigned if_id);

/**
 * assign to variable
 * char* variable
 * variable
 */
extern void code_generator_assign_variable(char* variable);

/**
 * declare variable
 * char* variable
 * variable
 */
extern void code_generator_declare_variable(char* variable);

/**
 * prints \n
 */
extern void code_generator_declare_variable_for_new_line();

/**
 * generate for end
 */
extern void code_generator_for_end(unsigned for_id);

/**
 * generate new if header
 * @param Token_type_T relational_operator
 * if relational operator
 * @param unsigned if_id
 * if identifier
 */
extern void code_generator_for_if(Token_type_T relational_operator, unsigned for_id);

/**
 * generate new for label
 * @param unsigned for_id
 * for identifier
 */
extern void code_generator_for_label(unsigned for_id);

/**
 * generate for assigment
 * @param unsigned for_id
 * for identifier
 */
extern void code_generator_for_assign();

/**
 * generate new for body header
 * @param unsigned for_id
 * for identifier
 */
extern void code_generator_for_body(unsigned for_id);

/**
 * generate EOF label
 */
extern void code_generator_eof();

/**
 * declare variable
 * char* variable
 * variable
 */
extern void code_generator_eof();

/**
 * generate new unique label
 * @param char* name of label
 * @return char* label
 */
extern char* get_label(char *name);


/**
 * generate push frame when scope lvl in increased
 */
extern void generate_pushframe();


/**
 * generate pop frame when scope lvl in decremented
 */
extern void generate_popframe();

/**
 * generate create frame
 */
extern void generate_createframe(char* func_name);

/**
 * Generate code to push token to stack
 * @param token token to push
 */
extern void generate_push(Token_T token);

/**
 * generate code to add two values on stack
 */
extern void generate_adds();

/**
 * generate code to sub two values on stack
 */
extern void generate_subs();

/**
 * generate code to mul two values on stack
 */
extern void generate_muls();

/**
 * generate code to divide two floats on stack
 */
extern void generate_divs();

/**
 * generate code to divide two integers on stack
 */
extern void generate_idivs();

/**
 * generate code to concatenate two last strings on stack
 */
extern void generate_concats();

/**
 * generate code to clear stack
 */
extern void generate_clears();

/**
 * generate code to add param to temporary frame
 */
extern void generate_func_call_param();

/**
 * Generate code for calling func
 * @pre generate_createframe()
 * @pre generate_func_call_param()
 */
extern void generate_func_call();

/**
 * Generate code when declaring func
 */
extern void generate_func_label(char* func_name);

/**
 * Generate code for end of func
 */
extern void generate_func_end(char *func_name);

/**
 * Generate code for return statement
 */
void generate_return();

/**
 * Generate code for map params %1..%n to real func variables
 * @param param_name name of param name
 */
void generate_param_map(char *param_name);

/**
 * Reset mapping_id  to 1
 */
void function_declare_finish();

#endif