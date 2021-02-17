/*!
 * @file
 * @brief This file contains implementation of Lexical analyzer (Scanner)
 * 
 * Input: Source program
 * Output: String of tokens
 * 
 * Broke source program into lexemes
 *
 * @author Pavel Šesták, xsesta07@stud.fit.vutbr.cz
 * @author Vojtěch Kulíšek, xkulis03@stud.fit.vutbr.cz
 * @author Lukáš Plevač, xpleva07@stud.fit.vutbr.cz
 */

#include "error_codes.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <ctype.h>
#include "global_variables.h"
#include "debug_tool.h"

#define EOL '\n' /* macro for end of line */ 

unsigned lex_line_counter = 1;

/* functions represented states of FSM */
void s_init();
void s_t_l();
void s_t_g();
void s_ne_mid();
void s_t_num();
void s_keyword();
void s_string();
void s_t_div();
void s_comment_oneline();
void s_comment_multi_line();
void s_comment_multi_line_end();
void s_t_id();
void s_t_float();
void s_exp();
void s_escape_seq();
void s_escape_hex();
void s_hex_first();
void s_declare_mid();
void s_t_assign();

const char* keywords[] = {"else", "float64", "for", "func", "if", "int", "package", "return", "string"};
Token_type_T keywordsTokens[] = {T_ELSE, T_FLOAT64, T_FOR, T_FUNC, T_IF, T_INT, T_PACKAGE, T_RETURN, T_STRING };
const int keywords_count = 9;

/* current readed character from source code*/ 
static char c;

bool read_next = true; /* check if its need to read in current loop or process current char*/
bool skip_token = false;

/*atribute string */
static dynamic_array_T attribut;

/* represent current state for switch */
static void(*state)() = s_init;

static bool end = false; /* indicate end of token */

/** @brief this function convert char to ascii value
 *  @param a::char 
 *  a is char to convert
 *  @return ASCII value of a
 */
static char ascii(char a){ return a; }

/** @brief This function check if current token is keyword. If token isn't keyword it's identifier
 *  @return return keyword token or T_ID
 */
Token_type_T get_keyword(){
    
    for(int i = 0; i < keywords_count; i++){
        //fprintf(stderr,"Compare \"%s\" with \"%s\"\n",attribut.ptr, keywords[i]);
        if(strcmp(attribut.ptr, keywords[i]) == 0) return keywordsTokens[i];    
    }

    return T_ID;
}

/** @brief This function check if current char is hexa digit.
 *  @return return 0 if char is legit hexa digit, else return > 0
 */
bool is_hexa_digit(){
    return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F');
}

/** @brief This function check if current char is whitespace \ {"EOL"}
 *  @return 0 if success or >0 for error
 */
bool is_whitespace(){
    return (c == ' ' || c == '\t' || c == '\v' || c == '\f' || c == '\r');
}

/** @brief This function is used in get_token
 *  @return 0 if success or >0 for error
 */
void set_token(Token_type_T type){
    token.token_type = type;

    /* SET TOKEN ATTRIBUT */
    //fprintf(stderr,"Attribut in lexical analyzer \"%s\" \n",attribut.ptr);
    switch(token.token_type){
        case T_NUM_L:
            token.attribut.attribute_i = atol(attribut.ptr);
            token.data_type = DT_INT;
            //dynamic_array_free(&attribut); /* clear memory of attribute*/
            break;
        case T_FLOAT_L:
            token.attribut.attribute_f = atof(attribut.ptr);
            token.data_type = DT_FLOAT;
            //dynamic_array_free(&attribut); /* clear memory of attribute*/
            break;
        case T_STRING_L:
            token.data_type = DT_STRING;
            token.attribut.attribute_s = attribut;
            break;
        case T_ID:
            token.attribut.attribute_s = attribut;
            break;
        default:
            if(attribut.ptr != NULL) {
                //dynamic_array_free(&attribut); /* clear memory of attribute*/
            }
            //token.attribut.attribute_s = attribut; /* PARSER NEED TO CLEAR MEMORY IF ITS STRING AFTER FINISH WORK WITH TOKEN*/
    }

    end = true; /* END LOOP AND RETURN TOKEN*/
}

Token_T get_token(){
    attribut    = dynamic_array_init_with_endbyte(10, '\0');

    if (attribut.ptr == NULL) {
        exit(ERROR_COMPILER);
    }

    end         = false; /* bool value represent if token was found and we can finish searchning or not*/
    state       = s_init; /* reset state to s_init */
    //read_next = true; /* check if we can read next char from stdin or process last one */

    while(true){
        if(read_next){ /* if its allowed to read next char*/
            if((c = getchar()) == EOF) {
                //dynamic_array_free(&attribut);
                token.token_type = T_EOF;
                break; 
            } // if EOF then break;
           // fprintf(stderr,"Reading from STDIN char c: %c\n",c);
        }
        //fprintf(stderr,"Actual processing char: %c \n", c);
        read_next = true;

        state();
        
        if(state == NULL){
            exit(ERROR_SCANNER);
        }

        if(end) { break; } /* if token is found end bit set to true */
        
        if(!skip_token && read_next && (!is_whitespace() || state != s_init)){
            //if (c != '"') {
                dynamic_array_endbyte_append(&attribut, c);
            //}
            //fprintf(stderr,"attribut appended in func Get_Token \"%s\"\n",attribut.ptr);
        }
        skip_token = false;
    }

    DEBUG_PRINT("LA returning token %s\n", debug_token_string[token.token_type]);
    return token;
}

void s_init(){
    if(isdigit(c) > 0)       { state = s_t_num;   return; }  /* NUMBER LITERAL */
    else if(is_whitespace()) {                    return; }
    else if(isalpha(c))      { state = s_keyword; return; }  /* IDENTIFIER / KEYWORD*/
   
    switch(c){
        case '"': state = s_string;                      break;      /* STRING LITERAL */
        case ',': set_token(T_COMMA);                    break;
        case '}': set_token(T_CBRK_R);                   break;
        case '{': set_token(T_CBRK_L);                   break;
        case '+': set_token(T_ADD);                      break;
        case '-': set_token(T_SUB);                      break;
        case '*': set_token(T_MUL);                      break;
        case ';': set_token(T_SEMCOL);                   break;
        case '<': state = s_t_l;                         break;
        case '>': state = s_t_g;                         break;
        case ':': state = s_declare_mid;                 break;
        case '(': set_token(T_BRK_L);                    break;
        case ')': set_token(T_BRK_R);                    break;
        case '/': state = s_t_div;                       break;
        case '!': state = s_ne_mid;                      break;
        case '=': state = s_t_assign;                    break;
        case EOL: set_token(T_EOL); lex_line_counter++;  break;
        case '_': state = s_t_id;                        break;
        default:  state = NULL;
        //T_E, T_NE, T_GE, T_LE nutne pridat mezistav
    }
}

/* OPERATORS */
void s_t_l(){
    if(c == '=') { set_token(T_LE); }
    else         { read_next = false; set_token(T_L); }
}

void s_t_g(){
    if(c == '=') { set_token(T_GE); }
    else         { read_next = false; set_token(T_G); }
}

void s_ne_mid(){
    if(c == '=') { set_token(T_NE); }
    else         { state = NULL; }
}

void s_t_assign(){
    if(c == '=') { set_token(T_E); }
    else         { read_next = false; set_token(T_ASSIGN); }
}

void s_declare_mid(){
    if(c == '=') { set_token(T_DECLARE); }
    else         { state = NULL; }
}

void s_t_div(){
    if(c == '/') { state = s_comment_oneline; }
    else if(c == '*') { state = s_comment_multi_line; }
    else{ read_next = false; set_token(T_DIV); }
}

/* COMMENTS */
void s_comment_oneline(){
    if(c == EOL) { read_next = false; state = s_init; }
}

void s_comment_multi_line(){
    if(c == '*') { state = s_comment_multi_line_end; }
}

void s_comment_multi_line_end(){
    if(c == '/') { skip_token = true; dynamic_array_clear(&attribut);  state = s_init;}
    else if( c != '*') { state = s_comment_multi_line; }
}

/* IDENTIFIER / KEYWORD*/
void s_keyword(){
    if(c == '_') { state = s_t_id; }
    else if(!isalpha(c) && !isdigit(c)) { /* cannot be next char of keyword*/

        token.token_type = get_keyword(); /* check if its keyword */
        if(token.token_type == T_ID){
            read_next = false; set_token(T_ID); /* isnt not underline, digit or letter, its cannot be keyword/id */ 
        } 
        else{
            read_next = false; set_token(token.token_type); /* It's keyword */ 
        }
    }
}

void s_t_id(){
    if(!isalpha(c) && !isdigit(c) && c != '_') { read_next = false;  set_token(T_ID); }
}

/* NUMBER LITERAL */
void s_t_num(){
    if(c == '.') { state = s_t_float; }
    else if(c == 'E' || c == 'e') { state = s_exp; }
    else if(!isdigit(c)) { read_next = false; set_token(T_NUM_L); }
}

/* FLOAT LITERAL */
void s_t_float(){
    if(!isdigit(c)) { read_next = false; set_token(T_FLOAT_L); }
}

void s_exp(){
    if(c == '+' || c == '-' || isdigit(c)) { state = s_t_float; }
    else{ state = NULL; }
}

/* STRING LITERALS */
void s_string(){
    if(c == '"') { dynamic_array_endbyte_append(&attribut, c); set_token(T_STRING_L); }
    else if(c == '\\') { state = s_escape_seq; }
    else if(ascii(c) <= 31) { state = NULL; }
}

void s_escape_seq(){
    if(c == 'x') { state = s_escape_hex; }
    else if(c == 'n' || c == '"' || c == 't' || c == '\\') { state = s_string; }
    else { state = NULL; }
}

void s_escape_hex(){
    if(is_hexa_digit(c)) { state = s_hex_first; }
    else { state = NULL; }
}

void s_hex_first(){
    if(is_hexa_digit(c)) { state = s_string; }
    else { state = NULL; }
}
