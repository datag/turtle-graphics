export function toRadians(degree) {
    return degree * (Math.PI / 180);
}

export class Point {
    constructor(x, y) {
        /** @type {number} */
        this.x = x;

        /** @type {number} */
        this.y = y;
    }

    clone() {
        return new Point(this.x, this.y);
    }
}

export class Pen {
    constructor(down = true, color = '#000', width = 1) {
        /** @type {bool} */
        this.down = down;

        /** @type {string | CanvasGradient | CanvasPattern} */
        this.color = color;

        /** @type {number} */
        this.width = width;
    }

    clone() {
        return new Pen(this.down, this.color, this.width);
    }
}

export class TurtleState {
    constructor(pos, angle, pen) {
        /** @type {Point} */
        this.pos = pos.clone();

        /** @type {number} */
        this.angle = angle;

        /** @type {Pen} */
        this.pen = pen.clone();
    }
}

export class Turtle {
    constructor(pos, angle, pen) {
        /** @type {Point} */
        this.pos = pos.clone();

        /** @type {number} */
        this.angle = angle;

        /** @type {Pen} */
        this.pen = pen.clone();

        /** @type {number} */
        this.radius = 35;

        /** @type {TurtleState[]} */
        this.states = [];
        this.pushState();

        /** @type {number} */
        this.stateIndex = 0;

        /** @type {number} */
        this.lastStateTimestamp = performance.now();
    }

    forward(distance) {
        const radians = toRadians(this.angle);
        const newX = this.pos.x + distance * Math.cos(radians);
        const newY = this.pos.y + distance * Math.sin(radians);

        this.pos = new Point(newX, newY);
        this.pushState();
    }

    backward(distance) {
        this.forward(-distance);
    }

    right(degrees) {
        this.angle = (this.angle + degrees) % 360;
        this.pushState();
    }

    left(degrees) {
        this.right(-degrees);
    }

    penDown() {
        if (this.pen.down) {
            return;
        }
        this.pen.down = true;
        this.pushState();
    }

    penUp() {
        if (!this.pen.down) {
            return;
        }
        this.pen.down = false;
        this.pushState();
    }

    resetStates() {
        this.states = [];
        this.pushState();
    }

    pushState() {
        this.states.push(new TurtleState(this.pos, this.angle, this.pen));
    }

    toLastState() {
        this.stateIndex = this.states.length - 1;
        this.lastStateTimestamp = performance.now();
    }

    /**
     * @param {TurtleState} state
     */
    restoreState(state) {
        this.pos = state.pos.clone();
        this.angle = state.angle;
        this.pen = state.pen.clone();
    }
}

export class TurtleGraphics {
    constructor(canvas, width, height, turtle) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;

        this.canvas.width = width;
        this.canvas.height = height;

        /** @type {CanvasRenderingContext2D} */
        this.ctx = canvas.getContext('2d');

        /** @type {Turtle} */
        this.turtle = turtle;

        /** @type {number} Value between 0 and 1 */
        this.speed = .5;

        this.init();
    }

    init() {
        /** @type {number} */
        this.lastRun = performance.now();

        /** @type {*} */
        this.debug = null;

        this.turtle.stateIndex = 0;
        this.turtle.lastStateTimestamp = this.lastRun;
        this.turtle.restoreState(this.turtle.states[0]);
    }

    mainLoop(timestamp) {
        const delta = (timestamp - this.lastRun) / 1000;
        const fps = 1 / delta;

        this.handleInput();
        this.update(timestamp);
        this.render(fps);

        this.lastRun = timestamp;
        requestAnimationFrame(this.mainLoop.bind(this));
    }

    handleInput() {
    }

    update(timestamp) {
        const turtle = this.turtle;

        const msStateRenderWait = 500 * (1 - this.speed);

        if (this.turtle.stateIndex < turtle.states.length && timestamp - this.turtle.lastStateTimestamp > msStateRenderWait) {
            this.turtle.restoreState(turtle.states[this.turtle.stateIndex]);

            this.turtle.stateIndex++;
            this.turtle.lastStateTimestamp = timestamp;
        }
    }

    render(fps) {
        const c = this.ctx;

        c.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.renderInfo(fps);
        this.renderDebug();

        this.renderTurtle();
        this.renderTurtleStates();
        this.renderPen();
    }

    renderInfo(fps) {
        const c = this.ctx;
        let infoParts = [Math.floor(fps) + ' fps'];

        // Progress
        if (this.turtle.stateIndex < this.turtle.states.length - 1) {
            const progress = (this.turtle.stateIndex + 1) / this.turtle.states.length;
            infoParts.push((progress * 100).toFixed(2) + '%');
        }

        c.fillStyle = 'Gray';
        c.font = '0.75rem monospace';
        c.fillText(infoParts.join(' · '), 2, 12);
    }

    renderDebug() {
        const c = this.ctx;

        if (!this.debug) {
            return;
        }

        c.fillStyle = 'Red';
        c.fillText(JSON.stringify(this.debug), 2, 30);
    }

    renderTurtle() {
        const c = this.ctx;
        const turtle = this.turtle;

        const bodyRatio = 0.8;
        const bodyColor = '#8e5f35';
        const limbColor = '#7caf22';
        const outlineColor = '#666';

        c.save();

        c.translate(turtle.pos.x, turtle.pos.y);
        c.rotate(toRadians(turtle.angle));

        // Head
        c.beginPath();
        c.stroke();
        c.ellipse(turtle.radius, 0, turtle.radius * 0.5, turtle.radius * 0.3, 0, 0, 2 * Math.PI);
        c.strokeStyle = outlineColor;
        c.stroke();
        c.fillStyle = limbColor;
        c.fill();


        // Feet
        c.strokeStyle = outlineColor;
        c.fillStyle = limbColor;
        [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([x, y]) => {
            c.beginPath();
            c.arc(x * turtle.radius / 2, y * turtle.radius * bodyRatio - 3 * y, 6, 0, 2 * Math.PI);
            c.stroke();
            c.fill();
        });

        // Body on top
        c.beginPath();
        c.ellipse(0, 0, turtle.radius, turtle.radius * bodyRatio, 0, 0, 2 * Math.PI);
        c.strokeStyle = outlineColor;
        c.stroke();
        c.fillStyle = bodyColor;
        c.fill();

        c.restore();
    }

    renderTurtleStates() {
        const c = this.ctx;
        const turtle = this.turtle;

        c.save();

        let prevState = turtle.states[0];
        let curState;

        for (let i = 1; i < this.turtle.stateIndex; i++) {
            curState = turtle.states[i];
            if (curState.pen.down) {
                c.beginPath();
                c.moveTo(prevState.pos.x, prevState.pos.y);
                c.lineTo(curState.pos.x, curState.pos.y);
                c.strokeStyle = curState.pen.color;
                c.lineWidth = curState.pen.width;
                c.stroke();
            }
            prevState = turtle.states[i];
        }

        c.restore();
    }

    renderPen() {
        const c = this.ctx;
        const turtle = this.turtle;

        if (!turtle.pen.down) {
            return;
        }

        c.save();

        c.translate(turtle.pos.x, turtle.pos.y);

        c.beginPath();
        c.arc(0, 0, turtle.pen.width / 2 + 1, 0, 2 * Math.PI);
        c.strokeStyle = '#111';
        c.stroke();
        c.fillStyle = turtle.pen.color;
        c.fill();

        c.restore();
    }
}
