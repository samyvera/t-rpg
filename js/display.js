class Display {
    constructor(level) {
        this.zoom = 2;
        this.frame = 0;

        this.canvas = document.createElement('canvas');
        this.cx = this.canvas.getContext("2d");

        this.canvas.width = Math.min(innerWidth, level.size.x * 16 * this.zoom);
        this.canvas.height = Math.min(innerHeight, level.size.y * 16 * this.zoom);
        this.cx.scale(this.zoom, this.zoom);
        this.cx.imageSmoothingEnabled = false;

        this.viewport = {
            left: 0,
            top: 0,
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
                x:level.cursor.pos.x,
                y:level.cursor.pos.y
            };

            if (focus.x < view.left) view.left = focus.x;
            else if (focus.x > view.left + view.width) view.left = focus.x - view.width;

            if (focus.y < view.top) view.top = focus.y;
            else if (focus.y > view.top + view.height) view.top = focus.y - view.height;
        }

        this.drawBackground = () => {
            var view = this.viewport;
            var xStart = Math.floor(view.left);
            var xEnd = Math.ceil(view.left + view.width) + 1;
            var yStart = Math.floor(view.top );
            var yEnd = Math.ceil(view.top + view.height) + 1;

            var tileSet = document.createElement("img");
            tileSet.src = "img/tileSet.png";
            var tileX;
            var tileY;

            for (let x = xStart; x < xEnd; x++) {
                for (let y = yStart; y < yEnd; y++) {
                    if (!level.overworld[level.pos.y + y] || !level.overworld[level.pos.y + y][level.pos.x + x]) continue;
                    else {
                        var tile = level.overworld[level.pos.y + y][level.pos.x + x];

                        if (tile === 'x') tileX = 0, tileY = 1;
                        else if (tile === 'f') tileX = Math.round(this.frame / 32) % 2, tileY = 2;
                        else if (tile === 'o') tileX = 0, tileY = 0;
                        else tileX = 0, tileY = 0;
                        
                        var screenX = (x - view.left) * 16;
                        var screenY = (y - view.top) * 16;
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
                (level.cursor.pos.y - this.viewport.top) * 16 - 4,
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
                top: 0,
                width: this.canvas.width / this.zoom / 16 - 1,
                height: this.canvas.height / this.zoom / 16 - 1
            }
        }

        window.addEventListener('resize', this.resize);
        document.body.appendChild(this.canvas);
    }
}