/** @file */

#include <stdlib.h>

#include "error_codes.h"

#include "lexical_analyzer.h"
#include "syntax_analyzer.h"
#include "code_generator.h"

int main(int argc, char **argv){
    
    syntax_analyzer();

    return EXIT_SUCCESS;
}
