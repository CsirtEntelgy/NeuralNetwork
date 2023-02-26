

const { matrix, round, pow, exp, random, multiply, dotMultiply, mean, abs, subtract, transpose, add } = require('mathjs');
const fs = require('fs');

class NeuralNetwork {
    /*    input_nodes;
        hidden_nodes;
        output_nodes;
        epochs;
        lr;
        output;
        epsilon;
        synapse0;
        synapse;
    */
    constructor(n1, n2, n3) {
        this.input_nodes = n1; //number of input neurons
        this.hidden_nodes = n2; //number of hidden neurons
        this.output_nodes = n3; //number of output neurons
        this.epochs = 5000;
        this.lr = .5; //learning rate
        this.output = 0;
        this.epsilon = 0.01; // 
        this.synapse0 = random([this.input_nodes, this.hidden_nodes], -1.0, 1.0); //connections from input layer to hiden
        this.synapse1 = random([this.hidden_nodes, this.output_nodes], -1.0, 1.0); //connections from hidden layer to output
    }
    toString() {
        return `${this.input_nodes}x${this.hidden_nodes}x${this.output_nodes} ${this.synapse0.length} ${this.synapse1.length}`;
    }
    load(filename) {
        try {
            var nn = JSON.parse(fs.readFileSync(filename));
            this.input_nodes = nn.input_nodes;
            this.hidden_nodes = nn.hidden_nodes;
            this.output_nodes = nn.output_nodes
            this.epochs = nn.epochs;
            this.lr = nn.lr;
            this.output = 0;
            this.epsilon = nn.epsilon;
            this.synapse0 = nn.synapse0;
            this.synapse1 = nn.synapse1;
        } catch (error) {
            //console.log(error);
        }
    }
    stringify() {
        var nn = {};
        nn.input_nodes = this.input_nodes;
        nn.hidden_nodes = this.hidden_nodes;
        nn.output_nodes = this.output_nodes
        nn.epochs = this.epochs;
        nn.lr = this.lr;
        nn.output = 0;
        nn.epsilon = this.epsilon;
        nn.synapse0 = this.synapse0;
        nn.synapse1 = this.synapse1;
        if (this.synapse0._data)
            nn.synapse0 = this.synapse0._data;
        else nn.synapse0 = this.synapse0;
        if (this.synapse0._data)
            nn.synapse1 = this.synapse1._data;
        else nn.synapse1 = this.synapse1;
        return nn;
    }
    save(filename) {
        var nn = {};
        nn.input_nodes = this.input_nodes;
        nn.hidden_nodes = this.hidden_nodes;
        nn.output_nodes = this.output_nodes
        nn.epochs = this.epochs;
        nn.lr = this.lr;
        nn.output = 0;
        nn.epsilon = this.epsilon;
        if (this.synapse0._data)
            nn.synapse0 = this.synapse0._data;
        else nn.synapse0 = this.synapse0;
        if (this.synapse0._data)
            nn.synapse1 = this.synapse1._data;
        else nn.synapse1 = this.synapse1;
        fs.writeFileSync(filename, JSON.stringify(nn, null, " "));
    }
    train(input, target, maxEpochs = 10, cb) {
        var realInput = matrix(input);
        var realOutput = matrix(target);
        var output_error;
        var epoca = 1;
        do {
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
                this.synapse1 = add(this.synapse1, multiply(transpose(hidden_layer), multiply(output_delta, this.lr)));
                this.synapse0 = add(this.synapse0, multiply(transpose(input_layer), multiply(hidden_delta, this.lr)));
                this.output = output_layer._data;
                cb(this, i, output_error, epoca);
            }
            cb(this, this.epochs, output_error, epoca);
            if (mean(abs(output_error)) < this.epsilon) return;
            epoca++;
        } while (--maxEpochs > 0);
    }

    activation(x, derivative) {
        let fx = 1 / (1 + exp(-x));
        if (derivative)
            return fx * (1 - fx);
        return fx;
    }

    predict(input) {
        var realInput = matrix(input);
        let input_layer = realInput;
        let hidden_layer = multiply(input_layer, this.synapse0).map(v => this.activation(v, false));
        let output_layer = multiply(hidden_layer, this.synapse1).map(v => this.activation(v, false));
        return output_layer._data;
    }

}



module.exports = { NeuralNetwork: NeuralNetwork }
