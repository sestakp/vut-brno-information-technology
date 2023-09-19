{-
Project: flp22-fun
Functional project
login: xsesta07
author: Pavel Sestak
year:2023
-}

import System.Environment
import Types (Arguments(..), Curve(..))
import Ecdsa (sign, verify, makeKeyPair, getRandomIntegerInRange)
import ParseInput (processArgs, parseCurve, parseHash, parsePublicKey, parseSignature, parseKey)
import System.Random (getStdGen)



main :: IO ()
main = do
    
    args <- getArgs
    arguments <- processArgs (args) 
    
    let curve = parseCurve (content arguments) 
 
    if (i arguments) 
        then do
            putStrLn $ show curve
        else return ()

    if (k arguments)
        then do
            gen <- getStdGen
            let keyPair = makeKeyPair curve gen
            putStrLn $ show keyPair
        else return ()

    if (s arguments)
    then do
            let inputKeyPair = parseKey (content arguments)

            let hash = parseHash (content arguments)
            
            randomNumb <- getRandomIntegerInRange 1 (p curve-1)
            let signature = sign inputKeyPair hash curve randomNumb
            putStrLn $ show signature
    else return ()

    if (v arguments)
    then do
        let signature = parseSignature (content arguments)

        let inputKeyPair = parsePublicKey (content arguments)

        let hash = parseHash (content arguments)
        let result = verify inputKeyPair hash signature curve
        putStrLn $ show result

    else return ()
