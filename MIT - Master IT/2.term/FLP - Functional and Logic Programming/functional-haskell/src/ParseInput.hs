{-
Project: flp22-fun
Functional project
login: xsesta07
author: Pavel Sestak
year:2023
-}

module ParseInput where
    import Types (
        Curve(..), Point(..), Signature(..), Arguments(..), KeyPair(..), 
        update_signature_s, update_signature_r, update_public_key, update_private_key, 
        update_curve_h, update_curve_n, update_curve_y, update_curve_x, update_curve_b, 
        update_curve_a, update_curve_p, update_FilePath, update_V,update_S, update_K, 
        update_Content, update_I)

    -- | Reads standard input from the user until an empty line is encountered.
    --
    --   Returns the input as a single string.
    {-
        readStdin
        Reads standard input from the user until an empty line is encountered.
        output:
            Returns the input as a single string.
    -}
    readStdin :: IO String
    readStdin = go ""
        where
            go acc = do
                line <- getLine
                if null line
                    then return acc
                    else go (acc ++ line ++ "\n")

    {-
    processArgs
    This function parses command-line arguments and returns an Arguments data type.

    The processArgs function takes a list of strings that represent the command-line arguments passed to the program. It returns an IO action that reads the content of the input file or standard input and updates the Arguments data type with it.

    If the input file is not specified in the command-line arguments, the function prompts the user to enter the input on the standard input.
    params:
        inputArgs - list of string which contains arguments
    output:
        Arguments type with data
    -}
    processArgs :: [String] -> IO Arguments
    processArgs inputArgs = do
        let args = processArgs' inputArgs Arguments { i = False, k = False, s = False, v = False, path = "", content= "" }
        if (path args) == "" then do
            putStrLn "Program input not found, please insert your input to stdin"
            input <- readStdin
            return (update_Content args input)

        else do
            content' <- readFile $ path args
            return (update_Content args content')

    {-
        processArgs'
        This is an internal function that processes a list of command-line arguments
        and updates an `Arguments` record accordingly. The function is called
        recursively, consuming the arguments one by one until it reaches the end of
        the list.
        The recognized command-line options are "-i", "-k", "-s", and "-v", which stand
        for "input", "key", "sign", and "verify", respectively. Each option sets a
        flag in the `Arguments` record to true. Any other argument is interpreted as
        the path to a file, which is then read and stored in the `content` field of
        the `Arguments` record.
        params:
            args - list of string which contains arguments
        output:
            Arguments type with data
    -}
    processArgs' :: [String] -> Arguments -> Arguments
    processArgs' ("-i":xs) args = processArgs' xs $ update_I args True
    processArgs' ("-k":xs) args = processArgs' xs $ update_K args True
    processArgs' ("-s":xs) args = processArgs' xs $ update_S args True
    processArgs' ("-v":xs) args = processArgs' xs $ update_V args True
    processArgs' (x':xs) args = processArgs' xs $ update_FilePath args x'
    processArgs' [] args = args

    {-
        splitByFirstSeparator
        Splits a given string into two parts at the first occurrence of a specified separator.
        If the separator is not found in the string, the second part of the result is an empty string.
        params:
            sep - character to split string
            str - input which will be split by sep
        output:
            Tuple of two strings which are splitted by sep
    -}
    splitByFirstSeparator :: Char -> String -> (String, String)
    splitByFirstSeparator sep str =
        let (before, after) = splitHelper sep str
        in (before, after)
    
     {-
        splitHelper
        Splits a given string by the first occurrence of a specified separator
        character, returning a tuple with the substring before the separator and
        the substring after it (including the separator).
        params:
            sep - character to split string
            str - input which will be split by sep
        output:
            Tuple of two strings which are splitted by sep
    -}
    splitHelper :: Char -> String -> (String, String)
    splitHelper _ [] = ([], []) 
    splitHelper sep (x':xs)
        | x' == sep = ([], xs)
        | otherwise = let (before, after) = splitHelper sep xs
                    in (x':before, after)

    {-
        parseCurve
        Parses a string to obtain a 'Curve' object. The expected input format is "Curve parameters", where
        parameters must be in the format "p=a=b=gx,gy=n,h". If the string does not match this format, the function
        returns a 'Curve' object with p = -1.
        params:
            content - input from user
        output:
            Curve object filled with data from input
    -}
    parseCurve :: String -> Curve
    parseCurve ('C':'u':'r':'v':'e':xs) = parseCurve' xs Curve {p = 0, a = 0, b = 0, g = Point { x = 0, y = 0}, n = 0, h = 0}
    parseCurve (_:xs) = parseCurve xs
    parseCurve _ = Curve {p = -1, a = 0, b = 0, g = Point { x = 0, y = 0}, n = 0, h = 0}

    {-
        parseCurve'
        Parses a curve definition in a string format and returns a `Curve` object.
        params:
            content - input from user
        output:
            Curve object filled with data from input
    -}
    parseCurve' :: String -> Curve -> Curve
    parseCurve' (' ':xs) curve = parseCurve' xs curve
    parseCurve' ('\t':xs) curve = parseCurve' xs curve
    parseCurve' ('\n':xs) curve = parseCurve' xs curve
    parseCurve' ('}':xs) curve = parseCurve' xs curve
    parseCurve' ('{':xs) curve = parseCurve' xs curve
    parseCurve' ('\r':xs) curve = parseCurve' xs curve --windows.....
    parseCurve' ('g':':':' ':'P':'o':'i':'n':'t':' ':'{':xs) curve = parseCurve' xs curve

    parseCurve' ('p':':':' ':xs) curve = parseCurve' after newCurve
        where
            (before, after) = splitByFirstSeparator '\n' xs
            pNumber =  read before :: Integer
            newCurve = update_curve_p curve pNumber

    parseCurve' ('a':':':' ':xs) curve = parseCurve' after newCurve
        where
            (before, after) = splitByFirstSeparator '\n' xs
            aNumber =  read before :: Integer
            newCurve = update_curve_a curve aNumber

    parseCurve' ('b':':':' ':xs) curve = parseCurve' after newCurve
        where
            (before, after) = splitByFirstSeparator '\n' xs
            bNumber =  read before :: Integer
            newCurve = update_curve_b curve bNumber

    parseCurve' ('x':':':' ':xs) curve = parseCurve' after newCurve
        where
            (before, after) = splitByFirstSeparator '\n' xs
            xNumber =  read before :: Integer
            newCurve = update_curve_x curve xNumber

    parseCurve' ('y':':':' ':xs) curve = parseCurve' after newCurve
        where
            (before, after) = splitByFirstSeparator '\n' xs
            yNumber =  read before :: Integer
            newCurve = update_curve_y curve yNumber

    parseCurve' ('n':':':' ':xs) curve = parseCurve' after newCurve
        where
            (before, after) = splitByFirstSeparator '\n' xs
            nNumber =  read before :: Integer
            newCurve = update_curve_n curve nNumber
    
    parseCurve' ('h':':':' ':xs) curve = parseCurve' after newCurve
        where
            (before, after) = splitByFirstSeparator '\n' xs
            hNumber =  read before :: Integer
            newCurve = update_curve_h curve hNumber

    parseCurve' _ curve = curve

    {-
        parseKey
        Parses a string to a KeyPair, extracting its private key and public key.
        params:
            content - input from user
        output:
            Keypair
        exceptions:
            If the string is malformed or doesn't contain a valid key, a default KeyPair with all fields set to 0 is returned.
    -}
    parseKey :: String -> KeyPair
    parseKey ('K':'e':'y':xs) = parseKey' xs KeyPair {privateKey = 0, publicKey = Point { x = 0, y = 0}}
    parseKey (_:xs) = parseKey xs
    parseKey _ = KeyPair {privateKey = 0, publicKey = Point { x = 0, y = 0}}

    {-
        parseKey'
        Parses a string to a KeyPair, extracting its private key and public key. This is intern function
        params:
            content - input from user
        output:
            Keypair
        exceptions:
            If the string is malformed or doesn't contain a valid key, a default KeyPair with all fields set to 0 is returned.
    -}
    parseKey' :: String -> KeyPair -> KeyPair
    parseKey' (' ':xs) keyPair = parseKey' xs keyPair
    parseKey' ('\t':xs) keyPair = parseKey' xs keyPair
    parseKey' ('{':xs) keyPair = parseKey' xs keyPair
    parseKey' ('\n':xs) keyPair = parseKey' xs keyPair
    parseKey' ('\r':xs) keyPair = parseKey' xs keyPair

    parseKey' ('d':':':' ':xs) keyPair = parseKey' after newKeyPair
        where
            (before, after) = splitByFirstSeparator '\n' xs
            dNumber =  read before :: Integer
            newKeyPair = update_private_key keyPair dNumber
    
    parseKey' ('Q':':':' ':xs) keyPair = parseKey' after newKeyPair
        where
            (before, after) = splitByFirstSeparator '\n' xs
            q = parsePublicKeyToPoint before
            newKeyPair = update_public_key keyPair q
    
    parseKey' ('}':_) keyPair = keyPair
    
    parseKey' x' _ = error ("error in parseKey'" ++ show x')

    {-
        parsePublicKeyToPoint
        Parses a string representing a public key and returns the corresponding point
        on the elliptic curve. The string should be in the format "0x04<x-coordinate><y-coordinate>",
        where <x-coordinate> and <y-coordinate> are the hexadecimal representations of the x and y
        coordinates of the point, respectively.
        params:
            content - input from user
        output:
            Point as public key
    -}
    parsePublicKeyToPoint :: String -> Point
    parsePublicKeyToPoint ('0':'x':'0':'4':xs) = parsePublicKeyToPoint xs
    parsePublicKeyToPoint xs = Point {x = x', y = y'}
        where
            (xStr, yStr) = splitAt (length xs `div` 2) xs
            x' = read ("0x"++xStr) :: Integer
            y' = read ("0x"++yStr) :: Integer

    {-
        parseHash
        Parse hash from input, string must start with "Hash: "
        params:
            content - input from user
        output:
            hash as integer
    -}
    parseHash :: String -> Integer
    parseHash ('H':'a':'s':'h':':':' ': xs) = hash
        where
            (before, _) = splitByFirstSeparator '\n' xs
            hash = read before :: Integer
    parseHash (_:xs) = parseHash xs
    parseHash _ = error "Hash not found"


    {-
        parseSignature
        Parse signature from input, string must start with "Signature: "
        params:
            content - input from user
        output:
            Signature type filled with r and s
        exception:
            when is problem with parsing, r == s == 0 is returned
    -}
    parseSignature :: String -> Signature
    parseSignature ('S':'i':'g':'n':'a':'t':'u':'r':'e':xs) = parseSignature' xs Signature { sign_r = 0, sign_s = 0}
    parseSignature (_:xs) = parseSignature xs
    parseSignature _ = Signature { sign_r = 0, sign_s = 0}

    {-
        parseSignature'
        Intern function to parse signature from input
        params:
            content - input from user
        output:
            Signature type filled with r and s
        exception:
            raise error when is problem with parsing
    -}
    parseSignature' :: String -> Signature -> Signature
    parseSignature' (' ':xs) signature = parseSignature' xs signature
    parseSignature' ('\t':xs) signature = parseSignature' xs signature
    parseSignature' ('\n':xs) signature = parseSignature' xs signature
    parseSignature' ('\r':xs) signature = parseSignature' xs signature
    parseSignature' ('{':xs) signature = parseSignature' xs signature
    
    parseSignature' ('r':':':' ':xs) signature = parseSignature' after newSignature
        where
            (before, after) = splitByFirstSeparator '\n' xs
            rNumber =  read before :: Integer
            newSignature = update_signature_r signature rNumber

    parseSignature' ('s':':':' ':xs) signature = parseSignature' after newSignature
        where
            (before, after) = splitByFirstSeparator '\n' xs
            sNumber =  read before :: Integer
            newSignature = update_signature_s signature sNumber

    parseSignature' ('}':_) signature = signature
    parseSignature' x' _ = error ("error in parseSignature'" ++ show x')

    {-
        parsePublicKey
        parse public key from input. Finding part in input with start "PublicKey: "
        params:
            content - input from user
        output:
            Keypair where only public key is filled, private key is initialized to 0
    -}
    parsePublicKey :: String -> KeyPair
    parsePublicKey ('P':'u':'b':'l':'i':'c':'K':'e':'y':xs) = parseKey' xs KeyPair {privateKey = 0, publicKey = Point { x = 0, y = 0}}
    parsePublicKey (_:xs) = parsePublicKey xs
    parsePublicKey _ = KeyPair {privateKey = 0, publicKey = Point { x = 0, y = 0}}