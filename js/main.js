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

    var overworld = [
        '                                ',
        '                                ',
        '                                ',
        '                                ',
        '     xxxxxxxxxxxxxxxxxxxxxxx    ',
        '     x                     x    ',
        '     x       xx   xxxxxxxx x    ',
        '     x f     xx   xxxxxxxx x    ',
        '     x   f   xx   xxxxxxxx x    ',
        '     x       xx   xxxxxxxx x    ',
        '     x    xxxxx   xxxxxxxx x    ',
        '     x       xx            x    ',
        '     x   f   xx            x    ',
        '     x xx    xx  xx  f     x    ',
        '     x xx    xx  xx        x    ',
        '     x       xx      x     x    ',
        '     x    f  xx        f   x    ',
        '     x       xx  f         x    ',
        '     x  xx   xxxxx   xxxxx x    ',
        '     x  xx   xxxxx   xxxxx x    ',
        '     x  xx        o o      x    ',
        '     x               f     x    ',
        '     x   f  o           xx x    ',
        '     x      o    f   x  xx x    ',
        '     x      f  xx    x     x    ',
        '     x               x     x    ',
        '     x  f         f        x    ',
        '     xxxxxxxxxxxxxxxxxxxxxxx    ',
        '                                ',
        '                                ',
        '                                ',
        '                                ',
    ];

    var level = new Level(overworld, { x:6, y:6 }, { x:20, y:20 });
    var display = new Display(level);

    var frame = () => {
        level.update(keys);
        display.drawFrame();
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}