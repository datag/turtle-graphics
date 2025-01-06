import { Example } from '../example.js';
import { Turtle, Point, Pen } from '../turtle.js';

export class Tinker extends Example {
    static info() {
        return {
            id: 'tinker-02',
            name: 'Tinker-02',
        }
    }

    start() {
        this.distance = 300;

        this.sim.turtle = new Turtle(
            new Point(this.sim.canvas.width / 2 - this.distance, this.sim.canvas.height / 2 + this.distance / 2),
            0,
            new Pen());

        this.tinker();
    }

    tinker() {
        const turtle = this.sim.turtle;
        let distance = this.distance;

        const iterations = 20;
        const colors = ['blue', 'red', 'orange', 'green', 'brown', 'black', 'purple', 'pink'];

        for (let i = 0; i < iterations; i++) {
            turtle.pen.color = colors[i % colors.length];
            turtle.pen.width = iterations - i;

            turtle.forward(distance * 2);
            turtle.left(90);
            turtle.forward(distance);
            turtle.left(90);
            turtle.forward(distance * 2);
            turtle.left(90);
            turtle.forward(distance);

            let degree = 27;
            turtle.left(90 + degree);
            distance *= 0.9;
            turtle.forward(distance * 0.1);
            turtle.right(degree + 5);
        }
    }
}
