#!/bin/bash
npm install
node src/impara-db.js 10 2022-31-12
for CHIAVE in ultimoValore variazionePercentuale
do for ID_AZIENDA in {1..3000}
   do if [ -e dati/elaborazioni/elab.${CHIAVE}.$ID_AZIENDA.dat ]
      then
      (
        echo "delete from iterazioni where ID_AZIENDA=$ID_AZIENDA and chiave='$CHIAVE';" 
        echo ".import dati/elaborazioni/elab.${CHIAVE}.$ID_AZIENDA.dat iterazioni"
      ) |sqlite3 db/elaborazioni.db
      rm  dati/elaborazioni/elab.${CHIAVE}.$ID_AZIENDA.dat
      fi
    done
done
