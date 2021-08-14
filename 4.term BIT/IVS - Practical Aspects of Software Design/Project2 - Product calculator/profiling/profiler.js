
import {mathlib} from '../src/library/mathlib.js';
import * as readline from 'readline';

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  
  });

  rl.on("line", function(input) {

    input = input.split(/\s+/); //split numbers by whitespaces

    for(var j=0;j<1000000;j++){
        var average = 0;
        var N = input.length;

        for(var i = 0; i < N; i++){
            average = mathlib.Add(average,parseFloat(input[i]));
        }
        average = mathlib.Div(average, N);

        var averagePower2 = mathlib.Power(average,2);
        var nTimesAveragePower2 = mathlib.Mul(averagePower2, N);

        var s = 0;
        for(var i = 0; i < N; i++){
            var xPow = mathlib.Power(input[i],2);
            s = mathlib.Add(s,xPow);
        }

        s = mathlib.Sub(s,nTimesAveragePower2);

        var div = mathlib.Div(1, N-1);
        s = mathlib.Mul(div,s);
        s = mathlib.Nth_root(s,2);
    }
    
     console.log(s);
     rl.close();
  });
