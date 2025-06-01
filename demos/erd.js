// Create a stage
const stage = new Konva.Stage({
    container: 'container',
    width: 800,
    height: 600
});

// Create a layer
const layer = new Konva.Layer();

// Store entities and relationships
const entities = new Map();
const relationships = [];

let clickedEntity = null;

// Entity class
class Entity {
    constructor(x, y) {
        this.id = Date.now();
        this.name = 'Entity';
        this.attributes = [];
        this.group = new Konva.Group({
            x,
            y,
            draggable: true
        });

        this.arrowBoarder = new Konva.Rect({
            width: 170,
            height: 50,
            fill: '#eee',
            x: -10,
            y: -10,
            opacity: 0.0,
        });

        this.arrowBoarder.on('click', () => {
            console.log('clicked on arrow boarder');
        });
        
        this.arrowBoarder.on('mouseover', () => {
            clickedEntity = this;
            this.arrowBoarder.opacity(1)
        });
        this.arrowBoarder.on('mouseout', () => {
            clickedEntity = null;
            this.arrowBoarder.opacity(0)
        });

        // Create entity box
        this.box = new Konva.Rect({
            width: 150,
            height: 30,
            fill: '#fff',
            stroke: '#000',
            strokeWidth: 2
        });

        // Create entity name text
        this.nameText = new Konva.Text({
            text: this.name,
            fontSize: 14,
            padding: 5,
            align: 'center',
            width: 150,
        });

        this.nameText.on('dblclick', () => {
            const newName = prompt('Enter entity name:', this.name);
            if (newName) {
                this.name = newName;
                this.nameText.text(newName);
                layer.batchDraw();
            }
        });

       
        // Add to group
        this.group.add(this.arrowBoarder);
        this.group.add(this.box);
        this.group.add(this.nameText);

        
        // Add to layer
        layer.add(this.group);
        
        // Add event listeners
        this.group.on('dragmove', () => {
            updateRelationships();
            layer.batchDraw();
        });

        // Add attribute button
        const addAttrBtn = new Konva.Circle({
            x: 140,
            y: 15,
            radius: 8,
            fill: '#4CAF50',
            stroke: '#000',
            strokeWidth: 1
        });



        this.group.add(addAttrBtn);

        addAttrBtn.on('click', (e) => {
            e.cancelBubble = true;
            this.addAttribute();
        });
    }

    addAttribute() {
        const attrName = 'New Attribute'; // prompt('Enter attribute name:');
        if (!attrName) return;

        const attr = {
            name: attrName,
            isKey: false
        };
        this.attributes.push(attr);
        this.updateBox();
    }

    updateBox() {
        const height = 30 + (this.attributes.length * 25);
        this.box.height(height);
        this.arrowBoarder.height(height + 20);
        this.nameText.y(0);

        // Remove old attribute texts
        this.group.children.forEach(child => {
            if (child.className === 'Text' && child !== this.nameText) {
                child.destroy();
            }
        });

        // Add attribute texts
        this.attributes.forEach((attr, index) => {
            const text = new Konva.Text({
                y: 30 + (index * 25),
                text: attr.name,
                fontSize: 12,
                padding: 5,
                width: 150
            });
            text.on('dblclick', () => {
                const newName = prompt('Enter attribute name:', attr.name);
                if (newName) {
                    attr.name = newName;
                    text.text(newName);
                }
            });
            this.group.add(text);
        });

        layer.batchDraw();
    }
}

// Relationship class
class Relationship {
    constructor(fromEntity, toEntity) {
        this.fromEntity = fromEntity;
        this.toEntity = toEntity;
        this.line = new Konva.Line({
            points: this.calculatePoints(),
            stroke: '#000',
            strokeWidth: 2
        });

        layer.add(this.line);
        this.update();
    }

    calculatePoints() {
        const from = this.fromEntity.group;
        const to = this.toEntity.group;
        return [
            from.x() + 75, from.y() + 15,
            to.x() + 75, to.y() + 15
        ];
    }

    update() {
        this.line.points(this.calculatePoints());
    }
}

// Function to update all relationships
function updateRelationships() {
    relationships.forEach(rel => rel.update());
}

// Add entity button
const addEntityBtn = new Konva.Circle({
    x: 50,
    y: 50,
    radius: 20,
    fill: '#2196F3',
    stroke: '#000',
    strokeWidth: 2
});

const plusText = new Konva.Text({
    x: 42,
    y: 38,
    text: '+',
    fontSize: 24,
    fill: '#fff'
});

layer.add(addEntityBtn);
layer.add(plusText);

// Add stage to layer
stage.add(layer);

// Event handlers
let isDrawing = false;
let startEntity = null;

addEntityBtn.on('click', () => {
    const entity = new Entity(
        Math.random() * (stage.width() - 200) + 50,
        Math.random() * (stage.height() - 200) + 50
    );
    entities.set(entity.id, entity);
    layer.batchDraw();
});

stage.on('mousedown', (e) => {
    console.log('clicked on stage', clickedEntity);
    if (clickedEntity) {
        console.log('clicked on entity');
        isDrawing = true;
        startEntity = clickedEntity;
    }
});

stage.on('mousemove', (e) => {
    // console.log('mousemove', isDrawing, startEntity);
    if (isDrawing && startEntity) {
        const pos = stage.getPointerPosition();
        const endEntity = Array.from(entities.values()).find(entity => {
            const box = entity.group.getClientRect();
            return pos.x >= box.x && pos.x <= box.x + box.width &&
                pos.y >= box.y && pos.y <= box.y + box.height;
        });

        if (endEntity && endEntity !== startEntity) {
            const relationship = new Relationship(startEntity, endEntity);
            relationships.push(relationship);
            isDrawing = false;
            startEntity = null;
            layer.batchDraw();
        }
    }
});

stage.on('mouseup', () => {
    isDrawing = false;
    startEntity = null;
}); 