#include <stdio.h>
#include <stdlib.h>
#include "lexical_analyzer.h"
#include "precedence_stack.h"
#include "global_variables.h"

/**
 * rules
 * E -> id
 * E -> E * E
 * E -> E + E
 */

/**
 * 0 =
 * 1 >
 * 2 <
 * 3 error
 * 
 *     +  *  id  $
 * 
 * +   >  <  <  <
 * *   >  >  <  >
 * id  >  >     >
 * $   <  <  <
 */
const int precedence_table[4][4] = {
   {1,2,2,1},
   {1,1,2,1},
   {1,1,3,1},
   {2,2,2,3}
};

const char * T_ID_STR = " ID ";
const char * T_ADD_STR = " + ";
const char * T_MUL_STR = " * ";
const char * T_$_STR = " $ ";
const char * T_prec_STR = " < ";
const char * T_E_STR = " E ";

/* testing globals */
Token_T            test_in[5];

int get_table_id(Token_T token) {
   if      (token.token_type == T_ID)  return 2;
   else if (token.token_type == T_MUL) return 1;
   else if (token.token_type == T_ADD) return 0;
}

const char *get_token_name(Token_T token) {
   if     ( token.token_type == T_ID)  return T_ID_STR;
   else if (token.token_type == T_MUL) return T_MUL_STR;
   else if (token.token_type == T_ADD) return T_ADD_STR;
}

const char *get_buffer_item_name(Precedence_stack_item_T *item) {
   if      (item->token.token_type == T_PRECEDENCE) return T_prec_STR;
   else if (item->token.token_type == T_EOF) return T_$_STR;
   else if (item->token.token_type == T_PRECEDENCE_E) return T_E_STR;
   else return get_token_name(item->token);
}

void print_stack() {
   
   Precedence_stack_item_T *item = precedence_stack.top;
   printf("[INFO] printing stack:  top ->");
   while (item != NULL) {
      printf("%s", get_buffer_item_name(item));

      item = item->previous;
   }
   
   printf("\n");
}

void test() {
   for (int i = 0; i < 5; i++) {
      int stack_index = precedence_stack.lastTerminal->token.token_type == T_EOF ? 3 : get_table_id(precedence_stack.lastTerminal->token);
      int input_index = get_table_id(test_in[i]);

      int table_rule = precedence_table[stack_index][input_index];

      printf("[info] current input token %s, last buffer terminal %s\n", get_token_name(test_in[i]), get_buffer_item_name(precedence_stack.lastTerminal));
      printf("[info] current table rule %i\n", table_rule);
      print_stack();

      if (table_rule == 0) {
         token = test_in[i];
         Precedence_stack_push_token_normal();
         printf("[info] do normal push\n");
      } else if (table_rule == 1) {
         //normálně se hledá zada odpovídá nějakému pravidlu
         Precedence_stack_reduce();
         printf("[info] do reduce\n");
         i--;
      } else if (table_rule == 2) {
         token = test_in[i];
         Precedence_stack_push_token_precedence();
         printf("[info] do precedence push\n");
      } else {
         printf("nesprávná syntaxe\n");
         return;
      }

      print_stack();


   }

   /* ok now finish input is $ */

   while (precedence_stack.lastTerminal->token.token_type != T_EOF) {
      int stack_index = precedence_stack.lastTerminal->token.token_type == T_PRECEDENCE ? 3 : get_table_id(precedence_stack.lastTerminal->token);
      int input_index = 3; // table index of $

      int table_rule = precedence_table[stack_index][input_index];

      printf("[info] current input token $, last buffer terminal %s\n", get_buffer_item_name(precedence_stack.lastTerminal));
      printf("[info] current table rule %i\n", table_rule);
      print_stack();

      if (table_rule == 0) {
         printf("[info] do normal push - push $ tis is not correct\n");
         return;
      } else if (table_rule == 1) {
         //normálně se hledá zada odpovídá nějakému pravidlu
         Precedence_stack_reduce();
         printf("[info] do reduce\n");
      } else if (table_rule == 2) {
         printf("[info] do precedence push - push $ tis is not correct\n");
         return;
      } else {
         printf("nesprávná syntaxe\n");
         return;
      }

      print_stack();
   }

   printf("syntax ok\n");
}

int main(){
   printf("testing precedence stack\n");
   printf("table:\n");
   printf("    +  *  id  $\n\n+   >  <  <  <\n*   >  >  <  >\nid  >  >     >\n$   <  <  <\n\n");

   // i + i * i  <-- ok
   test_in[0].token_type = T_ID;
   test_in[1].token_type = T_ADD;
   test_in[2].token_type = T_ID;
   test_in[3].token_type = T_MUL;
   test_in[4].token_type = T_ID;

   Precedence_stack_init(); // init stack
   test();
   Precedence_stack_dtor();  // free stack
   printf("\n\n\n");

   // i + + * i <-- toto tabulce odpovídá !!
   test_in[0].token_type = T_ID;
   test_in[1].token_type = T_ADD;
   test_in[2].token_type = T_ADD;
   test_in[3].token_type = T_MUL;
   test_in[4].token_type = T_ID;

   Precedence_stack_init(); // init stack
   test();
   Precedence_stack_dtor();  // free stack
   printf("\n\n\n");

   // i i +  i i <-- neodpovídá tabulce
   test_in[0].token_type = T_ID;
   test_in[1].token_type = T_ID;
   test_in[2].token_type = T_ADD;
   test_in[3].token_type = T_ID;
   test_in[4].token_type = T_ID;
   
   Precedence_stack_init(); // init stack
   test();
   Precedence_stack_dtor();  // free stack
   printf("\n\n\n");

   // i + i + i <-- ok
   test_in[0].token_type = T_ID;
   test_in[1].token_type = T_ADD;
   test_in[2].token_type = T_ID;
   test_in[3].token_type = T_ADD;
   test_in[4].token_type = T_ID;
   
   Precedence_stack_init(); // init stack
   test();
   Precedence_stack_dtor();  // free stack
   printf("\n\n\n");

   return 0;
    
}
