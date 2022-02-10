(function() { 'use strict';

const drawCanvas = new DrawCanvas(document.getElementById('canvas'), run_network);
let NeuralNet = null;


fetch('https://manusoman.github.io/digit-recognizer/network_matrix.json')
.then(data => data.json())
.then(matrices => {
    NeuralNet = new FFNetwork(matrices);
    removeLoader();
    drawCanvas.updateCanvasPosition();
})
.catch(console.error);



const LOADER = document.getElementById('loader'),
    MAIN = document.getElementById('main'),
    RESULT = document.getElementById('result'),
    CLEAR_BUTTON = document.getElementById('clear');



function FFNetwork(matrix) {
    this.weights = matrix.wMatrix;
    this.biases = matrix.bMatrix;
};

FFNetwork.prototype = {
    constructor : FFNetwork,

    applyInput : function(activations) {
        const l = this.weights.length;

        for(let i = 0; i < l; i++) {
            const w = this.weights[i],
                b = this.biases[i],
                wl = w.length,
                layerOutput = [];

            for(let wi = 0; wi < wl; wi++) {
                const tmp = math.dot(w[wi], activations) + b[wi];
                layerOutput.push(1 / (1 + math.exp(-tmp)));
            }

            activations = layerOutput;
        }

        return activations;
    }
};



function run_network(imgData) {
    const res = NeuralNet.applyInput(imgData),
        val = getLNindex(res);

    RESULT.innerHTML = val;
    RESULT.classList.remove('off');
    console.log('answer: ', val);
}


function getLNindex(a) {
    const l = a.length;
    let index = 0,
        n = a[0];

    for(let i = 1; i < l; i++) {
        if(a[i] > n) {
            n = a[i];
            index = i;
        }
    }

    return index;
}
    
function removeLoader() {
    LOADER.classList.add('off');
    MAIN.classList.remove('off');
}

CLEAR_BUTTON.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    RESULT.classList.add('off');
    RESULT.innerHTML = '_';
    drawCanvas.clear();
}, true);


})();