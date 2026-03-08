# Copilot Instructions

## Dev Setup & Commands

```shell
yarn          # install dependencies
yarn dev      # start dev server at http://localhost:5173/
yarn build    # production build to ./dist
yarn preview  # preview production build
```

There are no test or lint commands.

## Architecture

This is a vanilla JS + Vite app that implements turtle graphics on an HTML5 Canvas.

**Core data flow:**
1. `Turtle` accumulates a `states: TurtleState[]` array — every movement/pen change appends a new state (position, angle, pen).
2. `TurtleGraphics` owns the canvas and drives a `requestAnimationFrame` loop (`mainLoop`). On each tick, `#update` advances `stateIndex` through the states array at a time-controlled pace (`speed`), and `#render` redraws everything by replaying states up to `stateIndex`.
3. `main.js` wires the UI (buttons, keyboard, sliders) to `Turtle` methods and manages the `sim` instance.

**Example system:**
- All examples live in `src/examples/` and must `extend Example` (from `src/Example.js`).
- `ExampleLoader` uses Vite's `import.meta.glob('./examples/*.js')` to auto-discover them at runtime — no manual registration needed.
- Each example class must implement `static info() → { id, name }` and `start()`.
- `start()` typically replaces `this.sim.turtle` with a fresh `Turtle`, then calls turtle API methods to build up the states array.

## Key Conventions

- **State is append-only during drawing**: every turtle API call (`forward`, `left`, `penDown`, etc.) ends with `pushState()`. Undo is `popState()`. Replay is `sim.init()` which resets `stateIndex` to 0 without clearing states.
- **Pen color change without movement**: mutate `turtle.pen.color` directly then call `turtle.pushState()` explicitly (or let the next move push it). See examples like `Koch.js` which set `turtle.pen.color` between recursive calls.
- **Angles**: 0° points right (east). Positive `right()` rotates clockwise; `left()` is `right(-degrees)`. Angles are in degrees; `toRadians()` is used internally for canvas math.
- **Canvas coordinate origin** is top-left; the turtle starts at center `(width/2, height/2)` by default.
- **SVG icons**: loaded as a raw SVG string via `vite-plugin-svgo` and injected into the DOM as a hidden `<div>` containing `<defs>`. Icons are referenced with `<use xlink:href="#icon-name">`.
- **No framework, no TypeScript**: plain ES modules with JSDoc `@type` annotations for IDE hints.
