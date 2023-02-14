/*******************************************************************
* Project Name: ReactCalculator
*******************************************************************/
/**
* @file mathlib.js
*
* @brief Mathematical library, which implement basic mathematical operations
*
* @author Pavel Šesták (sestakp)
*/

/**
 * @brief namespace for mathematical library
 * @namespace mathlib
 */
export var mathlib = {};

/**
 * @brief function Add() take two arguments and calculate sum of number a and b
 * @param a Augend (Number)
 * @param b Addend (Number) 
 * @returns Sum if arguments are correct, else NaN
 */
mathlib.Add = function (a, b) {
    if (isNaN(a) || isNaN(b)){
        throw new Error("Not a number");
    }
    return a + b;
}


/**
 * @brief function Sub() take two arguments and calculate difference of number a and b
 * @param a left operand (Number)
 * @param b right operand (Number)
 * @returns difference if arguments are correct, else NaN
 */
mathlib.Sub = function(a, b){
    if (isNaN(a) || isNaN(b)){
        throw new Error("Not a number");
    }

    return a - b;
}

/**
 * @brief function Mod() take two arguments and calculate modulo
 * @param a left operand (Number)
 * @param b right operand (Number)
 * @returns modulo if arguments are correct, else NaN
 */
 mathlib.Mod = function(a, b){
    if (isNaN(a) || isNaN(b)){
        throw new Error("Not a Number");
    }

    return a % b;
}


/**
 * @brief function Div() take two arguments and calculate quotient of number a and b
 * @param a dividend (Number)
 * @param b divisor (Number)
 * @returns return quotient is arguments are correct, else NaN
 */
mathlib.Div = function (a, b){
    if (isNaN(a) || isNaN(b)){
        throw new Error("Not a number");
    }
    
    if(b === 0){
        throw new Error("Div by zero");
    }

    return a / b;
}

/**
 * @brief function Mul() take two arguments and calculate product of number a and b
 * @param a multiplication factor (Number)
 * @param b multiplication factor (Number)
 * @returns product if arguments are correct, else NaN
 */
mathlib.Mul = function (a, b){
    if (isNaN(a) || isNaN(b)){
        throw new Error("Not a number");
    }

    return a * b;
}

/**
 * @brief Function Fact() take one argument and calculate factorial of a
 * @param a Argument of factorial ∈ N+ (Number)
 * @returns factorial of a if arguments are correct, else NaN (Number)
 */
mathlib.Fact = function (a){
    //Check if argument is number
    if (isNaN(a)){
        throw new Error("Not a number");
    }

    //factorial is defined on non negative numbers
    if(a < 0){
        throw new Error("Factorial is not defined on negative numbers");
    }
    
    var result = 1;

    for(var i = 2; i <= a; i++){
        result *= i;
    }
    
    return result;
  }//End of Fact()

/**
 * @brief function Power() function takes two arguments (base value and power value), returns the power raised to the base number
 * @param base (Number)
 * @param exponent (Number)
 * @returns base^power if arguments are valid, else NaN (Number)
 */
mathlib.Power = function (base, exponent){

    if (isNaN(base) || isNaN(exponent)){
        throw new Error("Not a number");
    }

    if(base === 0 && exponent === 0){
        throw new Error("0^0 is undefined expression");
    }
    
    //a^0 == 1
    if (exponent === 0){
        return 1;
    } 
    
    var negative = false;

    if(exponent < 0) { negative = true; exponent = Math.abs(exponent); }

    var temp = base;
    for(var i = exponent; i >= 2; i--){
        temp = temp*base;
    }

    if(i > 1){ //handle floating exponent
        temp = temp*base*(i-1);
    }

    if(negative) { temp = mathlib.Div(1,temp); }
    
    return temp;
       
}//End of power()

/**
 * @brief function Nth_root() takes three arguments, returns the nth root of a
 * @param a Radicand (Number)
 * @param n Degree (Number)
 * @param eps maximal deviation, default value is 1e-10 (Number)
 * @returns If arguments are valid return root of a, else NaN. (Number)
 */
mathlib.Nth_root = function (a, n = 2, eps = 1e-10){
 
    if (isNaN(a) || isNaN(n)){
        throw new Error("Not a number");
    }

    if(n === 0){
        throw new Error("Not a number");
    }
    
    if(a === 0){
        return 0;
    }

    if(a < 0){
        throw new Error("Nth root is defined on non negative numbers");
    }

    //Nth root of A == A^(1/N)
    var xPred = Math.random() % a; //first is initialized to x0 which is random 
    var x;  //Represent current value of nth root
    var difference = Infinity;

    while(difference > eps){
        //Newtonove iterative algorithm
        //xi+1= xi - f(xi)/f'(xi)
        
        x = ((n - 1.0) * xPred + a/mathlib.Power(xPred, n-1)) / n;
        difference = Math.abs(x - xPred);
        xPred=x;
    }
    return x;
}//End of Nth_root()

/*  END OF MATHLIB.JS   */