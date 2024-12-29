import './style.css';
import { TurtleGraphics, Turtle, Pen, Point } from './turtle.js';
import { Koch } from './examples/koch.js';
import { Dragon } from './examples/dragon.js';
import { Tinker } from './examples/tinker.js';

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

function getOption(name) {
    switch (name) {
        case 'skipAnimation':
            return document.querySelector(`#${name}`).checked;
        case 'speed':
            return parseFloat(document.querySelector(`#${name}`).value);
        default:
            throw new Error(`Unknown option: ${name}`);
    }
}

function startExample() {
    sim.init();

    sim.speed = getOption('speed');

    if (getOption('skipAnimation')) {
        sim.turtle.toLastState();
    }
}

///////////////////////////////////////////////////////////////////////////////////////////

const controlsDistance = 10;

function manualInput(closure) {
    sim.turtle.toLastState();
    closure();
    sim.turtle.toLastState();
}

document.querySelector('#moveForward').addEventListener('click', () => manualInput(() => sim.turtle.forward(controlsDistance)));
document.querySelector('#moveBackward').addEventListener('click', () => manualInput(() => sim.turtle.backward(controlsDistance)));

document.querySelector('#turnLeft90').addEventListener('click', () => manualInput(() => sim.turtle.left(90)));
document.querySelector('#turnRight90').addEventListener('click', () => manualInput(() => sim.turtle.right(90)));
document.querySelector('#turnLeft45').addEventListener('click', () => manualInput(() => sim.turtle.left(45)));
document.querySelector('#turnRight45').addEventListener('click', () => manualInput(() => sim.turtle.right(45)));

document.querySelector('#penDown').addEventListener('click', () => manualInput(() => sim.turtle.penDown()));
document.querySelector('#penUp').addEventListener('click', () => manualInput(() => sim.turtle.penUp()));

window.addEventListener("keydown", (event) => {
    const turtle = sim.turtle;

    if (event.repeat) {
        return;
    }

    switch (event.key) {
        case 'ArrowUp':
            manualInput(() => turtle.forward(controlsDistance));
            break;
        case 'ArrowDown':
            manualInput(() => turtle.backward(controlsDistance));
            break;
        case 'ArrowLeft':
            manualInput(() => turtle.left(45));
            break;
        case 'ArrowRight':
            manualInput(() => turtle.right(45));
            break;
        case ' ':
            manualInput(() => turtle.penDown());
            break;
        case 'Escape':
            manualInput(() => turtle.penUp());
            break;
    }
});

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

document.querySelector('#skipAnimation').addEventListener('change', (e) => {
    if (e.target.checked) {
        sim.turtle.toLastState();
    }
});

document.querySelector('#speed').addEventListener('input', () => {
    sim.speed = getOption('speed');
});

document.querySelector('#koch').addEventListener('click', () => {
    sim.turtle = new Turtle(new Point(250, 250), 0, new Pen());

    const koch = new Koch(sim);
    koch.schneeflocke(3, 300, 3);

    startExample();
});

document.querySelector('#dragon').addEventListener('click', () => {
    sim.turtle = new Turtle(new Point(500, 250), 0, new Pen());

    const dragon = new Dragon(sim);
    dragon.dragon(5, 12, true);

    startExample();
});

document.querySelector('#tinker').addEventListener('click', () => {
    sim.turtle = new Turtle(new Point(500, 200), startAngle, startPen);

    const tinker = new Tinker(sim);
    tinker.tinker();

    sim.init();

    startExample();
});
