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

export class TurtleState {
    constructor(pos, angle) {
        this.pos = pos.clone();
        this.angle = angle;
    }
}

export class Turtle {
    constructor(pos, angle) {
        this.pos = pos.clone();
        this.angle = angle;
        this.radius = 35;

        this.states = [];
        this.pushState();
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

    resetStates() {
        this.states = [];
        this.pushState();
    }

    pushState() {
        this.states.push(new TurtleState(this.pos, this.angle));
    }
}

export class TurtleGraphics {
    constructor(canvas, width, height, turtle) {
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;

        this.ctx = canvas.getContext('2d');

        this.init();

        this.turtle = turtle;
    }

    init() {
        this.lastRun = performance.now();
        this.debug = null;
        this.turtleStateIndex = 0;
        this.turtleLastStateTimestamp = this.lastRun;
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
        if (this.turtleStateIndex < turtle.states.length && timestamp - this.turtleLastStateTimestamp > 75) {
            this.turtle.pos = turtle.states[this.turtleStateIndex].pos;
            this.turtle.angle = turtle.states[this.turtleStateIndex].angle;
            this.turtleStateIndex++;
            this.turtleLastStateTimestamp = timestamp;
        }

        this.debug = {
            turtleStateIndex: this.turtleStateIndex,
            statesLength: this.turtle.states.length,
            percentage: Math.round((this.turtleStateIndex / this.turtle.states.length) * 100),
        };
    }

    render(fps) {
        const c = this.ctx;

        c.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // FPS counter
        c.fillStyle = 'Gray';
        c.font = '0.75rem monospace';
        c.fillText(Math.floor(fps) + ' fps', 2, 12);

        // Debug
        if (this.debug) {
            c.fillStyle = 'Red';
            c.fillText(JSON.stringify(this.debug), 2, 30);
        }

        // turtle
        const turtle = this.turtle;
        c.save();
        c.translate(turtle.pos.x, turtle.pos.y);
        c.rotate(toRadians(turtle.angle));

        c.beginPath();
        c.arc(0, 0, turtle.radius, 0, 2 * Math.PI);
        c.strokeStyle = '#060';
        c.stroke();
        c.fillStyle = '#090';
        c.fill();

        c.beginPath();
        c.arc(turtle.radius, 0, 10, 0, 2 * Math.PI);
        c.stroke();
        c.fillStyle = '#060';
        c.fill();
        c.restore();

        // turtle states
        c.save();
        c.strokeStyle = '#00a';
        c.beginPath();
        c.moveTo(turtle.states[0].pos.x, turtle.states[0].pos.y);
        for (let i = 1; i < this.turtleStateIndex; i++) {
            c.lineTo(turtle.states[i].pos.x, turtle.states[i].pos.y);
        }
        c.stroke();
        c.restore();
    }
}
