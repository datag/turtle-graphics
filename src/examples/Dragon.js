import { Example } from '../Example.js';
import { Turtle, Point, Pen } from '../TurtleGraphics.js';

export class Dragon extends Example {
    static info() {
        return {
            id: 'dragon',
            name: 'Dragon curve',
        }
    }

    static colors = ['#4169e1', '#a7c7e7'];

    start() {
        this.sim.turtle = new Turtle(new Point(500, 250), 0, new Pen());

        this.dragon(5, 12, true);
    }

    /**
     * @param {number} s Distance
     * @param {number} n Iterations
     * @param {boolean} flag Flag (left or right)
     * @returns
     */
    dragon(s, n, flag) {
        const turtle = this.sim.turtle;

        if (n === 0) {
            turtle.forward(s);
        } else {
            turtle.pen.color = Dragon.colors[flag ? 0 : 1];

            this.dragon(s, n - 1, true);

            turtle.right(90 * (flag ? 1 : -1));

            this.dragon(s, n - 1, false);
        }
    }
}
