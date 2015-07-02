(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("Asset", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
var PALLETS = {
    mario1: { 1: "#EA1E1A", 2: "#A37F00", 3: "#FFD382" },
    luigi1: { 1: "#FFFFFF", 2: "#49A131", 3: "#FFD382" },
};

//  "0123456789abcdef"
var MARIO_R = [
    "     11111      ",
    "    111111111   ",
    "    2223323     ",
    "   2323332333   ",
    "   23223332333  ",
    "   2233332222   ",
    "     3333333    ",
    "    221222      ",
    "   2221221222   ",
    "  222211112222  ",
    "  332131131233  ",
    "  333111111333  ",
    "  331111111133  ",
    "    111  111    ",
    "   222    222   ",
    "  2222    2222  ",
].join("");

var MARIO_R_RUN1 = [
    "                ",
    "     11111      ",
    "    111111111   ",
    "    2223323     ",
    "   2323332333   ",
    "   23223332333  ",
    "   2233332222   ",
    "     3333333    ",
    "    222212 3    ",
    "   3222222333   ",
    "  3312222233    ",
    "  221111111     ",
    "  211111111     ",
    " 22111 111      ",
    " 2    222       ",
    "      2222      ",
].join("");

var MARIO_R_RUN2 = [
    "     11111      ",
    "    111111111   ",
    "    2223323     ",
    "   2323332333   ",
    "   23223332333  ",
    "   2233332222   ",
    "     3333333    ",
    "  22221122      ",
    "332222111222333 ",
    "333 22131112233 ",
    "33  1111111  2  ",
    "   11111111122  ",
    "  111111111122  ",
    " 22111   11122  ",
    " 222            ",
    "  222           ",
].join("");

var MARIO_R_RUN3 = [
    "     11111      ",
    "    111111111   ",
    "    2223323     ",
    "   2323332333   ",
    "   23223332333  ",
    "   2233332222   ",
    "     3333333    ",
    "     21222      ",
    "    2221122     ",
    "   2221131113   ",
    "   2222111113   ",
    "   122333111    ",
    "    1233111     ",
    "     111222     ",
    "     2222222    ",
    "     2222       ",
].join("");

var MARIO_R_JUMP = [
    "             333",
    "      11111  333",
    "     11111111133",
    "     2223323 222",
    "    232333233322",
    "    232233323332",
    "    22333322222 ",
    "      33333332  ",
    "  22222122212   ",
    " 222222212221  2",
    "3322222211111  2",
    "333  12111313122",
    " 3 2 11111111122",
    "  22211111111122",
    " 2221111111     ",
    " 2  1111        ",
].join("");

var MARIO_R_BRAKE = [
    "       111111   ",
    "     111111112  ",
    "      323222222 ",
    "    333333233233",
    "   3322332233233",
    "    22333333233 ",
    "     331222111  ",
    "    22211233311 ",
    "    22222233321 ",
    "    22222233111 ",
    "     2222111111 ",
    "      11112221  ",
    "      11122221  ",
    "       1222112 2",
    "           22222",
    "           2222 ",
].join("");

// --- class / interfaces ----------------------------------
function Asset(resp) {
    this._resp = resp;

    var atlas = global["atlas"];
    var clock = global["clock"];
    var Jump  = global["Jump"];
    this._create();

    var canvas = document.createElement("canvas");
    canvas.width  = 1024;
    canvas.height = 1024;

    var res = { atlas: atlas, ctx: canvas.getContext("2d") };
}

Asset["prototype"] = Object.create(Asset, {
    "constructor":  { "value": Asset             }, // new Asset():Asset
    "get":          { "value": Asset_get         }, // Asset#get(name:String):Any|Function|Cue
});

// --- implements ------------------------------------------
function Asset_get(name) { // @arg String
                           // @ret Any|Function|Cue
    switch (name) {
    case "mario_cues":   return this._mario_cues;
    case "luigi_cues":   return this._luigi_cues;
    case "mario_action": return Asset_marioAction;
    case "luigi_action": return Asset_luigiAction;
    }
}

function Asset_create() {
    // スプライト画像を作成する
    var mario_r = [
        new Sprite(this._resp, "mario_r",      32, 32, function(ctx) { _draw16x16(ctx, MARIO_R,      PALLETS.mario1, 2); }),
        new Sprite(this._resp, "mario_r_run1", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_RUN1, PALLETS.mario1, 2); }),
        new Sprite(this._resp, "mario_r_run2", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_RUN2, PALLETS.mario1, 2); }),
        new Sprite(this._resp, "mario_r_run3", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_RUN3, PALLETS.mario1, 2); }),
        new Sprite(this._resp, "mario_r_jump", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_JUMP, PALLETS.mario1, 2); }),
    ];
    var mario_l = [
        new Sprite(this._resp, "mario_l",      32, 32, function(ctx) { _draw16x16(ctx, MARIO_R,      PALLETS.mario1, 2, true); }),
        new Sprite(this._resp, "mario_l_run1", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_RUN1, PALLETS.mario1, 2, true); }),
        new Sprite(this._resp, "mario_l_run2", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_RUN2, PALLETS.mario1, 2, true); }),
        new Sprite(this._resp, "mario_l_run3", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_RUN3, PALLETS.mario1, 2, true); }),
        new Sprite(this._resp, "mario_l_jump", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_JUMP, PALLETS.mario1, 2, true); }),
    ];
    var luigi_r = [
        new Sprite(this._resp, "luigi_r",      32, 32, function(ctx) { _draw16x16(ctx, MARIO_R,      PALLETS.luigi1, 2); }),
        new Sprite(this._resp, "luigi_r_run1", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_RUN1, PALLETS.luigi1, 2); }),
        new Sprite(this._resp, "luigi_r_run2", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_RUN2, PALLETS.luigi1, 2); }),
        new Sprite(this._resp, "luigi_r_run3", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_RUN3, PALLETS.luigi1, 2); }),
        new Sprite(this._resp, "luigi_r_jump", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_JUMP, PALLETS.luigi1, 2); }),
    ];
    var luigi_l = [
        new Sprite(this._resp, "luigi_l",      32, 32, function(ctx) { _draw16x16(ctx, MARIO_R,      PALLETS.luigi1, 2, true); }),
        new Sprite(this._resp, "luigi_l_run1", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_RUN1, PALLETS.luigi1, 2, true); }),
        new Sprite(this._resp, "luigi_l_run2", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_RUN2, PALLETS.luigi1, 2, true); }),
        new Sprite(this._resp, "luigi_l_run3", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_RUN3, PALLETS.luigi1, 2, true); }),
        new Sprite(this._resp, "luigi_l_jump", 32, 32, function(ctx) { _draw16x16(ctx, MARIO_R_JUMP, PALLETS.luigi1, 2, true); }),
    ];

    // キューを作成する
    var mario_cue_seek = new Cue("MARIO_SEEK",           [mario_r[0], mario_l[0]],             [DELAY * 5, DELAY * 5],                   [0, 1, 0, 1]  );
    var mario_cue_toR  = new Cue("MARIO_WALK_TO_RIGHT",  [mario_r[1], mario_r[2], mario_r[3]], [DELAY * 1, DELAY * 1, DELAY * 1], _times([0, 1, 2], 4) );
    var mario_cue_toL  = new Cue("MARIO_WALK_TO_LEFT",   [mario_l[1], mario_l[2], mario_l[3]], [DELAY * 1, DELAY * 1, DELAY * 1], _times([0, 1, 2], 4) );
    var mario_cue_jump = new Cue("MARIO_JUMP",           [mario_l[4]],                         [DELAY * 5],                              [0]           );

    var luigi_cue_seek = new Cue("LUIGI_SEEK",           [luigi_r[0], luigi_l[0]],             [DELAY * 5, DELAY * 5],                   [0, 1, 0, 1]  );
    var luigi_cue_toR = new Cue("LUIGI_WALK_TO_RIGHT",  [luigi_r[1], luigi_r[2], luigi_r[3]], [DELAY * 1, DELAY * 1, DELAY * 1], _times([0, 1, 2], 4) );
    var luigi_cue_toL = new Cue("LUIGI_WALK_TO_LEFT",   [luigi_l[1], luigi_l[2], luigi_l[3]], [DELAY * 1, DELAY * 1, DELAY * 1], _times([0, 1, 2], 4) );

    // 貯めこむ
    this._mario_cues = [
        mario_cue_seek,     // ((▲))
        mario_cue_toR,      //   ▲>>>
        mario_cue_seek,     //     ((▲))
        mario_cue_toL,      //    <<<▲
        mario_cue_jump      //   ▲^^^
    ];
    this._luigi_cues = [
        luigi_cue_toR,      //   ▲>>>
        luigi_cue_seek,     //     ((▲))
        luigi_cue_toL,      //    <<<▲
        luigi_cue_seek      // ((▲))
    ];
}

function _times(array, times) {
    var rv = [];

    for (var i = 0; i < times; ++i) {
        rv.push(array);
    }
    return Array.prototype.concat.apply([], rv);
}

function _draw16x16(ctx,
                    dotData,
                    palletData, // @arg ColorObject|ColorArray - { no: ColorName, ... } or [ ColorName ]
                    zoom,       // @arg Number = 1
                    reverse) {  // @arg Boolean = false
    zoom = zoom || 1;
    reverse = reverse || false;
    var dx = 0;
    var dy = 0;
    var dataWidth = 16;
    var dataHeight = 16;

    for (var y = 0; y < dataHeight; ++y) {
        for (var x = 0; x < dataWidth; ++x) {
            var i = y * dataWidth + (reverse ? dataWidth - x - 1 : x);
            var color = palletData[parseInt(dotData[i], 10) || 0] || "transparent";

            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.fillRect(dx * zoom + x * zoom, dy * zoom + y * zoom, zoom, zoom);
            ctx.closePath();
        }
    }
}

function Asset_marioAction(event) {
    var node = event.target;

    switch (node.cue.id) {
    case "MARIO_SEEK": break;
    case "MARIO_WALK_TO_RIGHT": node.x += (5 * node.sx); break;
    case "MARIO_WALK_TO_LEFT":  node.x -= (5 * node.sx); break;
    case "MARIO_JUMP":
        if (node.jump) {
            node.jump.reuse();
        } else {
            //node.jump = new Jump(clock, 24, node.y, function(y, cy, iy) {
            node.jump = new Jump(clock, Math.min(14 * node.sy, 70), node.y, function(y, cy, iy) {
                                if (cy <= 0) {
                                    node.y = iy;
                                    node.command("NEXT_CUE");
                                    return true; // end
                                } else {
                                    node.y = y; // update
                                }
                            });
        }
        break;
    }
}

function Asset_luigiAction(event) {
    var node = event.target;
    switch (node.cueIndex) {
    case 0: node.x += (5 * node.sx); break;
    case 1: break;
    case 2: node.x -= (5 * node.sx); break;
    case 3: break;
    }
}

return Asset;

});

