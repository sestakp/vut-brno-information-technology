
/* ************************ s016-test.c **************************** */
/*
#include "symtable.h"

#include <stdio.h>
#include <math.h>
#include <stdlib.h>

symtable_T* table;

/* tiskne tData ze struktury *//*
void htPrintData ( char* variable_name ) {
	if (variable_name)
		fprintf(stderr,"%s\n", variable_name );
	else
		fprintf(stderr,"NULL\n");
}

/* tiskne tItem ze struktury *//*
void htPrintItem ( symtable_itemptr ptritem ) {
	if (ptritem)
		fprintf(stderr,"(%s)\n", ptritem->variable_name/*, ptritem->data *//*);
	else
		fprintf(stderr,"NULL\n");
}

/* tiskne celou tabulku *//*
void htPrintTable(symtable_T *table) {
	int maxlen = 0;
	int sumcnt = 0;
	
	fprintf(stderr,"------------HASH TABLE--------------\n");
	for(int i = 0; i < SYM_MAX_SCOPE; i++){
		for(int j = 0; j < SYM_TOP_ITEMS;j++){

		}
	}
	
	
	for ( int i=0; i<SYM_TOP_ITEMS; i++ ) {
		fprintf(stderr,"%i:",i);
		int cnt = 0;
		symtable_itemptr ptr = table->itemArr[i];
		while ( ptr != NULL ) {
			fprintf(stderr," (%s)",ptr->variable_name/*,ptr->data*//*);
			cnt++;
			ptr = ptr->next;
		}
		fprintf(stderr,"\n");
	
		if (cnt > maxlen)
			maxlen = cnt;
		sumcnt+=cnt;
	}
	
	fprintf(stderr,"------------------------------------\n");
	fprintf(stderr,"Items count %i   The longest list %i\n",sumcnt,maxlen);
	fprintf(stderr,"------------------------------------\n");
}

/* vola funkci htInit a v pripade ze neni resena tiskne chybu */
/*void use_init ( symtable_T *table ) {
	//symtable_ctor(table);
}

/* vola funkci htSearch a tiskne vysledek,
 v pripade ze neni resena tiskne chybu */
/*void use_search( symtable_T *table,char* key) {
	//symtable_itemptr ptritem = symtable_search(table,key);
	//htPrintItem ( ptritem );
}

/* vola funkci htInsert a v pripade ze neni resena tiskne chybu */
/*void use_insert ( symtable_T* table, char* key/*, tData data*/// ) {
	//symtable_insert(table, key,true/*, data*/);
//}


/* vola funkci htRead a tiskne vysledek,
 v pripade ze neni resena tiskne chybu */
/*void use_read(symtable_T *table, char *key){
	symtable_itemptr ptrdata = htRead ( table, key );
	htPrintData (ptrdata);
}*/

/* vola funkci symtable_delete a v pripade ze neni resena tiskne chybu */
/*void use_delete ( symtable_T *table, char *key){
	//symtable_delete(table,key);
}

/* vola funkci htClearAll a v pripade ze neni resena tiskne chybu */
/*void use_clear_all(symtable_T *table){
	//symtable_dtor(table);
}

/* Hlavni funkce pro testovani */
int main(int argc, char* argv[] ) {
/*	table = (symtable_T*) malloc(sizeof(symtable_T));

/********************* SCRIPT START ******************************************/
/*	fprintf(stderr,"Hash Table - testing script\n");

	fprintf(stderr,"\n[TEST01] Table initialization\n");
	use_init (table );
	htPrintTable(table);

	fprintf(stderr,"\n[TEST02] Let's try htInsert()\n");
	use_insert ( table, "krusovice");
	htPrintTable(table);

	fprintf(stderr,"\n[TEST03] Search for existing item\n");
	use_search (table,"krusovice");

	fprintf(stderr,"\n[TEST04] Let's insert next items\n");
	use_insert ( table, "korgon");
	use_insert ( table, "zlaty bazant");
	use_insert ( table, "gambrinus");
	use_insert ( table, "starobrno");
	use_insert ( table, "plzen");
	use_insert ( table, "velvet");
	use_insert ( table, "kelt");
	use_insert ( table, "kofola");
	htPrintTable(table);

	fprintf(stderr,"\n[TEST05] htSearch for \"starobrno\"\n");
	use_search ( table, "starobrno" );
	htPrintTable(table);

	/*fprintf ("\n[TEST06] Let's change korgon price to 12.50\n");
	use_insert ( table, "korgon");
	use_search ( table, "korgon");
	htPrintTable(table);
	*/
	
/*	fprintf(stderr,"\n[TEST07] Is \"starobahno\" in table?\n");
	use_search ( table, "starobahno" );
	htPrintTable(table);

	//fprintf ("\n[TEST08] How much is korgon?\n");
	//use_read ( table, "korgon" );

	fprintf(stderr,"\n[TEST09] Lets delete gambrinus and kofola\n");
	use_delete( table, "gambrinus" );
	use_delete( table, "kofola" );
	htPrintTable ( table );

	fprintf(stderr,"\n[TEST10] Let's delete whole table\n");
	use_clear_all ( table );
	htPrintTable ( table );

	fprintf(stderr,"\n[TEST11] And search for non-existing velvet\n");
	use_search ( table, "velvet" );
	htPrintTable(table);

	fprintf(stderr,"\n[TEST12] And insert velvet again\n");
	use_insert ( table, "velvet");
	htPrintTable(table);
	use_delete( table, "velvet" );

	free ( table );
*/	
	return 0;	
}
