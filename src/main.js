import './style.css';
import { TurtleGraphics, Turtle, Pen, Point } from './turtle.js';
import { Koch } from './koch.js';

const canvas = document.querySelector('#simCanvas');

const width = 800;
const height = 600;
const startPos = new Point(width / 2, height / 2);
const startAngle = 0;
const startPen = new Pen(true, 'black', 1);

const sim = new TurtleGraphics(
    canvas, width, height,
    new Turtle(startPos, startAngle, startPen),
);

sim.init();
sim.mainLoop(performance.now());

///////////////////////////////////////////////////////////////////////////////////////////

const distance = 10;
document.querySelector('#moveForward').addEventListener('click', () => sim.turtle.forward(distance));
document.querySelector('#moveBackward').addEventListener('click', () => sim.turtle.backward(distance));

document.querySelector('#turnLeft90').addEventListener('click', () => sim.turtle.left(90));
document.querySelector('#turnRight90').addEventListener('click', () => sim.turtle.right(90));
document.querySelector('#turnLeft45').addEventListener('click', () => sim.turtle.left(45));
document.querySelector('#turnRight45').addEventListener('click', () => sim.turtle.right(45));

document.querySelector('#penDown').addEventListener('click', () => sim.turtle.penDown());
document.querySelector('#penUp').addEventListener('click', () => sim.turtle.penUp());

document.querySelector('#reset').addEventListener('click', () => {
    const turtle = sim.turtle;

    turtle.pos = startPos.clone();
    turtle.angle = startAngle;
    turtle.pen = startPen.clone();

    turtle.resetStates();

    sim.init();
});

document.querySelector('#replay').addEventListener('click', () => {
    sim.init();
});

document.querySelector('#koch').addEventListener('click', () => {
    const turtle = sim.turtle;

    turtle.pos = new Point(250, 250);
    turtle.angle = 0;
    turtle.pen = new Pen();

    turtle.resetStates();

    const koch = new Koch(sim);
    koch.schneeflocke(3, 300, 3);

    sim.init();
});

window.addEventListener("keydown", (event) => {
    const turtle = sim.turtle;

    if (event.repeat) {
        return;
    }

    switch (event.key) {
        case 'ArrowUp':
            turtle.forward(distance);
            break;
        case 'ArrowDown':
            turtle.backward(distance);
            break;
        case 'ArrowLeft':
            turtle.left(45);
            break;
        case 'ArrowRight':
            turtle.right(45);
            break;
        case ' ':
            turtle.penDown();
            break;
        case 'Escape':
            turtle.penUp();
            break;
    }
});
