(function() { 'use strict';

const smallCanvas = (function() {
    const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    canvas.width = 25;
    canvas.height = 25;

    const clear = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

    return { canvas, ctx, clear };
})();

function DrawCanvas(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.isDrawing = false;

    this.context.lineWidth = 15.0;
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.attachEvents();
};

DrawCanvas.prototype = {
    constructor : DrawCanvas,

    attachEvents : function() {
        const _this = this;


        this.canvas.addEventListener('mousedown', function(e) {
            start(e, _this);
        }, true);
    
        this.canvas.addEventListener('mousemove', function(e) {
            move(e, _this);
        }, true);
    
        this.canvas.addEventListener('mouseup', function(e) {
            end(e, _this);
        }, true);


        this.canvas.addEventListener('touchstart', function(e) {
            start(e, _this);
        }, true);
    
        this.canvas.addEventListener('touchmove', function(e) {
            move(e, _this);
        }, true);
    
        this.canvas.addEventListener('touchend', function(e) {
            end(e, _this);
        }, true);
    },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        smallCanvas.clear();
    },

    updateCanvasPosition : function() {
        this.offsetLeft = this.canvas.offsetLeft;
        this.offsetTop = this.canvas.offsetTop;
    },

    getPenPosition : function(e) {
        let x, y;

        if(e.x) {
            x = e.x;
            y = e.y;
        } else if(e.touches) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }

        x -= this.offsetLeft;
        y -= this.offsetTop;

        return { x, y };
    },

    getImageData : function() {
        smallCanvas.clear();
        smallCanvas.ctx.drawImage(this.canvas, 0, 0, 25, 25);

        const { data } = smallCanvas.ctx.getImageData(0, 0, 25, 25),
            l = data.length,
            tmp = [];

        for(let i = 3; i < l; i += 4) {
            tmp.push(data[i] / 255); // /255 is for normalizing
        }
        
        return tmp;
    }
};


function start(e, _this) {
    e.preventDefault();
    e.stopPropagation();
    let { x, y } = _this.getPenPosition(e);

    _this.context.beginPath();
    _this.context.moveTo(x, y);
    _this.isDrawing = true;
}

function move(e, _this) {
    e.preventDefault();
    e.stopPropagation();
    
    if(_this.isDrawing) {
        let { x, y } = _this.getPenPosition(e);
        _this.context.lineTo(x, y);
        _this.context.stroke();
    }
}

function end(e, _this) {
    e.preventDefault();
    e.stopPropagation();

    _this.isDrawing = false;
    let r = NeuralNet.applyInput(_this.getImageData()),
        v = getLNindex(r);

    console.log('answer: ', v);
}


function getLNindex(a) {
    let n = a[0],
        index = 0;

    for(let i = 1, l = a.length; i < l; i++) {
        if(a[i] > n) {
            n = a[i];
            index = i;
        }
    }

    return index;
}

document.body.appendChild(smallCanvas.canvas);
window.DrawCanvas = DrawCanvas;

})();