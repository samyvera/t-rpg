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

    var overworld = new Array(32);
    for (let i = 0; i < overworld.length; i++) overworld[i] = '';
    for (let y = 0; y < overworld.length; y++) for (let x = 0; x < overworld.length; x++) {
        overworld[y] += perlinNoise(x/6, y/6, 0.8) < 0.6 ? ' ' : 'x';
    }

    var level = new Level(overworld, { x:6, y:6 }, { x:20, y:20 });
    var display = new Display(level);

    var frame = () => {
        level.update(keys);
        display.drawFrame();
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}