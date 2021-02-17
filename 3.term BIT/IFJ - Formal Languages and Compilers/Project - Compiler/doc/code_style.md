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

### Doxygen
```c
/**
 * Model spark
 * Hour recurrent prediction model for temperature using temp sensor only
 * 
 * @param uint8_t cur. month    0 - 11
 * @param uint8_t cur. hour     0 - 23
 * @param float   avg temp for last houre
 * 
 * 
 * @version 1.0.0
 * @author Lukáš Plevač <lukasplevac@gmail.com>
 * @date 1.8.2020
 */
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
