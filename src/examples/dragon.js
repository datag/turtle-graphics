import { TurtleGraphics } from '../turtle.js';

export class Dragon {
    constructor(sim) {
        /** @type TurtleGraphics */
        this.sim = sim;
    }

    dragon(s, n, flag) {
        const turtle = this.sim.turtle;

        if (n === 0) {
            turtle.forward(s);
            return;
        } else {
            this.dragon(s, n - 1, true);

            turtle.right(90 * (flag ? 1 : -1));

            this.dragon(s, n - 1, false);
        }
    }
}
