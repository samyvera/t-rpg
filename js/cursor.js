class Cursor {
    constructor(pos) {
        this.pos = pos;
        this.dir = new Vector2D(0, 0);

        this.coolDown = 4;
        this.currentCoolDown = 0;
        this.pressedSelectLastFrame = false;
        this.pressedCancelLastFrame = false;

        this.hoveredTile = null;
        this.hoveredUnit = null;
        this.selectedUnit = null;
        this.pathToSelectedUnit = null;

        this.update = (grid, keys) => {
            this.hoveredTile = grid.tiles[Math.floor(this.pos.x)][Math.floor(this.pos.y)];
            this.hoveredUnit = null;
            grid.units.forEach(unit => this.hoveredUnit = unit.pos.equals(this.pos.floor()) ? unit : this.hoveredUnit);
            this.move(grid, keys);

            if (!this.pressedSelectLastFrame) {
                if (keys.get('select')) {
                    if (this.hoveredUnit !== null && this.selectedUnit === null) {
                        this.selectedUnit = this.hoveredUnit;
                        this.selectedUnit.isSelected = true;
                        grid.setMoveTiles(this.selectedUnit);
                    }
                    this.pressedSelectLastFrame = true;
                }
            }
            else if (!keys.get('select')) this.pressedSelectLastFrame = false;

            if (!this.pressedCancelLastFrame) {
                if (keys.get('cancel')) {
                    if (this.selectedUnit !== null) {
                        this.pos = new Vector2D(this.selectedUnit.pos.x, this.selectedUnit.pos.y);
                        this.currentCoolDown = 0;
                        this.selectedUnit.isSelected = false;
                        this.selectedUnit = null;
                        this.pathToSelectedUnit = null;

                        grid.tiles.forEach(row => row.forEach(tile => {
                            tile.isInMoveReach = false;
                            tile.parent = null;
                        }));
                    }
                    this.pressedCancelLastFrame = true;
                }
            }
            else if (!keys.get('cancel')) this.pressedCancelLastFrame = false;

            if (this.selectedUnit) {
                var pathFinder = new Pathfinding(grid.tiles, grid.tiles[this.selectedUnit.pos.x][this.selectedUnit.pos.y], this.hoveredTile);
                while (pathFinder.isSearching) pathFinder.search();
                if (pathFinder.isSolvable) this.pathToSelectedUnit = pathFinder.path;
            }
            else this.pathToSelectedUnit = null;
        }

        this.move = (grid, keys) => {
            if (this.currentCoolDown === 0) {
                if (keys.get('left') && !keys.get('right') && this.pos.x > 0) this.dir.x = -1;
                else if (keys.get('right') && !keys.get('left') && this.pos.x + 1 < grid.size.x) this.dir.x = 1;
                else this.dir.x = 0;

                if (keys.get('up') && !keys.get('down') && this.pos.y > 0) this.dir.y = -1;
                else if (keys.get('down') && !keys.get('up') && this.pos.y + 1 < grid.size.y) this.dir.y = 1;
                else this.dir.y = 0;

                if (this.selectedUnit && grid.tiles[this.pos.x + this.dir.x] && grid.tiles[this.pos.x + this.dir.x][this.pos.y + this.dir.y] &&
                    !grid.tiles[this.pos.x + this.dir.x][this.pos.y + this.dir.y].isInMoveReach) {
                    if (this.dir.x !== 0 && this.dir.y !== 0 && grid.tiles[this.pos.x + this.dir.x] && grid.tiles[this.pos.x][this.pos.y + this.dir.y] &&
                        grid.tiles[this.pos.x + this.dir.x][this.pos.y].isInMoveReach !== grid.tiles[this.pos.x][this.pos.y + this.dir.y].isInMoveReach) {
                        if (grid.tiles[this.pos.x + this.dir.x][this.pos.y].isInMoveReach) this.dir.y = 0;
                        else this.dir.x = 0;
                    }
                    else this.dir = new Vector2D(0, 0);
                }
                this.currentCoolDown = this.coolDown;
            }
            if (this.currentCoolDown !== 0) this.currentCoolDown--;

            this.pos = this.pos.plus(new Vector2D(1 / this.coolDown * this.dir.x, 1 / this.coolDown * this.dir.y));
        }
    }
}