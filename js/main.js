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

    var tiles = [
        { tile:'w', level:n => n < 40 },
        { tile:'s', level:n => n < 43 },
        { tile:'c', level:n => n < 43.5 },
        { tile:'r', level:n => n > 49 && n < 51 },
        { tile:'g', level:n => n < 55 },
        { tile:'t', level:n => n >= 55 },
    ];

    var noise1 = 64;
    var noise2 = 18;
    var noise3 = 10;

    var overworldSize = { x:128, y:128 };

    var overworld = generateOverworld(overworldSize, tiles, noise1, noise2, noise3);

    var level = new Level(overworld, { x:24, y:40 }, { x:64, y:64 });
    var display = new Display(level);

    var frame = () => {
        level.update(keys);
        display.drawFrame();
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}