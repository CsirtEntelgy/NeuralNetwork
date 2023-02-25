#!/bin/bash
mkdir -p dati/azioni/db
find storici/ -name '*.csv' |while read SIGLA
do S=$(basename $SIGLA .csv)
   azione=$(sqlite3 dati/borsa.db "select filecsv from mappa where sigla='$S'")
   N=$(basename $azione .csv)
   (
     echo "create table if not exists azioni (data text primary key,apertura text,massimo text,minimo text, ultimoValore text, variazionePercentuale text,volume text);"
     echo ".import $SIGLA azioni"
     echo "delete from azioni where data='';"
   )| sqlite3 -separator "," dati/azioni/db/$N.db
done
read -p "Invio per continuare"
sqlite3 dati/borsa.db "select filecsv from mappa" | while read azione
do     N=$(basename $azione .csv) 
	(
        echo "create table if not exists azioni (data text primary key,apertura text,massimo text,minimo text, ultimoValore text, variazionePercentuale text,volume text);"
	echo ".import $azione azioni" 
	echo "delete from azioni where data='';" 
	)| sqlite3 -separator ";" dati/azioni/db/$N.db 
done
