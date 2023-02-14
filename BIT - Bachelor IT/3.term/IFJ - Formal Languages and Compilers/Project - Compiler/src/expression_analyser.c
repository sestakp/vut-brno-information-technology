/*!
 * @file
 * @brief This file contains implementation of machine for analyze expressions
 * 
 * Input: String of tokens
 * Output: Syntax analyze of expression
 *
 * @author Pavel Šesták, xsesta07@stud.fit.vutbr.cz
 * @author Lukáš Plevač, xpleva07@stud.fit.vutbr.cz
 */
#include <stdbool.h>
#include "lexical_analyzer.h"
#include "error_codes.h"
#include "expression_analyser.h"
#include "global_variables.h"
#include "code_generator.h"
#include "syntax_analyzer.h"
#include "debug_tool.h"

//todo remove
#include <stdlib.h>

#ifdef DEBUG
void print_stack() {
   
   Precedence_stack_item_T *item = precedence_stack.top;
   fprintf(stderr,"[INFO] printing stack:  top ->");
   while (item != NULL) {
      fprintf(stderr," %s ", debug_token_string[item->token.token_type]);

      item = item->previous;
   }
   
   fprintf(stderr,"\n");
}
#endif

const char precedent_table[TABLE_ROW][TABLE_ROW] = {
            /*         N   F   S  ID   +   -   *   /   (   )   $      */ 
  /*T_NUM_L (N)*/    {'_','_','_','_',']',']',']',']','_',']',']'},
  /*T_FLOAT_L (F)*/  {'_','_','_','_',']',']',']',']','_',']',']'},
  /*T_STRING_L (S)*/ {'_','_','_','_',']',']',']',']','_',']',']'},
  /*T_ID (ID)*/      {'_','_','_','_',']',']',']',']','_',']',']'},
  /*T_ADD (+)*/      {'[','[','[','[',']',']','[','[','[',']',']'},
  /*T_SUB (-)*/      {'[','[','[','[',']',']','[','[','[',']',']'},
  /*T_MUL (*)*/      {'[','[','[','[',']',']',']',']','[',']',']'},
  /*T_DIV (/)*/      {'[','[','[','[',']',']',']',']','[',']',']'},
  /*T_BRK_L (()*/    {'[','[','[','[','[','[','[','[','[','=','_'},
  /*T_BRK_R ())*/    {'_','_','_','_',']',']',']',']','_',']',']'},
  /*T_EOF ($)*/      {'[','[','[','[','[','[','[','[','[','_','_'}
};

int get_index(Token_T token_p){

  switch(token_p.token_type){
    case T_NUM_L:
      return 0;
      break;
    case T_FLOAT_L:
      return 1;
      break;
    case T_STRING_L:
      return 2;
      break;
    case T_ID:
      return 3;
      break;
    case T_ADD:
      return 4;
      break;
    case T_SUB:
      return 5;
      break;
    case T_MUL:
      return 6;
      break;
    case T_DIV:
      return 7;
      break;
    case T_BRK_L:
      return 8;
      break;
    case T_BRK_R:
      return 9;
      break;
    case T_EOF:
      return 10;
      break;
    
    default:
      return -1;
  }
}

void processFunc(char *fncname){
        //create new frame
        generate_createframe(fncname);

        get_token();
        bool space_with_no_param = false;
        while(token.token_type == T_EOL) { get_token(); space_with_no_param = true; } //after left bracket can be EOL

        if(token.token_type != T_BRK_R){ //check first argument
          space_with_no_param = false;
          if(token.token_type != T_ID       &&
             token.token_type != T_NUM_L    &&
             token.token_type != T_FLOAT_L  &&
             token.token_type != T_STRING_L) { syntax_error("invalid parametr in func"); }
          symtable_func_param_check();
          generate_func_call_param(fncname);
          get_token();
          
          while(token.token_type == T_COMMA){ //check others arguments
            get_token();
            
            while(token.token_type == T_EOL) { get_token(); }

            if(token.token_type != T_ID     &&
             token.token_type != T_NUM_L    &&
             token.token_type != T_FLOAT_L  &&
             token.token_type != T_STRING_L) { syntax_error("invalid parametr in func"); }
             symtable_func_param_check();
             generate_func_call_param(fncname);
             get_token();
          }
      }
      if(token.token_type != T_BRK_R) { syntax_error("expected ')' after parametr list"); }//after sequence of params must be )
      if(space_with_no_param){ syntax_error("Cannot make new line in empty list of parameters"); }
      symtable_func_check_count();
      get_token();

      //pass return values to SA
      
      int ret_vals_count;
      //is inted ?
      symtable_itemptr fncptr = symtable_search(fncname);
      if ((fncptr == NULL) || (!fncptr->declared && !fncptr->called)) { // ok predict count of retvals
        ret_vals_count = Token_queue_count(); 
      } else {
        ret_vals_count = symtable_func_get_retval_count();
      }

      generate_func_call(fncname);
      
      for (int i = 0; i < ret_vals_count; i++) {
        Data_type_queue_enqueue(symtable_retval_check());
      }

      symtable_func_is_called(fncname);

      //debug print parameters
      Data_type_queue_print();
}

bool is_expression_token(){
  return (token.token_type == T_NUM_L    ||
          token.token_type == T_FLOAT_L  ||
          token.token_type == T_STRING_L ||
          token.token_type == T_ID       ||
          token.token_type == T_ADD      ||
          token.token_type == T_SUB      ||
          token.token_type == T_MUL      ||
          token.token_type == T_DIV      ||
          token.token_type == T_BRK_L    ||
          token.token_type == T_BRK_R    ||
          token.token_type == T_EOL      ||
          token.token_type == T_EOF);
}

void valid_expression(Data_type_T *curr_type){
  Precedence_stack_item_T *item = precedence_stack.lastPrecedence;

  if(item == NULL) { syntax_error("Invalid expression"); }
  //first is <
  item = item->next;
  
  
  bool last_bracket = false;
  bool operand      = true;
  int scope = 0;
  
  while(item != NULL){

    last_bracket = false;
    if(operand){
      if(item->token.token_type == T_BRK_L){
        scope++;
        operand = !operand; //next need to be again operand
      }   
      else if(item->token.token_type != T_NUM_L && 
         item->token.token_type != T_FLOAT_L    && 
         item->token.token_type != T_STRING_L   && 
         item->token.token_type != T_ID         &&
         item->token.token_type != T_PRECEDENCE_E) { syntax_error("Invalid expression, expected operand"); }

      /**
       * semetic part
       */
      
      if (item->token.token_type != T_PRECEDENCE_E) { // reduce row ID no E check data type
        if (*curr_type == DT_UNDEFINED) { // first data type in expression
          DEBUG_PRINT("TOKEN TYPE %d\n",item->token.token_type);
          // select curr_type
          if (item->token.token_type == T_FLOAT_L ) {
            *curr_type = DT_FLOAT;
          } else if (item->token.token_type == T_STRING_L) {
            *curr_type = DT_STRING;
          } else if (item->token.token_type == T_NUM_L) {
            *curr_type = DT_INT;
          } else if (item->token.token_type == T_ID) {
            *curr_type = symtable_get_datatype(item->token.attribut.attribute_s.ptr);
            DEBUG_PRINT("T_ID: data type for %s is %i\n", item->token.attribut.attribute_s.ptr, *curr_type);
          }

          DEBUG_PRINT("curr_type is %i\n", *curr_type);

          DEBUG_PRINT("E reduce generate PUSHS\n");

        } else {
          if ((item->token.token_type == T_FLOAT_L  && *curr_type != DT_FLOAT) ||
              (item->token.token_type == T_STRING_L && *curr_type != DT_STRING) ||
              (item->token.token_type == T_NUM_L    && *curr_type != DT_INT)) {
                semantic_error("semantic error: expression with different data types ", "", ERROR_SEMANTIC_ANALYZER_TYPE_COMPATIBILITY);
          } else if (item->token.token_type == T_ID) { // do table search
            if (symtable_get_datatype(item->token.attribut.attribute_s.ptr) != *curr_type) {
              //exit by error
              semantic_error("semantic error: expression with different data types ", "", ERROR_SEMANTIC_ANALYZER_TYPE_COMPATIBILITY);
            }
          }
        }

        generate_push(item->token);
      }
      
      operand = !operand;
    }
    else{
      if(item->token.token_type == T_BRK_R){
        scope--;
        last_bracket = true;
        operand = !operand; //next need to be again operator
      } else if (item->token.token_type == T_ADD) {
        if (*curr_type == DT_STRING) {
          generate_concats();
        } else {
          generate_adds();
        }
      } else if (item->token.token_type == T_SUB) {
        generate_subs();
      } else if (item->token.token_type == T_MUL) {
        generate_muls();
      } else if (item->token.token_type == T_DIV) { 
        if (*curr_type == DT_FLOAT) {
          generate_divs();
        } else {
          generate_idivs();
        }
      } else {
        syntax_error("Invalid expression, expected operator");
      }
      
      
      operand = !operand;
    }

    item = item->next; 
  }

  if(scope != 0)               { syntax_error("Invalid expression, wrong count of brackets in expression"); }
  if(operand && !last_bracket) { syntax_error("Invalid expression, expression must end with operand"); }

  /** 
   * Sementaic part
   */
  if ( *curr_type == DT_STRING) {
    item = precedence_stack.lastPrecedence->next;
    while(item != NULL){
      if (item->token.token_type == T_DIV ||
          item->token.token_type == T_MUL ||
          item->token.token_type == T_SUB) {
        //exit by error
        semantic_error("semantic error: wrong operation with string ", "", ERROR_SEMANTIC_ANALYZER_TYPE_COMPATIBILITY);
      }

      item = item->next;
    }
  }

}

void check_zero_div(Token_type_T *last_token_type) {
  if (*last_token_type == T_DIV) {
    if ((token.token_type == T_NUM_L) && (token.attribut.attribute_i == 0)) {
      semantic_error("div by zero", "", ERROR_DIV_ZERO);
    } else if ((token.token_type == T_FLOAT_L) && ((int)token.attribut.attribute_f == 0)) {
      semantic_error("div by zero", "", ERROR_DIV_ZERO);
    }
  }

  *last_token_type = token.token_type;
}


void expression_analyser(){

  DEBUG_PRINT("\033[0;33mEXPRESSION start working %s\033[0m\n", debug_token_string[token.token_type]);

  Precedence_stack_init();

  bool expression = false;

  //sementyc data type for check types
  Data_type_T curr_type   = DT_UNDEFINED;
  //last token for check zero div
  Token_type_T last_token_type = token.token_type;

  
  char operation = '_';

  while(is_expression_token(token)){

    operation = precedent_table[get_index(precedence_stack.lastTerminal->token)][get_index(token)];
  
    if(precedence_stack.lastTerminal->token.token_type == T_ID && token.token_type == T_BRK_L){  //its func
      symtable_func_use(precedence_stack.lastTerminal->token.attribut.attribute_s.ptr);
      processFunc(precedence_stack.lastTerminal->token.attribut.attribute_s.ptr);
      Precedence_stack_dtor();
      return;
    }

    switch(operation){
      case '[':
        Precedence_stack_push_token_precedence();  
        get_token();
        check_zero_div(&last_token_type);
        break;

      case ']':
          valid_expression(&curr_type);
          Precedence_stack_reduce();
        break;

      case '=':
        Precedence_stack_push_token_normal();
        get_token();
        check_zero_div(&last_token_type);
        break;
      
      default:
        syntax_error("Invalid expression");
    }
    //actual_row = get_index(token);
    expression = true;

     //check EOL
    if(token.token_type == T_EOL){
      
      if(precedence_stack.top->token.token_type == T_EOF   || 
         precedence_stack.top->token.token_type == T_BRK_L ||
         precedence_stack.top->token.token_type == T_ADD   ||
         precedence_stack.top->token.token_type == T_SUB   ||
         precedence_stack.top->token.token_type == T_DIV   ||
         precedence_stack.top->token.token_type == T_MUL){
        
        while(token.token_type == T_EOL) { get_token(); }
      }
      else{
        break; //cannot be EOL there, try to finish expression and reduce
      }
    }
  }

  if(!expression){
    syntax_error("expected expression");
  }

  while(precedence_stack.lastTerminal->token.token_type != T_EOF){ //reduce stack
    valid_expression(&curr_type);
    Precedence_stack_reduce();
  }

  Precedence_stack_dtor();

  /**
   * Sematic check - pass Data_type_T to SA
   */

  Data_type_queue_enqueue(curr_type);
  //debug print parameters
  Data_type_queue_print();
  
  DEBUG_PRINT("\033[0;33mEXPRESSION stop working %s\033[0m\n", debug_token_string[token.token_type]);
}
