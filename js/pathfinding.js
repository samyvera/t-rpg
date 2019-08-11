class Pathfinding {
    constructor(grid, gridStart, gridEnd) {
        this.grid = grid;
        this.gridStart = gridStart;
        this.gridEnd = gridEnd;

        this.openSet = [this.gridStart];
        this.closedSet = [];

        this.path = [];
        this.isSearching = true;
        this.isSolvable;

        this.removeFromArray = (array, element) => {
            for (let i = array.length-1; i >= 0 ; i--) {
                if (array[i] === element) array.splice(i, 1);
            }
        }

        this.heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

        this.search = () => {
            if (this.openSet.length > 0) {
                var pathIndex = 0;
                this.openSet.forEach((cell, key) => {
                    if (cell.f < this.openSet[pathIndex].f) pathIndex = key;
                });
                var currentCell = this.openSet[pathIndex];

                if (currentCell === this.gridEnd) {
                    this.isSearching = false;
                    this.isSolvable = true;
                }
                else {
                    this.removeFromArray(this.openSet, currentCell);
                    this.closedSet.push(currentCell);
    
                    currentCell.neighbors.forEach(neighbor => {
                        if (!this.closedSet.includes(neighbor) && neighbor.id !== 'Water' && neighbor.id !== 'Unknown') {
                            var g = currentCell.g + 1;
    
                            if (this.openSet.includes(neighbor)) {
                                if (g < neighbor.g) neighbor.g = g;
                            }
                            else {
                                neighbor.g = g;
                                this.openSet.push(neighbor);
                            }
    
                            neighbor.h = this.heuristic(neighbor.pos, this.gridEnd.pos);
                            neighbor.f = neighbor.g + neighbor.h;
                            neighbor.parent = currentCell;
                        }
                    });
                }

                var path = [];
                var cell = currentCell;
                path.push(cell);

                var findPath = () => {
                    path.push(cell.parent);
                    cell = cell.parent;
                    if (cell.parent) findPath();
                }
                if (cell.parent) findPath();
                this.path = path;
            }
            else {
                this.isSearching = false;
                this.isSolvable = false;
            }
        }
    }
}