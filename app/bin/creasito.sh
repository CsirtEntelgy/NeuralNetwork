#!/bin/bash
HTM=html
mkdir -p $HTM/page $HTM/page_dat
rm -rf $HTM/page/*
rm -rf $HTM/page_dat/*
. ./bin/sito.lib
if [ -e output/riepilogo.json ]
then
(
  printf "var dati="
  cat output/riepilogo.json 
)>html/riepilogo.js
fi
grep fileName html/riepilogo.js | cut -d : -f 2 | sed 's/"//g' |sed 's/,//g'| while read FILE
do 
  NAME="$FILE"
  echo "Rielaborazione : " $NAME
  (
  printf "var dett="
  cat output/dati/$NAME.json 
  )>$HTM/page/$NAME.js 
  
  creaPage "output/dati" "$NAME" >$HTM/page/$NAME.html 

  (
    printf "var azione="
    cat dati/azioni/$NAME.json 
  ) >$HTM/page_dat/$NAME.js

  creaPageDati "json/azioni" "$NAME"  >$HTM/page_dat/$NAME.html 
done
