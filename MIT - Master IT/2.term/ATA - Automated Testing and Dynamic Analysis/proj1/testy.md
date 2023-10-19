
# Testy pro pokrytí uzlů z CEG

| description                                                                  | 1. test | 2. test | 3. test | 4. test |
| ---------------------------------------------------------------------------- | ------- | ------- | ------- | ------- |
| 1. Požadováno přemístění materiálu bez prioritní vlastnosti                  | 1       | 0       | 1       | 1       |
| 2. Méně jak 1 minuta od požadavku přemístění materiálu                       | 1       | 0       | 1       | 1       |
| 3. Vozík má minimálně jeden volný slot                                       | 1       | 1       | 1       | 0       |
| 4. Vozík vyzvednutím materiálu nepřekročí svoji maximální nosnost            | 1       | 1       | 1       | 0       |
| 5. Vozík vyzvedne neprioritní materiál do jedné minuty                       | 1       | 0       | 0       | 0       |
| 6. více nebo rovno jak 1 minuta od požadavku přemístění materiálu            | 0       | 0       | 1       | 1       |
| 7. Nastavení prioritní vlastnosti materiálu                                  | 0       | 0       | 1       | 1       |
| 8. Méně jak 1 minuta od nastavení prioritní vlastnosti materiálu             | 0       | 0       | 1       | 1       |
| 9. více nebo rovno jak 1 minuta od nastavení prioritní vlastnosti materiálu  | 0       | 0       | 1       | 1       |
| 10. Vozík vyzvedne prioritního materiál                                      | 0       | 0       | 1       | 0       |
| 71. Naložení neprioritního materiálu                                         | true    | false   | false   | false   |
| 72. Nastavení prioritní vlastnosti                                           | false   | false   | true    | true    |
| 73. Vozík naloží prioritní materiál                                          | false   | false   | true    | false   |
| 74. Zalogování chyby                                                         | false   | false   | true    | true    |
| 75. Vozík nemůže nakládat další materiál, pouze vykládat naložený            | false   | false   | true    | false   |
| 76. Vozík se přepne do režimu pouze vykládka                                 | false   | false   | true    | false   |




# Vstupní parametry pro kombinatorické testování

| parametr                | popis parametru                                                 |
| ----------------------- | --------------------------------------------------------------- |
| number_of_relocations   | Naplánovaný počet materiálů k přemístění                        |
| total_weight_materials  | Součet vah všech materiálů, které je potřeba přemístit          |
| cart_slots              | Celkový počet slotů na daném vozíku                             |
| cart_limit              | Maximální nosnost vozíku                                        |
| total_priority          | Počet prioritních materiálů                                     |
| cart_stops              | Počet zastávek na trase vozíku                                  |
| multi_relocations       | Vznik více plánů pro přemístění materiálu                       |
| trace_length            | Počet zastávek mezi zastávkou pro nakládku a vykládku materiálu |

# Rozklad vstupních domén

| cart_slots | Počet slotů vozíku |
| ---------- | ------------------ |
| 1          | 1                  |
| 2          | 2                  |
| 3          | 3 to 4             |

| cart_limit | Maximální nosnost vozíku |
| ---------- | ------------------------ |
| 1          | cart_limit = 50          |
| 2          | cart_limit = 150         |
| 3          | cart_limit = 500         |

| total_weight_materials | Nosnost vozíku je menší než součet vah materiálů, které je potřeba převést |
| ---------------------- | -------------------------------------------------------------------------- |
| 1                      | true                                                                       |
| 2                      | false                                                                      |

| total_priority | Počet prioritních materiálů |
| -------------- | --------------------------- |
| 1              | total_priority = 0          |
| 2              | total_priority > 0          |


| number_of_relocations | Počet naplánovaných přemístění |
| --------------------- | ------------------------------ |
| 1                     | number_of_relocations = 0      |
| 2                     | number_of_relocations > 0      |


| trace_length           | Počet zastávek mezi zastávkou pro nakládku a vykládku materiálu |
| ---------------------- | --------------------------------------------------------------- |
| 1                      | trace_length = 0                                                |
| 2                      | trace_length > 0                                                |



# Omezující podmínky pro kombinace

cart_limit.1 -> !cart_slots.1
cart_limit.3 -> !cart_slots.3
total_priority.2 -> !number_of_relocations.1
total_weight_materials.1 -> !number_of_relocations.1

Poznámka: jak je vidět tak poslední podmínka není splněna v posledním případě a proto bude tento případ ignorován, bohužel jsem nepřišel na to, kde je chyba a proč nástroj combine.testos.org tuto podmínku ignoruje.

# Výsledek kombinatorického testování

| cart_slots | cart_limit | total_weight_materials | total_priority | number_of_relocations | trace_length |
|------------|------------|------------------------|----------------|-----------------------|--------------|
| 1          | 150        | true                   | 0              | 1                     | 0            |
| 1          | 500        | false                  | 1              | 1                     | 1            |
| 2          | 50         | true                   | 1              | 1                     | 0            |
| 2          | 150        | false                  | 0              | 0                     | 1            |
| 2          | 500        | true                   | 0              | 1                     | 0            |
| 3 to 4     | 50         | false                  | 0              | 0                     | 0            |
| 3 to 4     | 150        | true                   | 1              | 1                     | 1            |
| 1          | 500        | false                  | 0              | 0                     | 0            |
| 2          | 50         | true                   | 0              | 0                     | 1            |