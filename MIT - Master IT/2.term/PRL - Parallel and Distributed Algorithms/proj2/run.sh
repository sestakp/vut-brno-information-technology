#!/bin/bash

#pocet cisel bud zadam nebo 10 :)
if [ $# -lt 1 ];then 
    numbers=32;
else
    numbers=$1;
fi;

#preklad cpp zdrojaku
mpic++ -g --prefix /usr/local/share/OpenMPI -o parkmeans parkmeans.c


#vyrobeni souboru s random cisly
dd if=/dev/random bs=1 count=$numbers of=numbers

#spusteni
mpirun --prefix /usr/local/share/OpenMPI -np $numbers --oversubscribe parkmeans

#uklid
rm -f oems numbers
