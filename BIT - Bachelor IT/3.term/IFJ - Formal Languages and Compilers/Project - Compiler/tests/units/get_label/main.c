#include <stdio.h>
#include <stdlib.h>
#include "code_generator.h"
#include "debug_tool.h"
#include "global_variables.h"

int main(){
   fprintf(stderr,"testing get_label\n");

   char *label = get_label("hello");
   printf("%s\n", label);
   free(label);

   label = get_label("hello");
   printf("%s\n", label);
   free(label);

   label = get_label("");
   printf("%s\n", label);
   free(label);

   label = get_label("test");
   printf("%s\n", label);
   free(label);

   return 0;
    
}
