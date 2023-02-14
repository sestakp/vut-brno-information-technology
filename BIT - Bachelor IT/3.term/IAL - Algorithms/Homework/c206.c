
/* c206.c **********************************************************}
{* Téma: Dvousměrně vázaný lineární seznam
**
**                   Návrh a referenční implementace: Bohuslav Křena, říjen 2001
**                            Přepracované do jazyka C: Martin Tuček, říjen 2004
**                                            Úpravy: Kamil Jeřábek, září 2020
**
** Implementujte abstraktní datový typ dvousměrně vázaný lineární seznam.
** Užitečným obsahem prvku seznamu je hodnota typu int.
** Seznam bude jako datová abstrakce reprezentován proměnnou
** typu tDLList (DL znamená Double-Linked a slouží pro odlišení
** jmen konstant, typů a funkcí od jmen u jednosměrně vázaného lineárního
** seznamu). Definici konstant a typů naleznete v hlavičkovém souboru c206.h.
**
** Vaším úkolem je implementovat následující operace, které spolu
** s výše uvedenou datovou částí abstrakce tvoří abstraktní datový typ
** obousměrně vázaný lineární seznam:
**
**      DLInitList ...... inicializace seznamu před prvním použitím,
**      DLDisposeList ... zrušení všech prvků seznamu,
**      DLInsertFirst ... vložení prvku na začátek seznamu,
**      DLInsertLast .... vložení prvku na konec seznamu,
**      DLFirst ......... nastavení aktivity na první prvek,
**      DLLast .......... nastavení aktivity na poslední prvek,
**      DLCopyFirst ..... vrací hodnotu prvního prvku,
**      DLCopyLast ...... vrací hodnotu posledního prvku,
**      DLDeleteFirst ... zruší první prvek seznamu,
**      DLDeleteLast .... zruší poslední prvek seznamu,
**      DLPostDelete .... ruší prvek za aktivním prvkem,
**      DLPreDelete ..... ruší prvek před aktivním prvkem,
**      DLPostInsert .... vloží nový prvek za aktivní prvek seznamu,
**      DLPreInsert ..... vloží nový prvek před aktivní prvek seznamu,
**      DLCopy .......... vrací hodnotu aktivního prvku,
**      DLActualize ..... přepíše obsah aktivního prvku novou hodnotou,
**      DLPred .......... posune aktivitu na předchozí prvek seznamu,
**      DLSucc .......... posune aktivitu na další prvek seznamu,
**      DLActive ........ zjišťuje aktivitu seznamu.
**
** Při implementaci jednotlivých funkcí nevolejte žádnou z funkcí
** implementovaných v rámci tohoto příkladu, není-li u funkce
** explicitně uvedeno něco jiného.
**
** Nemusíte ošetřovat situaci, kdy místo legálního ukazatele na seznam 
** předá někdo jako parametr hodnotu NULL.
**
** Svou implementaci vhodně komentujte!
**
** Terminologická poznámka: Jazyk C nepoužívá pojem procedura.
** Proto zde používáme pojem funkce i pro operace, které by byly
** v algoritmickém jazyce Pascalovského typu implemenovány jako
** procedury (v jazyce C procedurám odpovídají funkce vracející typ void).
**/

#include "c206.h"

int solved;
int errflg;

void DLError() {
/*
** Vytiskne upozornění na to, že došlo k chybě.
** Tato funkce bude volána z některých dále implementovaných operací.
**/	
    printf ("*ERROR* The program has performed an illegal operation.\n");
    errflg = TRUE;             /* globální proměnná -- příznak ošetření chyby */
    return;
}

void DLInitList (tDLList *L) {
/*
** Provede inicializaci seznamu L před jeho prvním použitím (tzn. žádná
** z následujících funkcí nebude volána nad neinicializovaným seznamem).
** Tato inicializace se nikdy nebude provádět nad již inicializovaným
** seznamem, a proto tuto možnost neošetřujte. Vždy předpokládejte,
** že neinicializované proměnné mají nedefinovanou hodnotu.
**/
    L->Act = NULL;
    L->First = NULL;
    L->Last = NULL;	
 }

void DLDisposeList (tDLList *L) {
/*
** Zruší všechny prvky seznamu L a uvede seznam do stavu, v jakém
** se nacházel po inicializaci. Rušené prvky seznamu budou korektně
** uvolněny voláním operace free. 
**/
    tDLElemPtr dlElem;
    
    while(L->First != NULL){
        dlElem = L->First; //select first element in list
        L->First = L->First->rptr; //set second item of list like first (skip first saved in elem)
        free(dlElem); //free first element memory
    }
    L->Act = NULL;
    L->Last = NULL;
}

void DLInsertFirst (tDLList *L, int val) {
/*
** Vloží nový prvek na začátek seznamu L.
** V případě, že není dostatek paměti pro nový prvek při operaci malloc,
** volá funkci DLError().
**/

    tDLElemPtr dlElem = malloc(sizeof(struct tDLElem)); /* Allocate memory for new element */
    if(dlElem == NULL){ /* malloc return null if error (No memory, etc...) */
        DLError();
        return; 
    }
    dlElem->data = val; /* set data of element with value from arg */
    dlElem->lptr = NULL; /* set left pointer to NULL because no value is there */
    dlElem->rptr = L->First; /* element and first point to first element of list */
    
    if(L->First != NULL){ /* If isn't first item in list */
        L->First->lptr = dlElem;
    }
    else{
        L->Last = dlElem;
    }

    L->First = dlElem; /* unbound first from first element and point to new element */
}

void DLInsertLast(tDLList *L, int val) {
/*
** Vloží nový prvek na konec seznamu L (symetrická operace k DLInsertFirst).
** V případě, že není dostatek paměti pro nový prvek při operaci malloc,
** volá funkci DLError().
**/ 	
    //TODO.... bind list
 
	tDLElemPtr dlElem = malloc(sizeof(struct tDLElem)); // Allocate memory for new element 
    if(dlElem == NULL){ // malloc return null if error (No memory, etc...) 
        DLError();
        return; 
    }
    dlElem->data = val; // set data of element with value from arg 
    dlElem->rptr = NULL;
    dlElem->lptr = L->Last;

    if(L->Last != NULL){
        L->Last->rptr = dlElem;
    }
    else{
        L->First = dlElem;
    }

    L->Last = dlElem;

}

void DLFirst (tDLList *L) {
/*
** Nastaví aktivitu na první prvek seznamu L.
** Funkci implementujte jako jediný příkaz (nepočítáme-li return),
** aniž byste testovali, zda je seznam L prázdný.
**/
    L->Act = L->First;
}

void DLLast (tDLList *L) {
/*
** Nastaví aktivitu na poslední prvek seznamu L.
** Funkci implementujte jako jediný příkaz (nepočítáme-li return),
** aniž byste testovali, zda je seznam L prázdný.
**/
    L->Act = L->Last;
}

void DLCopyFirst (tDLList *L, int *val) {
/*
** Prostřednictvím parametru val vrátí hodnotu prvního prvku seznamu L.
** Pokud je seznam L prázdný, volá funkci DLError().
**/
  if(L->First == NULL){ /* Copy op is forbidden on empty list */
      DLError(); 
      return; 
   }

  *val = L->First->data; /* if list.length > 0, copy value to specified address in mem by val */
}

void DLCopyLast (tDLList *L, int *val) {
/*
** Prostřednictvím parametru val vrátí hodnotu posledního prvku seznamu L.
** Pokud je seznam L prázdný, volá funkci DLError().
**/
  if(L->Last == NULL){ /* Copy op is forbidden on empty list */
      DLError(); 
      return; 
   }
   
  *val = L->Last->data; /* if list.length > 0, copy value to specified address in mem by val */
}

void DLDeleteFirst (tDLList *L) {
/*
** Zruší první prvek seznamu L. Pokud byl první prvek aktivní, aktivita 
** se ztrácí. Pokud byl seznam L prázdný, nic se neděje.
**/

	if(L->First == NULL) { return; }
    if(L->Act == L->First) { L->Act = NULL; }
    if(L->First == L->Last) { L->Last = NULL; }

    tDLElemPtr elem = L->First; //Save pointer to first element
    L->First = L->First->rptr; // Set second element like a first
    if(L->First != NULL){
        L->First->lptr = NULL;
    }
    free(elem); //free memory of first element, with stored pointer in elem
}

void DLDeleteLast (tDLList *L) {
/*
** Zruší poslední prvek seznamu L.
** Pokud byl poslední prvek aktivní, aktivita seznamu se ztrácí.
** Pokud byl seznam L prázdný, nic se neděje.
**/ 

	if(L->Last == NULL) { return; }
    if(L->Act == L->Last) { L->Act = NULL; }
    if(L->First == L->Last) { L->First = NULL; }

    tDLElemPtr elem = L->Last; //Save pointer to first element
    L->Last = L->Last->lptr; // Set second element like a first
    
    if(L->Last != NULL){
        L->Last->rptr = NULL;
    }

    free(elem); //free memory of first element, with stored pointer in elem

}

void DLPostDelete (tDLList *L) {
/*
** Zruší prvek seznamu L za aktivním prvkem.
** Pokud je seznam L neaktivní nebo pokud je aktivní prvek
** posledním prvkem seznamu, nic se neděje.
**/

  if(L->Act == NULL) { return; } //If actual pointer isn't set cannot be called post operation on list

  tDLElemPtr elem = L->Act->rptr; //select element after actual

  if(elem == NULL) { return; } //If actual is last in list

  L->Act->rptr = elem->rptr;    //element on Act redirect from Act+1 to Act+2 and skip Act+1 from sequence

   if(L->Act->rptr != NULL){
       L->Act->rptr->lptr = L->Act;
   } 
   else{
       L->Last = L->Act;
   }

  free(elem);
}

void DLPreDelete (tDLList *L) {
/*
** Zruší prvek před aktivním prvkem seznamu L .
** Pokud je seznam L neaktivní nebo pokud je aktivní prvek
** prvním prvkem seznamu, nic se neděje.
**/

	if(L->Act == NULL) { return; } //If actual pointer isn't set cannot be called post operation on list

    tDLElemPtr elem = L->Act->lptr; //select element after actual

    if(elem == NULL) { return; } //If actual is first in list

    L->Act->lptr = elem->lptr;    //element on Act redirect from Act+1 to Act+2 and skip Act+1 from sequence

    if(L->Act->lptr != NULL){
       L->Act->lptr->rptr = L->Act;
    } 
    else{
       L->First = L->Act;
    }

    free(elem);
}

void DLPostInsert (tDLList *L, int val) {
/*
** Vloží prvek za aktivní prvek seznamu L.
** Pokud nebyl seznam L aktivní, nic se neděje.
** V případě, že není dostatek paměti pro nový prvek při operaci malloc,
** volá funkci DLError().
**/
  if(L->Act == NULL) { return; }
  tDLElemPtr elem = malloc(sizeof(struct tDLElem));
  if(elem == NULL){ /* malloc return error */ 
      DLError();
      return;
  }

  elem->data = val; //set data to element
  
  if(L->Act->rptr != NULL){
    L->Act->rptr->lptr = elem;
  }
  else{
    L->Last = elem;
  }

  elem->lptr = L->Act;
  elem->rptr = L->Act->rptr;
  L->Act->rptr = elem;
}

void DLPreInsert (tDLList *L, int val) {
/*
** Vloží prvek před aktivní prvek seznamu L.
** Pokud nebyl seznam L aktivní, nic se neděje.
** V případě, že není dostatek paměti pro nový prvek při operaci malloc,
** volá funkci DLError().
**/
  if(L->Act == NULL) { return; }

  tDLElemPtr elem = malloc(sizeof(struct tDLElem));
  if(elem == NULL){ /* malloc return error */ 
      DLError();
      return;
  }

  elem->data = val; //set data to element
  
  if(L->Act->lptr != NULL){  
    L->Act->lptr->rptr = elem;
  }
  else{
    L->First = elem;
  }

  elem->lptr = L->Act->lptr;
  elem->rptr = L->Act;
  L->Act->lptr = elem;
}

void DLCopy (tDLList *L, int *val) {
/*
** Prostřednictvím parametru val vrátí hodnotu aktivního prvku seznamu L.
** Pokud seznam L není aktivní, volá funkci DLError ().
**/
 if(L->Act == NULL) {
     DLError();
     return;
  }
  *val = L->Act->data;
}

void DLActualize (tDLList *L, int val) {
/*
** Přepíše obsah aktivního prvku seznamu L.
** Pokud seznam L není aktivní, nedělá nic.
**/
 if(L->Act == NULL) { return; }
    L->Act->data = val;
}

void DLSucc (tDLList *L) {
/*
** Posune aktivitu na následující prvek seznamu L.
** Není-li seznam aktivní, nedělá nic.
** Všimněte si, že při aktivitě na posledním prvku se seznam stane neaktivním.
**/
  if(L->Act == NULL) { return; }
  L->Act = L->Act->rptr;
}


void DLPred (tDLList *L) {
/*
** Posune aktivitu na předchozí prvek seznamu L.
** Není-li seznam aktivní, nedělá nic.
** Všimněte si, že při aktivitě na prvním prvku se seznam stane neaktivním.
**/
  if(L->Act == NULL) { return; }
  L->Act = L->Act->lptr;
}

int DLActive (tDLList *L) {
/*
** Je-li seznam L aktivní, vrací nenulovou hodnotu, jinak vrací 0.
** Funkci je vhodné implementovat jedním příkazem return.
**/
    return L->Act != NULL;
}

/* Konec c206.c*/
