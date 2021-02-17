# VUT FIT - IFJ Project

Implementace překladače do předmětu IFJ

### Issues

* issues [https://gitlab.com/lukasplevac/vut-fit-ifj-project/-/issues]
* boards [https://gitlab.com/lukasplevac/vut-fit-ifj-project/-/boards]

### ci/cd

při push/marge to master se provede `make build -> make test && make speedtest -> make doc`

* build     - musí projít
* test      - musí projít
* speedtest - musí projít
* doc       - **ne**musí projít

### Documentation

v adresáři `doc/`

### Makefile

* build [submission] (default)  - build celého projektu
* submission                    - vytvoří submission složku (složka pro odevzání)
* archive [submission]          - vytvoří archiv pro odevzdání
* speedtest  [build]            - provede test rychlosti
* test  [build]                 - provede všechny testy z složky tests (prerekvizita build)
* documentation                 - vytvoří doxygen dokumentaci
* clean                         - odstraní všechny dovytvořené soubory

### tests

* všechny testy uložené v `/test/units` a `/test/whole` budou spuštěny při `make test`
* test je složka s make file a targets `test` a `artifacts`
* pokud jméno testu bude končit `-` test se přeskočí
