// Create a stage
const stage = new Konva.Stage({
    container: 'container',
    width: 500,
    height: 500
});

// Create a layer
const layer = new Konva.Layer();

// Create a custom shape
const customShape = new Konva.Shape({
    x: 250,
    y: 250,
    draggable: true,
    sceneFunc: function (context, shape) {
        const width = 100;
        const height = 100;
        
        context.beginPath();
        context.moveTo(-width/2, -height/2);
        context.lineTo(width/2, -height/2);
        context.lineTo(width/2, height/2);
        context.lineTo(-width/2, height/2);
        context.closePath();
        
        // Create gradient
        const gradient = context.createLinearGradient(
            -width/2, -height/2,
            width/2, height/2
        );
        gradient.addColorStop(0, '#FF6B6B');
        gradient.addColorStop(1, '#4ECDC4');
        
        context.fillStyle = gradient;
        context.fill();
        
        // Draw stroke
        context.strokeStyle = '#2C3E50';
        context.lineWidth = 2;
        context.stroke();
    }
});

// Add the custom shape to the layer
layer.add(customShape);

// Add the layer to the stage
stage.add(layer);

// Add hover effects
customShape.on('mouseover', () => {
    document.body.style.cursor = 'pointer';
    customShape.scale({ x: 1.1, y: 1.1 });
    layer.batchDraw();
});

customShape.on('mouseout', () => {
    document.body.style.cursor = 'default';
    customShape.scale({ x: 1, y: 1 });
    layer.batchDraw();
});

// Add rotation on click
customShape.on('click', () => {
    const currentRotation = customShape.rotation();
    customShape.rotation(currentRotation + 45);
    layer.batchDraw();
}); 