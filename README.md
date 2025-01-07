# Turtle Graphics

Tinkering implementation of [turtle graphics](https://en.wikipedia.org/wiki/Turtle_graphics)
for educational purpose.

## Hosted App

[Try It Out 🐢](https://datag.github.io/turtle-graphics/)

## Examples

Have a look at [src/examples](./src/examples).

## Manual control

### Buttons

Click the control buttons to move forward/backward, turn left/right 45°/90°, move the pen up/down, change the pen color and width, and undo the last operation.

### Keyboard

| Key          | Function            |
| ------------ | ------------------- |
| Cursor up    | Forward             |
| Cursor down  | Backward            |
| Cursor left  | Turn left 45°       |
| Cursor right | Turn right 45°      |
| Space        | Pen down            |
| Escape       | Pen up              |
| Backspace    | Undo last operation |

## Code a turtle graphic

### Turtle

| API          | Description            |
| ------------ | ------------------- |
| `forward(d)`    | Move forward with `d` distance            |
| `backward(d)`    | Move backward with `d` distance            |
| `left(a)`    | Turn left with `a` degree            |
| `right(a)`    | Turn right with `a` degree            |
| `penDown()`    | Move pen down           |
| `penUp()`    | Move pen up           |
| `pen.color`    | Set pen color (color/gradient/pattern)           |
| `pen.width`    | Set pen width          |
| `pushState()` | Explicitly add new new state from current state (e.g. for pen change)  |
| `popState()` | Removes the last state (i.e. undo)  |
| `resetStates()` | Remove all states and create a new with the current state  |

### Simulation

| API             | Description            |
| --------------- | ------------------- |
| `mainLoop()`    | Start the main loop            |
| `init()`        | Reset state index to start (replay states)            |


## Dev setup

Assuming we're using [Yarn](https://yarnpkg.com/).

```shell
yarn
yarn dev
```

And then browse to http://localhost:5173/.
