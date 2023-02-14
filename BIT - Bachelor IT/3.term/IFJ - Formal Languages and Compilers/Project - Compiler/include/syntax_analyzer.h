#ifndef SYNTAX_ANALYZER_H_ /* include guard */
#define SYNTAX_ANALYZER_H_
#include "lexical_analyzer.h"
#include "error_codes.h"
#include "symtable.h"
#include "precedence_stack.h"
#include "expression_analyser.h"

/** @brief This function start syntax analyzer
 */
extern int syntax_analyzer();

/** @brief This function print error free memory and exit program with code ERROR_PARSER
 *  @param char *error
 *  pointer to error message, ending with '\0'
 */
extern void syntax_error(char *error);

/** @brief This function print error free memory and exit program
 *  @param char *error
 *  pointer to error message with %s, ending with '\0'
 *  @parm char *string
 *  pointer to text which will be printed instead of %s in error parm
 *  @param int error_code
 *  exit code
 */
extern void semantic_error(char *error, char *string, int error_code);

#endif
