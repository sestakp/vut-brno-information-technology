Implementační dokumentace k 1. úloze do IPP 2020/2021
Jméno a příjmení: Pavel Šesták
Login: xsesta07

# Dokumentace Parseru v PHP

## Popis skriptu

PHP skript určený pro překlad z jazyka IPPcode21 do XML reprezentace daného jazyka pro další interpretaci. Součástí překladu je lexikální a syntaktická analýza.

## Struktura

Hlavní soubor pro spuštění je parse.php. Soubor dále pracuje s třídami, které jsou umístěny v adresáři ./include/parser.

### Třída Argument
Reprezentuje argument instrukce, rozdělí argument na jeho typ a hodnotu.

### Třída Instruction
Reprezentuje jednotlivé instrukce, skládá se z operačního kódu, délky instrukce a až tří argumentů.

### Třída XMLGenerator
Třída zapouzdřuje práci s knihovnou XMLWriter a slouží pro generování výstupu programu.

### Třída Parser
Parser realizuje analýzu zdrojového kódu. Zdrojový kód ze standartního vstupu je čten po řádcích. Pomocí regulárního výrazu jsou odfiltrovány komentáře, netisknutelné znaky a je vytvořena instance třídy Instruction. 
Podle operačního kódu je provedena lexikální a sémantická kontrola. Pro kontrolu zda se jedna o očekávaný token jsou implementovány funkce isVar, isSymb a isLabel, které kontrolují náležitosti pomocí regulárních výrazů. Instrukce jsou rozděleny do skupin podle počtu a typu argumentů. V případě úspěšných kontrol je vygenerován výstup v XML formátu na standartní výstup.

## Rozšíření

### STATP
Statistické rozšíření bylo implementováno pomocí pole čítačů. Při zpracování argumentů se vytvoří pole souborů a dvoudimenzionální pole přepínačů, kde ke každému souboru pro statistiky je přiřazeno právě jedno jednodimenzionální pole. V průběhu zpracovávání vstupního souboru, jsou inkrementovány jednotlivé čítače. Z důvodu identifikace kategorie jednotlivých skoků je evidováno pole skoků a pole návěští. V průběhu překladu se skok na neexistující návěští započítá jako dopředný skok a na konci je třeba provést korekturu. Po úspěšném překladu se otevřou soubory pro statistiky s argumenty. Přes asociativní pole se adresuje do pole čítačů a tiskne se jednotlivý čítač.