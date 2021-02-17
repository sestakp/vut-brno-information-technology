#ifndef SYMTABLE_H_ /* include guard */
#define SYMTABLE_H_
#include <stdbool.h>
#include "lexical_analyzer.h"

#define SYM_MAX_SCOPE 30
#define SYM_TOP_ITEMS 10 //define number of lists

typedef struct defvar_arr_S{
    char *name;
    unsigned unique_id;
    unsigned scope_lvl;
    char *frame;
} defvar_arr_item_T;


typedef struct symtable_item_S{
    
    char* variable_name;
    int  variable_unique_id;
    bool declared;
    bool called;

    Data_type_T *params;
    int param_count;
    int param_allocated;

    Data_type_T *retvals;
    int retval_count;
    int retval_allocated;
    
    //todo add data.
    struct symtable_item_S* next;
}symtable_item_T;

typedef symtable_item_T* symtable_itemptr;

typedef struct {
    symtable_itemptr tables[SYM_MAX_SCOPE][SYM_TOP_ITEMS];
    int scope_lvl;
}symtable_T;

/** @brief this function initialize symtable before first use
 *  @post symtable_dtor
 */
extern void symtable_ctor();

/** @brief this function destruct symtable after last use and correctly free memory
 *  @pre symtable_ctor
 *  @param check_semantic if its true, function check semantic and exit program if error is found
 */
extern void symtable_dtor(bool check_semantic);

/** @brief this function is used when scope lvl finishing, free memory in symtable
 *  @pre symtable_ctor
 *  @pre symtable_increase_scope_lvl
 */
extern void symtable_finish_scope_lvl();

/** @brief this function is used when new scope lvl start, increase pointer into table
 *  @pre symtable_ctor
 *  @post symtable_finish_scope_lvl
 */
extern void symtable_increase_scope_lvl();

/** @brief this function added id and check semantic correct of declaration variable
 *  @pre symtable_ctor
 */
extern void symtable_declare_var(char* variable_name);

/** @brief this function added id and check semantic correct of assign variable
 *  @pre symtable_ctor
 */
extern void symtable_assign_var(char* variable_name);

/** @brief this function added id and check semantic correct of declaration func
 *  @pre symtable_ctor
 */
extern void symtable_declare_func(char* func_name);

/** @brief this function added id and check semantic correct of use func
 *  @pre symtable_ctor
 */
extern void symtable_func_use(char* func_name);

/** @brief this function declare parameter for function, use actual token with datatype
 *  @pre symtable_declare_func
 */
extern void symtable_func_param_declare();

/** @brief this function declare return value for function, use actual token with datatype
 *  @pre symtable_declare_func
 */
extern void symtable_func_retval_declare();

/** @brief this function check parameter for function, use actual token with parameter
 *  @pre symtable_func_use
 */
extern void symtable_func_param_check();

/** @brief this function check return values for function, use actual token with return value
 *  @pre symtable_func_use
 */
extern Data_type_T symtable_retval_check();

/** @brief this function check parameters and return values count for function
 *  @pre symtable_func_use
 *  @pre symtable_func_param_check
 *  @pre symtable_func_retval_check 
 */
extern void symtable_func_check_count();

/** @brief this function return symtable item
 *  @pre symtable_init
 *  @return pointer to symtable item or NULL if item not found
 */
symtable_itemptr symtable_search(char* key);

/** @brief this function check return values count for last call func
 *  @pre symtable_init
 *  @pre symtable_func_param_declare
 */
extern void symtable_func_check_retval_count();

/** @brief This function return number of return values of last call func
 *  @pre symtable_init
 */
extern int symtable_func_get_retval_count();

/** @brief This function return number of parameters of last call func
 *  @pre symtable_init
 */
extern int symtable_func_get_param_count();

/** @brief This function set datatype defined in param to specified variable
 *  @pre symtable_init
 *  @param var_name variable name which we want to set datatype
 *  @param datatype datatype to set into variable
 */
extern void symtable_set_datatype(char* var_name, Data_type_T datatype);


/** @brief 
 *  @pre symtable_init
 *  @param var_name variable name which we want to know datatype
 *  @return datatype of variable specified by param, if retval isnts specified return DT_UNDEFINED
 */
extern Data_type_T symtable_get_datatype(char* var_name);

extern void symtable_func_is_called(char *func_name);

extern void symtable_func_is_declared();

/** @brief function check if its integrate func 
 *  @pre symtable_init
 *  @param string name of func
 *  @return true if func is integrate func, else false
 */
extern bool is_integrate_func(char* string);

/** @brief function return name of last called func
 *  @return string with func name
 */
extern char* symtable_get_last_call_func();

/** @brief function return unique id of item in symtable
 *  @pre symtable_init
 *  @param var_name name of variable
 *  @return unique id of variable
 */
extern int symtable_get_variable_unique_id(char *var_name);

/** @brief check if scope lvl for loop is zero
 *  @return true if scope lvl is zero
 */
extern bool is_loop_scope_lvl();

/** @brief Increment scope lvl for loop
 */
extern void loop_scope_lvl_increment();

/** @brief Increment scope lvl for loop
 */
extern void loop_scope_lvl_decrement();

/** @brief Insert into array for declaring after loops
 */
extern void defvar_arr_insert(char *name,int unique_id, char *frame);

/** @brief Print defvars after loop block
 */
extern void defvar_arr_print();

extern bool is_end_of_block_for();
#endif
