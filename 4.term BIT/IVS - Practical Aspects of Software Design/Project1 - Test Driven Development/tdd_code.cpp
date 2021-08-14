//======== Copyright (c) 2021, FIT VUT Brno, All rights reserved. ============//
//
// Purpose:     Test Driven Development - priority queue code
//
// $NoKeywords: $ivs_project_1 $tdd_code.cpp
// $Author:     PAVEL SESTAK <xsesta07@stud.fit.vutbr.cz>
// $Date:       $2021-01-04
//============================================================================//
/**
 * @file tdd_code.cpp
 * @author PAVEL SESTAK
 * 
 * @brief Implementace metod tridy prioritni fronty.
 */

#include <stdlib.h>
#include <stdio.h>
#include <iostream> //used for use stdin and stdout
#include "tdd_code.h"

//============================================================================//
// ** ZDE DOPLNTE IMPLEMENTACI **
//
// Zde doplnte implementaci verejneho rozhrani prioritni fronty (Priority Queue)
// 1. Verejne rozhrani fronty specifikovane v: tdd_code.h (sekce "public:")
//    - Konstruktor (PriorityQueue()), Destruktor (~PriorityQueue())
//    - Metody Insert/Remove/Find a GetHead
//    - Pripadne vase metody definovane v tdd_code.h (sekce "protected:")
//
// Cilem je dosahnout plne funkcni implementace prioritni fronty implementovane
// pomoci tzv. "double-linked list", ktera bude splnovat dodane testy 
// (tdd_tests.cpp).
//============================================================================//

PriorityQueue::PriorityQueue()
{
    this->m_pHead = nullptr;
}

PriorityQueue::~PriorityQueue()
{
    while(this->m_pHead != nullptr){
        this->Remove(m_pHead->value);
    }
}

void PriorityQueue::Insert(int value)
{
    //Item to insert
    Element_t *item = new Element_t();
    item->value = value;
    
    Element_t *QueueItem = this->m_pHead;

    if(QueueItem == nullptr){
        this->m_pHead = item;
        item->pNext = nullptr;
        return;
    }
    else{
        if(QueueItem->value < item->value){
            item->pNext = QueueItem;
            this->m_pHead = item;
            return;
        }
    }

    while(QueueItem->pNext != nullptr){
        if(QueueItem->pNext->value < item->value){
            item->pNext = QueueItem->pNext;
            QueueItem->pNext = item;
            return;
        }
        else{
            QueueItem = QueueItem->pNext;
        }
    }

    if(QueueItem->value > item->value){
        
        QueueItem->pNext = item;
        item->pNext = nullptr;
    }
}

bool PriorityQueue::Remove(int value)
{
    Element_t *item = this->GetHead();

    Element_t *ptrPrev = nullptr;
    
    while(item != nullptr){
        if(item->value == value){
            if(ptrPrev != nullptr){
                ptrPrev->pNext = item->pNext; //bypass
            }
            else{
                this->m_pHead = item->pNext;
            }
            delete item;
            return true;
        }
        ptrPrev = item;
        item = item->pNext;
    }

    return false;  
   
}

PriorityQueue::Element_t *PriorityQueue::Find(int value)
{
    Element_t *ptr = this->GetHead();

    while(ptr != nullptr){
        if(ptr->value == value){
            break;
        }
        ptr = ptr->pNext;
    }

    return ptr;
}

size_t PriorityQueue::Length()
{
    int length = 0;
	
    Element_t *ptr = this->m_pHead;

    while(ptr != nullptr){
        length++;
        ptr = ptr->pNext;
    }
    return length;
}

PriorityQueue::Element_t *PriorityQueue::GetHead()
{
    return this->m_pHead;
}

/*** Konec souboru tdd_code.cpp ***/
