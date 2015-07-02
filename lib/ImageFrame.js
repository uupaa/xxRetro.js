(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("ImageFrame", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
var _frameCounter = 0;

// --- class / interfaces ----------------------------------
function ImageFrame(resp,      // @arg ResourcePoolObject
                    image,     // @arg HTMLImageElement
                    aid,
                    sx,
                    sy,
                    sw,
                    sh) {
    this._aid = aid || ("ImageFrame" + (++_frameCounter));
    this._sx  = sx  || 0;
    this._sy  = sy  || 0;
    this._sw  = sw  || image.naturalWidth;
    this._sh  = sh  || image.naturalHeight;

    if (!image.complete || !image.naturalWidth || !image.naturalHeight) {
        throw TypeError("IS NOT LOADED: " + image.src);
    }
    resp["atlas"]["add"](this._aid,
                         image,
                         this._sx,
                         this._sy,
                         this._sw,
                         this._sh);
}

ImageFrame["prototype"] = Object.create(ImageFrame, {
    "constructor":  { "value": ImageFrame },
    "aid":          { "get": function() { return this._aid; } },
});

// --- implements ------------------------------------------


return ImageFrame; // return entity

});


