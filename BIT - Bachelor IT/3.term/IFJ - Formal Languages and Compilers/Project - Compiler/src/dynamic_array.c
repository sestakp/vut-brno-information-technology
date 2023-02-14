#include "dynamic_array.h"
#include "error_codes.h"
#include "debug_tool.h"
#include <stdlib.h>
#include <stdio.h>

unsigned          countOfAll = 0;
char**            all_arrays;

void add_to_dim_array (char* new_array) {
    if (countOfAll == 0) {
        all_arrays = (char**) malloc(sizeof(dynamic_array_T*));

        if (all_arrays == NULL) {
            fprintf(stderr, "compiler error: out of memory");
            exit(ERROR_COMPILER);
        }

    } else {
        all_arrays = (char**) realloc(all_arrays, sizeof(dynamic_array_T*) * (countOfAll + 1));

        if (all_arrays == NULL) {
            fprintf(stderr, "compiler error: out of memory");
            exit(ERROR_COMPILER);
        }
    }

    all_arrays[countOfAll++] = new_array;
}

void update_pointer_in_all(char* old_ptr, char* new_ptr) {
    for (int i = 0; i < countOfAll; i++) {
        if (old_ptr == all_arrays[i]) {
            all_arrays[i] = new_ptr;
            return; 
        }
    }

    fprintf(stderr, "cant find old ptr after realoc");
}

//init array
dynamic_array_T dynamic_array_init(unsigned init_elements_count) {
    dynamic_array_T new_array;

    new_array.length          = 0;
    new_array.allocated       = init_elements_count;
    new_array.ptr             = malloc(init_elements_count * sizeof(char));

    if(new_array.ptr == NULL){
        fprintf(stderr, "compiler error: out of memory");
        exit(ERROR_COMPILER);
    }
    
    add_to_dim_array(new_array.ptr);

    return new_array;
}

dynamic_array_T dynamic_array_init_with_endbyte(unsigned init_elements_count, char endbyte) {
    dynamic_array_T new_array;

    new_array.length          = 1;
    new_array.allocated       = init_elements_count;
    new_array.ptr             = malloc(init_elements_count * sizeof(char));

    if (new_array.ptr == NULL)  {
        fprintf(stderr, "compiler error: out of memory");
        exit(ERROR_COMPILER);
    }

    add_to_dim_array(new_array.ptr);
    
    new_array.ptr[0]          = endbyte;
    new_array.endbyte         = endbyte;

    return new_array;
}

void dynamic_array_clear(dynamic_array_T *of_array) {

    for(unsigned i=0;i<of_array->length-1;i++){
        of_array->ptr[i] = of_array->endbyte;
    }
    
    of_array->length = 1;
}

void dynamic_array_realloc(dynamic_array_T *of_array, unsigned new_allocated) {

    of_array->allocated      = new_allocated;

    char* old_ptr            = of_array->ptr;
    of_array->ptr            = realloc(of_array->ptr, sizeof(char) * new_allocated);

    if (of_array->ptr == NULL)  {
        fprintf(stderr, "compiler error: out of memory");
        free(old_ptr);
        exit(ERROR_COMPILER);
    }

    update_pointer_in_all(old_ptr, of_array->ptr);
}

void dynamic_array_endbyte_append(dynamic_array_T *in_array, char element) {

    //can write?
    if (in_array->ptr == NULL) {
        fprintf( stderr,"[WARING] write to dynamic array with null pointer!!\n");
        return;
    }

    if ((in_array->length + 1) >= in_array->allocated) {
        dynamic_array_realloc(in_array, in_array->allocated * GROW_RATE);
    }

    in_array->ptr[in_array->length - 1] = element;
    in_array->ptr[in_array->length]     = in_array->endbyte;
    
    in_array->length += 1;
}

//add element to end
void dynamic_array_append(dynamic_array_T *in_array, char element) {

    //can write?
    if (in_array->ptr == NULL) {
        fprintf( stderr,"[WARING] write to dynamic array with null pointer!!\n");
        return;
    }

    if ((in_array->length + 1) >= in_array->allocated) {
        dynamic_array_realloc(in_array, in_array->allocated * GROW_RATE);
    }

    in_array->ptr[in_array->length] = element;
    
    in_array->length += 1;
}

void dynamic_array_set(dynamic_array_T *in_array, unsigned position, char element) {
    //can write?
    if (in_array->ptr == NULL) {
        fprintf( stderr,"[WARING] write to dynamic array with null pointer!!\n");
        return;
    }

    if (position >= in_array->allocated) {
        dynamic_array_realloc(in_array, position + 1);
    }

    in_array->ptr[position] = element;
}

char dynamic_array_get(dynamic_array_T *in_array, unsigned position) {
    //can read?
    if (in_array->ptr == NULL) {
        fprintf( stderr,"[WARING] read from dynamic array with null pointer!!\n");
        return '\0';
    }

    return in_array->ptr[position];
}

void dynamic_array_free_all() {
    for (int i = 0; i < countOfAll; i++) {
        if (all_arrays[i] != NULL) {
            free(all_arrays[i]);
        }
    }

    DEBUG_PRINT("FREE all %u Dim Arras\n", countOfAll);

    countOfAll = 0;
    free(all_arrays);
}

//free array
void dynamic_array_free(dynamic_array_T *of_array) {
    //can free?
    if (of_array->ptr == NULL) {
        fprintf( stderr,"[WARING] free dynamic array with null pointer!!\n");
        return;
    }

    DEBUG_PRINT("FREE 1 Dim Arra\n");

    free(of_array->ptr);

    update_pointer_in_all(of_array->ptr, NULL);
    
    of_array->ptr = NULL;
}
