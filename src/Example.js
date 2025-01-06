import { TurtleGraphics } from './TurtleGraphics.js';

export class Example {
    constructor(sim) {
        /** @type {TurtleGraphics} */
        this.sim = sim;
    }

    /** @returns {{id: string, name: string}} */
    static info() {
        return {
            id: 'example',
            name: 'Example',
        }
    }

    start() {
        throw new Error('Example needs to override start()');
    }
}
