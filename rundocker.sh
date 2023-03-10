#!/bin/bash
docker build -t nn  app
docker stop NN
docker image prune -f
docker container prune -f
docker run -t --name=NN --rm -v $PWD/app/db:/home/node/app/db -v $PWD/app/dati:/home/node/app/dati -v $PWD/app/html:/home/node/app/html -v $PWD/app/output:/home/node/app/output nn bin/run.sh
./sync.sh
set -e
for i in 1 2 3 4 5 6 7 8 9 10
do
docker run -t --name=NN --rm -v $PWD/app/db:/home/node/app/db -v $PWD/app/dati:/home/node/app/dati -v $PWD/app/html:/home/node/app/html -v $PWD/app/output:/home/node/app/output nn bin/run-2.sh
./sync.sh
done
#docker run -t --name=NN --rm  nn 
#docker cp NN:/home/node/app/html.tgz html.tgz
#docker rm NN
