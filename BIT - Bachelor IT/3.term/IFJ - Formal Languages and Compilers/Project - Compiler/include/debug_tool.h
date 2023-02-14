///#define DEBUG 3 TODO add to makefile in compile

#if defined(DEBUG) && DEBUG > 2
 #define DEBUG_PRINT(fmt, args...) fprintf(stderr, "DEBUG: %s:%d:%s(): " fmt, \
    __FILE__, __LINE__, __func__, ##args)
#else
 #define DEBUG_PRINT(fmt, args...)
#endif

#if defined(DEBUG) && DEBUG > 1
 #define WARNING_PRINT(fmt, args...) fprintf(stderr, "WARNING: %s:%d:%s(): " fmt, \
    __FILE__, __LINE__, __func__, ##args)
#else
 #define WARNING_PRINT(fmt, args...)
#endif

#if defined(DEBUG) && DEBUG > 0
 #define ERROR_PRINT(fmt, args...) fprintf(stderr, "ERROR: %s:%d:%s(): " fmt, \
    __FILE__, __LINE__, __func__, ##args)
#else
 #define ERROR_PRINT(fmt, args...)
#endif

#include <stdio.h>