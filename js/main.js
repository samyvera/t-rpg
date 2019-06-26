window.onload = () => {
    var keyCodes = new Map([
        [37, "left"],
        [38, "up"],
        [39, "right"],
        [40, "down"],
        [87, "shoot"]
    ]);
    var trackKeys = codes => {
        var pressed = new Map();
        codes.forEach(code => pressed.set(code, false));
        var handler = event => {
            if (codes.get(event.keyCode) !== undefined) {
                var down = event.type === "keydown";
                pressed.set(codes.get(event.keyCode), down);
                event.preventDefault();
            }
        };
        addEventListener("keydown", handler);
        addEventListener("keyup", handler);
        return pressed;
    };
    var keys = trackKeys(keyCodes);

    var addTile = number => {
        if (number < 0.4) return 't';
        else if (number < 0.576) return 'g';
        else if (number < 0.5925) return 'c';
        else if (number < 0.65) return 's';
        else if (number < 0.7) return 'w';
        else return 'd';
    }

    var evaluate = value => {
        let a = 3;
        let b = 2;
        return Math.pow(value, a) / (Math.pow(value, a) + Math.pow(b - b * value, a));
    }

    var overworldSize = { x:128, y:128 };

    var noiseModifier = Array.from(Array(overworldSize.y), () => new Array(overworldSize.x));
    for (let x = 0; x < overworldSize.x; x++) for (let y = 0; y < overworldSize.y; y++) noiseModifier[y][x] = evaluate(Math.max(Math.abs(x / overworldSize.x * 2 - 1), Math.abs(y / overworldSize.y * 2 - 1)));

    var overworld = new Array(overworldSize.y);
    for (let y = 0; y < overworld.length; y++) overworld[y] = '';
    for (let y = 0; y < overworld.length; y++) for (let x = 0; x < overworldSize.x; x++) overworld[y] += addTile(perlinNoise(x/16, y/16) + noiseModifier[y][x]);

    var level = new Level(overworld, { x:0, y:0 }, { x:128, y:128 });
    var display = new Display(level);

    var frame = () => {
        level.update(keys);
        display.drawFrame();
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}