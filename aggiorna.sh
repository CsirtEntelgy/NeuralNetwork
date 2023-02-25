#!/bin/bash
CD=$(dirname $BASH_SOURCE)
cd $CD
./rundocker.sh 
./sync.sh
