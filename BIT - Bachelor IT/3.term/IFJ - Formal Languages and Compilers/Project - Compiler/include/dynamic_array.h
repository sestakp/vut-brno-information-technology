#ifndef DYNAMIC_ARRAY_H_ /* include guard */
#define DYNAMIC_ARRAY_H_

#define GROW_RATE 1.5

typedef struct {
   char*     ptr;
   unsigned  allocated;
   unsigned  length;
   char      endbyte;
} dynamic_array_T;

/**
 * Create dynamic array
 * @param unsigned init_elements_count - count of pre-alloced size (must by > 0)
 * @return dynamic_array_T
 */
extern dynamic_array_T dynamic_array_init(unsigned init_elements_count);

/**
 * Create dynamic array with endbyte
 * @param unsigned init_elements_count - count of pre-alloced size (must by > 1)
 * @param char endbyte                 - element what is puted on end of array
 * @return dynamic_array_T
 */
extern dynamic_array_T dynamic_array_init_with_endbyte(unsigned init_elements_count, char endbyte);

/**
 * clear elements from dynamic_array
 * @param dynamic_array_T* of_array - array for work
 * @return void
 */
extern void dynamic_array_clear(dynamic_array_T *of_array);

/**
 * realoc dynamic array on definaded size
 * @param dynamic_array_T* of_array - array for work
 * @param unsigned new_allocated - new alloc size (in elements)
 * @return void
 */
extern void dynamic_array_realloc(dynamic_array_T *of_array, unsigned new_allocated);

/**
 * add element to end of dynamic array (if is needed expand array)
 * @param dynamic_array_T* of_array - array for work
 * @param char element - element to push
 * @return void
 */
extern void dynamic_array_append(dynamic_array_T *in_array, char element);

/**
 * add element to end of dynamic array (if is needed expand array) with end byte support (on appended char is appended endbyte)
 * @param dynamic_array_T* of_array - array for work
 * @param char element - element to push
 * @return void
 */
extern void dynamic_array_endbyte_append(dynamic_array_T *in_array, char element);

/**
 * add element to position in dynamic array (if is needed expand array)
 * @param dynamic_array_T* of_array - array for work
 * @param unsigned postion - postion of element
 * @param char element - element to push
 * @return void
 */
extern void dynamic_array_set(dynamic_array_T *in_array, unsigned position, char element);

/**
 * get element from position in dynamic array
 * @param dynamic_array_T* of_array - array for work
 * @param unsigned postion - postion of element
 * @return char  - element
 */
extern char dynamic_array_get(dynamic_array_T *in_array, unsigned position);

/**
 * free all from dynamic array
 * @param dynamic_array_T* of_array - array for work
 * @return void
 */
extern void dynamic_array_free(dynamic_array_T *of_array);

/**
 * free all created dynamic arrays
 * @return void
 */
extern void dynamic_array_free_all();

#endif
