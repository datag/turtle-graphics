import { TurtleGraphics } from '../turtle.js';

export class Dragon {
    constructor(sim) {
        /** @type TurtleGraphics */
        this.sim = sim;
    }

    static colors = ['#4169e1', '#a7c7e7'];

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
