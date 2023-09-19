module Pulsemka where

    data Expr = Const Int | Var Char | Add Expr Expr
        deriving(Show, Eq)


    simplify tree =
        let 
            simp (Add (Const a) (Const b)) = Const (a+b)
            simp (Add x y) = Add (simp x) (simp y)
            simp x = x
            simpTree = simp tree
        in if simpTree == tree then tree else simplify simpTree
    