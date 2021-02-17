/*!
 * @file
 * @brief This file contains implementation of generator of targer program
 * 
 * Output: Target program
 * 
 * convert to target program
 *
 * @author Pavel Šesták, xsesta07@stud.fit.vutbr.cz
 * @author Vojtěch Kulíšek, xkulis03@stud.fit.vutbr.cz
 * @author Lukáš Plevač, xpleva07@stud.fit.vutbr.cz
 */

#include <stdio.h>
#include "error_codes.h"
#include <stdint.h>
#include <stdlib.h>
#include "lexical_analyzer.h"
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include "symtable.h"
#include "global_variables.h"

#define MAX_LABEL_ID_LEN 4;

unsigned label_count       = 0;
unsigned param_id          = 1;
unsigned mapping_id        = 1;
unsigned tmp_variable_id   = 1;
unsigned integrate_func_id = 1;
bool instruction_gen       = true;

void code_generator_substr_func();
void code_generator_ord_func();
void code_generator_chr_func();

#define GENERATE_FUNC_COUNT 7

bool require_createframe(char* func_name){
    const char* funcs[] = {"inputs", "inputi", "inputf", "int2float", "float2int", "print", "len"};

    for(int i = 0; i < GENERATE_FUNC_COUNT; i++){
        if(strcmp(func_name, funcs[i]) == 0) return false;  
    }
    return true;

}


void generate_defvar(char *frame, char *varname, int unique_id){
    if(!is_loop_scope_lvl()){
        symtable_itemptr item = symtable_search(varname);
        if(item != NULL){
            defvar_arr_insert(varname,item->variable_unique_id, frame);
        }
        else{
            defvar_arr_insert(varname,unique_id, frame);
        }
    }
    else{
        printf("DEFVAR %s@%s$%d\n",frame,varname,unique_id);
    }
}

void code_generator_prolog(){
	printf(".IFJcode20\n");
    generate_defvar("GF","E",1);
    generate_defvar("GF","E",2);
    generate_defvar("GF","E",3);
    generate_defvar("GF","STRLEN",0);
    printf("JUMP $$main\n");

    code_generator_substr_func();
    code_generator_ord_func();
    code_generator_chr_func();

}

void code_generator_if_header(Token_type_T relational_operator, unsigned if_id){
	
	switch(relational_operator){
		case T_E:
			printf("\nJUMPIFNEQS $$$IF_ELSE_%u\n\n", if_id);
			break;
		case T_NE:
			printf("\nJUMPIFEQS $$$IF_ELSE_%u\n\n", if_id);
			break;
		case T_L:
			printf("\nLTS\n");
			printf("PUSHS bool@true\n");
			printf("JUMPIFNEQS $$$IF_ELSE_%u\n\n", if_id);
			break;
		case T_G:
			printf("\nGTS\n");
			printf("PUSHS bool@true\n");
			printf("JUMPIFNEQS $$$IF_ELSE_%u\n\n", if_id);
			break;
		case T_GE:
			printf("\nLTS\n");
			printf("PUSHS bool@true\n");
			printf("JUMPIFEQS $$$IF_ELSE_%u\n\n", if_id);
			break;
		case T_LE:
			printf("\nGTS\n");
			printf("PUSHS bool@true\n");
			printf("JUMPIFEQS $$$IF_ELSE_%u\n\n", if_id);
			break;
	}
}

void code_generator_if_true_end(unsigned if_id){
	printf("JUMP $$$IF_END_%u\n", if_id);
	printf("\nLABEL $$$IF_ELSE_%u\n", if_id);
}

void code_generator_if_else_end(unsigned if_id){
	printf("LABEL $$$IF_END_%u\n\n", if_id);
}

void code_generator_assign_variable(char* variable){
	if(strcmp(variable, "_") != 0){
		printf("POPS LF@%s$%d\n", variable,symtable_get_variable_unique_id(variable));
	} else{
		//printf("DEFVAR LF@TMP$%u\n", tmp_variable_id);
        generate_defvar("LF","TMP",tmp_variable_id);
		printf("POPS LF@TMP$%u\n", tmp_variable_id);
		tmp_variable_id++;
	}
}

void code_generator_declare_variable(char* variable){
	int unique_id = symtable_get_variable_unique_id(variable);
    //printf("DEFVAR LF@%s$%d\n", variable, unique_id);
	generate_defvar("LF",variable,unique_id);
    printf("POPS LF@%s$%d\n", variable, unique_id);
}

void code_generator_eof(){
	printf("LABEL $$$EOF\n\n");
}

void code_generator_declare_variable_for_new_line(){
	printf("\n");
}

void code_generator_for_end(unsigned for_id){
    printf("JUMP $$$FOR_ITR_%u\n",for_id);
    printf("LABEL $$$FOR_DEF_%u\n",for_id);
    if(is_end_of_block_for()){ defvar_arr_print(); }
    printf("JUMP $$$FOR_ASSIGN_%u\n",for_id);
    printf("LABEL $$$FOR_END_%u\n",for_id);
}

void code_generator_for_if(Token_type_T relational_operator, unsigned for_id){
	
	switch(relational_operator){
		case T_E:
			printf("JUMPIFNEQS $$$FOR_END_%u\n", for_id);
			break;
		case T_NE:
			printf("JUMPIFEQS $$$FOR_END_%u\n", for_id);
			break;
		case T_L:
			printf("LTS\n");
			printf("PUSHS bool@true\n");
			printf("JUMPIFNEQS $$$FOR_END_%u\n", for_id);
			break;
		case T_G:
			printf("GTS\n");
			printf("PUSHS bool@true\n");
			printf("JUMPIFNEQS $$$FOR_END_%u\n", for_id);
			break;
		case T_GE:
			printf("LTS\n");
			printf("PUSHS bool@true\n");
			printf("JUMPIFEQS $$$FOR_END_%u\n", for_id);
			break;
		case T_LE:
			printf("GTS\n");
			printf("PUSHS bool@true\n");
			printf("JUMPIFEQS $$$FOR_END_%u\n", for_id);
			break;
	}
	printf("JUMP $$$FOR_BODY_%u\n", for_id);
	printf("LABEL $$$FOR_ITR_%u\n", for_id);
	
}

void code_generator_for_assign(unsigned for_id){
	printf("JUMP $$$FOR_DEF_%u\n",for_id);
	printf("LABEL $$$FOR_ASSIGN_%u\n",for_id);
}

void code_generator_for_label(unsigned for_id){
	printf("LABEL $$$FOR_%u\n",for_id);
}

void code_generator_for_body(unsigned for_id){
	printf("JUMP $$$FOR_%u\n",for_id);
	printf("LABEL $$$FOR_BODY_%u\n", for_id);
}

void code_generator_substr_func(){
    printf("LABEL $$substr\n");
    printf("PUSHFRAME\n");
    printf("DEFVAR LF@s$11\n");
    printf("MOVE LF@s$11 LF@%%$1\n");
    printf("DEFVAR LF@i$12\n");
    printf("MOVE LF@i$12 LF@%%$2\n");
    printf("DEFVAR LF@n$13\n");
    printf("MOVE LF@n$13 LF@%%$3\n");
    printf("PUSHS int@0\n");
    printf("DEFVAR LF@le$14\n");
    printf("POPS LF@le$14\n");
    printf("CREATEFRAME\n");
    printf("STRLEN GF@STRLEN$0 LF@s$11\n");
    printf("PUSHS GF@STRLEN$0\n");
    printf("POPS LF@le$14\n");
    printf("PUSHS LF@i$12\n");
    printf("PUSHS int@0\n");
    printf("LTS\n");
    printf("PUSHS bool@true\n");
    printf("JUMPIFNEQS $$$$IF_ELSE_0\n");
    printf("PUSHS string@\n");
    printf("PUSHS int@1\n");
    printf("POPFRAME\n");
    printf("RETURN\n");
    printf("JUMP $$$$IF_END_0\n");
    printf("LABEL $$$$IF_ELSE_0\n");
    printf("LABEL $$$$IF_END_0\n");
    printf("PUSHS LF@i$12\n");
    printf("PUSHS LF@le$14\n");
    printf("LTS\n");
    printf("PUSHS bool@true\n");
    printf("JUMPIFEQS $$$$IF_ELSE_1\n");
    printf("PUSHS string@\n");
    printf("PUSHS int@1\n");
    printf("POPFRAME\n");
    printf("RETURN\n");
    printf("JUMP $$$$IF_END_1\n");
    printf("LABEL $$$$IF_ELSE_1\n");
    printf("LABEL $$$$IF_END_1\n");
    printf("PUSHS LF@n$13\n");
    printf("PUSHS int@0\n");
    printf("LTS\n");
    printf("PUSHS bool@true\n");
    printf("JUMPIFNEQS $$$$IF_ELSE_2\n");
    printf("PUSHS string@\n");
    printf("PUSHS int@1\n");
    printf("POPFRAME\n");
    printf("RETURN\n");
    printf("JUMP $$$$IF_END_2\n");
    printf("LABEL $$$$IF_ELSE_2\n");
    printf("LABEL $$$$IF_END_2\n");
    printf("PUSHS int@0\n");
    printf("DEFVAR LF@tmp$15\n");
    printf("POPS LF@tmp$15\n");
    printf("PUSHS LF@le$14\n");
    printf("PUSHS LF@i$12\n");
    printf("SUBS\n");
    printf("POPS LF@tmp$15\n");
    printf("PUSHS int@0\n");
    printf("DEFVAR LF@to$16\n");
    printf("POPS LF@to$16\n");
    printf("PUSHS LF@n$13\n");
    printf("PUSHS LF@tmp$15\n");
    printf("GTS\n");
    printf("PUSHS bool@true\n");
    printf("JUMPIFNEQS $$$$IF_ELSE_3\n");
    printf("PUSHS LF@le$14\n");
    printf("POPS LF@to$16\n");
    printf("JUMP $$$$IF_END_3\n");
    printf("LABEL $$$$IF_ELSE_3\n");
    printf("PUSHS LF@i$12\n");
    printf("PUSHS LF@n$13\n");
    printf("ADDS\n");
    printf("POPS LF@to$16\n");
    printf("LABEL $$$$IF_END_3\n");
    printf("PUSHS string@\n");
    printf("DEFVAR LF@substring$17\n");
    printf("POPS LF@substring$17\n");
    printf("PUSHS string@\n");
    printf("DEFVAR LF@char$18\n");
    printf("POPS LF@char$18\n");
    printf("LABEL $$$$FOR_0\n");
    printf("PUSHS LF@i$12\n");
    printf("PUSHS LF@to$16\n");
    printf("LTS\n");
    printf("PUSHS bool@true\n");
    printf("JUMPIFNEQS $$$$FOR_END_0\n");
    printf("JUMP $$$$FOR_BODY_0\n");
    printf("LABEL $$$$FOR_ITR_0\n");
    printf("PUSHS LF@i$12\n");
    printf("PUSHS int@1\n");
    printf("ADDS\n");
    printf("POPS LF@i$12\n");
    printf("JUMP $$$$FOR_0\n");
    printf("LABEL $$$$FOR_BODY_0\n");
    printf("GETCHAR LF@char$18 LF@s$11 LF@i$12\n");
    printf("CONCAT LF@substring$17 LF@substring$17 LF@char$18\n");
    printf("JUMP $$$$FOR_ITR_0\n");
    printf("LABEL $$$$FOR_END_0\n");
    printf("PUSHS LF@substring$17\n");
    printf("PUSHS int@0\n");
    printf("POPFRAME\n");
    printf("RETURN\n");
}

void code_generator_ord_func(){
	printf("LABEL $$ord\n");
	printf("PUSHFRAME\n");
	printf("DEFVAR LF@s$11\n");
	printf("MOVE LF@s$11 LF@%%$1\n");
	printf("DEFVAR LF@i$12\n");
	printf("MOVE LF@i$12 LF@%%$2\n");
	printf("PUSHS int@0\n");
	printf("DEFVAR LF@ret$13\n");
	printf("POPS LF@ret$13\n");
	printf("PUSHS LF@i$12\n");
	printf("PUSHS int@0\n");
	printf("LTS\n");
	printf("PUSHS bool@true\n");
	printf("JUMPIFNEQS $$$$$IF_ELSE_0\n");
	printf("PUSHS int@0\n");
	printf("PUSHS int@1\n");
	printf("POPFRAME\n");
	printf("RETURN\n");
	printf("JUMP $$$$$IF_END_0\n");
	printf("LABEL $$$$$IF_ELSE_0\n");
	printf("LABEL $$$$$IF_END_0\n");
	printf("CREATEFRAME\n");
	printf("STRLEN GF@STRLEN$0 LF@s$11\n");
	printf("PUSHS GF@STRLEN$0\n");
	printf("DEFVAR LF@le$14\n");
	printf("POPS LF@le$14\n");
	printf("PUSHS LF@i$12\n");
	printf("PUSHS LF@le$14\n");
	printf("LTS\n");
	printf("PUSHS bool@true\n");
	printf("JUMPIFEQS $$$$$IF_ELSE_1\n");
	printf("PUSHS int@0\n");
	printf("PUSHS int@1\n");
	printf("POPFRAME\n");
	printf("RETURN\n");
	printf("JUMP $$$$$IF_END_1\n");
	printf("LABEL $$$$$IF_ELSE_1\n");
	printf("LABEL $$$$$IF_END_1\n");
	printf("STRI2INT LF@ret$13 LF@s$11 LF@i$12\n");
	printf("PUSHS LF@ret$13\n");
	printf("PUSHS int@0\n");
	printf("POPFRAME\n");
	printf("RETURN\n");
}

void code_generator_chr_func(){
	printf("LABEL $$chr\n");
	printf("PUSHFRAME\n");
	printf("DEFVAR LF@i$11\n");
	printf("MOVE LF@i$11 LF@%%$1\n");
	printf("PUSHS string@\n");
	printf("DEFVAR LF@char$12\n");
	printf("POPS LF@char$12\n");
	printf("PUSHS LF@i$11\n");
	printf("PUSHS int@0\n");
	printf("LTS\n");
	printf("PUSHS bool@true\n");
	printf("JUMPIFNEQS $$$$$$IF_ELSE_0\n");
	printf("PUSHS string@\n");
	printf("PUSHS int@1\n");
	printf("POPFRAME\n");
	printf("RETURN\n");
	printf("JUMP $$$$$$IF_END_0\n");
	printf("LABEL $$$$$$IF_ELSE_0\n");
	printf("LABEL $$$$$$IF_END_0\n");
	printf("PUSHS LF@i$11\n");
	printf("PUSHS int@255\n");
	printf("GTS\n");
	printf("PUSHS bool@true\n");
	printf("JUMPIFNEQS $$$$$$IF_ELSE_1\n");
	printf("PUSHS string@\n");
	printf("PUSHS int@1\n");
	printf("POPFRAME\n");
	printf("RETURN\n");
	printf("JUMP $$$$$$IF_END_1\n");
	printf("LABEL $$$$$$IF_ELSE_1\n");
	printf("LABEL $$$$$$IF_END_1\n");
	printf("INT2CHAR LF@char$12 LF@i$11\n");
	printf("PUSHS LF@char$12\n");
	printf("PUSHS int@0\n");
	printf("POPFRAME\n");
	printf("RETURN\n");
}

char* get_label(char *name) {
    int   name_len  = strlen(name);
    int   label_len = name_len + 1 + 1 + MAX_LABEL_ID_LEN; /* 1 + for /0 and for %*/
    char *label     = (char*) malloc(label_len * sizeof(char));

    strncpy(label, name, label_len);

    label[label_len - 1] = '\0';

    label[name_len] = '%';

    sprintf(&(label[name_len + 1]), "%04d", label_count);

    label_count++;

    return label;
}


void print_attribut_val(Token_T token){    

    if(token.token_type == T_ID){
        //TODO... generate LF/GT@
        int unique_id = symtable_get_variable_unique_id(token.attribut.attribute_s.ptr);
        printf("LF@%s$%d",token.attribut.attribute_s.ptr,unique_id);
    }
    else{
        switch (token.data_type)
        {
        case DT_INT:
            printf("int@%ld",token.attribut.attribute_i);
            break;

        case DT_FLOAT:
            printf("float@%a",token.attribut.attribute_f);
            break;

        case DT_STRING: 
            printf("string@");
            int token_length = strlen(token.attribut.attribute_s.ptr);

            for(int i = 1; i < token_length-1 ; i++){ //magic constant 1 is for skipping " on start and end of string
                char c = token.attribut.attribute_s.ptr[i];
                if((c >= 0 && c <= 32) || c == '#' || c == '\\'){
                    if(c == '\\'){
                        c = token.attribut.attribute_s.ptr[i+1];
                        if(c == 'n'){
                            printf("\\010");
                        }
                        else if(c == 't'){
                            printf("\\009");
                        }
                        else if(c == '"'){
                            printf("\"");
                        }
                        else if(c == '\\'){
                            printf("\\");
                        }
                        else if(c == 'x'){
                            char numb[2];
                            numb[0] = token.attribut.attribute_s.ptr[i+2];
                            numb[1] = token.attribut.attribute_s.ptr[i+3];
                            int numb_converted = (unsigned char)strtol(numb, NULL, 16);
                            printf("\\%03d",numb_converted);
                            i+=2;
                        }
                        i++;
                    }
                    else{
                        printf("\\%03d",c);
                    }
                }
                else{
                    printf("%c",token.attribut.attribute_s.ptr[i]);
                }
            }
            break;
        }
    }
}

void generate_pushframe(){
    printf("PUSHFRAME\n");
}

void generate_popframe(){
    printf("POPFRAME\n");
}

void generate_createframe(char* func_name){
    if(require_createframe(func_name)){
        printf("CREATEFRAME\n");
    }
}

void generate_push(Token_T token){
    if(token.token_type != T_ID &&
       token.token_type != T_FLOAT_L &&
       token.token_type != T_STRING_L &&
       token.token_type != T_NUM_L ) { return; }
       
    printf("PUSHS ");
    print_attribut_val(token);
    printf("\n");
}

void generate_adds(){
    printf("ADDS\n");
}

void generate_subs(){
    printf("SUBS\n");
}

void generate_muls(){
    printf("MULS\n");
}

void generate_divs(){
    printf("DIVS\n");
}

void generate_idivs(){
    printf("IDIVS\n");
}

void generate_exp_var(int n){
    printf(" GF@E$%d ",n);
}

void generate_concats(){
    //POPS E$1
    printf("POPS");
    generate_exp_var(1);
    printf("\n");

    //POPS E$2
    printf("POPS");
    generate_exp_var(2);
    printf("\n");

    //CONCAT E$3 E$2 E$1
    printf("CONCAT");
    generate_exp_var(3);
    generate_exp_var(2);
    generate_exp_var(1);
    printf("\n");

    //PUSHS E$3
    printf("PUSHS");
    generate_exp_var(3);
    printf("\n");
}

void generate_clears(){
    printf("CLEARS\n");
}

void generate_func_call_param(){
    char *func_name = symtable_get_last_call_func();
    
    if(require_createframe(func_name)){
        //printf("DEFVAR TF@%%%d\n",param_id);
        generate_defvar("TF","%",param_id);
        printf("MOVE TF@%%$%d ",param_id++);
        print_attribut_val(token);
        printf("\n");
    }
    else{
        if(strcmp(func_name,"print") == 0){
            printf("WRITE ");
            print_attribut_val(token);
            printf("\n");
        }
        else if(strcmp(func_name,"float2int") == 0){
            printf("PUSHS ");
            print_attribut_val(token);
            printf("\n");
            printf("FLOAT2INTS\n");
        }
        else if((strcmp(func_name,"int2float") == 0)){
            printf("PUSHS ");
            print_attribut_val(token);
            printf("\n");
            printf("INT2FLOATS\n");   
        }
        else if((strcmp(func_name,"len") == 0)){
            
            printf("STRLEN GF@STRLEN$0 ");
            print_attribut_val(token);
            printf("\n");
            printf("PUSHS GF@STRLEN$0\n");
        }
        else{

        }
    }

instruction_gen = false;
}   

void generate_func_call(){
    char *func_name = symtable_get_last_call_func();
    if(require_createframe(func_name)){

        printf("CALL $$%s\n",func_name);
    }
    else if((strcmp(func_name,"inputs") == 0) || (strcmp(func_name,"inputf") == 0) || (strcmp(func_name,"inputi") == 0)){
            
        //read from stdin
        printf("READ ");
        if(token_queue.front == NULL) { fprintf(stderr,"Error while reading token queue, its null\n");
        exit(ERROR_COMPILER); }
        print_attribut_val(token_queue.front->token);
        switch(func_name[5]){
            case 's':
            printf(" string\n");
            break;
            case 'f':
            printf(" float\n");
            break;
            case 'i':
            printf(" int\n");
            break;
        }

        //push read value on stack
        printf("PUSHS ");
        print_attribut_val(token_queue.front->token);
        printf("\n");

        //push nil to stack
        printf("PUSHS nil@nil\n");
        printf("JUMPIFEQS $$$inputs_incorrect%d\n",integrate_func_id);
        
        //corect call
        //push value
        
        printf("PUSHS ");
        print_attribut_val(token_queue.front->token);
        printf("\n");

        printf("PUSHS int@0\n");
        
        printf("JUMP $$$inputs_end%d\n",integrate_func_id);
        //incorrect call
        printf("LABEL $$$inputs_incorrect%d\n",integrate_func_id);

        printf("PUSHS nil@nil\n");

        printf("PUSHS int@1\n");

        printf("LABEL $$$inputs_end%d\n",integrate_func_id);

        integrate_func_id++;
    }
    
    param_id = 1;

    instruction_gen = true;
}

void generate_func_label(char* func_name){
    printf("\nLABEL $$%s\n",func_name);
    if(strcmp(func_name, "main") == 0){
        printf("CREATEFRAME\n");
    }
    generate_pushframe();
}

void generate_func_end(char* func_name){
    //printf("LABEL $$%s_end\n",func_name);
    if(strcmp(func_name,"main") != 0){
        generate_popframe();
        printf("RETURN\n");
    }
    else{
        printf("JUMP $$$EOF\n");
    }
}

void generate_return(){
    if(strcmp(symtable_get_last_call_func(),"main") == 0){
        printf("JUMP $$$EOF\n");
    }
    else{
        generate_popframe();
        printf("RETURN\n");
    }
}

void generate_param_map(char *param_name){
	int unique_id = symtable_get_variable_unique_id(param_name);
	//printf("DEFVAR LF@%s$%d\n", param_name, unique_id);
    generate_defvar("LF",param_name,unique_id);
    printf("MOVE LF@%s$%d LF@%%$%d\n", param_name, unique_id, mapping_id++);
}

void function_declare_finish(){
    mapping_id = 1;
}
