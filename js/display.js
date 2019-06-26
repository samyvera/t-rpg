class Display {
    constructor(level) {
        this.zoom = 3;
        this.frame = 0;

        this.canvas = document.createElement('canvas');
        this.cx = this.canvas.getContext("2d");

        this.canvas.width = Math.min(innerWidth, level.size.x * 16 * this.zoom);
        this.canvas.height = Math.min(innerHeight, level.size.y * 16 * this.zoom);
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

            this.frame++;
        }

        this.updateViewport = () => {
            var view = this.viewport;

            var focus = {
                x: level.cursor.pos.x,
                y: level.cursor.pos.y
            };

            if (focus.x < view.left) view.left = focus.x;
            else if (focus.x > view.left + view.width) view.left = focus.x - view.width;

            if (focus.y < view.bottom) view.bottom = focus.y;
            else if (focus.y > view.bottom + view.height) view.bottom = focus.y - view.height;
        }

        this.drawBackground = () => {
            var view = this.viewport;
            var xStart = Math.floor(view.left);
            var xEnd = Math.ceil(view.left + view.width) + 1;
            var yStart = Math.floor(view.bottom);
            var yEnd = Math.ceil(view.bottom + view.height) + 1;

            var tileSet = document.createElement("img");
            tileSet.src = "img/tileSet.png";
            var tileX;
            var tileY;

            for (let x = xStart; x < xEnd; x++) {
                for (let y = yStart; y < yEnd; y++) {
                    if (level.overworld[level.pos.y + y] === undefined || level.overworld[level.pos.y + y][level.pos.x + x] === undefined) continue;
                    else {
                        var tile = level.overworld[level.pos.y + y][level.pos.x + x];
                        if (tile === 'd') tileX = 0, tileY = 0;
                        else if (tile === 'w') tileX = 4, tileY = 0;
                        else if (tile === 's') tileX = 8, tileY = 0;
                        else if (tile === 'g') tileX = 12, tileY = 0;
                        else if (tile === 't') tileX = 16, tileY = 0;
                        else if (tile === 'c') tileX = 0, tileY = 4;

                        var interact = (a, b) => {
                            if (
                                a === 'd' ||
                                a === 'w' && b !== 'd' ||
                                a === 's' && !(b === 'w' || b === 'd') ||
                                a === 'g' && b !== 's'
                            ) return true;
                            else return false;
                        }

                        if (tile !== 'd' && tile !== 'c') {
                            var n = {
                                bottom:level.overworld[level.pos.y + y + 1][level.pos.x + x] === tile || interact(tile, level.overworld[level.pos.y + y + 1][level.pos.x + x]),
                                right:level.overworld[level.pos.y + y][level.pos.x + x + 1] === tile || interact(tile, level.overworld[level.pos.y + y][level.pos.x + x + 1]),
                                top:level.overworld[level.pos.y + y - 1][level.pos.x + x] === tile || interact(tile, level.overworld[level.pos.y + y - 1][level.pos.x + x]),
                                left:level.overworld[level.pos.y + y][level.pos.x + x - 1] === tile || interact(tile, level.overworld[level.pos.y + y][level.pos.x + x - 1]),

                                bottomRight:level.overworld[level.pos.y + y + 1][level.pos.x + x + 1] === tile || interact(tile, level.overworld[level.pos.y + y + 1][level.pos.x + x + 1]),
                                topRight:level.overworld[level.pos.y + y - 1][level.pos.x + x + 1] === tile || interact(tile, level.overworld[level.pos.y + y - 1][level.pos.x + x + 1]),
                                topLeft:level.overworld[level.pos.y + y - 1][level.pos.x + x - 1] === tile || interact(tile, level.overworld[level.pos.y + y - 1][level.pos.x + x - 1]),
                                bottomLeft:level.overworld[level.pos.y + y + 1][level.pos.x + x - 1] === tile || interact(tile, level.overworld[level.pos.y + y + 1][level.pos.x + x - 1])
                            }

                            if (!(n.bottom && n.right && n.top && n.left)) {
                                if (!n.bottom && !n.right && !n.top && !n.left) tileY += 1;
                                else if (n.bottom && !n.right && n.top && !n.left) tileY += 2;
                                else if (!n.bottom && n.right && !n.top && n.left) tileY += 3;
    
                                else if (n.bottom && n.right && !n.top && n.left && n.bottomLeft && n.bottomRight) tileX += 1, tileY += 0;
                                else if (n.bottom && !n.right && n.top && n.left && n.topLeft && n.bottomLeft) tileX += 1, tileY += 1;
                                else if (!n.bottom && n.right && n.top && n.left && n.topLeft && n.topRight) tileX += 1, tileY += 2;
                                else if (n.bottom && n.right && n.top && !n.left && n.topRight && n.bottomRight) tileX += 1, tileY += 3;
                                else if (n.bottom && n.right && !n.top && n.left && !n.bottomLeft && !n.bottomRight) tileX += 2, tileY += 8;
                                else if (n.bottom && !n.right && n.top && n.left && !n.topLeft && !n.bottomLeft) tileX += 2, tileY += 9;
                                else if (!n.bottom && n.right && n.top && n.left && !n.topLeft && !n.topRight) tileX += 2, tileY += 10;
                                else if (n.bottom && n.right && n.top && !n.left && !n.topRight && !n.bottomRight) tileX += 2, tileY += 11;

                                else if (n.bottom && n.right && !n.top && n.left && !n.bottomLeft && n.bottomRight) tileX += 1, tileY += 8;
                                else if (n.bottom && !n.right && n.top && n.left && !n.topLeft && n.bottomLeft) tileX += 1, tileY += 9;
                                else if (!n.bottom && n.right && n.top && n.left && n.topLeft && !n.topRight) tileX += 1, tileY += 10;
                                else if (n.bottom && n.right && n.top && !n.left && n.topRight && !n.bottomRight) tileX += 1, tileY += 11;
                                else if (n.bottom && n.right && !n.top && n.left && n.bottomLeft && !n.bottomRight) tileY += 8;
                                else if (n.bottom && !n.right && n.top && n.left && n.topLeft && !n.bottomLeft) tileY += 9;
                                else if (!n.bottom && n.right && n.top && n.left && !n.topLeft && n.topRight) tileY += 10;
                                else if (n.bottom && n.right && n.top && !n.left && !n.topRight && n.bottomRight) tileY += 11;
    
                                else if (n.bottom && !n.right && !n.top && n.left && n.bottomLeft) tileX += 2, tileY += 0;
                                else if (!n.bottom && !n.right && n.top && n.left && n.topLeft) tileX += 2, tileY += 1;
                                else if (!n.bottom && n.right && n.top && !n.left && n.topRight) tileX += 2, tileY += 2;
                                else if (n.bottom && n.right && !n.top && !n.left && n.bottomRight) tileX += 2, tileY += 3;
                                else if (n.bottom && !n.right && !n.top && n.left && !n.bottomLeft && n.topRight) tileX += 3, tileY += 8;
                                else if (!n.bottom && !n.right && n.top && n.left && !n.topLeft && n.bottomRight) tileX += 3, tileY += 9;
                                else if (!n.bottom && n.right && n.top && !n.left && !n.topRight && n.bottomLeft) tileX += 3, tileY += 10;
                                else if (n.bottom && n.right && !n.top && !n.left && !n.bottomRight && n.topLeft) tileX += 3, tileY += 11;

                                else if (!n.bottom && !n.right && !n.top && n.left) tileX += 3, tileY += 0;
                                else if (!n.bottom && !n.right && n.top && !n.left) tileX += 3, tileY += 1;
                                else if (!n.bottom && n.right && !n.top && !n.left) tileX += 3, tileY += 2;
                                else if (n.bottom && !n.right && !n.top && !n.left) tileX += 3, tileY += 3;
                            }
                            else if (!(n.bottomRight && n.topRight && n.topLeft && n.bottomLeft)) {
                                tileY += 4;
                                if (!n.topRight && !n.bottomRight && !n.bottomLeft && !n.topLeft) tileY += 1;
                                else if (n.topRight && !n.bottomRight && n.bottomLeft && !n.topLeft) tileY += 2;
                                else if (!n.topRight && n.bottomRight && !n.bottomLeft && n.topLeft) tileY += 3;
    
                                else if (!n.topRight && n.bottomRight && n.bottomLeft && n.topLeft) tileX += 1, tileY += 0;
                                else if (n.topRight && !n.bottomRight && n.bottomLeft && n.topLeft) tileX += 1, tileY += 1;
                                else if (n.topRight && n.bottomRight && !n.bottomLeft && n.topLeft) tileX += 1, tileY += 2;
                                else if (n.topRight && n.bottomRight && n.bottomLeft && !n.topLeft) tileX += 1, tileY += 3;
    
                                else if (!n.topRight && !n.bottomRight && n.bottomLeft && n.topLeft) tileX += 2, tileY += 0;
                                else if (n.topRight && !n.bottomRight && !n.bottomLeft && n.topLeft) tileX += 2, tileY += 1;
                                else if (n.topRight && n.bottomRight && !n.bottomLeft && !n.topLeft) tileX += 2, tileY += 2;
                                else if (!n.topRight && n.bottomRight && n.bottomLeft && !n.topLeft) tileX += 2, tileY += 3;

                                else if (!n.topRight && !n.bottomRight && !n.bottomLeft && n.topLeft) tileX += 3, tileY += 0;
                                else if (n.topRight && !n.bottomRight && !n.bottomLeft && !n.topLeft) tileX += 3, tileY += 1;
                                else if (!n.topRight && n.bottomRight && !n.bottomLeft && !n.topLeft) tileX += 3, tileY += 2;
                                else if (!n.topRight && !n.bottomRight && n.bottomLeft && !n.topLeft) tileX += 3, tileY += 3;
                            }
                        }

                        var screenX = (x - view.left) * 16;
                        var screenY = (y - view.bottom) * 16;
                        this.cx.drawImage(tileSet, tileX * 16, tileY * 16, 16, 16, screenX, screenY, 16, 16);
                    }
                }
            }
        }

        this.drawCursor = () => {
            var sprite = document.createElement("img");
            sprite.src = 'img/cursor.png';

            this.cx.drawImage(sprite,
                Math.round(this.frame / 8) % 3 * 24, 0, 24, 24,
                (level.cursor.pos.x - this.viewport.left) * 16 - 4,
                (level.cursor.pos.y - this.viewport.bottom) * 16 - 4,
                24, 24
            );


            this.cx.fillStyle = '#fff';
            this.cx.font = '8px sans-serif';
            this.cx.fillText('x:' + level.cursor.pos.x, 2, 8);
            this.cx.fillText('y:' + level.cursor.pos.y, 2, 16);
            this.cx.fillText(level.cursor.hoveredTile.tile, 2, 24);
        }

        this.resize = () => {
            this.canvas.width = Math.min(innerWidth, level.size.x * 16 * this.zoom);
            this.canvas.height = Math.min(innerHeight, level.size.y * 16 * this.zoom);
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