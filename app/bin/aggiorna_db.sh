#!/bin/bash
if [ "$1" = "" ]
then
  sqlite3 db/borsa.db "select sigla from mappa where sigla!=''" | sed  's/.csv//g' | while read AZ
  do curl "https://query1.finance.yahoo.com/v7/finance/download/${AZ}?period1=1645778581&period2=$(date +%s)&interval=1d&events=history&includeAdjustedClose=true" --output storici/$AZ.csv
  done
fi

find storici/ -name '*.csv' |while read SIGLA
do echo "Lettura storico $SIGLA"
   S=$(basename $SIGLA .csv)
   filename=$(sqlite3 db/borsa.db "select filename from mappa where sigla='$S'")
   if [ "$filename" != "" ] 
   then
   (
     echo "create table if not exists r_azioni (data text primary key,apertura text,massimo text,minimo text, ultimoValore text, variazionePercentuale text,volume text);"
     echo "delete from r_azioni;"
     echo ".import $SIGLA r_azioni"
     echo "delete from r_azioni where data='' or data='Date';"
     echo "insert into azioni select * from r_azioni where data not in (select data from azioni);"
   )| sqlite3 -separator "," db/azioni/$filename.db
   fi
done
echo "Creazione mappa_borsa.csv"
sqlite3 db/borsa.db "select * from mappa order by azienda" >dati/mappa_borsa.csv

sqlite3 db/borsa.db "select filename from borsa order by azienda"| while read CSV 
do 
  echo "Creazione azione $CSV"
  sqlite3 -separator "," db/azioni/$CSV.db "select * from azioni where data!='Date' order by data asc" >dati/azioni/csv/$CSV.csv
done 
