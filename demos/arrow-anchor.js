// Arrow Anchor Demo: Arrow connects two draggable shapes

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
    x: 80,
    y: 80,
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
    x: 350,
    y: 250,
    radius: 50,
    fill: '#FF6B6B',
    stroke: 'black',
    strokeWidth: 2,
    draggable: true
});

// Helper to get center of rect
function getRectCenter(rect) {
    return {
        x: rect.x() + rect.width() / 2,
        y: rect.y() + rect.height() / 2
    };
}

// Create an arrow
const arrow = new Konva.Arrow({
    points: [], // will set below
    pointerLength: 20,
    pointerWidth: 20,
    fill: 'black',
    stroke: 'black',
    strokeWidth: 4
});

// Function to update arrow points
function updateArrow() {
    const from = getRectCenter(rect);
    const to = { x: circle.x(), y: circle.y() };
    arrow.points([from.x, from.y, to.x, to.y]);
    layer.batchDraw();
}

// Initial arrow position
updateArrow();

// Add shapes and arrow to the layer
layer.add(rect);
layer.add(circle);
layer.add(arrow);

// Add the layer to the stage
stage.add(layer);

// Update arrow when shapes move
rect.on('dragmove', updateArrow);
circle.on('dragmove', updateArrow);

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