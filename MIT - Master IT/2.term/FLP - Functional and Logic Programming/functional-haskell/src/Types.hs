{-
Project: flp22-fun
Functional project
login: xsesta07
author: Pavel Sestak
year:2023
-}
module Types where
    import Numeric (showHex, showIntAtBase)
    import Data.Char (intToDigit)
    data Arguments = Arguments { i :: Bool
                            , k :: Bool
                            , s :: Bool
                            , v :: Bool
                            , path :: String
                            , content :: String
                            } deriving Show

    update_I :: Arguments -> Bool -> Arguments
    update_I args newI = args { i = newI }

    update_K :: Arguments -> Bool -> Arguments
    update_K args newK = args { k = newK }

    update_S :: Arguments -> Bool -> Arguments
    update_S args newS = args { s = newS }

    update_V :: Arguments -> Bool -> Arguments
    update_V args newV = args { v = newV }   
    
    update_FilePath :: Arguments -> String -> Arguments
    update_FilePath args newPath = args { path = newPath }     

    update_Content :: Arguments -> String -> Arguments
    update_Content args newContent = args { content = newContent }   


    {-
        intToFixedHex
        Convert an integer to a fixed-length hexadecimal string.
        params:
            len - length of expected output
            n   - number to print 
        output:
            number converted to string in hexa format
    -}
    intToFixedHex :: Int -> Integer -> String
    intToFixedHex len digits = padding ++ hexChars
        where 
            hexChars = showIntAtBase 16 intToDigit digits ""
            numChars = length hexChars
            padding = replicate (len - numChars) '0'

    data Point = Point{ x :: Integer
                      , y :: Integer
                      } deriving (Eq)

    instance Show Point where
            show (Point x' y') = "Point {\n    x: 0x" ++ intToFixedHex 64 x' ++ "\n    y: 0x" ++ showHex y' "" ++ "\n}"

    data Curve = Curve{ p :: Integer
                      , a :: Integer
                      , b :: Integer
                      , g :: Point
                      , n :: Integer
                      , h :: Integer
                      }

    instance Show Curve where
        show (Curve p' a' b' g' n' h') = "Curve {\n    p: 0x" ++ showHex p' "" ++ "\n    a: " ++ show a' ++ "\n    b: " ++ show b' ++ "\n    g: " ++ show g' ++ "\n    n: 0x" ++ showHex n' "" ++ "\n    h: " ++ show h'  ++ "\n}"

    data Signature = Signature {
        sign_r :: Integer,
        sign_s :: Integer
    }

    instance Show Signature where
            show (Signature r s') = "Signature {\n    r: 0x" ++ showHex r "" ++ "\n    s: 0x" ++ showHex s' "" ++ "\n}"

    update_signature_r :: Signature -> Integer -> Signature
    update_signature_r signature newR = signature { sign_r = newR }

    update_signature_s :: Signature -> Integer -> Signature
    update_signature_s signature newS = signature { sign_s = newS }




    data KeyPair = KeyPair { privateKey :: Integer
                           , publicKey  :: Point
                           }


    update_private_key :: KeyPair -> Integer -> KeyPair
    update_private_key keyPair newPriv = keyPair { privateKey = newPriv }


    update_public_key :: KeyPair -> Point -> KeyPair
    update_public_key keyPair newPub = keyPair { publicKey = newPub }

    instance Show KeyPair where
        show (KeyPair privateKey' publicKey') = "Key {\n    d: 0x" ++ intToFixedHex 64 privateKey' ++ "\n    Q: 0x04" ++ intToFixedHex 64 (x publicKey') ++ intToFixedHex 64 (y publicKey')  ++ "\n}"

    update_curve_p :: Curve -> Integer -> Curve
    update_curve_p curve newP = curve { p = newP }

    update_curve_a :: Curve -> Integer -> Curve
    update_curve_a curve newA = curve { a = newA }

    update_curve_b :: Curve -> Integer -> Curve
    update_curve_b curve newB = curve { b = newB }
    
    update_curve_x :: Curve -> Integer -> Curve
    update_curve_x curve newX = curve { g = (g curve) {x = newX} }

    update_curve_y :: Curve -> Integer -> Curve
    update_curve_y curve newY = curve { g = (g curve) {y = newY} }

    update_curve_n :: Curve -> Integer -> Curve
    update_curve_n curve newN = curve { n = newN }

    update_curve_h :: Curve -> Integer -> Curve
    update_curve_h curve newH = curve { h = newH }