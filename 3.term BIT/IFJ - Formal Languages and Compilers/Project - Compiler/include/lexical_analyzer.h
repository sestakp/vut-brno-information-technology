#ifndef LEXICAL_ANALYZER_H_ /* include guard */
#define LEXICAL_ANALYZER_H_
#include <stdint.h>
#include <stdbool.h>
#include "dynamic_array.h"

/*! This is an enum class for type of token*/
typedef enum { 
               /*  KEYWORD/ID*/
               T_ELSE,
               T_FLOAT64,
               T_FOR,
               T_FUNC,
               T_IF,
               T_INT,
               T_PACKAGE,
               T_RETURN,
               T_STRING,
               T_ID,
               
               /* Literals */
               T_NUM_L,
               T_FLOAT_L,
               T_STRING_L,
               
               /* OPERATORS */
               T_COMMA,
               T_CBRK_R,
               T_CBRK_L,
               T_SEMCOL,
               T_SUB,
               T_ADD,
               T_NE,
               T_MUL,
               T_E,
               T_GE,
               T_G,
               T_EOL,
               T_EOF,
               T_LE,
               T_L,
               T_BRK_R,
               T_ASSIGN,
               T_DECLARE,
               T_BRK_L,
               T_DIV,

               /* for pecedence stack */
               T_PRECEDENCE,
               T_PRECEDENCE_E

             } Token_type_T;

    typedef enum {
        DT_UNDEFINED,
        DT_INT,
        DT_FLOAT,
        DT_STRING
    } Data_type_T;


#ifdef DEBUG
static char* debug_token_string[] = {
"T_ELSE",
"T_FLOAT64",
"T_FOR",
"T_FUNC",
"T_IF",
"T_INT",
"T_PACKAGE",
"T_RETURN",
"T_STRING",
"T_ID",
"T_NUM_L",
"T_FLOAT_L",
"T_STRING_L",
"T_COMMA",
"T_CBRK_R",
"T_CBRK_L",
"T_SEMCOL",
"T_SUB",
"T_ADD",
"T_NE",
"T_MUL",
"T_E",
"T_GE",
"T_G",
"T_EOL",
"T_EOF",
"T_LE",
"T_L",
"T_BRK_R",
"T_ASSIGN",
"T_DECLARE",
"T_BRK_L",
"T_DIV",
"T_PRECEDENCE",
"T_PRECEDENCE_E"
};
#endif

/** @union token_T
 *  @brief This structure represent token for lexem from lexical to syntax analyze
 *  @var token_T::token_type 
 *  Member 'token_type' represent type of token used for syntax analyze
 *  @var token_T::atribute 
 *  Member 'atribute' contains data, and names for semantic analyze
 */
typedef union Attribut_u {
    //TODO.. add pointer to symtable record
    uint64_t attribute_i;
    double attribute_f;
    dynamic_array_T attribute_s;
} Attribut_T;

/** @struct token_T
 *  @brief This structure represent token for lexem from lexical to syntax analyze
 *  @var token_T::token_type 
 *  Member 'token_type' represent type of token used for syntax analyze
 *  @var token_T::atribute 
 *  Member 'atribute' contains data, and names for semantic analyze
 */
 typedef struct Token_st{
     Token_type_T token_type;
     /*TODO... add atribute*/
     Attribut_T attribut;
     Data_type_T data_type;
 } Token_T;

extern unsigned lex_line_counter;

/** @brief This function get next token from source code
 *  @return return token
 */
extern Token_T get_token();

#endif
