(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("Sprite", function moduleClosure(global) {
"use strict";

// Asset.js から呼ばれる

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function Sprite(resp,       // @arg ResourcePoolObject
                id,         // @arg SpriteIDString
                width,      // @arg Number - sprite width
                height,     // @arg Number - sprite height
                init) {     // @arg Function - init draw(ctx) { ... }
    this._id = id;
    var ctx = resp["ctx"];

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();

    init(ctx);
    resp["atlas"]["add"](ctx.canvas, this._id, [0, 0, width, height]);

    ctx.restore();
}

Sprite["VERBOSE"] = false;
Sprite["prototype"] = Object.create(Sprite, {
    "constructor":  { "value": Sprite },
    "id":           { "get": function() { return this._id; } },
    "aid":          { "get": function() { return this._id; } }, // DEPRECATED
});


// --- implements ------------------------------------------

return Sprite; // return entity

});

