import './style.css';
import svgDefs from './icons.svg';

import { TurtleGraphics, Turtle, Pen, Point } from './TurtleGraphics.js';
import { ExampleLoader } from './ExampleLoader.js';

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

const exampleLoader = new ExampleLoader();
(async () => {
    try {
        const examples = await exampleLoader.load();
        exampleLoader.addButtons(examples, document.querySelector('#examples'));

        document.querySelector('#examples').addEventListener('click', (e) => {
            /** @type {HTMLElement} */
            const button = e.target.closest('button');

            if (!button) {
                return;
            }

            const exampleDef = examples[button.id];
            if (exampleDef === undefined) {
                throw new Error(`Button with ID ${button.id} does not map to a loaded example`);
            }

            const exampleClass = exampleDef.class;
            const example = new exampleClass(sim);
            example.start();

            sim.init();

            sim.speed = getOption('speed');

            if (getOption('skipAnimation')) {
                sim.turtle.toLastState();
            }
        });

        // DEBUG
        const runExample = null; // 'fibonacci';
        if (runExample !== null) {
            document.querySelector('#skipAnimation').checked = true;
            document.querySelector('#'+runExample).click();
        }
    } catch (error) {
        console.error("Error loading examples:", error);
    }
})();

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

///////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
    // Inject SVG definitions
    const container = document.createElement('div');
    container.style.display = 'none';
    container.innerHTML = svgDefs;
    document.body.appendChild(container);
});

document.querySelector('#controls').addEventListener('click', (e) => {
    /** @type {HTMLElement} */
    const button = e.target.closest('button');

    if (!button) {
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
    const button = e.target.closest('button');

    if (!button) {
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
