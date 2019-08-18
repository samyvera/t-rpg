class Level {
    constructor(overworld) {
        this.grid = new Grid(overworld[0], overworld[1]);

        this.update = keys => {
            this.grid.update(this, keys);
        }
    }
}