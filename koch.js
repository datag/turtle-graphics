export class Koch {
    constructor(sim) {
        this.sim = sim;
    }

    kochkurve(length, d) {
        const turtle = this.sim.turtle;

        if (d === 0) {
            turtle.forward(length);
        } else {
            this.kochkurve(length / 3, d - 1);
            turtle.left(60);
            this.kochkurve(length / 3, d - 1);
            turtle.right(120);
            this.kochkurve(length / 3, d - 1);
            turtle.left(60);
            this.kochkurve(length / 3, d - 1);
        }
    }

    schneeflocke(sides, length, d) {
        for (let i = 0; i < sides; i++) {
            this.kochkurve(length, d);
            this.sim.turtle.right(360 / sides);
        }
    }
}

