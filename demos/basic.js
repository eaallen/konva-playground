// Create a stage
const stage = new Konva.Stage({
    container: 'container',
    width: 500,
    height: 500
});

// Create a layer
const layer = new Konva.Layer();

// Create a rectangle
const rect = new Konva.Rect({
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 2,
    draggable: true,
    cornerRadius: 10
});

// Create a circle
const circle = new Konva.Circle({
    x: 300,
    y: 200,
    radius: 50,
    fill: '#FF6B6B',
    stroke: 'black',
    strokeWidth: 2,
    draggable: true
});

// Add shapes to the layer
layer.add(rect);
layer.add(circle);

// Add the layer to the stage
stage.add(layer);

// Add event listeners for drag events
rect.on('dragmove', () => {
    layer.batchDraw();
});

circle.on('dragmove', () => {
    layer.batchDraw();
});

// Add hover effects
rect.on('mouseover', () => {
    document.body.style.cursor = 'pointer';
    rect.strokeWidth(4);
    layer.batchDraw();
});

rect.on('mouseout', () => {
    document.body.style.cursor = 'default';
    rect.strokeWidth(2);
    layer.batchDraw();
});

circle.on('mouseover', () => {
    document.body.style.cursor = 'pointer';
    circle.strokeWidth(4);
    layer.batchDraw();
});

circle.on('mouseout', () => {
    document.body.style.cursor = 'default';
    circle.strokeWidth(2);
    layer.batchDraw();
}); 