export function toRadians(degree) {
    return degree * (Math.PI / 180);
}

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Point(this.x, this.y);
    }
}

export class Pen {
    constructor(down = true, color = '#000', width = 1) {
        this.down = down;
        this.color = color;
        this.width = width;
    }

    clone() {
        return new Pen(this.down, this.color, this.width);
    }
}

export class TurtleState {
    constructor(pos, angle, pen) {
        this.pos = pos.clone();
        this.angle = angle;
        this.pen = pen.clone();
    }
}

export class Turtle {
    constructor(pos, angle, pen) {
        this.pos = pos.clone();
        this.angle = angle;
        this.pen = pen.clone();

        this.radius = 35;

        this.states = [];
        this.pushState();

        this.stateIndex = 0;
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
}

export class TurtleGraphics {
    constructor(canvas, width, height, turtle) {
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;

        this.ctx = canvas.getContext('2d');

        this.turtle = turtle;

        this.init();
    }

    init() {
        this.lastRun = performance.now();
        this.debug = null;

        this.turtle.stateIndex = 0;
        this.turtle.lastStateTimestamp = this.lastRun;
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
        if (this.turtle.stateIndex < turtle.states.length && timestamp - this.turtle.lastStateTimestamp > 75) {
            this.turtle.pos = turtle.states[this.turtle.stateIndex].pos.clone();
            this.turtle.angle = turtle.states[this.turtle.stateIndex].angle;
            this.turtle.pen = turtle.states[this.turtle.stateIndex].pen.clone();

            this.turtle.stateIndex++;
            this.turtle.lastStateTimestamp = timestamp;
        }

        this.debug = {
            stateIndex: this.turtle.stateIndex,
            statesLength: this.turtle.states.length,
            percentage: Math.round((this.turtle.stateIndex / this.turtle.states.length) * 100),
        };
    }

    render(fps) {
        const c = this.ctx;

        c.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.renderFps(fps);
        this.renderDebug();

        this.renderTurtle();
        this.renderTurtleStates();
        this.renderPen();
    }

    renderFps(fps) {
        const c = this.ctx;

        c.fillStyle = 'Gray';
        c.font = '0.75rem monospace';
        c.fillText(Math.floor(fps) + ' fps', 2, 12);
    }

    renderDebug() {
        const c = this.ctx;

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
        c.closePath();

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