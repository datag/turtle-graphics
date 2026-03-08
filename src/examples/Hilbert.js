import { Example } from '../Example.js';
import { Turtle, Point, Pen } from '../TurtleGraphics.js';

export class Hilbert extends Example {
    static info() {
        return {
            id: 'hilbert',
            name: 'Hilbert curve',
        };
    }

    start() {
        const order = 5;
        const step = 15;
        const size = (Math.pow(2, order) - 1) * step;

        // Center the curve on the 800×600 canvas; turtle starts at top-left corner facing east
        // (the curve extends downward from the start point)
        const x = Math.round((800 - size) / 2);
        const y = Math.round((600 - size) / 2);

        this.sim.turtle = new Turtle(new Point(x, y), 0, new Pen());
        this.totalSteps = Math.pow(4, order) - 1;
        this.stepCount = 0;

        this.hilbert(order, step, 90);
    }

    hilbert(order, step, turn) {
        if (order === 0) return;
        const turtle = this.sim.turtle;

        turtle.right(turn);
        this.hilbert(order - 1, step, -turn);
        this.#advance(step);

        turtle.left(turn);
        this.hilbert(order - 1, step, turn);
        this.#advance(step);

        this.hilbert(order - 1, step, turn);
        turtle.left(turn);
        this.#advance(step);

        this.hilbert(order - 1, step, -turn);
        turtle.right(turn);
    }

    #advance(step) {
        const turtle = this.sim.turtle;
        turtle.pen.color = `hsl(${(this.stepCount / this.totalSteps) * 360}, 100%, 50%)`;
        turtle.forward(step);
        this.stepCount++;
    }
}
