class Cursor {
    constructor(pos) {
        this.pos = pos;
        this.dir = { x:0, y:0 };

        this.coolDown = 4;
        this.currentCoolDown = 0;

        this.hoveredTile = null;

        this.update = (level, keys) => {
            this.hoveredTile = level.grid[Math.floor(this.pos.x)][Math.floor(this.pos.y)];
            this.move(level, keys);
        }

        this.move = (level, keys) => {
            if (this.currentCoolDown === 0) {
                if (keys.get('left') && !keys.get('right') && this.pos.x > 0) this.dir.x = -1;
                else if (keys.get('right') && !keys.get('left') && this.pos.x + 1 < level.size.x) this.dir.x = 1;
                else this.dir.x = 0;

                if (keys.get('up') && !keys.get('down') && this.pos.y > 0) this.dir.y = -1;
                else if (keys.get('down') && !keys.get('up') && this.pos.y + 1 < level.size.y) this.dir.y = 1;
                else this.dir.y = 0;

                this.currentCoolDown = this.coolDown;
            }
            
            if (this.currentCoolDown !== 0) this.currentCoolDown--;
            
            this.pos.x += 1 / this.coolDown * this.dir.x;
            this.pos.y += 1 / this.coolDown * this.dir.y;
        }
    }
}

class Level {
    constructor(overworld, pos, size) {
        this.overworld = overworld;
        this.overworldSize = { x:this.overworld[0].length, y:this.overworld.length };

        this.pos = pos;
        this.size = size;

        this.initGrid = () => {
            var grid = Array.from(Array(this.size.x), () => new Array(this.size.y));
            for (let x = 0; x < this.size.x; x++) for (let y = 0; y < this.size.y; y++) {
                var tileIndex = this.overworld[this.pos.y + y][this.pos.x + x];
                var tile = null;
                
                if (tileIndex === 't') tile = 'wood';
                else if (tileIndex === 'g') tile = 'plain';
                else if (tileIndex === 'c') tile = 'cliff';
                else if (tileIndex === 'r') tile = 'road';
                else if (tileIndex === 'w') tile = 'water';
                else if (tileIndex === 's') tile = 'sand';
                else tile = 'unknown';

                grid[x][y] = { pos:{ x:x, y:y }, tile:tile };
            };
            return grid;
        }
        this.grid = this.initGrid();

        this.cursor = new Cursor({ x:this.size.x / 2, y:this.size.y / 2 });

        this.update = keys => {
            this.cursor.update(this, keys);
        }
    }
}