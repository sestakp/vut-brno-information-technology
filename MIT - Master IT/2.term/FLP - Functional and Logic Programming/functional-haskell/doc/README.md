ECDSA je algoritmus pouzivany v digitalnim podpisum.
Projekt implementuje ECDSA algoritmus ve funkcionalnim jazyce Haskell. Kod by mel byt dostatecne
komentovan, jelikoz sam s touto problematikou zkusenosti nemam a psal jsem si ji hlavne pro sebe a budouci cerpani z tohoto projektu.
Aplikace ocekava na vstupu prepinace a nasledne struktury, v zavislosti na zadanych prepinacich.
Prepinace:
    -i  Vypise informace o zadane krivce na stdout
    -k  Pro zadanou krivku vygeneruje verejny a soukromy klic, ktery muze byt pouzit pro podepsani zpravy
    -s  Pro zadanou krivku, klic a hash vygeneruje podpis
    -v  Pro zadanou krivku, verejny klic, podpis a hash overi validitu podpisu.
Ukazka jednotlivych struktur, ktere je nutne predat programu jsou v prilozenych testech ve slozce /test.

V pripade, ze uzivatel zadava vstup ze stdinu, musi poslat prazdny radek aby se zadavani ukoncilo.
Testy jsou brany spise jako ukazka vstupu v souborech .in. Soubory .out nejde nejak rozumne pouzit,
jelikoz se generuji nahodne cisla a program diky specifikaci vstupu (Key vs PublicKey) nejde pipovat za sebe ./flp-22 -k | ./flp-22 -s | ./flp-22 -v.

Implementováno by mělo být zadání v plném rozsahu, tedy generování klíčů, podepsání zprávy a ověření podpisu. 
Aplikace byla otestována na sekvenci vygenerovat klíč, podepsat zprávu a následné ověření. V případě úpravy hashe nebo klíče, již verify vrací False. Testovani probehlo i na referenecnim stroji Merlin, kde jsem zabalil pomoci Makefile projekt k odevzdani, presunul do prazdne slozky a rozbalil. Prosli vsechny prepinace, kde se povedlo podepsat a overit zpravu. Vstup byl zadan i rucne ze stdin.

Aplikaci se mi nepodařilo přeložit s nástrojem ghc, jelikož si stěžoval na chybějící knihovnu Random, která ovšem v systému byla nainstalovaná. Proto pro lokální vývoj byl zvolen cabal, který byl doporučován na cvičení předmětu FLP.

Cabal bohužel není nainstalován na referenčním stroji Merlin, takže pro překlad na Merlinovi byl zprovozněn Makefile, který využívá ghc překladač.





