#!/bin/sh
#apk add bash openssh gnuplot git wget nodejs npm sqlite
sudo apt-get install gnuplot git wget nodejs npm sqlite
git config --global user.email "giuliano.giusti61@gmail.com"
git config --global user.name "giuliano giusti"
cd
(
echo "#!/bin/bash"
echo "cd NeuralNetwork"
echo "git pull"
echo "cd app"
echo "npm install"
echo "node base.js"
)>runserver.sh 
chmod +x runserver.sh
