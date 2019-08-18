class Grid {
    constructor(overworld, shadows) {
        this.size = new Vector2D(overworld[0].length, overworld.length);

        this.cursor = new Cursor(new Vector2D(9, 4));

        this.tiles = Array.from(Array(this.size.x), () => new Array(this.size.y));
        for (let x = 0; x < this.size.x; x++)
            for (let y = 0; y < this.size.y; y++) {
                var id = overworld[y][x];
                var def = 0;
                var avo = 0;
                var isCrossable = false;
                var shadow = shadows[y][x];

                switch (overworld[y][x]) {
                    case '1':
                        isCrossable = true;
                        break;
                    case '4':
                        isCrossable = true;
                        break;
                    case '6':
                        isCrossable = true;
                        break;
                    case 'e':
                        isCrossable = true;
                        break;
                    case 'm':
                        isCrossable = true;
                        break;
                    case 'q':
                        avo = -30;
                        break;
                    default:
                        break;
                }
                this.tiles[x][y] = new Tile(id, new Vector2D(x, y), def, avo, isCrossable, shadow);
            };
        this.tiles.forEach(row => row.forEach(tile => tile.setNeighbors(this.tiles)));

        this.setMoveTiles = unit => {
            var unitTile = this.tiles[unit.pos.x][unit.pos.y];

            var possibleTiles = [];

            this.tiles.forEach(row => row.forEach(tile => {
                var pathFinder = new Pathfinding(this.tiles, unitTile, tile);
                while (pathFinder.isSearching) pathFinder.search();
                if (pathFinder.isSolvable && pathFinder.path.length - 1 <= unit.mov) possibleTiles.push(tile);
            }));

            possibleTiles.forEach(tile => tile.isInMoveReach = true);
        }

        this.units = [
            new Unit('Harlson', 'Lord', false, new Vector2D(3, 3), 1, 7, null),
            new Unit('Nui', 'Priest', true, new Vector2D(9, 4), 0, 5, null),
        ];

        this.update = (level, keys) => {
            this.cursor.update(this, keys);
        }
    }
}