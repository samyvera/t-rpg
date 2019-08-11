class Level {
    constructor(overworld) {
        this.grid = new Grid(overworld);

        this.update = keys => {
            this.grid.update(this, keys);
        }
    }
}