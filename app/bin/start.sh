#!/bin/bash
. bin/nn.lib
rm -rf $WD_DB/

mkdir -p ${WD_DB}

cat bin/borsa.sql | sqlite3 $DB
DB_RETI=$WD_DB/reti.db
(
echo "CREATE TABLE nn (id_azienda integer, chiave text,n1 integer, n2 integer, n3 integer, jsonData Text,primary key (id_azienda,chiave,n1,n2,n3));"
) | sqlite3 $DB_RETI
DB_ELAB=$WD_DB/elaborazioni.db
(
echo "CREATE TABLE iterazioni (id_azienda integer,chiave text,iter integer,errore number);"
) | sqlite3 $DB_ELAB
set -e
aggiornaDB

