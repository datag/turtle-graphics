import { Example } from '../example.js';
import { Turtle, Point, Pen } from '../turtle.js';

export class Fibonacci extends Example {
    static info() {
        return {
            id: 'fibonacci',
            name: 'Fibonacci',
        }
    }

    static colors = ['#ff0000', '#00ff00', '#0000ff'];

    start() {
        this.sim.turtle = new Turtle(new Point(400, 300), 0, new Pen(true, null, 2));

        this.fib(10);
    }

    fib(iterations) {
        const turtle = this.sim.turtle;

        const lineLenth = 5;

        let last2 = 0;
        let last1 = 1;

        for (let i = 0; i < iterations; i++) {
            const f = last1;
            turtle.pen.color = Fibonacci.colors[i % Fibonacci.colors.length];

            turtle.forward(last1 * lineLenth);
            turtle.left(60);

            last1 += last2;
            last2 = f;
        }
    }
}
