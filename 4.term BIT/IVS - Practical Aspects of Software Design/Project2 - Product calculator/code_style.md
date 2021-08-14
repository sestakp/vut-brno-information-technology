# Code style

### blocks
```c
if (int isAwesome) {
  return true;
}
```

### function short
```c
int test(int test1, int test2) {
    ............
}
```

### function long (params > 5 or out of screen)
```c
int test(
           int test1,
           int test2,
           int test3,
           int test4,
           int test5,
           int test6,
           ...
        ) {
    ...
}
```

### Doxygen function
```c
/**
 * @brief function brief
 * @param a argument description (Datatype)  
 * @param b argument description (Datatype) 
 * @returns return description
 */
function Name(a, b) {
    return a + b;
}
```

### Doxygen file
```c
/*******************************************************************
* Project Name: ReactCalculator
*******************************************************************/
/**
* @file currentFile.js
*
* @brief file description
*
* @author FIRSTNAME LASTNAME (GIT_NICK)
*/
...
...
/*  END OF CURRENTFILE.JS   */

```

### Vertical alignment
```c
int a   = 10;
int tmp = 42;
```
```c
float b  = 100;
int   aa = 42;
```
