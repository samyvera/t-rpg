class Display {
    constructor(level) {
        this.frame = 0;
        this.zoom = 3;

        this.canvas = document.createElement('canvas');
        this.cx = this.canvas.getContext("2d");

        this.canvas.width = Math.min(innerWidth, level.grid.size.x * 16 * this.zoom);
        this.canvas.height = Math.min(innerHeight, level.grid.size.y * 16 * this.zoom);
        this.cx.scale(this.zoom, this.zoom);
        this.cx.imageSmoothingEnabled = false;

        this.viewport = {
            left: 0,
            bottom: 0,
            width: this.canvas.width / this.zoom / 16 - 1,
            height: this.canvas.height / this.zoom / 16 - 1
        }

        this.drawFrame = () => {
            this.updateViewport();

            this.drawBackground();
            this.drawCursor();
            this.drawUnits();

            this.drawHUD();

            this.frame++;
        }

        this.updateViewport = () => {
            var view = this.viewport;

            var focus = new Vector2D(level.grid.cursor.pos.x, level.grid.cursor.pos.y);

            if (focus.x < view.left) view.left = focus.x;
            else if (focus.x > view.left + view.width) view.left = focus.x - view.width;

            if (focus.y < view.bottom) view.bottom = focus.y;
            else if (focus.y > view.bottom + view.height) view.bottom = focus.y - view.height;
        }

        this.drawUnits = () => {
            var view = this.viewport;
            var xStart = Math.floor(view.left);
            var xEnd = Math.ceil(view.left + view.width) + 1;
            var yStart = Math.floor(view.bottom);
            var yEnd = Math.ceil(view.bottom + view.height) + 1;

            level.grid.units.forEach(unit => {
                this.cx.fillStyle = unit.affiliation ? '#00f' : '#f00';
                this.cx.fillStyle = unit.isSelected ? '#f80' : this.cx.fillStyle;
                if (unit.pos.x < xEnd && unit.pos.x + 1 > xStart &&
                    unit.pos.y < yEnd && unit.pos.y + 1 > yStart) {
                    this.cx.fillRect((unit.pos.x - view.left) * 16 + 2, (unit.pos.y - view.bottom) * 16 + 2, 12, 12);
                }
            });
        }

        this.drawBackground = () => {
            var view = this.viewport;
            var xStart = Math.floor(view.left);
            var xEnd = Math.ceil(view.left + view.width) + 1;
            var yStart = Math.floor(view.bottom);
            var yEnd = Math.ceil(view.bottom + view.height) + 1;

            var tileSet = document.createElement("img");
            tileSet.src = "img/clean.png";
            var tileX;
            var tileY;
            for (let x = xStart; x < xEnd; x++) {
                for (let y = yStart; y < yEnd; y++) {
                    if (level.grid.tiles[x] === undefined || level.grid.tiles[x][y] === undefined) continue;
                    else {
                        switch (level.grid.tiles[x][y].id) {
                            case 'Plain':
                                tileX = 1, tileY = 0;
                                break;
                            case 'Water':
                                tileX = 1, tileY = 3;
                                break;
                            default:
                                tileX = 0, tileY = 0;
                                break;
                        }
                        this.cx.drawImage(tileSet,
                            tileX * 16, tileY * 16, 16, 16,
                            (x - view.left) * 16, (y - view.bottom) * 16, 16, 16);
                        
                        if (level.grid.tiles[x][y].isInMoveReach) {
                            this.cx.fillStyle = '#00f5';
                            this.cx.fillRect((x - view.left) * 16, (y - view.bottom) * 16, 15, 15);
                        }
                    }
                }
            }

            if (level.grid.cursor.pathToSelectedUnit) {
                this.cx.strokeStyle = '#ff8';
                this.cx.lineWidth = 4;
                this.cx.moveTo((level.grid.cursor.pos.x - view.left) * 16 + 8, (level.grid.cursor.pos.y - view.bottom) * 16 + 8);
                this.cx.beginPath();
                this.cx.lineTo((level.grid.cursor.pos.x - view.left) * 16 + 8, (level.grid.cursor.pos.y - view.bottom) * 16 + 8);
                level.grid.cursor.pathToSelectedUnit.forEach((tile, key) => {
                    if (key !== 0) this.cx.lineTo((tile.pos.x - view.left) * 16 + 8, (tile.pos.y - view.bottom) * 16 + 8);
                });
                this.cx.stroke();
            }
        }

        this.drawCursor = () => {
            var sprite = document.createElement("img");
            sprite.src = 'img/cursor.png';
            this.cx.drawImage(sprite,
                Math.round(this.frame / 8) % 3 * 16 * 1.5, (level.grid.cursor.selectedUnit ? 1 : 0) * 24, 16 * 1.5, 16 * 1.5,
                (level.grid.cursor.pos.x - this.viewport.left) * 16 - 4,
                (level.grid.cursor.pos.y - this.viewport.bottom) * 16 - 4,
                16 * 1.5, 16 * 1.5
            );
        }

        this.drawHUD = () => {

            var tileInfo = document.createElement("img");
            tileInfo.src = 'img/tileInfo.png';
            this.cx.drawImage(tileInfo,
                0, 0, 48, 24,
                0, 0, 48, 24
            );
            this.cx.fillStyle = '#fff';
            this.cx.font = '7px Tahoma';
            this.cx.textAlign = 'center';
            this.cx.fillText(level.grid.cursor.hoveredTile.id, 24, 10);
            this.cx.textAlign = 'left';
            this.cx.fillStyle = '#bbf';
            this.cx.fillText(level.grid.cursor.hoveredTile.def, 12, 20);
            this.cx.fillText(level.grid.cursor.hoveredTile.avo, 32, 20);

            if (level.grid.cursor.hoveredUnit) {
                var unitInfo = document.createElement("img");
                unitInfo.src = 'img/unitInfo.png';
                this.cx.drawImage(unitInfo,
                    0, 0, 112, 24,
                    this.canvas.width / this.zoom - 112, 0, 112, 24
                );

                var mugshots = document.createElement("img");
                mugshots.src = 'img/mugshots.png';
                this.cx.drawImage(mugshots,
                    level.grid.cursor.hoveredUnit.mugshot * 21, 0, 21, 21,
                    this.canvas.width / this.zoom - 111, 1, 21, 21
                );

                this.cx.textAlign = 'left';
                this.cx.fillStyle = '#fff';
                this.cx.font = '7px Tahoma';
                this.cx.fillText(level.grid.cursor.hoveredUnit.name, this.canvas.width / this.zoom - 88, 10);
                this.cx.fillStyle = '#bbf';
                this.cx.font = '6px Tahoma';
                this.cx.fillText('HP', this.canvas.width / this.zoom - 88, 18);
                this.cx.fillText('LV', this.canvas.width / this.zoom - 26, 9);
                this.cx.font = '7px Tahoma';
                this.cx.fillText(level.grid.cursor.hoveredUnit.unitClass, this.canvas.width / this.zoom - 59, 20);
                this.cx.fillStyle = '#fff';
                this.cx.fillText('20/20', this.canvas.width / this.zoom - 79, 20);
                this.cx.fillText('20', this.canvas.width / this.zoom - 12, 10);
            }
        }

        this.resize = () => {
            this.canvas.width = Math.min(innerWidth, level.grid.size.x * 16 * this.zoom);
            this.canvas.height = Math.min(innerHeight, level.grid.size.y * 16 * this.zoom);
            this.cx.scale(this.zoom, this.zoom);
            this.cx.imageSmoothingEnabled = false;

            this.viewport = {
                left: 0,
                bottom: 0,
                width: this.canvas.width / this.zoom / 16 - 1,
                height: this.canvas.height / this.zoom / 16 - 1
            }
        }

        window.addEventListener('resize', this.resize);
        document.body.appendChild(this.canvas);
    }
}