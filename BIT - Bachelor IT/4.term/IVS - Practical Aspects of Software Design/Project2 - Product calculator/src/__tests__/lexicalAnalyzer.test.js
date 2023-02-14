/*******************************************************************
* Project Name: ReactCalculator
*******************************************************************/
/**
* @file lexicalAnalyzer.test.js
*
* @brief Automatic testing of lexical analyzer
*
* @author Marie Koláríková
*/

import {lexicalAnalyzer} from "../library/lexicalAnalyzer.js";

test('5-2+4', () => {

    var Tokens = lexicalAnalyzer.GetTokens("5-2+4");

    expect(Tokens[1].type).toBe("T_SUB");
    expect(Tokens[3].type).toBe("T_ADD");
    expect(Tokens[0,2,4].type).toBe("T_NUMB");
});

test('10×4÷2', () => {

    var Tokens = lexicalAnalyzer.GetTokens("10×4÷2");

    expect(Tokens[1].type).toBe("T_MUL");
    expect(Tokens[3].type).toBe("T_DIV");
    expect(Tokens[0,2,4].type).toBe("T_NUMB");
});

test('√4^2', () => {

    var Tokens = lexicalAnalyzer.GetTokens("√4^2");

    expect(Tokens[0].type).toBe("T_ROOT");
    expect(Tokens[2].type).toBe("T_POW");
    expect(Tokens[1,3].type).toBe("T_NUMB");
});

test('65%2+5!', () => {

    var Tokens = lexicalAnalyzer.GetTokens("65%2+5!");

    expect(Tokens[1].type).toBe("T_MOD");
    expect(Tokens[3].type).toBe("T_ADD");
    expect(Tokens[5].type).toBe("T_FACT");
    expect(Tokens[0,2,4].type).toBe("T_NUMB");
});

test('(14.5+5.5)÷2', () => {

    var Tokens = lexicalAnalyzer.GetTokens("(14.5+5.5)÷2");

    expect(Tokens[0].type).toBe("T_BRK_L");
    expect(Tokens[2].type).toBe("T_ADD");
    expect(Tokens[4].type).toBe("T_BRK_R");
    expect(Tokens[5].type).toBe("T_DIV");
    expect(Tokens[1,3,6].type).toBe("T_NUMB");
});

test('(15-5)×2', () => {

    var Tokens = lexicalAnalyzer.GetTokens("(15-5)×2");

    expect(Tokens[0].type).toBe("T_BRK_L");
    expect(Tokens[2].type).toBe("T_SUB");
    expect(Tokens[4].type).toBe("T_BRK_R");
    expect(Tokens[5].type).toBe("T_MUL");
    expect(Tokens[1,3,6].type).toBe("T_NUMB");  
});

test('√64-(15+6)÷3', () => {

    var Tokens = lexicalAnalyzer.GetTokens("√64-(15+6)÷3");

    expect(Tokens[0].type).toBe("T_ROOT");
    expect(Tokens[2].type).toBe("T_SUB");
    expect(Tokens[3].type).toBe("T_BRK_L");
    expect(Tokens[5].type).toBe("T_ADD");
    expect(Tokens[7].type).toBe("T_BRK_R");
    expect(Tokens[8].type).toBe("T_DIV");
    expect(Tokens[1,4,6,9].type).toBe("T_NUMB");
});

test('5^2×(4!+50)%3', () => {

    var Tokens = lexicalAnalyzer.GetTokens("5^2×(4!+50)%3");

    expect(Tokens[1].type).toBe("T_POW");
    expect(Tokens[3].type).toBe("T_MUL");
    expect(Tokens[4].type).toBe("T_BRK_L");
    expect(Tokens[6].type).toBe("T_FACT");
    expect(Tokens[7].type).toBe("T_ADD");
    expect(Tokens[9].type).toBe("T_BRK_R");
    expect(Tokens[10].type).toBe("T_MOD");
    expect(Tokens[0,2,5,8,11].type).toBe("T_NUMB");
});

test('√(90.7-10)+(4!)^2×100%(42÷7)', () => {

    var Tokens = lexicalAnalyzer.GetTokens("√(90.7-10)+(4!)^2×100%(42÷7)");

    expect(Tokens[0].type).toBe("T_ROOT");
    expect(Tokens[3].type).toBe("T_SUB");
    expect(Tokens[6].type).toBe("T_ADD");
    expect(Tokens[9].type).toBe("T_FACT");
    expect(Tokens[11].type).toBe("T_POW");
    expect(Tokens[13].type).toBe("T_MUL");
    expect(Tokens[15].type).toBe("T_MOD");
    expect(Tokens[18].type).toBe("T_DIV");
    expect(Tokens[1,7,16].type).toBe("T_BRK_L");
    expect(Tokens[5,10,20].type).toBe("T_BRK_R");
    expect(Tokens[2,4,8,12,14,17,19].type).toBe("T_NUMB");
});

/*  END OF LEXICALANALYZER.TEST.JS   */