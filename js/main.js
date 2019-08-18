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
        [
            'kkdllllllllldddd',
            'kkdkkkkkkkkkdlll',
            'kkd444444444lkkk',
            'kkd444444444k444',
            'kkd4444444444444',
            'kkd444444444dd4d',
            'kkdddd444ddddl4l',
            'kkllll444llllkek',
            'kkkkkk6emkkkkkek',
            'kkkkkd6emdkkkkek',
            'kkkkkl444lkkkk4k',
            'kkkkkk6emkkkk444',
            'kkkkkk444kkkkccc',
            '44kkkk444kkkkkkk',
            '44hhhk444khhhhhh',
            '44hhhh444hhhhhhh',
            'cc99994449999999',
            'kk99994449999999',
        ],
        [
            '0000000000000000',
            '0000000000000000',
            '0001000000000100',
            '0001000000000100',
            '0001000000000000',
            '0001000000000000',
            '0000000000000010',
            '0000001000000110',
            '0000001000000110',
            '0000001000000110',
            '0000001000100110',
            '0000001000100100',
            '0000001000100000',
            '0000000000100000',
            '0010000001100000',
            '0010000001000000',
            '0010000001000000',
            '0010000001000000',
        ],
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