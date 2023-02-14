Implementační dokumentace k 2. úloze do IPP 2020/2021
Jméno a příjmení: Pavel Šesták
Login: xsesta07

# Dokumentace interpretru v Pythonu

## Popis skriptu
Python skript určený pro interpretaci jazyka IPPcode21 ve formátu XML. Skript zkontroluje argumenty a pomocí utility find prohledá zadaný adresář.
Zkontroluje že daný test obsahuje všechny povinné soubory a nepovinné případně dogeneruje s defaultním nastavením. Podle parametrů spustí daný nástroj a porovná očekávané hodnoty s hodnotami od interpretru nebo parseru. V případě porovnávání XML souborů je použita utilita jexamxml, v ostatních případech utilita diff. Testy jsou seřazeny podle abecedy a pomocí HTMLrenderu vugenerovány na standardní výstup.

## Struktura
Hlavní soubor pro spuštění je interpret.py. Soubor dále pracuje s třídami, které jsou umístěny v adresáři ./include/interpret.

### Třída Argument
Třída argument rozdělí argument na jeho typ a hodnotu. Typ argumentu je specifikován pomocí výčtového typu ArgumentType. Třída obsahuje kontroly pro ověření, zdali se jedná o proměnou, symbol, typ. Textová hodnota je převedena na hodnotu jejího typu.

### Třída ErrorHandler
Třída obsahuje definici návratových hodnot a statickou metodu pro vypsání chyby a ukončení interpretace.

### Třída FileHandler
Třída obsluhuje práci se soubory, další části programu volají metodu getLine, která vrátí řádek daného souboru.

### Třída Instruction
Třída obsahuje informace o konkrétní instrukci. Vlastnost Opcode nese operační kód instrukce, Args je pole argumentů. Dále je evidováno pořadí instrukce a skutečný počet argumentů. Obsluha těchto vlastností je pomocí getrů a setrů z důvodů dalších kontrol jednotlivých vlastností.

### Třída xmlParser
Třída provádí pársování vstupního xml souboru. Kontroluje jednotlivé instrukce a ukládá je do instancí třídy Instruction. Pracuje s knihovnou ElementTree. Nakoncí vrací pole instrukcí, s kterými se pak pracuje v rámci třídy Interpreter.

### Třída Statistics
Třída implementující pomocné funkce pro počítání statistik. Funkce jsou volány v rámci třídy Interpreter a výpis statistik probíhá v rámci souboru interpret.py

### Třída Interpreter
Třída interpreter provádí již interpretaci jazyka IPPcode21. V rámci konstruktoru se volá xmlParser a FileHandler pro obsluhu vstupního souboru. Dále se nastaví pole instrukcí, programový čítač a slovník jednotlivých návěští, které nesou hodnotu o pozici v kódu pro skok. Poslední pomocnou proměnou je boolovská hodnota TFisCreated, která reprezentuje zda byl vytvořen dočasný rámec. Interpret dále obsahuje slovníky pro jednotlivé rámce, zásobník volání a datový zásobník. Pro jednotný přístup k symbolům a proměným je vytvořena pomocná funkce getVariable. Pro práci s proměnými jsou vytvořeny funkce getVariable a setVariable. Funkce s prefixem Interpet reprezentují interpretaci jednotlivých instrukcí, které jsou mapovány pomocí slovníku mapper. Funkce InterpretFile provede interpretaci nad daným souborem. Interpretace má dva průchody. V prvním průchodu se projdou pouze návěští a uloží se jejich pozice v kódu. Druhý průchod již provádí kompletní interpretaci.

# Dokumentace testovacího skriptu v PHP

## Popis skriptu
Skript pro testování parseru pro IPPcode21 a pro interpret, který interpretuje XML reprezentaci daného jazyka.

## Struktura
Hlavní soubor pro spuštění je test.php. Soubor dále pracuje s třídami a soubory, které jsou umístěny v adresáři ./include/test.

### CheckArguments
Třída CheckArguments obsahuje parsování argumentů příkazové řádky. Parsování využívá knihovnu getopt. Třída zastřešuje ošetření chybných vstupů a naplnění proměnných podle daných přepínačů a defaultní hodnoty daných proměnných. 

### ErrorHandler
ErrorHandler zapouzdřuje návratové konstanty a funkci pro informování o chybě

### Třída HTMLrender
Třída HTMLrender zapouzdřuje generování html reportu na standartní výstup. V rámci konstruktoru se vytvoří hlavička s potřebnými styly. Následně definuje funkce pro vygenerování progress baru, který informuje o procentuální úspěšnosti daných testů. Následně se pomocí funkce vygeneruje hlavička tabulku a pomocí funkce AddTest se naplní jednotlivými testy. V rámci destruktoru se pouze uzavřou otevřené HTML značky.

### Třída Test
Třída Test zapouzdřuje jednotlivé testy a obsahuje pouze parametrický konstruktor.
