#!/bin/bash
CD=$(dirname $BASH_SOURCE)
. $CD/sito.lib
bin/aggiorna_db.sh
node js/csv2json.js

