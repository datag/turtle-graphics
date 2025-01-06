import { Example } from '../example.js';
import { Turtle, Point, Pen } from '../turtle.js';

export class Koch extends Example {
    static info() {
        return {
            id: 'koch',
            name: 'Koch snowflake',
        }
    }

    static colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    start() {
        this.sim.turtle = new Turtle(new Point(250, 250), 0, new Pen());

        this.snowflake(3, 300, 3);
    }

    /**
     * @param {number} length Distance
     * @param {*} d Iterations
     */
    kochcurve(length, d) {
        const turtle = this.sim.turtle;

        if (d === 0) {
            turtle.forward(length);
        } else {
            this.kochcurve(length / 3, d - 1);

            turtle.left(60);
            this.kochcurve(length / 3, d - 1);

            turtle.right(120);
            this.kochcurve(length / 3, d - 1);

            turtle.left(60);
            this.kochcurve(length / 3, d - 1);
        }
    }

    /**
     * @param {number} sides Number of sides
     * @param {number} length Distance
     * @param {number} d Iterations
     */
    snowflake(sides, length, d) {
        const turtle = this.sim.turtle;

        for (let i = 0; i < sides; i++) {
            turtle.pen.color = Koch.colors[i % Koch.colors.length];

            this.kochcurve(length, d);
            turtle.right(360 / sides);
        }
    }
}
