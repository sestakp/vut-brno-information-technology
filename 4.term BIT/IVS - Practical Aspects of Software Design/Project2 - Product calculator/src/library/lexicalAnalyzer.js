/*******************************************************************
* Project Name: ReactCalculator
*******************************************************************/
/**
* @file lexicalAnalyzer.js
*
* @brief Lexical analyzer for calculator input
*
* @author Pavel Šesták (sestakp)
*/

/**
 * @brief namespace for lexical analyzer
 * @namespace lexicalAnalyzer
 */
 export var lexicalAnalyzer = {};

/**
 * @brief function GetTokens() take mathematical expression and return array of tokens
 * @param input Input from calculator (String)
 * @returns Array of tokens
 */
 lexicalAnalyzer.GetTokens = function(input) {
    input = input.replace(' ','');
    var inputParsedArray = input.match(/[\d|.]+|\D+|/g); //split input to sequences of digits and nondigits
    
    var Tokens = []

    for (let element of inputParsedArray) {
        
        if(!isNaN(element) && element.trim().length !== 0){
            Tokens.push({type: "T_NUMB", value: element});
            continue;
        }
        for (var i = 0; i < element.length; i++) {
            var char = element.charAt(i);
            switch(char){
                case " ":
                break;
                
                case "+":
                    Tokens.push({type: "T_ADD", value: char});
                break;

                case "-":
                    Tokens.push({ type: "T_SUB", value: char });
                  break;
                case "×":
                    Tokens.push({ type: "T_MUL", value: char });
                  break;
                case "÷":
                    Tokens.push({ type: "T_DIV", value: char });
                  break;
                case "^":
                    Tokens.push({ type: "T_POW", value: char });
                  break;
                case "(":
                    Tokens.push({ type: "T_BRK_L", value: char });
                  break;
                case ")":
                    Tokens.push({ type: "T_BRK_R", value: char });
                  break;
                case "!":
                    Tokens.push({ type: "T_FACT", value: char });
                  break;
                case "√":
                    Tokens.push({ type: "T_ROOT", value: char });
                  break;
                case "%":
                    Tokens.push({ type: "T_MOD", value: char });
                    break;
                default:
                    throw new Error("LEXICAL ERROR");
                    
            }//end of switch
        }//End of for iterate over chars in element if its not a number
        
    }//end of for iterate over all elements
    return Tokens;
};//End of GetTokens()


/*  END OF LEXICALANALYZER.JS   */