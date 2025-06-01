// Create a stage
const stage = new Konva.Stage({
    container: 'container',
    width: 500,
    height: 500
});

// Create a layer
const layer = new Konva.Layer();

// Create a star
const star = new Konva.Star({
    x: 250,
    y: 250,
    numPoints: 5,
    innerRadius: 40,
    outerRadius: 70,
    fill: '#FFD700',
    stroke: '#FF8C00',
    strokeWidth: 2,
    draggable: true,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: { x: 5, y: 5 },
    shadowOpacity: 0.3
});

// Add the star to the layer
layer.add(star);

// Add the layer to the stage
stage.add(layer);

// Animation
const anim = new Konva.Animation((frame) => {
    const time = frame.time * 0.001;
    star.rotation(time * 45);
    star.scale({
        x: 1 + Math.sin(time) * 0.1,
        y: 1 + Math.sin(time) * 0.1
    });
}, layer);

// Start animation
anim.start();

// Add hover effects
star.on('mouseover', () => {
    document.body.style.cursor = 'pointer';
    star.shadowBlur(20);
    layer.batchDraw();
});

star.on('mouseout', () => {
    document.body.style.cursor = 'default';
    star.shadowBlur(10);
    layer.batchDraw();
});

// Add click effect
star.on('click', () => {
    star.fill(Konva.Util.getRandomColor());
    layer.batchDraw();
}); 