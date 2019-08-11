class Tile {
    constructor(id, pos, def, avo) {
        this.id = id;
        this.pos = pos;

        this.def = def;
        this.avo = avo;
        this.mov = 1;

        this.isInMoveReach = false;
        this.isInAttackReach = false;

        this.setNeighbors = tiles => {
            if (this.pos.x < tiles[0].length-1) this.neighbors.push(tiles[this.pos.x + 1][this.pos.y]);
            if (this.pos.y < tiles.length-1) this.neighbors.push(tiles[this.pos.x][this.pos.y + 1]);
            if (this.pos.x > 0) this.neighbors.push(tiles[this.pos.x - 1][this.pos.y]);
            if (this.pos.y > 0) this.neighbors.push(tiles[this.pos.x][this.pos.y - 1]);
        }

        this.f = 0;
        this.g = 0;
        this.h = 0;

        this.parent = null;
        this.neighbors = [];
    }
}