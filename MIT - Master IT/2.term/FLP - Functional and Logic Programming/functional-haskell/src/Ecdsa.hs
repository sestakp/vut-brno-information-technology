{-
Project: flp22-fun
Functional project
login: xsesta07
author: Pavel Sestak
year:2023
-}
module Ecdsa where
    import Types(Point(..), KeyPair(..), Curve(..), Signature(..))
    import System.Random (randomR, StdGen, randomRIO)
    import Data.Bits ((.&.), shiftR)
    {-
    The extended euclidean algorithm
    Used for calculation greatest common divisior (gcd)
    params:
    a - first number for which we are looking for the gcd
    b - second number for which we are looking for the gcd
    output:
    gcd - gcd of params
    x1 and x2 coefficients which satisfy equation: gcd(a, b) = x1*a + x2*b
    -}
    extendedEuclidean :: Integer -> Integer -> (Integer, Integer, Integer)
    extendedEuclidean 0 b' = (b', 0, 1)
    extendedEuclidean a' b' = (gcd', x1, x2) 
        where
            (gc, x', y') = extendedEuclidean (mod b' a') a'
            gcd' = gc
            x1 = y' - (b' `div` a') * x'
            x2 = x'

    {-
    Inverse modulo
    (a * x) ≡ 1 (mod b)
    this operation is neccesary when we want do arithmetic operations on finite field on our curve
    params: 
    a - first param of modulo
    b - second param of modulo
    output:
    invMod a b
    exception:
    throw exception whn inverse modulo doesn't exist. It's when gcd of a and b /= 1
    -}
    modinv :: Integer -> Integer -> Integer
    modinv a' b'
        | g' /= 1 = error "g not equal to 0, inverse modulo does't exist"
        | otherwise = (mod x' b')
            where
            (g', x', _) = extendedEuclidean a' b'

    {-
    Multiplication
    this operation implement multiplication on finite field
    params: 
    a - first param of multiplication
    b - second param of multiplication
    output:
    a * b
    -}
    multiply :: Integer -> Integer -> Integer -> Integer
    multiply a' b' p' = mod (a' * b') p'

    {-
    divide
    this operation implement division on finite field
    params: 
    a - first param of division
    b - second param of division
    output:
    a / b
    -}
    divide :: Integer -> Integer -> Integer -> Integer
    divide a' b' p' = (multiply m ec p')
        where
            ec = modinv b' p'
            m = mod a' p'

    {-
    Tangent
    Calculates the tangent of an elliptic curve at a given point on a finite field.
    params: 
    point - point The point on the elliptic curve.
    a -  The 'a' parameter of the elliptic curve equation.
    p -  The prime modulus of the finite field.
    output:
    The tangent of the elliptic curve at the given point modulo 'p'.
    -}
    tangent :: Point -> Integer -> Integer -> Integer
    tangent point a' p' = divide ((x point * x point * 3) + a') (y point * 2) p'


    {-
    IntToPoint
    Calculates the point on an elliptic curve over a finite field with the given prime modulus.
    params:
    p -  The prime modulus of the finite field.
    output:
    The point on the elliptic curve, with X-coordinate equal to 'p' and Y-coordinate equal to 0.
    -}
    intToPoint :: Integer -> Point
    intToPoint p' = Point p' 0


    {-
    Dot
    Computes the result of adding two points on an elliptic curve over a finite field with the given modulus.
    params:
    p1 - The first point to add.
    p2 - The second point to add.
    m  - The slope of the line connecting the two points.
    p  - The prime modulus of the finite field.
    output:
    The result of adding the two points, computed as the intersection of the elliptic curve and the line
    connecting the two points, modulo 'p'. 
    -}
    dot :: Point -> Point -> Integer -> Integer -> Point
    dot p1 p2 m p' = Point t q
        where
            v' = mod (y p1 + p' - mod (m * x p1) p') p'
            t = mod (m * m + p' - x p1 + p' - x p2) p'
            q = mod (p' - (mod (m * t) p') + p' - v') p'

    {-
    Double
    Doubles a point on an elliptic curve over a finite field with the given modulus.
    params:
    point - The point to double.
    a     - The 'a' coefficient of the equation defining the elliptic curve.
    p     - The prime modulus of the finite field.
    output:
    The result of doubling the given point on the elliptic curve, computed as the intersection of the
    elliptic curve and the tangent line at the given point, modulo 'p'. If the given point has an X-coordinate
    equal to 'p', then the function returns the point unchanged.
    -}
    double :: Point -> Integer -> Integer -> Point
    double point a' p'
        | x point == p' = point
        | otherwise = dot point point tan' p'
            where
                tan' = tangent point a' p'

    {-
    Add
    Adds two points on an elliptic curve over a finite field with the given modulus.
    params:
    p1 - The first point to add.
    p2 - The second point to add.
    p  - The prime modulus of the finite field.
    a  - The 'a' coefficient of the equation defining the elliptic curve.
    output:
    The result of adding the two given points on the elliptic curve, computed as the intersection of
    the elliptic curve and the line passing through the two points, modulo 'p'. If one of the points has an
    X-coordinate equal to 'p', then the other point is returned. If the two points have the same X-coordinate
    but different Y-coordinates, then the point at infinity is returned. If the two points are equal, then
    the result is the doubling of the given point, computed as the intersection of the elliptic curve and the
    tangent line at the given point, modulo 'p'.
    -}
    add :: Point -> Point -> Integer -> Integer -> Point
    add p1 p2 p' a'
        | x p1 == p' = p2
        | x p2 == p' = p1
        | (x p1 == x p2) && (y p1 == y p2) = double p1 a' p'
        | (x p1 == x p2) = intToPoint p'
        | otherwise = dot p1 p2 m p'
            where
                m = divide (y p1 + p' - y p2) (x p1 + p' - x p2) p'

    {-
    pointMultiply
    Performs scalar multiplication of a point on an elliptic curve using the double-and-add algorithm.
    params:
    curve - Eliptic curve
    n - The second point to add.
    point  - The prime modulus of the finite field.
    preconditions:
    point must be on the curve and curve must be valid eliptic curve
    output:
    The result is the point Q = scalar * P on the curve E.
    -}
    pointMultiply :: Curve -> Integer -> Point -> Point
    pointMultiply (Curve p'' a'' _ _ _ _) scalar point = pointMultiply' (intToPoint p'', scalar, p'', point, a'')
        where
            
            {-
            pointMultiply'
            Helper function for the pointMultiply function that performs scalar multiplication of a point on an elliptic curve
            using the double-and-add algorithm.
            params:
            r - current result, default is inserted point with x coordita equal to p
            n - curve parameter n
            p  - The prime modulus of the finite field.
            g  - Generator point on curve
            a  - curve parameter a
            output:
            The result is the point Q = scalar * P on the curve E.
            -}
            pointMultiply' :: (Point, Integer, Integer, Point, Integer) -> Point
            pointMultiply' (r, 0, _, _, _) = r
            pointMultiply' (r, n', p', g', a')
                | ((.&.)  n' 1 /= 0) = pointMultiply'((add r g' p' a'), nm, p', double g' a' p', a')
                | otherwise = pointMultiply'(r, nm, p', double g' a' p', a')
                where
                    nm = shiftR n' 1

    {-
    sign
    Signs data with a private key using a specified random value k.
    params:
        keyPair - type KeyPair, which contains private and public key, in this function only private key d is used
        hash - hash of message
        curve  - The prime modulus of the finite field.
        randomK  - Generator point on curve
    output:
        Returns a Signature type containing the values of r and s.
    exception:
        If either r or s is equal to zero, an error is thrown.
    -}
    sign :: KeyPair -> Integer -> Curve -> Integer -> Signature
    sign keyPair hash curve@(Curve _ _ _ g' n' _) randomK
        |r /= 0 && s' /= 0 = Signature {sign_r = r, sign_s = s'}
        | otherwise =  error "r or s of signature is zero"
        where
            p1 = pointMultiply curve randomK g'
            r = (x p1) `mod` n'
            s' = (modinv randomK n') * (hash + privateKey keyPair * r) `mod` n'

    {-
    verify
    Verifies a signature given a hash value, key pair, signature, and curve.
    params:
        keyPair - type KeyPair, which contains private and public key, in this function only public key Q is used
        hash - hash of message
        sig  - signature of message
        curve  - structure of type Curve
    output:
        True if the signature is valid, and False otherwise.
    -}
    verify :: KeyPair -> Integer -> Signature -> Curve -> Bool
    verify keyPair hash sig curve@(Curve p' a' _ g' n' _)
        | r < 1 || r > n' - 1 = False
        | s' < 1 || s' > n' - 1 = False
        | otherwise = r == v'
        where
            r = sign_r sig
            s' = sign_s sig
            c = modinv s' n'
            u1 = mod (hash * c) n'
            u2 = mod (r * c) n'
            p1 = pointMultiply curve u1 g'
            p2 = pointMultiply curve u2 (publicKey keyPair)
            p3 = add p1 p2 p' a'
            v' = mod (x p3) n'

    {-
    makeKeyPair
    Generates a new KeyPair on the specified elliptic curve. Use secure random generator is neccesary, 
    but this is school project and that library wasn't on allowed list.
    params:
        curve - structure of type Curve
    output:
        IO KeyPair structure with public key and private key
    -}
    makeKeyPair :: Curve -> StdGen -> KeyPair
    makeKeyPair curve gen = KeyPair {privateKey = privKey', publicKey = pubKey}
        where
            (privKey', _) = generatePrivateKey gen
            pubKey = pointMultiply curve privKey' (g curve) 
            {-
            generatePrivateKey
            Generates a random private key on the specified elliptic curve using the System.Random package
            params:
                gen - random generator
            output:
                Tuple, first element is private key and second parameter is new generator.
            -}
            generatePrivateKey generator
                | gcd privKey (n curve) == 1 = (privKey, gen')
                | otherwise = generatePrivateKey gen'
                    where
                    (privKey, gen') = randomR (1, (n curve) - 1) generator

    {-
    getRandomIntegerInRange
    Generate a random integer within a given range.
    params:
        lo - lower bound of interval
        hi - upper bound of interval
    preconditions:
        lo <= hi
    output:
        random number in selected interval
    -}
    getRandomIntegerInRange :: Integer -> Integer -> IO Integer
    getRandomIntegerInRange lo hi = randomRIO (lo, hi)