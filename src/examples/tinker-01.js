import { Example } from '../example.js';
import { Turtle, Point, Pen } from '../turtle.js';

export class Tinker extends Example {
    static info() {
        return {
            id: 'tinker-01',
            name: 'Tinker-01',
        }
    }

    start() {
        this.sim.turtle = new Turtle(new Point(500, 200), 0, new Pen());

        this.tinker();
    }

    tinker() {
        const turtle = this.sim.turtle;

        const iterations = 20;
        let lineLenth = 100;
        let penWidth = Math.min(iterations - 1, 10);

        for (let i = 0; i < iterations; i++) {
            turtle.pen.width = penWidth;

            turtle.pen.color = 'black';
            turtle.forward(lineLenth * 2);
            turtle.left(90);
            turtle.forward(lineLenth);
            turtle.left(90);
            turtle.forward(lineLenth);
            turtle.left(90);
            turtle.forward(lineLenth);

            turtle.pen.color = 'red';
            turtle.forward(lineLenth);
            turtle.right(90);
            turtle.pen.color = 'green';
            turtle.forward(lineLenth);
            turtle.left(90);
            turtle.pen.color = 'blue';
            turtle.forward(lineLenth);
            turtle.right(90);
            turtle.pen.color = 'orange';
            turtle.forward(lineLenth);

            turtle.left(90);

            lineLenth *= 0.85;
            if (penWidth > 1) {
                penWidth -= 1;
            }
        }
    }
}
