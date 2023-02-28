#!/bin/bash
. bin/nn.lib
rm -rf $WD_DB/

mkdir -p ${WD_DB}

cat bin/borsa.sql | sqlite3 $DB
cat bin/dati.sql | sqlite3 $DB
DB_RETI=$WD_DB/reti.db
(
echo "CREATE TABLE nn (ID_AZIENDA integer, chiave text,n1 integer, n2 integer, n3 integer, jsonData Text,primary key (ID_AZIENDA,chiave,n1,n2,n3));"
) | sqlite3 $DB_RETI
DB_ELAB=$WD_DB/elaborazioni.db
(
echo "CREATE TABLE iterazioni (ID_AZIENDA integer,chiave text,iter integer,errore number,primary key (ID_AZIENDA,chiave));"
) | sqlite3 $DB_ELAB

aggiornaDB

