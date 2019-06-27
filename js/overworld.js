var evaluate = value => {
    let a = 3;
    let b = 2;
    return Math.pow(value, a) / (Math.pow(value, a) + Math.pow(b - b * value, a));
}

var fixCliffs = (overworld, overworldSize) => {
    var newOverwold = Array.from(Array(overworldSize.y), () => new Array(overworldSize.x));
    for (let x = 0; x < overworldSize.x; x++) for (let y = 0; y < overworldSize.y; y++) {
        var tile = overworld[y][x];
        if (tile === 'g') {
            var n = [
                overworld[y-1][x],
                overworld[y][x+1],
                overworld[y+1][x],
                overworld[y][x-1]
            ];
            var buffer = 0;
            n.forEach(c => buffer += (c === 'c') ? 1 : 0);
            if (buffer > 0) tile = 'c';
        }
        newOverwold[y][x] = tile;
    }
    for (let x = 0; x < overworldSize.x; x++) for (let y = 0; y < overworldSize.y; y++) {
        var tile = newOverwold[y][x];
        if (tile === 'g') {
            var n = [
                newOverwold[y-1][x],
                newOverwold[y][x+1],
                newOverwold[y+1][x],
                newOverwold[y][x-1]
            ];
            if ((n[0] === 'c' && n[2] === 'c' && !(n[1] === 'g' && n[3] === 'g')) ||
                (n[1] === 'c' && n[3] === 'c' && !(n[0] === 'g' && n[2] === 'g'))) tile = 'c';
        }
        newOverwold[y][x] = tile;
    }
    return newOverwold;
}

var fixRoads = (overworld, overworldSize) => {
    var newOverwold1 = Array.from(Array(overworldSize.y), () => new Array(overworldSize.x));
    for (let x = 0; x < overworldSize.x; x++) for (let y = 0; y < overworldSize.y; y++) {
        var tile = overworld[y][x];
        if (tile === 'r') {
            var n = {
                top:overworld[y-1][x],
                right:overworld[y][x+1],
                bottom:overworld[y+1][x],
                left:overworld[y][x-1]
            };
            if (
                (n.top === 'r' && n.right === 'r') ||
                (n.left === 'r' && n.top === 'r') ||
                (n.bottom === 'r' && n.left === 'r') ||
                (n.right === 'r' && n.bottom === 'r')
            ) tile = 'g';
        }
        newOverwold1[y][x] = tile;
    }
    var newOverwold2 = Array.from(Array(overworldSize.y), () => new Array(overworldSize.x));
    for (let x = 2; x < overworldSize.x - 4; x++) for (let y = 2; y < overworldSize.y - 4; y++) {
        var tile = newOverwold1[y][x];
        if (tile === 'g') {
            var n = {
                top:newOverwold1[y-1][x],
                right:newOverwold1[y][x+1],
                bottom:newOverwold1[y+1][x],
                left:newOverwold1[y][x-1],
                topRight:newOverwold1[y-1][x+1],
                bottomRight:newOverwold1[y+1][x+1],
                bottomLeft:newOverwold1[y+1][x-1],
                topLeft:newOverwold1[y-1][x-1],

                farTop:newOverwold1[y-2][x],
                farRight:newOverwold1[y][x+2],
                farBottom:newOverwold1[y+2][x],
                farLeft:newOverwold1[y][x-2],
                farTopRight:newOverwold1[y-2][x+2],
                farBottomRight:newOverwold1[y+2][x+2],
                farBottomLeft:newOverwold1[y+2][x-2],
                farTopLeft:newOverwold1[y-2][x-2]
            };

            if (
                (n.top === 'r' && n.bottom === 'r' && n.left !== 'r' && n.right !== 'r') ||
                (n.left === 'r' && n.right === 'r' && n.bottom !== 'r' && n.top !== 'r') ||
                (n.topRight === 'r' && n.bottomLeft === 'r' && n.left !== 'r' && n.right !== 'r' && n.bottom !== 'r' && n.top !== 'r' && n.topLeft !== 'r' && n.bottomRight !== 'r') ||
                (n.topLeft === 'r' && n.bottomRight === 'r' && n.bottom !== 'r' && n.top !== 'r' && n.left !== 'r' && n.right !== 'r' && n.topRight !== 'r' && n.bottomLeft !== 'r') ||
                (n.left === 'r' && n.topRight === 'r' && n.top !== 'r' && n.right !== 'r' && n.topLeft !== 'r' && n.bottomLeft !== 'r' && n.bottom !== 'r' && n.bottomRight !== 'r') ||
                (n.left === 'r' && n.bottomRight === 'r' && n.bottom !== 'r' && n.right !== 'r' && n.topLeft !== 'r' && n.bottomLeft !== 'r' && n.top !== 'r' && n.topRight !== 'r') ||
                (n.right === 'r' && n.bottomLeft === 'r' && n.bottom !== 'r' && n.left !== 'r' && n.topRight !== 'r' && n.bottomRight !== 'r' && n.top !== 'r' && n.topLeft !== 'r') ||
                (n.right === 'r' && n.topLeft === 'r' && n.top !== 'r' && n.left !== 'r' && n.topRight !== 'r' && n.bottomRight !== 'r' && n.bottom !== 'r' && n.bottomLeft !== 'r') ||
                (n.top === 'r' && n.bottomRight === 'r' && n.bottom !== 'r' && n.right !== 'r' && n.topLeft !== 'r' && n.topRight !== 'r' && n.left !== 'r' && n.bottomLeft !== 'r') ||
                (n.top === 'r' && n.bottomLeft === 'r' && n.bottom !== 'r' && n.left !== 'r' && n.topLeft !== 'r' && n.topRight !== 'r' && n.right !== 'r' && n.bottomRight !== 'r') ||
                (n.bottom === 'r' && n.topRight === 'r' && n.top !== 'r' && n.right !== 'r' && n.bottomRight !== 'r' && n.bottomLeft !== 'r' && n.left !== 'r' && n.topLeft !== 'r') ||
                (n.bottom === 'r' && n.topLeft === 'r' && n.top !== 'r' && n.left !== 'r' && n.bottomRight !== 'r' && n.bottomLeft !== 'r' && n.right !== 'r' && n.topRight !== 'r')
            ) tile = 'r';
        }
        newOverwold2[y][x] = tile;
    };
    return newOverwold2;
}

var addTile = (number, tiles) => {
    var result;
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].level(number)) {
            result = tiles[i].tile;
            break;
        }
    }
    return result;
}

var generateOverworld = (overworldSize, tiles, noise1, noise2, noise3) => {
    var overworld = new Array(overworldSize.y);
    var noiseModifier = Array.from(Array(overworldSize.y), () => new Array(overworldSize.x));
    for (let x = 0; x < overworldSize.x; x++) for (let y = 0; y < overworldSize.y; y++) noiseModifier[y][x] = evaluate(Math.max(Math.abs(x / overworldSize.x * 2 - 1), Math.abs(y / overworldSize.y * 2 - 1)));
    for (let y = 0; y < overworld.length; y++) overworld[y] = '';
    for (let y = 0; y < overworld.length; y++) for (let x = 0; x < overworldSize.x; x++) overworld[y] += addTile(
        (((perlinNoise(x/noise1, y/noise1) + perlinNoise(x/noise2, y/noise2) + perlinNoise(x/noise3, y/noise3)) / 3) - noiseModifier[y][x]) * 100, tiles
    );
    var overworld = fixRoads(overworld, overworldSize);
    var overworld = fixCliffs(overworld, overworldSize);
    return overworld;
}