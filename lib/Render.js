(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("Render", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function Render(resp) { // @arg ResourcePoolObject - { clock, atlas }
    this._resp = resp;
    this._tick = _tick.bind(this);

    // --- render tree ---
    this._dirty = true;
    this._rootNode = null;
    this._nodeCount = 0;
    this._renderNodes = []; // [ node, ...] // 全てを解決した状態のレンダリングノード

    // --- state ---
    this._stated = false;
}

Render["prototype"] = Object.create(Render, {
    "constructor":  { "value": Render              }, // new Render(resp:ResourcePoolObject):Render
    // --- state ---
    "start":        { "value": Render_start        }, // Render#start():void
    "pause":        { "value": Render_pause        }, // Render#pause():void
    "stop":         { "value": Render_stop         }, // Render#stop():void
    // ---
    "notify":       { "value": Render_notify       }, // Render#notify(sender:Any, message:String, value:Any|undefined, param:Any|undefined):void
    "rootNode":     { "get":   function()  { return this._rootNode; },
                      "set":   function(v) { this._rootNode = v;    } },
});

// --- implements ------------------------------------------
function _tick(timeStamp,   // @arg Number - current time
               deltaTime) { // @arg Number - delta time
                            // @bind this
                            // @callfrom Clock#_enterFrame
    if (this._dirty) { // dirty -> update render nodes.
        this._dirty = false;
        this._renderNodes = _getNodes(this._rootNode, true, false);
    }
    //timeStamp -= this._pausedTime.total; // adjust time when paused.

    var ctx    = this._resp["ctx"];
    var width  = this._resp["width"];
    var height = this._resp["height"];
    var atlas  = this._resp["atlas"];
    var perf   = this._resp["perf"] || 0;

    // atlas が汚れていたら更新する
    if (atlas["dirty"]) {
        atlas["updateCache"]();
    }
    // 毎フレームクリアする
    ctx.clearRect(0, 0, width, height);

//{@dev
    perf["a"];
//}@dev

    for (var i = 0, iz = this._renderNodes.length; i < iz; ++i) {
        var node = this._renderNodes[i];
        if (node) {
            node["tick"](timeStamp, deltaTime);
        }
    }
//{@dev
    perf["b"];
//}@dev
}

function _getNodes(rootNode,    // @arg Node
                   visible,     // @arg Boolean = false - enum visible nodes.
                   algorithm) { // @arg Boolean = false - Tree traversal algorithm.
                                //                        false is breadth first search. 幅優先探索
                                //                        true is depth first search. 深さ優先探索
                                // @ret NodeArray - [node, ...]
    var result = [];
    var queue = [rootNode];

    if (!algorithm) {
        // --- breadth first search ---
        for (var q = 0; q < queue.length; ++q) {
            Array.prototype.push.apply(queue, queue[q]["children"]);
        }
        if (!visible) {
            return queue.slice(1); // remove rootNode
        }
        // ignore hidden node
        for (var i = 1, iz = queue.length; i < iz; ++i) {
            var node = queue[i];
            if (node["visible"]) {
                result.push(node);
            }
        }
    } else {
        // --- depth first search ---
        // TODO:
        throw new Error("NOT IMPL");
    }
    return result;
}

function Render_start() {
    if (!this._stated) {
        this._stated = true;

        if (this._dirty) { // dirty -> update render nodes.
            this._dirty = false;
            this._renderNodes = _getNodes(this._rootNode, true, false);
        }
        //if (this._pausedTime.begin) { // pause -> play, adjust time when paused.
        //    this._pausedTime.total += (this._clock["now"]() - this._pausedTime.begin);
        //    this._pausedTime.begin = 0;
        //}
        this._clock["on"](this._tick);
    }
}

function Render_pause() {
    if (this._stated) {
        this._stated = false;
        //this._pausedTime.begin = this._clock["now"](); // adjust time when paused.
        this._clock["off"](this._tick);
    }
}

function Render_stop() {
    this._stated = false;
    //this._pausedTime.begin = 0;
    this._clock["off"](this._tick);
}

function Render_notify(sender,  // @arg Any
                       message, // @arg String
                       value,   // @arg Any|undefined
                       param) { // @arg Any|undefined
                                // @callfrom Render***Node
    // 詳細不明
    switch (message) {
    case "Node#add":
    case "Node#swap":
    case "Node#insert":
    case "Node#remove":
    case "Node#setOrder":
    case "Node#sortOrder":
    case "Node#setParent":
    case "Node#setVisible":
        this._dirty = true; // set dirty flag
        break;
    case "Node#reorder":
        break;
    default:
        console.log("unknown message: " + message);
        break;
    }
}

return Render; // return entity

});

