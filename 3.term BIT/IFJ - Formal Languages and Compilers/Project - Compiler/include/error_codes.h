#ifndef ERROR_CODES_H_ /* include guard */
#define ERROR_CODES_H_
/**
 * @defgroup COMPILER_ERRORS_GROUP Compiler errors group
 *
 * @{
 */

/** Error in lexical analysis - lexeme structure error */
#define ERROR_SCANNER 1

/** Error in syntax analysis - Wrong program syntax, unexpected line breaks */
#define ERROR_PARSER 2

/** Error in semantic analysis - undefined function/variable, attempt to redefine a function/variablem etc... */
#define ERROR_SEMANTIC_ANALYZER_UNDEFINED 3

/** Error in semantic analysis - error deriving data type of newly defined variable */
#define ERROR_SEMANTIC_ANALYZER_WRONG_TYPE 4

/** Error in semantic analysis - type compatibility in aritmetic, string and relations expressions */
#define ERROR_SEMANTIC_ANALYZER_TYPE_COMPATIBILITY 5

/** Error in semantic analysis - wrong arguments (count or type), wrong return value */
#define ERROR_SEMANTIC_ANALYZER_WRONG_FUNCTION 6

/** Error in semantic analysis - other semantic errors */
#define ERROR_SEMANTIC_UNSPECIFIED 7

/** Error in semantic analysis - divide by zero constant */
#define ERROR_DIV_ZERO 9

/** Intern compiler error - error in alocation memory, etc */
#define ERROR_COMPILER 99

/** @} */

#endif
