#include <stdio.h>
#include "lexical_analyzer.h"
#include "dynamic_array.h"

int main(){
    fprintf(stderr,"testing lexical analyzer\n");

    Token_T tkn;
    do {
      tkn =  get_token();
      switch(tkn.token_type){
            case T_ELSE:
                fprintf(stderr,"T_ELSE\n");
                break;
            case T_FLOAT64:
                fprintf(stderr,"T_FLOAT64\n");
                break;
            case T_FOR:
                fprintf(stderr,"T_FOR\n");
                break;
            case T_FUNC:
                fprintf(stderr,"T_FUNC\n");
                break;
            case T_IF:
                fprintf(stderr,"T_IF\n");
                break;
            case T_INT:
                fprintf(stderr,"T_INT\n");
                break;
            case T_PACKAGE:
                fprintf(stderr,"T_PACKAGE\n");
                break;
            case T_RETURN:
                fprintf(stderr,"T_RETURN\n");
                break;
            case T_STRING:
                fprintf(stderr,"T_STRING\n");
                break;
            case T_ID:
                fprintf(stderr,"T_ID, attribut: \"%s\"\n",tkn.attribut.attribute_s.ptr);
                //free string
                //dynamic_array_free(&tkn.attribut.attribute_s);
                break;
            case T_NUM_L: 
                fprintf(stderr,"T_NUM_L, attribut: \"%ld\"\n",tkn.attribut.attribute_i);
                break;               
            case T_FLOAT_L: 
                fprintf(stderr,"T_FLOAT_L, attribut: \"%lf\"\n",tkn.attribut.attribute_f);
                break;
            case T_STRING_L: 
                fprintf(stderr,"T_STRING_L, attribut: \"%s\"\n",tkn.attribut.attribute_s.ptr);
                //free string
                //dynamic_array_free(&tkn.attribut.attribute_s);
                break;
             case T_COMMA: 
                fprintf(stderr,"T_COMMA\n");
                break;
             case T_CBRK_R: 
                fprintf(stderr,"T_CBRK_R\n");
                break;
             case T_CBRK_L: 
                fprintf(stderr,"T_CBRK_L\n");
                break;
             case T_SEMCOL: 
                fprintf(stderr,"T_SEMCOL\n");
                break;    
             case T_SUB: 
                fprintf(stderr,"T_SUB\n");
                break; 
             case T_ADD: 
                fprintf(stderr,"T_ADD\n");
                break; 
             case T_NE: 
                fprintf(stderr,"T_NE\n");
                break;                                     
             case T_MUL: 
                fprintf(stderr,"T_MUL\n");
                break; 
             case T_E: 
                fprintf(stderr,"T_E\n");
                break; 
             case T_GE: 
                fprintf(stderr,"T_GE\n");
                break;
             case T_G: 
                fprintf(stderr,"T_G\n");
                break; 
             case T_EOL: 
                fprintf(stderr,"T_EOL\n");
                break; 
             case T_LE: 
                fprintf(stderr,"T_LE\n");
                break; 
             case T_L: 
                fprintf(stderr,"T_L\n");
                break; 
             case T_BRK_R: 
                fprintf(stderr,"T_BRK_R\n");
                break; 
             case T_ASSIGN: 
                fprintf(stderr,"T_ASSIGN\n");
                break; 
             case T_DECLARE: 
                fprintf(stderr,"T_DECLARE\n");
                break; 
             case T_BRK_L: 
                fprintf(stderr,"T_BRK_L\n");
                break; 
             case T_DIV: 
                fprintf(stderr,"T_DIV\n");
                break;
             default:
                fprintf(stderr,"UNKNOWN VALUE\n");
        }
    } while(tkn.token_type != T_EOF);
    
    fprintf(stderr,"end testing lexical analyzer\n");

    dynamic_array_free_all();

    return 0;
    
}
