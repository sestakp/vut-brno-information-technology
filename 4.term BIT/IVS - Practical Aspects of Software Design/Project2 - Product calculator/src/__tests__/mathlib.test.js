import {mathlib} from "../library/mathlib.js";

var op1_positive = [2,5,10,50,1589,15892,17,48489,18489];
var op2_positive = [17,15,89,248,1746,184856,174889,1820,10];
var op2_negative = [-17,-15,-89,-248,-1746,-184856,-174889,-1820,-10]

test('Add positive numbers', () => {

    expect(op1_positive.length).toBe(op2_positive.length);
    for (var i = 0; i < op1_positive.length; i++) {
        expect(mathlib.Add(op1_positive[i],op2_positive[i])).toBe(op1_positive[i]+op2_positive[i]);
    }
});


test('Add negative numbers', () => {
    expect(op1_positive.length).toBe(op2_negative.length);
    for (var i = 0; i < op1_positive.length; i++) {
        expect(mathlib.Add(op1_positive[i],op2_negative[i])).toBe(op1_positive[i]-op2_positive[i]);
        expect(mathlib.Add(op1_positive[i],op2_negative[i])).toBe(op1_positive[i]+op2_negative[i]);
    }
    
});

test('Add zero', () => {
    for (var i = 0; i < op1_positive.length; i++) {
        expect(mathlib.Add(op1_positive[i],0)).toBe(op1_positive[i]);
    }
});

test("Add check types", () => {
    expect(mathlib.Add(1.5,3.5)).toBe(5);
    expect(mathlib.Add(1,3.5)).toBe(4.5);

    expect(() => {
        mathlib.Add("a",2)
      }).toThrow("Not a number");

      expect(() => {
        mathlib.Add(1,undefined)
      }).toThrow("Not a number");
});


test('Sub positive numbers', () => {

    expect(op1_positive.length).toBe(op2_positive.length);
    for (var i = 0; i < op1_positive.length; i++) {
        expect(mathlib.Sub(op1_positive[i],op2_positive[i])).toBe(op1_positive[i]-op2_positive[i]);
    }
});


test('Sub negative numbers', () => {
    expect(op1_positive.length).toBe(op2_negative.length);
    for (var i = 0; i < op1_positive.length; i++) {
        expect(mathlib.Sub(op1_positive[i],op2_negative[i])).toBe(op1_positive[i]+op2_positive[i]);
        expect(mathlib.Sub(op1_positive[i],op2_negative[i])).toBe(op1_positive[i]-op2_negative[i]);
    }
    
});

test('Sub zero', () => {
    for (var i = 0; i < op1_positive.length; i++) {
        expect(mathlib.Sub(op1_positive[i],0)).toBe(op1_positive[i]);
    }
});


test("Sub check types", () => {
    expect(mathlib.Sub(1.5,3.5)).toBe(-2);
    expect(mathlib.Sub(1,3.5)).toBe(-2.5);
    expect(() => {
        mathlib.Sub("a",2)
      }).toThrow("Not a number");

    expect(() => {
        mathlib.Sub(1,undefined)
    }).toThrow("Not a number");
});

test('Div positive numbers', () => {
    expect(op1_positive.length).toBe(op2_positive.length);
    for (var i = 0; i < op1_positive.length; i++) {
        expect(mathlib.Div(op1_positive[i],op2_positive[i])).toBe(op1_positive[i]/op2_positive[i]);
    }
});


test('Div negative numbers', () => {
    expect(op1_positive.length).toBe(op2_negative.length);
    for (var i = 0; i < op1_positive.length; i++) {
        expect(mathlib.Div(op1_positive[i],op2_negative[i])).toBe(op1_positive[i]/op2_negative[i]);
        expect(mathlib.Div(op1_positive[i],op2_negative[i]) <= 0).toBeTruthy();
    }
});

test('Div by zero', () => {
    for (var i = 0; i < op1_positive.length; i++) {
        expect(() => {
            mathlib.Div(op1_positive[i],0)
          }).toThrow("Div by zero");
    
    }
});

test("Div check types", () => {
    expect(mathlib.Div(4.5,-2)).toBe(-2.25);
    expect(mathlib.Div(100,2.5)).toBe(40);
    expect(() => {
        mathlib.Div("b",2)
      }).toThrow("Not a number");

    expect(() => {
        mathlib.Div(1,undefined)
    }).toThrow("Not a number");
});


test('Mul positive numbers', () => {
    expect(op1_positive.length).toBe(op2_positive.length);
    for (var i = 0; i < op1_positive.length; i++) {
        expect(mathlib.Mul(op1_positive[i],op2_positive[i])).toBe(op1_positive[i]*op2_positive[i]);
    }
});


test('Mul negative numbers', () => {
    expect(op1_positive.length).toBe(op2_negative.length);
    for (var i = 0; i < op1_positive.length; i++) {
        expect(mathlib.Mul(op1_positive[i],op2_negative[i])).toBe(op1_positive[i]*op2_negative[i]);
        expect(mathlib.Mul(op1_positive[i],op2_negative[i]) <= 0).toBeTruthy();
    }
});

test('Mul by zero', () => {
    for (var i = 0; i < op1_positive.length; i++) {
        expect(mathlib.Mul(op1_positive[i],0)).toBe(0);
    }
});

test("Mul check types", () => {
    expect(mathlib.Mul(4.5,-2)).toBe(-9);
    expect(mathlib.Mul(100,2.5)).toBe(250);
    expect(() => {
        mathlib.Mul("a",2)
      }).toThrow("Not a number");

    expect(() => {
        mathlib.Mul(1,undefined)
    }).toThrow("Not a number");
});

test('factorial positive', () => {
    var fact_numbs = [1,1,2,6,24,120,720,5040,40320,362880,3628800,39916800,479001600,6227020800,87178291200,1307674368000];
     
    for(var i = 0; i < fact_numbs.length; i++){
        expect(mathlib.Fact(i)).toBe(fact_numbs[i]);
    }
});

test('factorial negative', () => {
     
    for(var i = 0; i < op2_negative.length; i++){
        expect(() => {
            mathlib.Fact(op2_negative[i])
        }).toThrow("Factorial is not defined on negative numbers");
    }
});

test('power to positive', () => {

    var powerNumbers = [5,1485,7,14,36,98,11,11]
    for (var i = 0; i < powerNumbers.length; i++) {
        expect(mathlib.Power(powerNumbers[i],i)).toBeCloseTo(Math.pow(powerNumbers[i],i));      //.toBe(Math.pow(op1_positive[i],i));
    }
});

test('Power to zero', () => {
    for (var i = 0; i < op1_positive.length; i++) {
        expect(mathlib.Power(op1_positive[i],0)).toBe(1);
    }
});

test('square root monotony', () => {
    for (var i = 0; i < op1_positive.length; i++) {
        expect(mathlib.Nth_root(op1_positive[i],i+2) < mathlib.Nth_root(op1_positive[i]+1,i+2)).toBeTruthy();
    }
});

test('Square root zero', () => {
    for(var i = 0; i < op1_positive.length; i++){
        expect(mathlib.Nth_root(0,i+2)).toBeCloseTo(0);
    }
});

test('Basic square roots', () => {

    expect(mathlib.Nth_root(4)).toBeCloseTo(2);

    expect(mathlib.Nth_root(8,3)).toBeCloseTo(2);
    
    expect(mathlib.Nth_root(16)).toBeCloseTo(4);
    
    expect(mathlib.Nth_root(25)).toBeCloseTo(5);

    expect(mathlib.Nth_root(27,3)).toBeCloseTo(3);
    
    expect(mathlib.Nth_root(81,4)).toBeCloseTo(3);

});