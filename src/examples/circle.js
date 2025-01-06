import { Example } from '../example.js';
import { Turtle, Point, Pen } from '../turtle.js';

export class Circle extends Example {
    static info() {
        return {
            id: 'circle',
            name: 'Circle',
        }
    }

    static colors = ['#ff0000', '#00ff00', '#0000ff'];

    start() {
        this.sim.turtle = new Turtle(new Point(400, 400), 0, new Pen(true, null, 2));

        this.circle(20, 50);
    }

    circle(steps, distance) {
        const turtle = this.sim.turtle;

        const angle = 360 / steps;

        for (let i = 0; i < steps; i++) {
            turtle.pen.color = Circle.colors[i % Circle.colors.length];
            turtle.forward(distance);
            turtle.left(angle);
        }
    }
}
