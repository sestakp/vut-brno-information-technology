
import System.IO
import Control.Monad


data BooleanType = Var String
                 | Not BooleanType
                 | And BooleanType BooleanType
                 deriving (Show)

em::BooleanType -> BooleanType
em (Not(Not x)) = em x
em (Not x) = Not (em x)
em (And x y) = And (em x) (em y)
em x = x


data Expr = VarE String
          | Neg Expr
          | Add Expr Expr
          | Sub Expr Expr
        deriving(Show, Eq)

um:: Expr -> Expr

um tree = let
    um' (Neg(Sub x y)) = Sub (um y) (um x)
    um' (Sub x y) = Sub (um x) (um y)
    um' (Add x y) = Add (um x) (um y)
    um' (Neg x) = Neg (um x)
    um' x = x
    simpTree = um' tree
        in if tree == simpTree then tree else um simpTree   


data MyInt =  Const Int
            | VarI String
            | AddI MyInt MyInt
        deriving (Show, Eq)


simplify:: MyInt -> MyInt
simplify tree = let 
    simplify' (AddI (Const x) (Const y)) = Const (x + y)
    simplify' (AddI x y) = AddI (simplify x) (simplify y)
    simplify' x = x
    simpTree = simplify' tree
        in if simpTree == tree then tree else simplify simpTree

data SubsInt =   SubConst Int
               | SubVar String
               | SubAdd SubsInt SubsInt
            deriving (Show)

subst:: SubsInt -> String -> SubsInt -> SubsInt
subst (SubAdd x y) v s = SubAdd (subst x v s) (subst y v s)
subst (SubVar x) v s = if x == v then s else SubVar x
subst x _ _ = x


data Tree v k = EmptyTree 
              | Node v k (Tree v k) (Tree v k)
            deriving(Show, Eq, Ord)

findInTree :: Ord k => Tree v k -> k -> Maybe v
findInTree EmptyTree _ = Nothing
findInTree (Node value key left right) searchKey
  | searchKey == key = Just value
  | searchKey < key  = findInTree left searchKey
  | searchKey > key  = findInTree right searchKey

insertIntoTree :: Ord k => Tree v k -> v -> k -> Tree v k
insertIntoTree EmptyTree v k = Node v k EmptyTree EmptyTree
insertIntoTree (Node v k left right) newValue insertKey
    | k == insertKey = (Node newValue k left right)
    | insertKey < k = Node v k (insertIntoTree left newValue insertKey) right
    | insertKey > k = Node v k left (insertIntoTree right newValue insertKey)


data Line = Line {
                    lineNum::Int,
                    lineContent::String
                 }
    deriving(Eq)

instance Show (Line) where
    show line = lineContent line


parseLines lines = newLines
    where
        noEmpty = filter (\x -> x /= "") lines
        newLines = noEmpty
--rf:: String -> IO


rF filename = do
    content <- readFile filename
    let listOfLines = lines content
    let newLines = parseLines listOfLines
    mapM_ putStrLn newLines
