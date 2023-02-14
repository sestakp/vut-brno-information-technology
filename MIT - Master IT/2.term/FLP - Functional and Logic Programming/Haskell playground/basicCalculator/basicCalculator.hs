main = do   putStrLn "Haskell basic calculator"
            putStrLn "Select operation:"
            putStrLn "1. Addition"
            putStrLn "2. Subtraction"
            putStrLn "3. Multiplication"
            putStrLn "4. Division"
            operation <- readLn
            pow1 b e  
            | (e == 0)\t= 1  
            | otherwise = b * pow1 b (e-1)


            if operation <= 4
                then do
                putStrLn "Insert first operand"
                x <- getLine
                putStrLn "Insert second operand"
                y <- getLine

                if operation == 1 
                    then let operator = (+)

                else if operation == 2 
                    then let operator = (-)

                else if operation == 3 
                    then let operator = (*)

                else if operation == 4 
                    then let operator = (div)
                else undefined

                if operator /= null 
                    then
                    putStr "Your result is: "
                    print ((operator) (read x) (read y));
                    
                    else pure() --nop
            else print "Wrong selection, restart program"