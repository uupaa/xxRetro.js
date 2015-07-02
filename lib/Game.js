(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("Game", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function Game(resp) { // @arg ResourcePoolObject - { atlas, clock, render, asset }
    this._resp = resp;
    this["init"]();
}

Game["prototype"] = Object.create(Game, {
    "constructor":  { "value": Game         }, // new Game(resp:ResourcePoolObject):Game
    "init":         { "value": Game_init    }, // Game#init():void
    // --- state ---
    "start":        { "value": Game_start   }, // Game#start():void
    "pause":        { "value": Game_pause   }, // Game#pause():void
});

// --- implements ------------------------------------------
function Game_init() {
    var asset  = this._resp["asset"];
    var render = this._resp["render"];

    // set rootNode
    render.rootNode = new Node(resp, "root");

    var mario_cues   = asset.get("mario_cues");
    var mario_action = asset.get("mario_action")
    var luigi_cues   = asset.get("luigi_cues");
    var luigi_action = asset.get("luigi_action")

    for (var i = 0, iz = CHARACTERS / 2; i < iz; ++i) {
        _createNode(i, iz, mario_cues, mario_action);
        _createNode(i, iz, luigi_cues, luigi_action);
    }

    function _createNode(index, length, cues, action) {
        var node = new AnimationNode(resp, render, { cues: cues, loops: 1 });

        node.x = (Math.random() * SCREEN_WIDTH);
        node.y = (Math.random() * SCREEN_HEIGHT);

        node.onenterframe = action;
        node.onended = function(event) {
            if (event.target.cue.id === "MARIO_JUMP") {
                //
            } else {
                return "NEXT_CUE";
            }
        };
        var scale = (((Math.random() * 1.8 + 0.2) * 10) | 0) / 10;

        // big mario
        if (length > 1000) {
            if (index === length - 2) {
                scale = 5;
                node.x = (Math.random() * (SCREEN_WIDTH - 200)  + 50);
                node.y = (Math.random() * (SCREEN_HEIGHT - 200) + 50);
            }
            if (index === length - 1) {
                scale = 20;
                node.x = (Math.random() * (SCREEN_WIDTH - 400)  + 50);
                node.y = (Math.random() * (SCREEN_HEIGHT - 400) + 50);
            }
        }

        node.sx = scale;
        node.sy = scale;

        // この例では rootNode 直下にフラットに追加している
        render.rootNode.add(node);

        // バラバラにするために時間差で start() する
        setTimeout(function() {
            node.start();
        }, (Math.random() * 2000) | 0);
    }
}

function Game_start() {
    this._resp["render"].start();
}

function Game_pause() {
    this._resp["render"].pause();
}

return Game; // return entity

});

