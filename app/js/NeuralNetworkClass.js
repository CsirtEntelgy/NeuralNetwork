

const { round, pow, exp, random, multiply, dotMultiply, mean, abs, subtract, transpose, add } = require('mathjs');
const fs = require('fs');
const {pattern, fromArray, toArray}=require("./realtoarray.js");
class NeuralNetwork {
    constructor({ filename = null, nInput = 1, nHidden = 2, nOutput = 3 , mode=0,epochs=1000,learningRate=0.5}) {
        try {
            if (filename) {
                this.load(filename);
            } else {
                this.mode=mode;
                this.input_nodes = nInput; //number of input neurons
                this.hidden_nodes = nHidden; //number of hidden neurons
                this.output_nodes = nOutput; //number of output neurons
                this.epochs = epochs;
                this.learningRate = learningRate;
                this.output = 0;
                this.epsilon = 0.01; // 
                this.synapse0 = random([this.input_nodes, this.hidden_nodes], -1.0, 1.0); //connections from input layer to hiden
                this.synapse1 = random([this.hidden_nodes, this.output_nodes], -1.0, 1.0); //connections from hidden layer to output
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    load(filename) {
        var nn = JSON.parse(fs.readFileSync(filename));
        Object.assign(this, nn);
    }
    save(filename) {
        var nn = {};
        Object.assign(nn,this);
        if (this.synapse0._data)
            nn.synapse0 = this.synapse0._data;
        if (this.synapse0._data)
            nn.synapse1 = this.synapse1._data;
        fs.writeFileSync(filename, JSON.stringify(nn, null, " "));
    }
    train(input, target, cb) {
        console.log("Tipo input",typeof input._data,typeof input._data[0]);
        var realInput=input;
        if(typeof typeof input[0] === "number"){
            realInput=input.map(el => toArray(el,this.input_nodes));   
        }
        var realOutput=target;
        if(typeof typeof target[0] === "number"){
            realOutput=matrix(target.map(el => toArray(el,this.output_nodes)));   
        }else{
            realOutput=matrix(target);
        }
        var output_error;
       
            for (let i = 0; i < this.epochs; i++) {
                //forward
                let input_layer = realInput; //input data
                let hidden_layer = multiply(input_layer, this.synapse0).map(v => this.activation(v, false)); //output of hidden layer neurons (matrix!)
                let output_layer = multiply(hidden_layer, this.synapse1).map(v => this.activation(v, false)); // output of last layer neurons (matrix!)

                //backward
                output_error = subtract(realOutput, output_layer); //calculating error (matrix!)       
                let output_delta = dotMultiply(output_error, output_layer.map(v => this.activation(v, true))); //calculating delta (vector!)
                let hidden_error = multiply(output_delta, transpose(this.synapse1)); //calculating of error of hidden layer neurons (matrix!)
                let hidden_delta = dotMultiply(hidden_error, hidden_layer.map(v => this.activation(v, true))); //calculating delta (vector!)

                //gradient descent
                this.synapse1 = add(this.synapse1, multiply(transpose(hidden_layer), multiply(output_delta, this.learningRate)));
                this.synapse0 = add(this.synapse0, multiply(transpose(input_layer), multiply(hidden_delta, this.learningRate)));
                this.output = output_layer._data;
                if (cb) cb(this, i, output_error, maxEpochs);
            }
            
       
    }

    activation(x, derivative) {
        let fx = 1 / (1 + exp(-x));
        if (derivative)
            return fx * (1 - fx);
        return fx;
    }

    predict(input) {
        var realInput=input;
        if(typeof typeof input[0] === "number"){
            realInput=input.map(el => toArray(el,this.input_nodes));   
        }
        let input_layer = realInput;
        let hidden_layer = multiply(input_layer, this.synapse0).map(v => this.activation(v, false));
        let output_layer = multiply(hidden_layer, this.synapse1).map(v => this.activation(v, false));
        return output_layer._data.map(el=>fromArray(el));
    }

}



module.exports = { NeuralNetwork: NeuralNetwork }