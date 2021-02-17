/*!
 * @file
 * @brief This file contains implementation of symbol table realized by hash table
 * 
 * Input: Source program
 * Output: String of tokens
 * 
 * Symbol table care about identifiers for variables and functions and hold info if its used, declared, etc...
 *
 * @author Pavel Šesták, xsesta07@stud.fit.vutbr.cz
 */

#include <stdio.h>
#include <string.h>
#include "error_codes.h"
#include <stdbool.h>
#include <stdlib.h>
#include "global_variables.h"
#include "syntax_analyzer.h"
#include "debug_tool.h"
#include "code_generator.h"

#define INTEGR_FUNC_COUNT 10

char* last_call_func_name = "";
unsigned unique_id   = 1 - INTEGR_FUNC_COUNT; //integr func is inserted first into table.. now will user IDs start on 1
unsigned param_count = 0;
unsigned retval_count = 0;

unsigned LoopScopeLvl = 0;
defvar_arr_item_T* LoopDefVar;
unsigned LoopDefVarCount = 0;
unsigned allocated;

bool is_loop_scope_lvl(){
    return LoopScopeLvl == 0;
}

bool is_end_of_block_for(){
    return LoopScopeLvl == 1;
}

void loop_scope_lvl_increment(){
    LoopScopeLvl++;
}

void loop_scope_lvl_decrement(){
    LoopScopeLvl--;
}

void defvar_arr_insert(char *name,int unique_id, char* frame){
    //printf("insert into arr\n");
    //printf("sizeof arr item %ld\n", sizeof(defvar_arr_item_T));
    if(LoopDefVarCount == 0){
        LoopDefVar = malloc(sizeof(defvar_arr_item_T));
        if(LoopDefVar == NULL){
            fprintf(stderr,"Error while allocating memory\n");
            exit(ERROR_COMPILER);
        }
        allocated = 1;
    }
    else{
        if(allocated <= LoopDefVarCount){
            allocated*=2;
            LoopDefVar = realloc(LoopDefVar,sizeof(defvar_arr_item_T)*allocated);
            if(LoopDefVar == NULL){
                fprintf(stderr,"Error while allocating memory\n");
                exit(ERROR_COMPILER);
            }
        }
    }
    defvar_arr_item_T item;
    item.scope_lvl = LoopScopeLvl;
    item.unique_id = unique_id;
    item.name = name;
    item.frame = frame;
    LoopDefVar[LoopDefVarCount++] = item;
}

void defvar_arr_print(){
    defvar_arr_item_T item;
    for(int i = 0; i < LoopDefVarCount; i++){
        item = LoopDefVar[i];
        printf("DEFVAR %s@%s$%d\n",item.frame,item.name,item.unique_id); 
    }
    free(LoopDefVar);
    LoopDefVarCount = 0;
}


/*!
 * function return index to symtable for current key(variable)
 * \param key 
 * \return 
 */
int get_hash(char* key){
    if(key == NULL) { 
        fprintf(stderr,"get_hash: argument key passed into this function was null.");
        exit(ERROR_COMPILER);
    }

    int sum = 0;
    for(int i = 0; i < strlen(key);i++){
        sum += key[i];
    }
    return sum % SYM_TOP_ITEMS; 
}

void symtable_ctor(){
     DEBUG_PRINT("symtable: Calling table constructor\n");
    symtable.scope_lvl = 0; //set current scope to 0

    for(int i = 0; i < SYM_MAX_SCOPE; i++) { 
        for(int j = 0; j < SYM_TOP_ITEMS; j++){
            symtable.tables[i][j] = NULL; 
        }
    }

    //add implicit functions into symtable

    //backup global variable
    Token_T backupToken = token;
    Token_T newToken;
    token = newToken;

    //define func inputs() (string, int)
    symtable_declare_func("inputs");
    token.token_type = T_STRING;
    symtable_func_retval_declare();
    token.token_type = T_INT;
    symtable_func_retval_declare();
    symtable_func_is_declared();

    //define func inputi() (int,int)
    symtable_declare_func("inputi");
    token.token_type = T_INT;
    symtable_func_retval_declare();
    token.token_type = T_INT;
    symtable_func_retval_declare();
    symtable_func_is_declared();

    //define func inputf() (float64,int)
    symtable_declare_func("inputf");
    token.token_type = T_FLOAT64;
    symtable_func_retval_declare();
    token.token_type = T_INT;
    symtable_func_retval_declare();
    symtable_func_is_declared();

    //define func int2float(i int) (float64)
    symtable_declare_func("int2float");
    token.token_type = T_INT;
    symtable_func_param_declare();
    token.token_type = T_FLOAT64;
    symtable_func_retval_declare();
    symtable_func_is_declared();
    
    //define func float2int(f float64) (int)
    symtable_declare_func("float2int");
    token.token_type = T_FLOAT64;
    symtable_func_param_declare();
    token.token_type = T_INT;
    symtable_func_retval_declare();
    symtable_func_is_declared();

    //define func len(s string) (int)
    symtable_declare_func("len");
    token.token_type = T_STRING;
    symtable_func_param_declare();
    token.token_type = T_INT;
    symtable_func_retval_declare();
    symtable_func_is_declared();

    //define func substr(s string, i int, n int) (string,int)
    symtable_declare_func("substr");
    token.token_type = T_STRING;
    symtable_func_param_declare();
    token.token_type = T_INT;
    symtable_func_param_declare();
    token.token_type = T_INT;
    symtable_func_param_declare();
    token.token_type = T_STRING;
    symtable_func_retval_declare();
    token.token_type = T_INT;
    symtable_func_retval_declare();
    symtable_func_is_declared();

    //define func ord(s string, i int) (int, int)
    symtable_declare_func("ord");
    token.data_type = T_STRING_L;
    symtable_func_param_declare();
    token.data_type = T_INT;
    symtable_func_param_declare();
    token.token_type = T_INT;
    symtable_func_retval_declare();
    symtable_func_retval_declare();
    symtable_func_is_declared();

    //define func chr(i int) (string, int)
    symtable_declare_func("chr");
    token.data_type = T_INT;
    symtable_func_param_declare();
    symtable_func_is_declared();

    token.token_type = T_STRING_L;
    symtable_func_param_declare();
    token.token_type = T_INT;
    symtable_func_param_declare();
    symtable_func_is_declared();
    
    symtable_declare_func("print");
    symtable_func_is_declared();

}



const char* integr_func[] = {"inputs", "inputi", "inputf", "int2float", "float2int", "print", "len", "ord", "chr", "substr"};

bool is_integrate_func(char* string){
    for(int i = 0; i < INTEGR_FUNC_COUNT; i++){
        if(strcmp(string, integr_func[i]) == 0) return true;  
    }
    return false;
}


symtable_itemptr symtable_search(char* key){
    //DEBUG_PRINT("symtable: Searching in table key %s\n",key);
    if(key == NULL){
        fprintf(stderr,"symtable_search: argument key passed into this function was null.");
        exit(ERROR_COMPILER);
    }
    int actual_scope = symtable.scope_lvl;

    while(actual_scope >= 0){
        symtable_itemptr item = symtable.tables[actual_scope][get_hash(key)];
        while(item != NULL){
            if(strcmp(item->variable_name,key) == 0) { return item; DEBUG_PRINT("symtable: Search find item %s on scope %d table constructor\n",key,actual_scope); }
            item = item->next;
        }
        actual_scope--;
    }

    return NULL;
}

void symtable_insert(char* key, bool declared){/* TODO ADD DATA*/
    symtable_itemptr item;
    for(int i = 0; i < SYM_TOP_ITEMS; i++){
        item = symtable.tables[symtable.scope_lvl][i];
        while(item != NULL){
            if(strcmp(item->variable_name,key) == 0) { semantic_error("Variable %s was already declared",key,ERROR_SEMANTIC_ANALYZER_UNDEFINED); }
            item = item->next;
        }
    }

   /* if(item != NULL && item->declared == true){ //item was found and its declared yet
        semantic_error("semantic error: variable %s was already declared",item->variable_name,ERROR_SEMANTIC_ANALYZER_UNDEFINED);
    }
*/
    item = symtable.tables[symtable.scope_lvl][get_hash(key)]; //get pointer from table defined by hash func
    symtable_itemptr newItem = (symtable_itemptr) malloc(sizeof(symtable_item_T)); //alloc memory for new item
    if(newItem != NULL){ //if malloc was succesfull insert values
        //newItem->data = data;
        newItem->variable_name = key;
        newItem->declared = declared;
        newItem->called = false;
        newItem->next = item; //set like first item in current table index
        newItem->params = NULL;
        newItem->param_count = 0;
        newItem->retvals = NULL;
        newItem->retval_count = 0;
        newItem->variable_unique_id = unique_id++;
        newItem->param_allocated = 0;
        newItem->retval_allocated = 0;
        
        symtable.tables[symtable.scope_lvl][get_hash(key)] = newItem;
    }
    else{
        fprintf(stderr,"Error while allocating memory\n");
        exit(ERROR_COMPILER);
    }
}

/*
void symtable_delete(char* key){
    
	symtable_itemptr item = symtable.itemArr[get_hash(key)];
	symtable_itemptr pred = NULL;

	while(item != NULL){ //try to find match in hash table
		if(strcmp(item->variable_name,key) == 0) { break; }
		pred = item;
		item = item->next;
	}	

	if(item != NULL){ //if item was found
		if(pred != NULL){
			pred->next = item->next; //item isnt first in line, need to update previous item
		}
		else{
			symtable.itemArr[get_hash(key)] = item->next; //item is first need to update record in table

        if(item->retvals != NULL) { free(item->retvals); }
		}
        if(item->params != NULL) { free(item->params); }
        
        if(!is_integrate_func(item->variable_name) && /* ERROR HERE CHECK LVL 0 ON SYMTABLE*//*){
            free(item->variable_name);
        }
		
        free(item);
	}
}
*/

void symtable_dtor(bool check_semantic){


    DEBUG_PRINT("symtable: Calling dtor\n");
   
   if(check_semantic){
        symtable_itemptr item = symtable_search("main");
        if(item == NULL){
            semantic_error("semantic error: Missing function main",NULL,ERROR_SEMANTIC_ANALYZER_UNDEFINED);
        }
        if(item->param_count != 0 || item->retval_count != 0){
            semantic_error("semantic error: Function main cannot be declared with parameters",NULL,ERROR_SEMANTIC_ANALYZER_WRONG_FUNCTION);
        }
   }
   
    symtable.scope_lvl = 0;

    for(int i = 0; i < SYM_MAX_SCOPE; i++){
        for(int j = 0; j < SYM_TOP_ITEMS; j++){
            while(symtable.tables[i][j] != NULL){ //delete first item until chain is not clear
			symtable_itemptr item = symtable.tables[i][j];
			symtable.tables[i][j] = item->next;
            
            if(check_semantic){
                if(item->called && item->declared == false && !(is_integrate_func(item->variable_name)) && strcmp(item->variable_name,"substr") != 0){
                    semantic_error("Functions %s is not declared",item->variable_name,ERROR_SEMANTIC_ANALYZER_UNDEFINED);
                }
            }

            if(item->retvals != NULL) { free(item->retvals); }
            if(item->params != NULL) { free(item->params); }
            
			free(item);
		}
        }
    }

}

void symtable_finish_scope_lvl(){
    DEBUG_PRINT("symtable: Calling finish scope, actual scope is %d\n",symtable.scope_lvl);
    for(int i = 0; i < SYM_TOP_ITEMS; i++){
        while(symtable.tables[symtable.scope_lvl][i] != NULL){ //delete first item until chain is not clear
			symtable_itemptr item = symtable.tables[symtable.scope_lvl][i];
			symtable.tables[symtable.scope_lvl][i] = item->next;

            if(item->retvals != NULL) { free(item->retvals); }
            if(item->params != NULL) { free(item->params); }

			free(item);
	    }
    }


    symtable.scope_lvl--;
    //generate_popframe();
    DEBUG_PRINT("symtable: Calling finish scope, new scope is %d\n",symtable.scope_lvl);
}

void symtable_declare_var(char* variable_name){
    DEBUG_PRINT("symtable: Calling declare var %s\n",variable_name);
    if(strcmp(variable_name,"_") == 0) { semantic_error("Cannot declare _ variable\n",NULL,ERROR_SEMANTIC_ANALYZER_UNDEFINED); }
    symtable_insert(variable_name,false);
}

void symtable_assign_var(char* variable_name){
    
    DEBUG_PRINT("symtable: Calling assign to var %s\n",variable_name);
    if(strcmp(variable_name,"_") != 0){
        symtable_itemptr item = symtable_search(variable_name);
        if(item == NULL){
            //assign to variable which is undeclared
            //TODO... remove comment
            semantic_error("semantic error: Assignment to undeclared variable %s",variable_name,ERROR_SEMANTIC_ANALYZER_UNDEFINED);
        }
    }
}

void symtable_declare_func(char* func_name){
    DEBUG_PRINT("symtable: Calling declare func %s\n",func_name);
    symtable_insert(func_name,true);
    last_call_func_name = func_name; //set last called func 
    param_count = 0; //reset param counter
    retval_count = 0; //reset retval counter
    
    symtable_itemptr item = symtable_search(func_name);
    if(item == NULL) { 
        fprintf(stderr,"symtable seach return false");
        exit(ERROR_COMPILER);
    }

    item->called = false;
}

void symtable_func_use(char* func_name){
    DEBUG_PRINT("symtable: Calling func use %s\n",func_name);
    symtable_itemptr item = symtable_search(func_name);
    if(item == NULL){
        //used unknown func => predict
        symtable_insert(func_name,false);
        item = symtable_search(func_name);
        if(item == NULL){
            fprintf(stderr, "Symtable Error while allocating memory\n");
            exit(ERROR_COMPILER);
        }
    }
    
    last_call_func_name = func_name; //set last called func 
    param_count = 0; //reset param counter
    retval_count = 0; //reset retval counter
}

void symtable_increase_scope_lvl(){
    //DEBUG_PRINT("symtable: Increasing scope lvl: actual scope %d\n",symtable.scope_lvl);
    symtable.scope_lvl++;
    //generate_pushframe();
    DEBUG_PRINT("symtable: Increasing scope lvl: new scope %d\n",symtable.scope_lvl);
}


void symtable_func_param_declare(){
    DEBUG_PRINT("symtable: func param declare for func %s\n",last_call_func_name);
    symtable_itemptr item = symtable_search(last_call_func_name);
    if(item != NULL){
        if(item->param_count == 0){
            item->params = (Data_type_T *) malloc(sizeof(Data_type_T));
            DEBUG_PRINT("symtable: func param declare : its first param for func %s, malloc memory \n",last_call_func_name);
            item->param_allocated = 1;
        }
        else{
            if(item->param_allocated <= item->param_count) { 
                    item->param_allocated *= 2;
                    item->params = (Data_type_T *) realloc(item->params,sizeof(Data_type_T)*item->param_allocated); 
                    DEBUG_PRINT("symtable: func param declare : this param for func %s, reallocing memory \n",last_call_func_name);
                }
        }
        if(item->params == NULL) { fprintf(stderr,"symtable_func_param_declare error while allocating memory \n"); exit(ERROR_COMPILER); }
        
        switch(token.token_type){
            case T_INT:
                item->params[item->param_count] = DT_INT;    
                break;
            case T_STRING:
                item->params[item->param_count] = DT_STRING;
                break;
            case T_FLOAT64:
                item->params[item->param_count] = DT_FLOAT;
                break;
            default:
                item->params[item->param_count] = DT_UNDEFINED;
                break;
        }
        
        item->param_count++;
    }
    else{
        //error
        syntax_error("Declaring parameters for unknown function");
    }
    param_count++;
}

void symtable_func_retval_declare(){
    DEBUG_PRINT("symtable: func retval declare for func %s\n",last_call_func_name);
    symtable_itemptr item = symtable_search(last_call_func_name);
    if(item != NULL){

        if(item->called == false){
            DEBUG_PRINT("item is not null \n");
            if(item->retval_allocated == 0){
                item->retvals = (Data_type_T *) malloc(sizeof(Data_type_T));
                DEBUG_PRINT("symtable: func retval declare : its first retval for func %s, malloc memory \n",last_call_func_name);
                item->retval_allocated = 1;
            }  
            else{
                if(item->retval_allocated == item->retval_count) { 
                    item->retval_allocated *= 2;
                    item->retvals = (Data_type_T *) realloc(item->retvals,sizeof(Data_type_T)*item->retval_allocated); 
                    DEBUG_PRINT("symtable: func retval declare : this retval for func %s, reallocing memory \n",last_call_func_name);
                }
            }
            
            if(item->retvals == NULL){
                fprintf(stderr,"Error while allocating memory in func symtable_func_retval_declare\n");
                exit(ERROR_COMPILER);
            }
            //item->retvals[item->retval_count] = token.token_type;
            
            
            switch(token.token_type){
                case T_INT:
                    item->retvals[item->retval_count] = DT_INT;    
                    break;
                case T_STRING:
                    item->retvals[item->retval_count] = DT_STRING;
                    break;
                case T_FLOAT64:
                    item->retvals[item->retval_count] = DT_FLOAT;
                    break;
                case T_ID:
                    item->retvals[item->retval_count] = symtable_get_datatype(token.attribut.attribute_s.ptr);
                    break;
                default:
                    item->retvals[item->retval_count] = DT_UNDEFINED;
                    //todo error?
                    break;
            }


            DEBUG_PRINT("Retval declared: %d\n",item->retvals[item->retval_count]);
            item->retval_count++;
            
        }
        else{
            Token_T backup = token;

            switch(token.token_type){
                case T_INT:
                token.data_type = DT_INT;
                break;
                case T_STRING:
                token.data_type = DT_STRING;
                break;
                case T_FLOAT64:
                token.data_type = DT_FLOAT;
                break;
                case T_ID:
                item->retvals[item->retval_count] = symtable_get_datatype(token.attribut.attribute_s.ptr);
                break;
            }
            symtable_func_param_check();

            token = backup;
        }
        retval_count++;
        
    }
    else{
        //error
        syntax_error("Declaraing return values for unknown function");
    }

    DEBUG_PRINT("END OF RETVAL DECLARE \n");
}


void symtable_func_param_check(){
    DEBUG_PRINT("symtable_func_param_check, last call func name: %s\n", last_call_func_name);
    symtable_itemptr item = symtable_search(last_call_func_name);
    if(item != NULL){
        if( strcmp(item->variable_name,"print") != 0){
            
            if(item->called || item->declared){
                if(item->params != NULL){
                    DEBUG_PRINT("item param count %d, param count %d\n",item->param_count, param_count);
                    if(item->param_count < param_count) { semantic_error("Function %s called with more parameters than is defined",last_call_func_name,ERROR_SEMANTIC_ANALYZER_WRONG_FUNCTION); }
                
                    DEBUG_PRINT("defined param type %d, income data type %d\n",item->params[param_count],token.data_type);
                    
                    Data_type_T type;
                    if(token.token_type != T_ID){
                        type = token.data_type;
                    }
                    else{
                        type = symtable_get_datatype(token.attribut.attribute_s.ptr);
                        //ADDED to free mem correctly
                    }

                    if(item->params[param_count] != type) { semantic_error("Function %s called with wrong parametr type",last_call_func_name,ERROR_SEMANTIC_ANALYZER_WRONG_FUNCTION); }
                   
                    param_count++;
                }
            }
            else if(item->declared == false){
                DEBUG_PRINT("Func %s is not declaredialized \n",last_call_func_name);
                    
                int token_type_backup = token.token_type;
                switch(token.data_type){
                    case DT_INT:
                        token.token_type = T_INT;
                    break;

                    case DT_STRING:
                        token.token_type = T_STRING;
                    break;
                    case DT_FLOAT:
                        token.token_type = T_FLOAT64;
                    }

                symtable_func_param_declare();
                token.token_type = token_type_backup;
            }
        }
        else{
            param_count++;
        }
    }
    else{
        syntax_error("Checking parameters for unknown function");
    }
}

Data_type_T symtable_retval_check(){
    DEBUG_PRINT("symtable: retval check for func %s \n",last_call_func_name);
    symtable_itemptr item = symtable_search(last_call_func_name);
    if(item != NULL){
        
        if(item->called || item->declared){
            
            DEBUG_PRINT("symtable: retval is declareded for func %s \n",last_call_func_name);
            if(item->retval_count < retval_count) { semantic_error("Function %s called with more retvals than is defined",last_call_func_name,ERROR_SEMANTIC_ANALYZER_WRONG_FUNCTION); }
            
            DEBUG_PRINT("var retval_count is %d \n",retval_count);
            DEBUG_PRINT("Returning datatype from symtable : %d\n",item->retvals[retval_count]);
            DEBUG_PRINT("variable retval_count is %d\n",retval_count);
            return item->retvals[retval_count++];
                   
        }
        else if(item->declared == false){
            if(symtable_func_get_param_count() != 0 || symtable_func_get_retval_count() != 0){
                DEBUG_PRINT("symtable: retval is not delcared for func %s \n",last_call_func_name);
            
            if(token_queue.front == NULL){
                fprintf(stderr,"token queue front is null \n");
                exit(ERROR_COMPILER);
            }
            
            Token_T token_backup = token;
            token = token_queue.front->token;
            symtable_func_retval_declare();
            token = token_backup;
            return symtable_get_datatype(token_queue.front->token.attribut.attribute_s.ptr);

            }
        }
        
    }
    else{
        fprintf(stderr,"Calling symtable_retval_check before symtable_func_use()\n");
        exit(100);
    }
}
  
void symtable_func_check_count(){
    DEBUG_PRINT("symtable: func check count %s \n",last_call_func_name);
    symtable_itemptr item = symtable_search(last_call_func_name);
    if(item != NULL){
        if( strcmp(item->variable_name,"print") != 0){
            DEBUG_PRINT("Item param count: %d/, var param_count %d\n",item->param_count,param_count);
            if(item->param_count != param_count) { semantic_error("Wrong param count for function %s \n",last_call_func_name,ERROR_SEMANTIC_ANALYZER_WRONG_FUNCTION); }
        }
        else{
            if(param_count == 0) { semantic_error("Function %s expected minimal 1 parameter","print",ERROR_SEMANTIC_ANALYZER_WRONG_FUNCTION);  }
        }
    }
    else{
        semantic_error("Checking param and retval counts for unknown function %s \n",last_call_func_name,ERROR_SEMANTIC_ANALYZER_WRONG_FUNCTION);
    }
}

void symtable_func_check_retval_count(){
    DEBUG_PRINT("symtable: func check retval count for func %s \n",last_call_func_name);
    symtable_itemptr item = symtable_search(last_call_func_name);
    if(item != NULL){
        DEBUG_PRINT("Item retval count: %d, var retval_count %d\n",item->retval_count,retval_count);
        if(item->retval_count != retval_count) { semantic_error("Wrong return values count for function %s \n",last_call_func_name,ERROR_SEMANTIC_ANALYZER_WRONG_FUNCTION); }
    }
    else{
        semantic_error("Checking return values counts for unknown function %s \n",last_call_func_name,ERROR_SEMANTIC_ANALYZER_WRONG_FUNCTION);
    }
}


int symtable_func_get_retval_count(){
    DEBUG_PRINT("symtable: get retval count for func %s \n",last_call_func_name);
    symtable_itemptr item = symtable_search(last_call_func_name);
    if(item != NULL){
        return item->retval_count;
    }
    else{
        semantic_error("Getting count of return values of unknown function %s \n",last_call_func_name,ERROR_SEMANTIC_ANALYZER_WRONG_FUNCTION);
    }
}

int symtable_func_get_param_count(){
    DEBUG_PRINT("symtable: get param count for func %s \n",last_call_func_name);
    symtable_itemptr item = symtable_search(last_call_func_name);
    if(item != NULL){
        return item->param_count;
    }
    else{
        semantic_error("Getting count of parameters of unknown function %s \n",last_call_func_name,ERROR_SEMANTIC_ANALYZER_WRONG_FUNCTION);
    }
}

void symtable_set_datatype(char* var_name, Data_type_T datatype){
    DEBUG_PRINT("symtable: setting datatype for var %s \n",var_name);
    symtable_itemptr item = symtable_search(var_name);
    if(item != NULL){
        item->retval_count = 1;
        if(item->retvals == NULL) { item->retvals = (Data_type_T *) malloc(sizeof(Data_type_T));}
        item->retvals[0] = datatype;
    }
    else{
        semantic_error("Setting datatype to unknown variable %s",var_name,ERROR_SEMANTIC_ANALYZER_WRONG_FUNCTION);
    }
}

Data_type_T symtable_get_datatype(char* var_name){
    DEBUG_PRINT("symtable: get datatype for var %s \n",var_name);
    symtable_itemptr item = symtable_search(var_name);
    if(item != NULL){
        if(item->retvals != NULL){
            return item->retvals[0];
        }
        else{
            return DT_UNDEFINED;
        }
    }
    else{
        semantic_error("Setting datatype to unknown variable %s",var_name,ERROR_SEMANTIC_ANALYZER_WRONG_FUNCTION);
    }
}



void symtable_func_is_called(char *func_name){
    symtable_itemptr item = symtable_search(func_name);
    if(item != NULL){
        item->called = true;
    }
    else{
        fprintf(stderr,"symtable func is called on unknown function\n");
        exit(ERROR_COMPILER);
    }
}

void symtable_func_is_declared(){
    symtable_itemptr item = symtable_search(last_call_func_name);
    if(item != NULL){
        item->declared = true;
    }
    else{
        fprintf(stderr,"symtable func is called on unknown function\n");
        exit(ERROR_COMPILER);
    }
}

char* symtable_get_last_call_func(){
    return last_call_func_name;
}

int symtable_get_variable_unique_id(char *var_name){
    symtable_itemptr item = symtable_search(var_name);
    if(item != NULL){
        return item->variable_unique_id;
    }
    else{
        fprintf(stderr,"Symtable_get_variable_unique cannot find item %s in symtable\n",var_name);
        exit(ERROR_COMPILER);
    }
}
