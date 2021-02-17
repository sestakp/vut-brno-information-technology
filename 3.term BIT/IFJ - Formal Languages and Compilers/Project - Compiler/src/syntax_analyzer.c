/*!
 * @file
 * @brief This file contains implementation of Syntax analyzer (Parser)
 * 
 * Input: String of tokens
 * Output: Simulation of parse tree construction
 * 
 * Parser verifies that the string of tokens represents a syntactically well-formed program
 *
 * @author Vojtěch Kulíšek, xkulis03@stud.fit.vutbr.cz
 */

#include "lexical_analyzer.h"
#include "error_codes.h"
#include "global_variables.h"
#include "expression_analyser.h"
#include "token_queue.h"
#include "debug_tool.h"
#include "code_generator.h"
#include "string_stack.h"
#include <stdlib.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>

#define FUNC_PARM 0
#define FUNC_RETURN 1

#define SUCCESS true
#define FAIL false

void prolog();
void func();
void data_type(bool caller);
void param_define();
void mu_param_define();
void can_eol();
void param_list();
void return_list();
void return_data_type();
void statement();
void syntax_error(char *error);
void expression_list();
void param();
void rel_operator();
void comparison();
void for_declaration();
void for_comparison();
void for_assignment();
void multy_assign();
void syntax_analyzer_free(bool is_success);
void print_error_on_line(char *error, char *string);
void semantic_error(char *error, char *string, int error_code);

static char* last_declared_function;
static char* last_defined_parm_in_func_decl;
static Token_type_T last_if_relational_operator;
static unsigned if_id_count = 0;
static unsigned for_id_count = 0;

//void(*state)() = init;

void prolog(){

    // <can_EOL>
    get_token();
    can_eol();

    // <can_EOL> package
    if(token.token_type == T_PACKAGE){
        get_token();

        // <can_EOL> package main
        if(token.token_type == T_ID){
            
            if(strcmp(token.attribut.attribute_s.ptr, "main") != 0){
                syntax_error("This package is not supported :(");
            }

            //dynamic_array_free(&token.attribut.attribute_s);

            // <can_EOL> package main T_EOL
            get_token();
            if(token.token_type != T_EOL){
                syntax_error("excepted new line after package definition");
            }

        } else{
            syntax_error("excepted ID after package keyword");
        }
    } else{
        syntax_error("excepted prologue package main");
    }

    // <can_EOL> package main T_EOL <func>
    get_token();
    func();

}

void func(){

    // while token is defined
    while(token.token_type != T_EOF){

        if(token.token_type != T_EOL){
            
            // func
            if(token.token_type == T_FUNC){
                get_token();
                //func id
                if(token.token_type == T_ID){
                    
                    // declare function in symtable
                    symtable_declare_func(token.attribut.attribute_s.ptr);
                    generate_func_label(token.attribut.attribute_s.ptr);
                    
                    //SE
                    last_declared_function = token.attribut.attribute_s.ptr;

                    // func id (
                    get_token();
                    if(token.token_type == T_BRK_L){

                        // function scope lvl start
                        symtable_increase_scope_lvl();

                        // func id (<param_define>
                        get_token();
                        param_define();

                        // code generate, function param mapping finish
                        function_declare_finish();

                        // func id (<param_define>)
                        if(token.token_type != T_BRK_R){
                            syntax_error("excepted ) after param definiton or (");
                        }

                        // func id (<param_define>) <return_list>
                        get_token();
                        return_list();

                        //func id (<param_define>) <return_list> {
                        if(token.token_type != T_CBRK_L){
                            syntax_error("excepted { after return list/param definition");
                        }

                        // symtable function was declared
                        symtable_func_is_declared();

                        // func id (<param_define>) <return_list> { <statement>
                        get_token();
                        statement();

                        // func id (<param_define>) <return_list> { <statement> }
                        if(token.token_type != T_CBRK_R){
                            syntax_error("excepted } after statement");
                        }

                        // function scope lvl finish
                        symtable_finish_scope_lvl();

                        // code generate, function end
                        generate_func_end(last_declared_function);

                    }
                }

            } else {
                syntax_error("excepted func keyword");
            }
        }
        
        get_token();
    }

}

void return_list(){

    // (
    if(token.token_type == T_BRK_L){
        
        // ( <return_data_type>
        get_token();
        return_data_type();
     
        // ( <return_data_type> )
        if(token.token_type != T_BRK_R){
            syntax_error("excepted ) in return list");
        }
        get_token();

    }
}

void return_data_type(){
    
    // <data_type>
    data_type(FUNC_RETURN);

    // <data_type> , <return_data_type>
    while(token.token_type == T_COMMA){
        get_token();
        data_type(FUNC_RETURN);
    }

}

void param_define(){
	
	// T_ID
	if(token.token_type == T_ID){
		
        // add variable to symtable
        symtable_declare_var(token.attribut.attribute_s.ptr);

        // code generate, function param mapping
        generate_param_map(token.attribut.attribute_s.ptr);

		// SE
		last_defined_parm_in_func_decl = token.attribut.attribute_s.ptr;


		// T_ID <data_type>
		get_token();
		data_type(FUNC_PARM);
		
		// T_ID <data_type> ,
		if(token.token_type == T_COMMA){
			
			// T_ID <data_type> , <mu_param_define>
            get_token();
            mu_param_define();
		}
	}
}

void mu_param_define(){
	
	// T_ID
	if(token.token_type == T_ID){
		
        // add variable to symtable
        symtable_declare_var(token.attribut.attribute_s.ptr);
        
        // code generate, function param mapping
        generate_param_map(token.attribut.attribute_s.ptr);

		// SE
		last_defined_parm_in_func_decl = token.attribut.attribute_s.ptr;
		

		// T_ID <data_type>
		get_token();
		data_type(FUNC_PARM);
		
		// T_ID <data_type> ,
		if(token.token_type == T_COMMA){
			
			// T_ID <data_type> , <mu_param_define>
            get_token();
            mu_param_define();
		}
	}else {
		syntax_error("excepted variable");
	}
}

void can_eol(){
	while(token.token_type == T_EOL){
		get_token();
	}
}

void param_list(){

    // <param>
	param();
	
    // <param> T_COMMA <param_list>
    while(token.token_type == T_COMMA){

        // <param> T_COMMA <can_EOL>
        get_token();
        can_eol();

        param();

    }

}

void data_type(bool caller){
    // T_INT, T_FLOAT64 or T_STRING
    if(token.token_type != T_INT &&
       token.token_type != T_FLOAT64 &&
       token.token_type != T_STRING){
        syntax_error("excepted string, float64 or int");
    }

    switch(caller){
        // declare type of parameter in function
        case FUNC_PARM:
            symtable_func_param_declare();
            
            
            // SE
            switch(token.token_type){
				case T_INT:
					symtable_set_datatype(last_defined_parm_in_func_decl, DT_INT);
					break;
				case T_FLOAT64:
					symtable_set_datatype(last_defined_parm_in_func_decl, DT_FLOAT);
					break;
				case T_STRING:
					symtable_set_datatype(last_defined_parm_in_func_decl, DT_STRING);
					break;
			}
            
            
            break;
        // declare type of return in function
        case FUNC_RETURN:
            symtable_func_retval_declare();
            break;
    }

    get_token();
}

void expression_list(){
    // <expression>
    expression_analyser();

    // <expression> ,
    if(token.token_type == T_COMMA){

        // <expression> , <expression_list>
        get_token();
        expression_list();

    }

}

// pz. <statement> → ε
void statement(){

    Token_T previous_token;

    do{
        // <can_EOL>
        can_eol();

        // T_ID
        if(token.token_type == T_ID){

            previous_token = token;

            // T_ID (
            get_token();

            // T_ID <can_EOL> (
            can_eol();

            if(token.token_type == T_BRK_L){
                
                // check semantic correct of use func in symtable
                symtable_func_use(previous_token.attribut.attribute_s.ptr);
                
                generate_createframe(previous_token.attribut.attribute_s.ptr);
                
                // not T_ID <can_EOL> ( )
                get_token();
                if(token.token_type != T_BRK_R){
                    
                    // T_ID <can_EOL> ( <param_list>
                    param_list();

                    // T_ID <can_EOL> ( <param_list> ) 
                    if(token.token_type != T_BRK_R){
                        syntax_error("excepted ) in function call");
                    }

                }

                // T_ID <can_EOL> ( <param_list> ) T_EOL
                get_token();
                if(token.token_type != T_EOL){
                    syntax_error("excepted newline after function call");
                }
                
                // SE, symtable function was called
                symtable_func_is_called(previous_token.attribut.attribute_s.ptr);

                // code generate, function call
                generate_func_call(previous_token.attribut.attribute_s.ptr);

                // symtable function call statement is endeing, check count of function parameters
                symtable_func_check_count();

                get_token();

            // T_ID :=
            } else if(token.token_type == T_DECLARE){

				char* variable = previous_token.attribut.attribute_s.ptr;
				
                // T_ID := <can_EOL>
                get_token();
                can_eol();

                // T_ID := <can_EOL> <expression>
                expression_analyser();

				// add variable to symtable
                symtable_declare_var(variable);

                // SE
                // add data type of variable to symtable
                // check if data_type_queue is empty
                if(data_type_queue.front == NULL){
                    semantic_error("no return value from function in declaration%s", "", ERROR_SEMANTIC_ANALYZER_WRONG_TYPE);
                }

				DEBUG_PRINT("set datatype variable %s\n", previous_token.attribut.attribute_s.ptr);
                symtable_set_datatype(previous_token.attribut.attribute_s.ptr, Data_type_queue_dequeue());

                // check if data_type_queue is not empty
                if(data_type_queue.front != NULL){
                    semantic_error("too many return values from function in declaration%s", "", ERROR_SEMANTIC_ANALYZER_WRONG_TYPE);
                }

				// code generate, assign variable
				code_generator_declare_variable(variable);

                if(token.token_type != T_EOL){
                    syntax_error("excepted new line after declaration");
                }
                
                get_token();
                statement();
                
            // T_ID <multy_assign>
            } else{

                // add variable to token queue
                Token_queue_enqueue(previous_token);
                
                // add variable string to string stack
                string_stack_push(previous_token.attribut.attribute_s.ptr);

                multy_assign();

                // T_ID <multy_assign> =
                if(token.token_type != T_ASSIGN){
                    syntax_error("excepted = after identifier");
                }

                // T_ID <multy_assign> = <can_EOL>
                get_token();
                can_eol();

                // T_ID <multy_assign> = <can_EOL> <expression_list>
                expression_list();

                // T_ID <multy_assign> = <can_EOL> <expression_list> T_EOL
                if(token.token_type != T_EOL){
                    syntax_error("excepted newline after assignment");
                }
                
                
                // SE
                while(data_type_queue.front != NULL){
					
					if(token_queue.front == NULL){
						semantic_error("too many expressions in assignment%s", "", ERROR_SEMANTIC_ANALYZER_TYPE_COMPATIBILITY);
					}
					
					char *variable = (Token_queue_dequeue()).attribut.attribute_s.ptr;
					
					// check semantic correct of assign variable in symtable
					symtable_assign_var(variable);
					
					Data_type_T data_type = Data_type_queue_dequeue();
					if(strcmp(variable, "_") != 0 && symtable_get_datatype(variable) != data_type){
						semantic_error("expression not match data type with %s variable", variable, ERROR_SEMANTIC_ANALYZER_TYPE_COMPATIBILITY);
					}
					
					// code generate, assign variable
					code_generator_assign_variable(string_stack_pop());
					
				}
                if(token_queue.front != NULL){
					semantic_error("too many variables%s", "", ERROR_SEMANTIC_ANALYZER_TYPE_COMPATIBILITY);
				}
                
                
                get_token();

            }
        
        // return
        } else if(token.token_type == T_RETURN){

            // return <expression_list>
            get_token();
            if(token.token_type != T_EOL){

                expression_list();
                
                generate_return();
                // return <expression_list> T_EOL
                if(token.token_type != T_EOL){
                    syntax_error("excepted new line after return");
                }


				// SE
				symtable_func_use(last_declared_function);
				
				while(data_type_queue.front != NULL){
					if(data_type_queue.front->type != symtable_retval_check()){
						semantic_error("expression not match data type with defined return data type%s", "", ERROR_SEMANTIC_ANALYZER_WRONG_FUNCTION);
					}
                    Data_type_queue_dequeue();
				}

				if(token_queue.front != NULL){
					semantic_error("too many expressions in return%s", "", ERROR_SEMANTIC_ANALYZER_TYPE_COMPATIBILITY);
				}

				symtable_func_check_retval_count();


                get_token();

            }

        // if
        } else if(token.token_type == T_IF){

            // if <comparison>
            get_token();
            comparison();
			
            // if <comparison> {
            if(token.token_type != T_CBRK_L){
                syntax_error("excepted { after comparison");
            }
            
            // generate if header
            unsigned this_if_id = if_id_count;
			if_id_count +=1;
			code_generator_if_header(last_if_relational_operator, this_if_id);

			
			// if scope lvl start
            symtable_increase_scope_lvl();

            // if <comparison> { T_EOL
            get_token();
            if(token.token_type != T_EOL){
                syntax_error("excepted new line after { in if statement");
            }

            // if <comparison> { T_EOL <statement>
            get_token();
            statement();

            // if <comparison> { T_EOL <statement> }
            if(token.token_type != T_CBRK_R){
                syntax_error("excepted } after statement in if statement");
            }
            
            // if scope lvl finish
            symtable_finish_scope_lvl();

			// generate if true branch end
			code_generator_if_true_end(this_if_id);

            // if <comparison> { T_EOL <statement> } else
            get_token();
            if(token.token_type != T_ELSE){
                syntax_error("excepted else after } in if statement");
            }

            // if <comparison> { <statement> } else {
            get_token();
            if(token.token_type != T_CBRK_L){
                syntax_error("excepted { after else in if statement");
            }
            
            // if scope lvl start
            symtable_increase_scope_lvl();

            // if <comparison> { <statement> } else { T_EOL
            get_token();
            if(token.token_type != T_EOL){
                syntax_error("excepted newline after else{ in if statement");
            }

            // if <comparison> { <statement> } else { T_EOL <statement>
            get_token();
            statement();

             // if <comparison> { <statement> } else { T_EOL <statement> }
            if(token.token_type != T_CBRK_R){
                syntax_error("excepted } after statement in else statement");
            }
            
            // if scope lvl finish
            symtable_finish_scope_lvl();

			// generate if else branch end
			code_generator_if_else_end(this_if_id);

            // if <comparison> { <statement> } else { T_EOL <statement> } T_EOL
            get_token();
            if(token.token_type != T_EOL){
                syntax_error("excepted newline after }");
            }
            
            get_token();

        // for
        } else if(token.token_type == T_FOR){
            
            // for declaration scope lvl start
            symtable_increase_scope_lvl();
			
			unsigned this_for_id = for_id_count;
			for_id_count += 1;
			
			// code generator, declare variable new line
			code_generator_declare_variable_for_new_line();
            
            // code generator, for assign
            code_generator_for_assign(this_for_id);
            
            // symtable increment scope loop lvl
            loop_scope_lvl_increment();
			
            // for <for_declaration>
            get_token();
            for_declaration();

            // for <for_declaration> ;
            if(token.token_type != T_SEMCOL){
                syntax_error("excepted ; after declaration in for statement");
            }

			// code generator, generate for label
			code_generator_for_label(this_for_id);

            // for <for_declaration> ; <for_comparison>
            get_token();
            for_comparison(this_for_id);
            
            code_generator_for_if(last_if_relational_operator, this_for_id);

            // for <for_declaration> ; <for_comparison> ;
            if(token.token_type != T_SEMCOL){
                syntax_error("excepted ; after comparison in for statement");
            }

            // for <for_declaration> ; <for_comparison> ; <for_assignment>
            get_token();
            for_assignment();
            
            // code generator, generate for body header
            code_generator_for_body(this_for_id);

            // for <for_declaration> ; <for_comparison> ; <for_assignment> {
            if(token.token_type != T_CBRK_L){
                syntax_error("excepted { after assignment in for statement");
            }

            // for statement scope lvl start
            symtable_increase_scope_lvl();
            
            // for <for_declaration> ; <for_comparison> ; <for_assignment> { T_EOL
            get_token();
            if(token.token_type != T_EOL){
                syntax_error("excepted newline after { in for statement");
            }

            // for <for_declaration> ; <for_comparison> ; <for_assignment> { T_EOL <statement>
            get_token();
            statement();

            // for <for_declaration> ; <for_comparison> ; <for_assignment> { T_EOL <statement> }
            if(token.token_type != T_CBRK_R){
                syntax_error("excepted } after statement in for statement");
            }

			// code generate, for end
			code_generator_for_end(this_for_id);

            // for statement scope lvl finish
            symtable_finish_scope_lvl();
            
            // for declaration lvl finish
            symtable_finish_scope_lvl();

            // symtable decrement scope loop lvl
            loop_scope_lvl_decrement();

            // for <for_declaration> ; <for_comparison> ; <for_assignment> { T_EOL <statement> } T_EOL
            get_token();
            if(token.token_type != T_EOL){
                syntax_error("excepted newline after }");
            }
            
            get_token();

        } else if(token.token_type != T_CBRK_R && token.token_type != T_EOF){
            syntax_error("excepted variable, return, if or for in statement");
        }

    } while(token.token_type != T_CBRK_R && token.token_type != T_EOF);

}

void param(){
    // T_STRING_L, T_ID, T_INT_L or T_FLOAT_L
    if(token.token_type != T_STRING_L &&
        token.token_type != T_ID &&
        token.token_type != T_NUM_L &&
        token.token_type != T_FLOAT_L){
        syntax_error("excepted correct parameter in function call");
    }

    // check parameter data type
    symtable_func_param_check();
    
    // code generate, function call param
    generate_func_call_param();

    get_token();
}

void rel_operator(){
    // <, <=, >, >=, == or !=
    if(token.token_type != T_L &&
       token.token_type != T_LE &&
       token.token_type != T_G &&
       token.token_type != T_GE &&
       token.token_type != T_E &&
       token.token_type != T_NE){
        syntax_error("excepted relational operator in if statement");
    }
    
    // code generator
    last_if_relational_operator = token.token_type;
    
    get_token();
}

void comparison(){

    // <expression>
    expression_analyser();
    
    
    // SE
    if(data_type_queue.front == NULL){
		semantic_error("function not returning value before relational operator in if statement%s", "", ERROR_SEMANTIC_ANALYZER_WRONG_TYPE);
	}
	
	Data_type_T first_data_type = Data_type_queue_dequeue();
	
	if(data_type_queue.front != NULL){
		semantic_error("too many return values from function before relational operator in if statement%s", "", ERROR_SEMANTIC_ANALYZER_WRONG_TYPE);
	}
	
	
    // <expression> <rel_operator>
    rel_operator();

    // <expression> <rel_operator> <can_EOL>
    can_eol();

    // <expression> <rel_operator> <can_EOL> <expression> 
    expression_analyser();
    
    
    // SE
    if(data_type_queue.front == NULL){
		semantic_error("function not returning value after relational operator in if statement%s", "", ERROR_SEMANTIC_ANALYZER_WRONG_TYPE);
	}
    
    Data_type_T second_data_type = Data_type_queue_dequeue();
    
    if(data_type_queue.front != NULL){
		semantic_error("too many return values from function after relational operator in if statement%s", "", ERROR_SEMANTIC_ANALYZER_WRONG_TYPE);
	}
    
    if(first_data_type != second_data_type){
		semantic_error("data types not fit in if statement%s", "", ERROR_SEMANTIC_ANALYZER_WRONG_TYPE);
	}

}

void for_declaration(){

    // T_ID
    if(token.token_type == T_ID){

		char* variable = token.attribut.attribute_s.ptr;

        // add variable to symtable
        symtable_declare_var(variable);

        // T_ID :=
        get_token();
        if(token.token_type != T_DECLARE){
            syntax_error("excepted := after variable in for statement");
        }

        // T_ID := <can_EOL>
        get_token();
        can_eol();

        // T_ID := <can_EOL> <expresion>
        expression_analyser();

		// code generator, declare variable
		code_generator_declare_variable(variable);

        // SE
        // add data type of variable to symtable
        // check if data_type_queue is empty
        if(data_type_queue.front == NULL){
            semantic_error("no return value from function in declaration in for statement%s", "", ERROR_SEMANTIC_ANALYZER_WRONG_TYPE);
        }

		DEBUG_PRINT("set datatype variable %s in for statement\n", variable);
        symtable_set_datatype(variable, Data_type_queue_dequeue());

        // check if data_type_queue is not empty
        if(data_type_queue.front != NULL){
            semantic_error("too many return values from function in declaration in for statement%s", "", ERROR_SEMANTIC_ANALYZER_WRONG_TYPE);
        }


    }

}

void for_comparison(){

    // <comparison>
    if(token.token_type != T_SEMCOL){
        comparison();
    }

}

void for_assignment(){

    // T_ID
    if(token.token_type == T_ID){

        // check semantic correct of assign variable in symtable
        symtable_assign_var(token.attribut.attribute_s.ptr);

        // add variable to token queue
        Token_queue_enqueue(token);

        // T_ID <multy_assign>
        get_token();
        multy_assign();
    
        // T_ID <multy_assign> =
        if(token.token_type != T_ASSIGN){
            syntax_error("excepted := or , after identifier in for statement");
        }
    
        // T_ID <multy_assign> = <can_EOL>
        get_token();
        can_eol();
    
        // T_ID <multy_assign> = <can_EOL> <expression_list>
        expression_list();
        
        // SE
        while(data_type_queue.front != NULL){
			if(token_queue.front == NULL){
				semantic_error("too many expressions in assignment in for satement%s", "", ERROR_SEMANTIC_ANALYZER_TYPE_COMPATIBILITY);
			}
			char* variable = (Token_queue_dequeue()).attribut.attribute_s.ptr;
			Data_type_T data_type = Data_type_queue_dequeue();
			if(strcmp(variable, "_") != 0 && symtable_get_datatype(variable) != data_type){
				semantic_error("expression not match data type with %s variable in assignment in for statement", variable, ERROR_SEMANTIC_ANALYZER_TYPE_COMPATIBILITY);
			}
			
			// code generate, assign variable
			code_generator_assign_variable(variable);
			
		}
		if(token_queue.front != NULL){
			semantic_error("too many variables in assignment in for statement%s", "", ERROR_SEMANTIC_ANALYZER_TYPE_COMPATIBILITY);
		}

    }

}

void multy_assign(){

    // ,
    if(token.token_type == T_COMMA){
        
        // , <can_eol>
        get_token();
        can_eol();

        // , <can_eol> T_ID
        if(token.token_type != T_ID){
            syntax_error("excepted identifier after , in assignment");
        } 

        // add variable to token queue
        Token_queue_enqueue(token);
        
        // add variable string to string stack
        string_stack_push(token.attribut.attribute_s.ptr);

        // , <can_eol> T_ID <multy_assign>
        get_token();
        multy_assign();

    }

}

/** @brief This function print error with number of line
 *  @param char *error
 *  pointer to error message with %s, ending with '\0'
 *  @parm char *string
 *  pointer to text which will be printed instead of %s in error parm
 */
void print_error_on_line(char *error, char *string){

    fprintf(stderr, error, string);

    if(token.token_type == T_EOL){
        lex_line_counter -= 1;
    }

    fprintf(stderr, ", on line: %u\n", lex_line_counter);

}

/** @brief This function print error free memory and exit program with code ERROR_PARSER
 *  @param char *error
 *  pointer to error message, ending with '\0'
 */
void syntax_error(char *error){

    fprintf(stderr, "syntax error: ");
    print_error_on_line(error, "\0");

    syntax_analyzer_free(FAIL);

    exit(ERROR_PARSER);

}

/** @brief This function print error free memory and exit program
 *  @param char *error
 *  pointer to error message with %s, ending with '\0'
 *  @parm char *string
 *  pointer to text which will be printed instead of %s in error parm
 *  @param int error_code
 *  exit code
 */
void semantic_error(char *error, char *string, int error_code){

    fprintf(stderr, "semantic error: ");
    print_error_on_line(error, string);

    syntax_analyzer_free(FAIL);

    exit(error_code);

}

/** @brief this function free memory inicialized by syntax analyzer
 *  @pre syntax_analyzer()
 *  @param bool is_success
 *  if an error occurs use FAIL, otherwise SUCCESS
 */
void syntax_analyzer_free(bool is_success){

    // free symtable
    symtable_dtor(is_success);
    // free token queue
    Token_queue_dtor();
    // free data type queue
    Data_type_queue_dtor();
    // free string stack
    string_stack_dtor();
    // free all strings
    dynamic_array_free_all();

}

/** @brief This function start syntax analyzer
 */
void syntax_analyzer(){
    //Token_T token = get_token();

    // create symtable
    symtable_ctor();
    // create token queue
    Token_queue_init();
    // create data type queue
    Data_type_queue_init();

	// generate prolog
	code_generator_prolog();

    // run SA
    prolog();

	// code generator generate EOF
	code_generator_eof();

    // free memory
    syntax_analyzer_free(SUCCESS);

}
