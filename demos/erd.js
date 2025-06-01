
const stage = new Konva.Stage({
    container: 'container',
    width: 800,
    height: 600
});


const globalState = {
    isDrawingArrow: false,
}

// Create a layer
const layer = new Konva.Layer();

// Store entities and relationships
const entities = new Map();
/**
 * @type {Relationship[]}
 */
const relationships = [];

let clickedEntity = null;

// Entity class
class Entity {
    state = {
        lastPos: null
    }

    /**
     * @type {Set<Relationship>}
     */
    rels = new Set();
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
            opacity: 0,
            x: -10,
            y: -10,
        });

        this.arrowBoarder.on('click', e => {
            console.log('clicked on arrow boarder', globalState.isDrawingArrow);
            if (globalState.isDrawingArrow) {
                // this is linking to an existing entity
                globalState.isDrawingArrow = false;
                const pointer = stage.getPointerPosition();

                const rel = relationships.at(-1);
                rel.draw(
                    rel.line.points()[0],
                    rel.line.points()[1],
                    this.xAfterSnap(pointer.x),
                    this.yAfterSnap(pointer.y),
                )
                this.rels.add(rel);

                return;
            }

            // this is a new relationship
            const pointer = stage.getPointerPosition();
            const x = this.xAfterSnap(pointer.x);
            const y = this.yAfterSnap(pointer.y);
            this.createEdge(x, y, x, y);
            globalState.isDrawingArrow = true;
        });

        this.arrowBoarder.on('mouseup', e => {
            console.log('mouseup on arrow boarder', this.arrowBoarder.getStage().getPointerPosition());
        });

        this.arrowBoarder.on('mouseover', () => {
            clickedEntity = this;
            this.arrowBoarder.opacity(0.5)
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
        this.group.on('dragstart', () => {
            // Store the initial position when dragging starts
            this.state.lastPos = { x: this.group.x(), y: this.group.y() };
        });
        this.group.on('dragmove', () => {
            // updateRelationships();
            if (this.state.lastPos && this.rels.size > 0) {
                const currentPos = { x: this.group.x(), y: this.group.y() };
                const delta = {
                    x: currentPos.x - this.state.lastPos.x,
                    y: currentPos.y - this.state.lastPos.y
                };
                this.#updateEdges(delta);
            }

            this.state.lastPos = { x: this.group.x(), y: this.group.y() };
            layer.batchDraw();
        });
        this.group.on('dragend', () => {
            this.state.lastPos = null;
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
        const oldHeight = this.box.height();
        const height = 30 + (this.attributes.length * 25);
        const heightDelta = height - oldHeight;
        this.box.height(height);
        this.rels.forEach(rel => {
            if (this.ownsRelationship(rel)) {
                rel.line.points([
                    rel.line.points()[0],
                    rel.line.points()[1] + heightDelta,
                    rel.line.points()[2],
                    rel.line.points()[3],
                ])
            } else {
                rel.line.points([
                    rel.line.points()[0],
                    rel.line.points()[1],
                    rel.line.points()[2],
                    rel.line.points()[3] + heightDelta,
                ])

            }
        })
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

    createEdge(fromX, fromY, toX, toY) {
        const relationship = new Relationship(this);
        this.rels.add(relationship);
        relationship.draw(fromX, fromY, toX, toY);
    }


    /**
     * @param {{x: number, y: number}} delta
     */
    #updateEdges(delta) {
        console.log('updateEdges');
        this.rels.forEach(rel => {
            if (rel.fromEntity === this) {
                rel.draw(
                    rel.line.points()[0] + delta.x,
                    rel.line.points()[1] + delta.y,
                    rel.line.points()[2],
                    rel.line.points()[3],
                )
            } else {
                rel.draw(
                    rel.line.points()[0],
                    rel.line.points()[1],
                    rel.line.points()[2] + delta.x,
                    rel.line.points()[3] + delta.y,
                )
            }
        });

        layer.batchDraw();


    }

    get centerCoordinates() {
        return {
            x: this.group.x() + this.box.width() / 2,
            y: this.group.y() + this.box.height() / 2
        }
    }

    /**
     * returns the bottom-right coordinates of the entity
     */
    get bottomCoordinates() {
        return {
            x: this.group.x() + this.box.width(),
            y: this.group.y() + this.box.height()
        }
    }

    xShouldSnapLeft(pointerX) {
        return pointerX < this.group.x()
    }

    xShouldSnapRight(pointerX) {
        return pointerX > this.bottomCoordinates.x
    }

    yShouldSnapTop(pointerY) {
        return pointerY < this.group.y()
    }

    yShouldSnapBottom(pointerY) {
        return pointerY > this.bottomCoordinates.y
    }

    xAfterSnap(pointerX) {
        if (this.xShouldSnapLeft(pointerX)) {
            return this.group.x()
        }
        if (this.xShouldSnapRight(pointerX)) {
            return this.bottomCoordinates.x
        }
        return pointerX
    }

    yAfterSnap(pointerY) {
        if (this.yShouldSnapTop(pointerY)) {
            return this.group.y()
        }
        if (this.yShouldSnapBottom(pointerY)) {
            return this.bottomCoordinates.y
        }
        return pointerY
    }

    /**
     * @param {Relationship} rel
     */
    ownsRelationship(rel) {
        return this.rels.has(rel) && rel.fromEntity === this;
    }
}

// Relationship class
class Relationship {
    constructor(fromEntity, toEntity) {
        this.fromEntity = fromEntity;
        this.toEntity = toEntity;
        this.id = Date.now();

        this.group = new Konva.Group({});

        this.line = new Konva.Line({
            points: [],
            stroke: '#000',
            strokeWidth: 2
        });

        layer.add(this.line);
        relationships.push(this);
    }

    draw(fromX, fromY, toX, toY) {
        this.line.points([fromX, fromY, toX, toY]);
        layer.batchDraw();
    }





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

const bg = new Konva.Rect({
    width: stage.width(),
    height: stage.height(),
    fill: 'yellow',
    opacity: 0.5,
});

layer.add(bg);
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


bg.on('click', () => {
    console.log('bg: clicked');
    if (globalState.isDrawingArrow) {
        globalState.isDrawingArrow = false;
    }
})

stage.on('mousemove', (e) => {
    console.log('mousemove', globalState.isDrawingArrow);
    if (globalState.isDrawingArrow) {
        console.log('drawing arrow');
        const pos = stage.getPointerPosition();
        const rel = relationships.at(-1);
        rel.draw(
            rel.line.points()[0],
            rel.line.points()[1],
            pos.x,
            pos.y,
        )
    }
});

stage.on('mouseup', () => {
    isDrawing = false;
    startEntity = null;
}); 