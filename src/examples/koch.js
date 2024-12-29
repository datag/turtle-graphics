import { TurtleGraphics } from '../turtle.js';

export class Koch {
    constructor(sim) {
        /** @type TurtleGraphics */
        this.sim = sim;
    }

    static colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    kochkurve(length, d) {
        const turtle = this.sim.turtle;

        if (d === 0) {
            turtle.forward(length);
        } else {
            this.kochkurve(length / 3, d - 1);

            turtle.left(60);
            this.kochkurve(length / 3, d - 1);

            turtle.right(120);
            this.kochkurve(length / 3, d - 1);

            turtle.left(60);
            this.kochkurve(length / 3, d - 1);
        }
    }

    schneeflocke(sides, length, d) {
        const turtle = this.sim.turtle;

        for (let i = 0; i < sides; i++) {
            turtle.pen.color = Koch.colors[i % Koch.colors.length];

            this.kochkurve(length, d);
            turtle.right(360 / sides);
        }
    }
}
