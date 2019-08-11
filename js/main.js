window.onload = () => {
    var keyCodes = new Map([
        [37, "left"],
        [38, "up"],
        [39, "right"],
        [40, "down"],
        [87, "select"],
        [88, "cancel"]
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
        'gggggggggggggggg',
        'gggggggggggggggg',
        'gggg  wwgggggwgg',
        'gggggggggggggwgg',
        'gggggggggggggwgg',
        'gggggggggggggwgg',
        'ggggg   gggggwgg',
        'gggggggwwwwwwwww',
        'ggggggggggwwwwww',
        'ggggg  ggggggggw',
        'ggggg  ggggggggw',
        'gggggggggg   ggw',
        'gggggggggggggggw',
        'gggggggggggggggw',
        'ggggggg    ggggw',
        'wwwwwwwwwwwwwwww',
    ];

    var level = new Level(overworld);
    var display = new Display(level);

    var frame = () => {
        level.update(keys);
        display.drawFrame();
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}