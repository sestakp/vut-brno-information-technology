/*******************************************************************
* Project Name: ReactCalculator
*******************************************************************/
/**
* @file expressionAnalyzer.js
*
* @brief Precedent analysis for calculator input
*
* @author Pavel Šesták (sestakp)
*/

import {lexicalAnalyzer} from './lexicalAnalyzer.js';
import {precedenceStack} from './precedenceStack.js';
import {mathlib} from './mathlib.js';

/**
 * @brief namespace for expression analyzer
 * @namespace expressionAnalyzer
 */
export var expressionAnalyzer = {};


/**
 * @brief Table which decide which operation do
 */
expressionAnalyzer.Table = [
               /*T_ADD, T_SUB, T_MUL, T_DIV, T_POW, T_NUMB, T_BRK_L T_BRK_R, T_FACT, T_ROOT, T_MOD, $*/
   /*T_ADD*/   ['>',    '>',   '<',   '<',   '<',   '<',    '<',    '>',     '<',    '<',    '<',   '>'],
   /*T_SUB*/   ['>',    '>',   '<',   '<',   '<',   '<',    '<',    '>',     '<',    '<',    '<',   '>'],
   /*T_MUL*/   ['>',    '>',   '>',   '>',   '<',   '<',    '<',    '>',     '<',    '<',    '>',   '>'],
   /*T_DIV*/   ['>',    '>',   '>',   '>',   '<',   '<',    '<',    '>',     '<',    '<',    '>',   '>'],
   /*T_POW*/   ['>',    '>',   '>',   '>',   '<',   '<',    '<',    '>',     '<',    '<',    '>',   '>'],
   /*T_NUMB*/  ['>',    '>',   '>',   '>',   '>',   '_',    '_',    '>',     '>',    '>',    '>',   '>'],
   /*T_BRK_L*/ ['<',    '<',   '<',   '<',   '<',   '<',    '<',    '=',     '<',    '<',    '<',   '_'],
   /*T_BRK_R*/ ['>',    '>',   '>',   '>',   '>',   '_',    '_',    '>',     '>',    '>',    '>',   '>'],
   /*T_FACT*/  ['>',    '>',   '>',   '>',   '>',   '_',    '<',    '>',     '>',    '>',    '>',   '>'],
   /*T_ROOT*/  ['>',    '>',   '>',   '>',   '<',   '<',    '<',    '>',     '<',    '<',    '>',   '>'],
   /*T_MOD*/   ['>',    '>',   '>',   '>',   '<',   '<',    '<',    '>',     '<',    '<',    '>',   '>'],
   /*$*/       ['<',    '<',   '<',   '<',   '<',   '<',    '<',    '_',     '<',    '<',    '<',   '_'],

];

/**
 * @brief Mapper to index into table
 */
expressionAnalyzer.indexMapper = new Map();
expressionAnalyzer.indexMapper.set("T_ADD",0);
expressionAnalyzer.indexMapper.set("T_SUB",1);
expressionAnalyzer.indexMapper.set("T_MUL",2);
expressionAnalyzer.indexMapper.set("T_DIV",3);
expressionAnalyzer.indexMapper.set("T_POW",4);
expressionAnalyzer.indexMapper.set("T_NUMB",5);
expressionAnalyzer.indexMapper.set("T_BRK_L",6);
expressionAnalyzer.indexMapper.set("T_BRK_R",7);
expressionAnalyzer.indexMapper.set("T_FACT",8);
expressionAnalyzer.indexMapper.set("T_ROOT",9);
expressionAnalyzer.indexMapper.set("T_MOD",10);
expressionAnalyzer.indexMapper.set("T_EOF",11);

/**
 * @brief function GetResult() take mathematical expression and return result
 * @param input Input from calculator (String)
 * @returns Result
 */
 expressionAnalyzer.GetResult = function(input) {
    var Tokens = lexicalAnalyzer.GetTokens(input);
    var precStack = new precedenceStack();

    for (var i = 0; i < Tokens.length; i++) {
        var token = Tokens[i];

        var operation = expressionAnalyzer.Table[expressionAnalyzer.indexMapper.get(precStack.Last_terminal().type)][expressionAnalyzer.indexMapper.get(token.type)];
        
        var value = 0;
        var comparePart = [];

        switch(operation){
            case '<': 
              precStack.Push(token);
              break;
      
            case '>':
              i = i - 1;
              comparePart = precStack.Compare_part();
              value = expressionAnalyzer.valid_expression(comparePart);
              precStack.Reduce(value);
              break;
      
            case '=':
              precStack.Push_no_precedence(token);
              break;
            
            default:
              throw new Error("SYNTAX ERROR");
          }
    }

    while(precStack.Last_terminal().type !== "T_EOF"){ //reduce stack
        comparePart = precStack.Compare_part();
        value = expressionAnalyzer.valid_expression(comparePart);
        precStack.Reduce(value);
      }

      return value;

 }

 expressionAnalyzer.valid_expression = function(comparePart){
    var rules = [
        ["T_NUMB"],
        ["T_E", "T_ADD", "T_E"],
        ["T_E", "T_SUB", "T_E"],
        ["T_E", "T_MUL", "T_E"],
        ["T_E", "T_DIV", "T_E"],
        ["T_E", "T_POW", "T_E"],
        ["T_E", "T_MOD", "T_E"],        
        ["T_E", "T_ROOT", "T_E"],
        ["T_BRK_L", "T_E", "T_BRK_R"],
        ["T_E", "T_FACT"],
        ["T_ROOT", "T_E"],
        ["T_SUB", "T_E"]
    ];

  
    var index = -1;

    for(var i = 0; i < rules.length; i++){
        var found = true;

        if(rules[i].length !== comparePart.length){
            found = false;
            continue;
        }

        for(var j = 0; j < comparePart.length; j++){
            if(rules[i][j] !== comparePart[j].type){
                found = false;
                break;
            }
        }

        if(found){
            index = i;
            break;
        }
            
    }

    if(index >= 1 && index <= 7){
        comparePart[0].value = Number(comparePart[0].value);
        comparePart[2].value = Number(comparePart[2].value);
    }
    else if(index === 8 || index === 10 || index === 11){
        comparePart[1].value = Number(comparePart[1].value);
    }
    else if(index === 9 || index === 0){
        comparePart[0].value = Number(comparePart[0].value);
    }

    switch(index){
        case 0:
            return comparePart[0].value;
        case 1:
            return mathlib.Add(comparePart[0].value,comparePart[2].value);
        case 2:
            return mathlib.Sub(comparePart[0].value,comparePart[2].value);
        case 3:
            return mathlib.Mul(comparePart[0].value,comparePart[2].value);
        case 4:
            return mathlib.Div(comparePart[0].value,comparePart[2].value);
        case 5:
            return mathlib.Power(comparePart[0].value,comparePart[2].value);
        case 6:
            return mathlib.Mod(comparePart[0].value,comparePart[2].value);
        case 7:
            return mathlib.Nth_root(comparePart[2].value,comparePart[0].value);
        case 8:
            return comparePart[1].value;
        case 9:
            return mathlib.Fact(comparePart[0].value);
        case 10:
            return mathlib.Nth_root(comparePart[1].value);
        case 11:
            return mathlib.Mul(comparePart[1].value,-1);
        default:
            throw new Error("SYNTAX ERROR");
    }
 }

 /*  END OF LEXICALANALYZER.JS   */