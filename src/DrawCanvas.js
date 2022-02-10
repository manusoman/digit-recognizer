(function() { 'use strict';

const smallCanvas = (function() {
    const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    canvas.width = 25;
    canvas.height = 25;

    const clear = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

    return { canvas, ctx, clear };
})();

function DrawCanvas(canvas, cb) {
    this.canvas = canvas;
    this.cb = cb;
    this.context = canvas.getContext('2d');
    this.isDrawing = false;

    this.context.lineWidth = 15.0;
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';

    attachEvents(this);
};

DrawCanvas.prototype = {
    constructor : DrawCanvas,

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        smallCanvas.clear();
    },

    updateCanvasPosition : function() {
        const parent = this.canvas.offsetParent;
        this.offsetLeft = parent.offsetLeft;
        this.offsetTop = parent.offsetTop;
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
            res = [];

        for(let i = 3; i < l; i += 4) {
            res.push(data[i] / 255); // /255 is for normalizing
        }
        
        return res;
    }
};


function attachEvents(_this) {
    _this.canvas.addEventListener('mousedown', function(e) {
        start(e, _this);
    }, true);

    _this.canvas.addEventListener('mousemove', function(e) {
        move(e, _this);
    }, true);

    _this.canvas.addEventListener('mouseup', function(e) {
        end(e, _this);
    }, true);


    _this.canvas.addEventListener('touchstart', function(e) {
        start(e, _this);
    }, true);

    _this.canvas.addEventListener('touchmove', function(e) {
        move(e, _this);
    }, true);

    _this.canvas.addEventListener('touchend', function(e) {
        end(e, _this);
    }, true);
}


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
    _this.cb(_this.getImageData());
}


window.DrawCanvas = DrawCanvas;

})();