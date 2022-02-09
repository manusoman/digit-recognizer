(function() { 'use strict';

const drawCanvas = new DrawCanvas(document.getElementById('canvas'));


fetch('https://manusoman.github.io/digit-recognizer/network_matrix.json')
.then(data => data.json())
.then(matrices => {
    window.NeuralNet = new FFNetwork(matrices);
    drawCanvas.updateCanvasPosition();
    removeLoader();
})
.catch(console.error);



const LOADER = document.getElementById('loader'),
    MAIN = document.getElementById('main'),
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


    
function removeLoader() {
    LOADER.classList.add('off');
    MAIN.classList.remove('off');
}

CLEAR_BUTTON.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    drawCanvas.clear();
}, true);


})();