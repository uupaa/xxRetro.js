(function(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
//var _isNodeOrNodeWebKit = !!global.global;
//var _runOnNodeWebKit =  _isNodeOrNodeWebKit &&  /native/.test(setTimeout);
//var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
//var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
//var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

// --- class / interfaces ----------------------------------
function Sprite(resources,  // @arg Object - { game, ctx, asset, atlas, clock, ... }
                id,         // @arg SpriteIDString
                width,      // @arg Number - sprite width
                height,     // @arg Number - sprite height
                init) {     // @arg Function - init draw(ctx) { ... }
    this._id = id;
    var ctx = resources["ctx"];

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    init(ctx);
    resources["atlas"]["add"](ctx.canvas, this._id, [0, 0, width, height]);
    ctx.restore();
}

Sprite["prototype"] = Object.create(Sprite, {
    "constructor":  { "value": Sprite },
    "id":           { "get": function() { return this._id; } },
    "aid":          { "get": function() { return this._id; } }, // DEPRECATED
});
Sprite["VERBOSE"] = false;

// --- implements ------------------------------------------
// --- validate / assertions -------------------------------
//{@dev
//function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
//function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
global["Air_" in global ? "Air_" : "Air"]["Sprite"] = Sprite; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

