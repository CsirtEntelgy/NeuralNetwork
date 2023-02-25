#!/bin/bash
docker build -t nn  app
docker stop NN
docker image prune -f
docker container prune -f
docker run -t --name=NN --rm -v $PWD/app/dati:/home/node/app/dati -v $PWD/app/html:/home/node/app/html -v $PWD/app/output:/home/node/app/output nn bin/run.sh
#docker run -d --name=NN --rm -v $PWD/app/dati:/home/node/app/dati -v $PWD/app/html:/home/node/app/html -v $PWD/app/output:/home/node/app/output nn bin/run-2.sh
#docker run -t --name=NN --rm  nn 
#docker cp NN:/home/node/app/html.tgz html.tgz
#docker rm NN
