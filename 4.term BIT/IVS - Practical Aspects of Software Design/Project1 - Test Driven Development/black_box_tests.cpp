//======== Copyright (c) 2017, FIT VUT Brno, All rights reserved. ============//
//
// Purpose:     Red-Black Tree - public interface tests
//
// $NoKeywords: $ivs_project_1 $black_box_tests.cpp
// $Author:     PAVEL SESTAK <xsesta07@stud.fit.vutbr.cz>
// $Date:       $2017-01-04
//============================================================================//
/**
 * @file black_box_tests.cpp
 * @author PAVEL SESTAK
 * 
 * @brief Implementace testu binarniho stromu.
 */

#include <vector>

#include "gtest/gtest.h"

#include "red_black_tree.h"

//============================================================================//
// ** ZDE DOPLNTE TESTY **
//
// Zde doplnte testy Red-Black Tree, testujte nasledujici:
// 1. Verejne rozhrani stromu
//    - InsertNode/DeleteNode a FindNode
//    - Chovani techto metod testuje pro prazdny i neprazdny strom.
// 2. Axiomy (tedy vzdy platne vlastnosti) Red-Black Tree:
//    - Vsechny listove uzly stromu jsou *VZDY* cerne.
//    - Kazdy cerveny uzel muze mit *POUZE* cerne potomky.
//    - Vsechny cesty od kazdeho listoveho uzlu ke koreni stromu obsahuji
//      *STEJNY* pocet cernych uzlu.
//============================================================================//

class EmptyTree : public ::testing::Test
{  
    protected:
        BinaryTree *tree;

        virtual void SetUp(){
            tree = new BinaryTree();
        }

        virtual void TearDown()
        {
            delete tree;
        }
};

#define LOOP_COUNT 50

TEST_F(EmptyTree, InsertNode){
    
    //Test 50 inserts into tree
    for (int i = 0; i < LOOP_COUNT; i++) {
        std::pair<bool, Node_t *> result = tree->InsertNode(i);
        EXPECT_TRUE(result.first); //Expect value is not in tree
        EXPECT_NE(result.second,nullptr); //Expect pointer != nullptr
    }
};

TEST_F(EmptyTree, DeleteNode){
    bool result;
    //Test 50 deletes on empty tree
    for (int i = 0; i < LOOP_COUNT; i++) {
        result = tree->DeleteNode(i);
        EXPECT_FALSE(result); //Expect value is not in tree
    }
};

TEST_F(EmptyTree, FindNode){
    Node_t *ptr;
    //Try to find node in empty tree
    for (int i = 0; i < LOOP_COUNT; i++) {
        ptr = tree->FindNode(i);
        EXPECT_EQ(ptr,nullptr); //Expect value is not in empty tree
    }
};

class NonEmptyTree : public ::testing::Test
{  
    protected:
        BinaryTree *tree;

        virtual void SetUp(){
            tree = new BinaryTree();
            for (int i = 0; i < LOOP_COUNT; i++) {
                tree->InsertNode(i);
            }
        }

        virtual void TearDown()
        {
            delete tree;
        }
};

TEST_F(NonEmptyTree, InsertNode){

    for (int i = 0; i < LOOP_COUNT; i++) {
        std::pair<bool, Node_t *> result = tree->InsertNode(i);
        EXPECT_FALSE(result.first); //Expect value is in tree
        EXPECT_NE(result.second,nullptr); //Expect pointer != nullptr
    }
};

TEST_F(NonEmptyTree, DeleteNode){
    
    bool result;

    for (int i = 0; i < LOOP_COUNT; i++) {
        result = tree->DeleteNode(i);
        EXPECT_TRUE(result); //Expect value is in tree
        
        result = tree->DeleteNode(i);
        EXPECT_FALSE(result); //Expect value is not in tree
    }
};

TEST_F(NonEmptyTree, FindNode){
    
    Node_t *result;

    for (int i = 0; i < LOOP_COUNT; i++) {
        result = tree->FindNode(i);
        EXPECT_NE(result,nullptr); //Expect value is in tree
    }
};

class TreeAxioms : public ::testing::Test
{  
    protected:
        BinaryTree *tree;

        virtual void SetUp(){
            tree = new BinaryTree();
            for (int i = 0; i < LOOP_COUNT; i++) {
                tree->InsertNode(i);
            }
        }

        virtual void TearDown()
        {
            delete tree;
        }
};

TEST_F(TreeAxioms,Axiom1_GetAllNodes){
    std::vector<Node_t *> allNodes;
    
    tree->GetAllNodes(allNodes);

    std::vector<Node_t *>::iterator it;
    for(it = allNodes.begin(); it != allNodes.end(); it++) {
        //Test axiom
        //Leaf has not left and right child
        if((*it)->pLeft == nullptr && (*it)->pRight == nullptr){
            //If is leaf its must be black node
            EXPECT_EQ((*it)->color,Color_t::BLACK);
        }
    }
};

TEST_F(TreeAxioms,Axiom1_GetLeafNodes){
    std::vector<Node_t *> leafNodes;
    tree->GetLeafNodes(leafNodes);

    std::vector<Node_t *>::iterator it;
    for(it = leafNodes.begin(); it != leafNodes.end(); it++) {
        //Test axiom
        //Leaf has not left and right child
        if((*it)->pLeft == nullptr && (*it)->pRight == nullptr){
            //If is leaf its must be black node
            EXPECT_EQ((*it)->color,Color_t::BLACK);
        }
    }
};

TEST_F(TreeAxioms,Axiom2_RedNodeWithBlackChilds){
    std::vector<Node_t *> allNodes;
    tree->GetLeafNodes(allNodes);

    std::vector<Node_t *>::iterator it;
    for(it = allNodes.begin(); it != allNodes.end(); it++) {
        //Test axiom
        //Red node has only black childs
        if((*it)->color == Color_t::RED){
            if((*it)->pLeft != nullptr){
                EXPECT_EQ((*it)->pLeft->color,Color_t::BLACK);
            }
            if((*it)->pRight != nullptr){
                EXPECT_EQ((*it)->pRight->color,Color_t::BLACK);
            }
        }
    }
};

TEST_F(TreeAxioms,Axiom3_BlackNodesCountFromLeafs){
    //Test axiom
    //In way from leaf node to root count of black nodes is equal
    std::vector<Node_t *> leafNodes;
    tree->GetLeafNodes(leafNodes);

    Node_t *root = tree->GetRoot();
    EXPECT_NE(root,nullptr);

    Node_t *ptr;
    int blackNodes;
    std::vector<Node_t *>::iterator it;
    for(it = leafNodes.begin(); it != leafNodes.end(); it++) {
        ptr = (*it);
        int counter = 0;
        while(ptr != root){
            if(ptr->color == Color_t::BLACK){
                counter++;
            }
            ptr = ptr->pParent;
        }
        if(it == leafNodes.begin()){
            blackNodes = counter;
        }
        else{
            EXPECT_EQ(blackNodes,counter);
        }
    }   
};
/*** Konec souboru black_box_tests.cpp ***/