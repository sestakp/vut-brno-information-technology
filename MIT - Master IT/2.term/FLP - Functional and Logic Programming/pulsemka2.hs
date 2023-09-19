

{-
data BooleanExp =  Var String 
                 | Neg BooleanExp
                 | And BooleanExp BooleanExp
                 deriving (Show)

em :: BooleanExp -> BooleanExp
em (And x y) = And (em x) (em y)
em (Neg(Neg(x))) = em x
em (Neg(x)) = Neg (em x)
em x = x

-}

{-
data Expr =  Var String
           | Neg Expr
           | Add Expr Expr
           | Sub Expr Expr
        deriving (Show, Eq)

um:: Expr -> Expr
um (Neg(Sub x y)) = Sub (um y) (um x)
um (Neg x) = um (Neg (um x))
um (Add x y) = Add (um x) (um y)
um (Sub x y) = Sub (um x) (um y)
um x = x 



um :: Expr -> Expr
um tree = let 
    um' (Neg(Sub x y)) = Sub (um y) (um x)
    um' (Neg x) = Neg (um x)
    um' (Add x y) = Add (um x) (um y)
    um' (Sub x y) = Sub (um x) (um y)
    um' x = x 
    simpTree = um' tree
        in if tree == simpTree then tree else um simpTree

-}


data Tree k v =  EmptyTree
               | Node k v (Tree k v) (Tree k v)
               deriving(Show)

find :: (Ord k) => Tree k v -> k -> Maybe v 
find EmptyTree _ = Nothing
find (Node key value left right) k
    | k == key = Just value
    | key < k  = find right k
    | key > k = find left k

insert :: (Ord k) => Tree k v -> k -> v -> Tree k v
insert EmptyTree k v = Node k v EmptyTree EmptyTree
insert (Node k v left right) newKey newValue 
    | k == newKey = Node newKey newValue left right
    | k < newKey = Node k v left (insert right newKey newValue)
    | k > newKey = Node k v (insert left newKey newValue) right



