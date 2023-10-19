Pokud je požadováno přemístění nákladu z jednoho místa do druhého, vozík si materiál vyzvedne do 1 minuty.
- DANGLING_ELSE, není specifikováno co se stane, když není požadováno přemístění nákladu.
- UNSPECIFIED_SUBJECT, v textu se dále pracuje s pojmem materiál, sjednotil bych tedy označení na materiál
*Pokud je požadováno přemístění materiálu z jednoho místa do druhého, vozík si materiál vyzvedne do 1 minuty. Pokud není požadováno přemístění materiálu, tak je vozík zaparkován.*

Pokud se to nestihne, materiálu se nastavuje prioritní vlastnost.
- UNSPECIFIED_SUBJECT věta bez kontextu není sama o sobě pochopytelná.
*Pokud vozík nestihne vyzvednout materiál do 1 minuty, materiálu se nastavuje prioritní vlastnost.*

Každý prioritní materiál musí být vyzvednutý vozíkem  1 minuty od nastavení prioritního požadavku.
- DANGLING_ELSE, není specifikováno co se stane, když není do té jedné minuty vyzvednut.
- UNSPECIFIED_SUBJECT prioritní materiál není v předchozím textu nikde definován.
*Každý materiál s prioritní vlastností musí být vyzvednutý vozíkem do 1 minuty od nastavení prioritního požadavku. V případě, že se nepovede prioritní materiál do jedné minuty vyzvednout, tak se zaloguje chyba o pozdním vyzvednutí materiálu.*

Pokud vozík nakládá prioritní materiál, přepíná se do režimu pouze-vykládka.
- OMISSION, je definován režim vozíku, nicméně není definováno chování vozíku v tomto režimu
- DANGLING_ELSE, není specifikován standardní režim a co se děje pokud nakládá materiál bez prioritní vlastnosti.
- UNSPECIFIED_SUBJECT prioritní materiál není v předchozím textu nikde definován.
*Pokud vozík nakládá materiál s prioritní vlastností tak se přepíná z režimu nakládka-vykládka do režimu pouze-vykládka. Pokud vozík nakládá materiál bez prioritní vlastnosti, tak zůstává v režimu nakládka-vykládka. Vozík v režimu pouze-vykládka již nenakládá další materiál a pouze doručí naložený materiál.*

V tomto režimu zůstává, dokud nevyloží všechen takový materiál.
- AMB_REFERENCE, asi bych místo takový materiál explicitně jmenoval kategorii.
- AMB_REFERENCE, asi bych místo v tomto režimu explicitně jmenoval režim.
*V režimu pouze-vykládka vozík zůstává, dokud nevyloží všechen prioritní materiál. Následně se přepne zpět do režimu nakládka-vykládka.*

Normálně vozík během své jízdy může nabírat a vykládat další materiály v jiných zastávkách.
- AMB_REFERENCE, není definované co to znamená normálně.
- UNSPECIFIED_SUBJECT, v textu se doteď pracovalo s pojmem vyzvednout ne nabírat
*V případě, že je vozík v režimu nakládka-vykládka, tak během své jízdy může vyzvedávat a vykládat další materiály v jiných zastávkách.*

Na jednom místě může vozík akceptovat nebo vyložit jeden i více materiálů.
- OMISSION, Není specifikováno co se má stát potom co vozík materiál akceptuje.
- UNSPECIFIED_SUBJECT, nekonzistence mezi slovem akceptování a vyzvednutí
*Na jednom místě může vozík vyzvednout nebo vyložit jeden i více materiálů. Pokud vozík materiál vyzvedne, tak ho vozík naloží.*

Vozík neakceptuje materiál, pokud jsou všechny jeho sloty obsazené nebo by jeho převzetím byla překročena maximální nosnost.
- OTHER, negace
- UNSPECIFIED_SUBJECT, nekonzistence mezi slovem převzetí a vyzvednutí
*Vozík může vyzvednout materiál, pokud je nějaký jeho slot volný a jeho vyzvednutím není překročena maximální nosnost.*


# Výsledná specifikace po Ambient review

Pokud je požadováno přemístění materiálu z jednoho místa do druhého, vozík si materiál vyzvedne do 1 minuty. Pokud není požadováno řemístění materiálu, tak je vozík zaparkován. Pokud vozík nestihne vyzvednout materiál do 1 minuty, materiálu se nastavuje prioritní vlastnost. Každý materiál s prioritní vlastností musí být vyzvednutý vozíkem do 1 minuty od nastavení prioritního požadavku. V případě, že se nepovede prioritní materiál do jedné minuty vyzvednout, tak se zaloguje chyba o pozdním vyzvednutí materiálu. Pokud vozík nakládá materiál s prioritní vlastností tak se přepíná z režimu nakládka-vykládka do režimu pouze-vykládka. Pokud vozík nakládá materiál bez prioritní vlastnosti, tak zůstává v režimu nakládka-vykládka. Vozík v režimu pouze-vykládka již nenakládá další materiál a pouze doručí naložený materiál. V režimu pouze-vykládka vozík zůstává, dokud nevyloží všechen prioritní materiál. Následně se přepne zpět do režimu nakládka-vykládka. V případě, že je vozík v režimu nakládka-vykládka, tak během své jízdy může vyzvedávat a vykládat další materiály v jiných zastávkách. Na jednom místě může vozík vyzvednout nebo vyložit jeden i více materiálů. Pokud vozík materiál vyzvedne, tak ho vozík naloží. Pořadí vyzvednutí materiálů nesouvisí s pořadím vytváření požadavků. Vozík může vyzvednout materiál, pokud je nějaký jeho slot volný a jeho vyzvednutím není překročena maximální nosnost.
