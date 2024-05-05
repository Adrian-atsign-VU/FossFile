window.onload = function() {
    generateProfilePic();
    // exportImage();
}

function generateProfilePic() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var dimensions = document.getElementById("dimensions").value.split("x");
    canvas.width = parseInt(dimensions[0]);
    canvas.height = parseInt(dimensions[1]);
    
    var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, getRandomPastelColor());
    gradient.addColorStop(1, getRandomPastelColor());
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    var numShapes = getRandomInt(5, 15);
    for (var i = 0; i < numShapes; i++) {
        var shapeType = getRandomInt(0, 2); // 0: rectangle, 1: circle, 2: polygon
        ctx.fillStyle = getRandomPastelColor();
        if (shapeType === 0) {
            var x = getRandomInt(0, canvas.width);
            var y = getRandomInt(0, canvas.height);
            var width = getRandomInt(20, canvas.width - x);
            var height = getRandomInt(20, canvas.height - y);
            drawFeatheredRect(ctx, x, y, width, height);
        } else if (shapeType === 1) {
            var centerX = getRandomInt(0, canvas.width);
            var centerY = getRandomInt(0, canvas.height);
            var radius = getRandomInt(10, Math.min(canvas.width - centerX, canvas.height - centerY));
            drawFeatheredCircle(ctx, centerX, centerY, radius);
        } else {
            var numPoints = getRandomInt(3, 8);
            var points = [];
            for (var j = 0; j < numPoints; j++) {
                var nextX = getRandomInt(0, canvas.width);
                var nextY = getRandomInt(0, canvas.height);
                points.push({x: nextX, y: nextY});
            }
            drawFeatheredPolygon(ctx, points);
        }
    }
    applyBlur(canvas, ctx, getRandomInt(6, 7)); // Apply blur of 6 to 7 pixels
    applyGrainEffect(canvas, ctx);
}

function getRandomPastelColor() {
    var hue = Math.floor(Math.random() * 360);
    var pastel = 'hsl(' + hue + ', 80%, 80%)';
    return pastel;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawFeatheredRect(ctx, x, y, width, height) {
    var tempCanvas = document.createElement("canvas");
    tempCanvas.width = width + 10;
    tempCanvas.height = height + 10;
    var tempCtx = tempCanvas.getContext("2d");
    
    tempCtx.fillStyle = ctx.fillStyle;
    tempCtx.fillRect(5, 5, width, height);
    tempCtx.globalCompositeOperation = 'destination-in';
    tempCtx.filter = 'blur(5px)';
    tempCtx.fillRect(0, 0, width + 10, height + 10);
    
    ctx.drawImage(tempCanvas, x - 5, y - 5);
}

function drawFeatheredCircle(ctx, centerX, centerY, radius) {
    var tempCanvas = document.createElement("canvas");
    tempCanvas.width = radius * 2 + 10;
    tempCanvas.height = radius * 2 + 10;
    var tempCtx = tempCanvas.getContext("2d");
    
    tempCtx.fillStyle = ctx.fillStyle;
    tempCtx.beginPath();
    tempCtx.arc(radius + 5, radius + 5, radius, 0, Math.PI * 2);
    tempCtx.fill();
    tempCtx.globalCompositeOperation = 'destination-in';
    tempCtx.filter = 'blur(5px)';
    tempCtx.fillRect(0, 0, radius * 2 + 10, radius * 2 + 10);
    
    ctx.drawImage(tempCanvas, centerX - radius - 5, centerY - radius - 5);
}

function drawFeatheredPolygon(ctx, points) {
    var minX = Math.min(...points.map(p => p.x));
    var minY = Math.min(...points.map(p => p.y));
    var maxX = Math.max(...points.map(p => p.x));
    var maxY = Math.max(...points.map(p => p.y));
    var width = maxX - minX;
    var height = maxY - minY;

    var tempCanvas = document.createElement("canvas");
    tempCanvas.width = width + 10;
    tempCanvas.height = height + 10;
    var tempCtx = tempCanvas.getContext("2d");

    tempCtx.fillStyle = ctx.fillStyle;
    tempCtx.beginPath();
    tempCtx.moveTo(points[0].x - minX + 5, points[0].y - minY + 5);
    for (var i = 1; i < points.length; i++) {
        tempCtx.lineTo(points[i].x - minX + 5, points[i].y - minY + 5);
    }
    tempCtx.closePath();
    tempCtx.fill();
    tempCtx.globalCompositeOperation = 'destination-in';
    tempCtx.filter = 'blur(5px)';
    tempCtx.fillRect(0, 0, width + 10, height + 10);

    ctx.drawImage(tempCanvas, minX - 5, minY - 5);
}

function applyBlur(canvas, ctx, blurRadius) {
    var tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    var tempCtx = tempCanvas.getContext("2d");
    tempCtx.filter = 'blur(' + blurRadius + 'px)';
    tempCtx.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
}

function applyGrainEffect(canvas, ctx) {
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
        var grain = Math.random() * 3 - 1.5; // Randomize grain effect within 3 pixels of each other
        data[i] += grain;
        data[i + 1] += grain;
        data[i + 2] += grain;
    }

    ctx.putImageData(imageData, 0, 0);
}

function exportImage() {
    var canvas = document.getElementById("canvas");
    var format = document.getElementById("format").value;
    var filename = document.getElementById("filename").value;
    var dimensions = document.getElementById("dimensions").value.split("x");
    var tempCanvas = document.createElement("canvas");
    tempCanvas.width = parseInt(dimensions[0]);
    tempCanvas.height = parseInt(dimensions[1]);
    var tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
    var dataURL = tempCanvas.toDataURL("image/" + format);
    var link = document.createElement("a");
    link.href = dataURL;
    link.download = filename + "." + format;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}