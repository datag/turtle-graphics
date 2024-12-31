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
const manualInputDistance = 10;

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

function manualInput(closure) {
    if (sim.turtle.stateIndex < sim.turtle.states.length - 1) {
        sim.turtle.toLastState();
    }
    closure();
    sim.turtle.toLastState();
}

function startExample() {
    sim.init();

    sim.speed = getOption('speed');

    if (getOption('skipAnimation')) {
        sim.turtle.toLastState();
    }
}

///////////////////////////////////////////////////////////////////////////////////////////

document.querySelector('#controls').addEventListener('click', (e) => {
    /** @type {HTMLElement} */
    const button = e.target;

    if (button.localName !== 'button') {
        return;
    }

    if (button.id === 'moveForward') {
        manualInput(() => sim.turtle.forward(manualInputDistance));
    } else if (button.id === 'moveBackward') {
        manualInput(() => sim.turtle.backward(manualInputDistance));
    } else if (button.id === 'turnLeft90') {
        manualInput(() => sim.turtle.left(90));
    } else if (button.id === 'turnRight90') {
        manualInput(() => sim.turtle.right(90));
    } else if (button.id === 'turnLeft45') {
        manualInput(() => sim.turtle.left(45));
    } else if (button.id === 'turnRight45') {
        manualInput(() => sim.turtle.right(45));
    } else if (button.id === 'penDown') {
        manualInput(() => sim.turtle.penDown());
    } else if (button.id === 'penUp') {
        manualInput(() => sim.turtle.penUp());
    } else if (button.id === 'lineWidthSmaller') {
        if (sim.turtle.pen.width <= 1) {
            return;
        }
        sim.turtle.pen.width--;
    } else if (button.id === 'lineWidthLarger') {
        sim.turtle.pen.width++;
    } else if (button.id === 'undo') {
        manualInput(() => sim.turtle.popState());
    } else if (button.matches('.color')) {
        sim.turtle.pen.color = e.target.getAttribute('data-color');
    } else {
        alert('Warning: Unhandled controls button');
        return;
    }
});

window.addEventListener("keydown", (event) => {
    const turtle = sim.turtle;

    if (event.repeat) {
        return;
    }

    switch (event.key) {
        case 'ArrowUp':
            manualInput(() => turtle.forward(manualInputDistance));
            break;
        case 'ArrowDown':
            manualInput(() => turtle.backward(manualInputDistance));
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
        case 'Backspace':
            manualInput(() => turtle.popState());
            break;
    }
});

document.querySelector('#actions').addEventListener('click', (e) => {
    /** @type {HTMLElement} */
    const button = e.target;

    if (button.localName !== 'button') {
        return;
    }

    if (button.id === 'reset') {
        const turtle = sim.turtle;

        turtle.pos = startPos.clone();
        turtle.angle = startAngle;
        turtle.pen = startPen.clone();

        turtle.resetStates();

        sim.init();
    } else if (button.id === 'replay') {
        sim.init();
    } else {
        alert('Warning: Unhandled actions button');
        return;
    }
});

document.querySelector('#skipAnimation').addEventListener('change', (e) => {
    if (e.target.checked) {
        sim.turtle.toLastState();
    }
});

document.querySelector('#speed').addEventListener('input', () => {
    sim.speed = getOption('speed');
});

document.querySelector('#examples').addEventListener('click', (e) => {
    /** @type {HTMLElement} */
    const button = e.target;

    if (button.localName !== 'button') {
        return;
    }

    if (button.id === 'koch') {
        sim.turtle = new Turtle(new Point(250, 250), 0, new Pen());

        const koch = new Koch(sim);
        koch.schneeflocke(3, 300, 3);
    } else if (button.id === 'dragon') {
        sim.turtle = new Turtle(new Point(500, 250), 0, new Pen());

        const dragon = new Dragon(sim);
        dragon.dragon(5, 12, true);
    } else if (button.id === 'tinker') {
        sim.turtle = new Turtle(new Point(500, 200), startAngle, startPen);

        const tinker = new Tinker(sim);
        tinker.tinker();
    } else {
        alert('Warning: Unhandled examples button');
        return;
    }

    startExample();
});
