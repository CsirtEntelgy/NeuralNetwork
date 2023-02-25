#!/bin/bash
sqlite3 dati/borsa.db "select sigla from mappa where sigla!=''" | sed  's/.csv//g' | while read AZ
do curl "https://query1.finance.yahoo.com/v7/finance/download/${AZ}?period1=1645778581&period2=$(date +%s)&interval=1d&events=history&includeAdjustedClose=true" --output storici/$AZ.csv
done
find storici/ -name '*.csv' |while read SIGLA
do 
   S=$(basename $SIGLA .csv)
   azione=$(sqlite3 dati/borsa.db "select filecsv from mappa where sigla='$S'")
   if [ "$azione" != "" ] 
   then
   N=$(basename "$azione" .csv)
   (
     echo "create table if not exists r_azioni (data text primary key,apertura text,massimo text,minimo text, ultimoValore text, variazionePercentuale text,volume text);"
     echo "delete from r_azioni;"
     echo ".import $SIGLA r_azioni"
     echo "delete from r_azioni where data='';"
     echo "insert into azioni select * from r_azioni where data not in (select data from azioni);"
   )| sqlite3 -separator "," dati/azioni/db/$N.db
   fi
done
sqlite3 dati/borsa.db "select * from mappa order by azienda" >dati/mappa_borsa.csv
