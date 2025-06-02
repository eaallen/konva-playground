// Orthogonal Line Demo: Create a line with 90-degree turns and draggable anchors

const stage = new Konva.Stage({
    container: 'container',
    width: 600,
    height: 400
});

const layer = new Konva.Layer();
stage.add(layer);

// Initial points for the orthogonal line (polyline)
let points = [
    100, 100,
    200, 100,
    200, 200,
    400, 200
];

// Create the line
const line = new Konva.Line({
    points: points,
    stroke: '#0074D9',
    strokeWidth: 4,
    lineJoin: 'miter',
    lineCap: 'butt',
    tension: 0,
});
layer.add(line);

// Create draggable anchors for each point
const anchors = [];
for (let i = 0; i < points.length; i += 2) {
    const anchor = new Konva.Circle({
        x: points[i],
        y: points[i + 1],
        radius: 8,
        fill: '#FF4136',
        stroke: '#85144b',
        strokeWidth: 2,
        draggable: true,
        name: 'anchor'
    });
    anchors.push(anchor);
    layer.add(anchor);

    anchor.on('dragmove', () => {
        // Snap to horizontal or vertical relative to previous/next anchor
        let prev = null, next = null;
        if (i > 0) prev = anchors[(i / 2) - 1];
        if (i < anchors.length * 2 - 2) next = anchors[(i / 2) + 1];
        let newX = anchor.x();
        let newY = anchor.y();
        // If previous anchor exists, snap to horizontal or vertical
        if (prev) {
            if (Math.abs(newX - prev.x()) < Math.abs(newY - prev.y())) {
                newX = prev.x();
            } else {
                newY = prev.y();
            }
        }
        // If next anchor exists, snap to horizontal or vertical
        if (next) {
            if (Math.abs(newX - next.x()) < Math.abs(newY - next.y())) {
                newX = next.x();
            } else {
                newY = next.y();
            }
        }
        anchor.position({ x: newX, y: newY });
        // Update points array
        points[i] = newX;
        points[i + 1] = newY;
        line.points(points);
        layer.batchDraw();
    });

    anchor.on('mouseover', () => {
        document.body.style.cursor = 'pointer';
        anchor.radius(12);
        layer.batchDraw();
    });
    anchor.on('mouseout', () => {
        document.body.style.cursor = 'default';
        anchor.radius(8);
        layer.batchDraw();
    });
}

layer.batchDraw(); 