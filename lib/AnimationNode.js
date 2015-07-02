(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("AnimationNode", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
var Node = global["Node"];

// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function AnimationNode(resp,        // @arg ResourcePoolObject
                       cues,        // @arg Cue|CueArray
                       loops,       // @arg Integer = 1 - loop times.
                       autostart) { // @arg Boolean = false - auto start
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(cues,     "Cue|CueArray"), AnimationNode, "cues");
        $valid($type(loops,    "Integer|omit"), AnimationNode, "loops");
        $valid($type(autoplay, "Boolean|omit"), AnimationNode, "autoplay");
    }
//}@dev

    Node.call(this, resp); // call super

    this._loops     = loops || 1;
    // --- resource ---
    this._cueIndex  = 0;        // cue index
    this._cues      = Array.isArray(cues) ? cues : [cues];
    this._cue       = _getCurrentCue(this); // current cue. { id, frames, delays, track }
    // --- internal state ---
    this._adjust    = false;    // adjust the last modified time to timeStamp.
    this._started   = autostart || false;
    // --- event handler -----------------------------------
    this._handler = {
        start:      null,       // AnimationNode#onstart(event:Object - { target: Node, type: "start" }):void
        pause:      null,       // AnimationNode#onpause(event:Object - { target: Node, type: "pause" }):void
        ended:      null,       // AnimationNode#onended(event:Object - { target: Node, type: "ended" }):CommandString
        enterframe: null,       // AnimationNode#onenterframe(event:Object - { target: Node, type: "enterframe", timeStamp: 0.0 }):void
    };
    // --- view --------------------------------------------
    this._view = {
        sx:         1.0,        // scale x
        sy:         1.0,        // scale y
        x:          0,          // offset x of animation frame.
        y:          0,          // offset y of animation frame.
        px:         0.0,        // pivot x
        py:         0.0,        // pivot y
        // ----
        trackIndex: 0,          // current track index
        trackLength:0,          // track length
        lastAID:    "",         // last aid
        nextDelay:  0,          // next frame delay time (ms).
        lastModTime:0.0,        // last modified/updated time.
        fourceUpdate: true,
    };
    this._view.trackLength = this._cue.track.length * this._loops;
    this._view.lastAID = this["aid"];
}

AnimationNode["prototype"] = Object.create(Node["prototype"], {
    "constructor":  { "value": AnimationNode    },
    "tick":         { "value": AnimationNode_tick       },
    "start":        { "value": AnimationNode_start      },
    "pause":        { "value": AnimationNode_pause      },
    "command":      { "value": AnimationNode_command    }, // AnimationNode#command(command:String):Any
    // --- accessors ---
    "aid":          { "get": function()  { var fi = this._cue.track[this._view.trackIndex % this._cue.track.length];
                                           return this._cue.frames[fi]["aid"]; } },
    "cue":          { "get": function()  { return this._cue; } },
    "cues":         { "get": function()  { return this._cues; } },
    "cueIndex":     { "get": function()  { return this._cueIndex; },
                      "set": function(v) { this._cueIndex = v % this._cues.length;
                                           this._cue = _getCurrentCue(this);
                                           this._view.trackIndex = 0;
                                           this._view.trackLength = this._cue.track.length * this._loops;
                                           this._view.lastAID = this["aid"];
                                           // keep lastModTime and nextDelay
                                           this._view.fourceUpdate = true; } },
    "track":        { "get": function()  { return { "track": this._cue.track, "position": this._view.trackIndex }; },
                      "set": function(v) { this._view.trackIndex = v % this._cue.track.length;
                                           this._view.lastAID = this["aid"];
                                           this._view.nextDelay = 0;
                                           this._view.lastModTime = 0.0;
                                           this._view.fourceUpdate = true;
                                           this["update"](-1); } }, // redraw last aid(redraw current frame)
    // --- event handlers ---
    "onstart":      { "set": function(v) { this._handler.start      = v; } },
    "onpause":      { "set": function(v) { this._handler.pause      = v; } },
    "onended":      { "set": function(v) { this._handler.ended      = v; } },
    "onenterframe": { "set": function(v) { this._handler.enterframe = v; } },
    // --- render property accessors ---
    "x":            { "get": function()  { return this._view.x;             },
                      "set": function(v) {        this._view.x = v | 0;     } },
    "y":            { "get": function()  { return this._view.y;             },
                      "set": function(v) {        this._view.y = v | 0;     } },
    "px":           { "get": function()  { return this._view.px;            },
                      "set": function(v) {        this._view.px = v | 0;    } },
    "py":           { "get": function()  { return this._view.py;            },
                      "set": function(v) {        this._view.py = v | 0;    } },
    "sx":           { "get": function()  { return this._view.sx;            },
                      "set": function(v) {        this._view.sx = v;        } },
    "sy":           { "get": function()  { return this._view.sy;            },
                      "set": function(v) {        this._view.sy = v;        } },
});

// --- implements ------------------------------------------
function AnimationNode_tick(timeStamp           // @arg Number - time stamp. -1 is redraw last aid
                            /*, deltaTime */) { // @arg Number - delta time
    var update = false;
    var view = this._view;

    if (timeStamp >= 0 && this._started) {
        if (this._adjust) {
            this._adjust = false;
            view.lastModTime = timeStamp;
        }
        if (view.fourceUpdate) {
            view.fourceUpdate = false;
            update = true;
        }
        if (!update) {
            if (timeStamp - view.lastModTime >= view.nextDelay) {
                timeStamp = view.lastModTime +  view.nextDelay;
                update = true;
            }
        }
        if (update) {
            if (this._handler.enterframe) {
                this._handler.enterframe({ "type": "enterframe", "target": this, "timeStamp": timeStamp });
            }
            var cue = this._cue;
            // udpate last modified time, nextDelay, lastAID
            view.lastModTime = timeStamp;
            view.nextDelay   = cue.delays[view.trackIndex % cue.delays.length];
            view.lastAID     = this["aid"];
        }
    }
    this._resp["atlas"]["draw"](view.lastAID,
                                this._ctx,
                                view.x - view.px,
                                view.y - view.py,
                                view.sx,
                                view.sy);
    if (update) {
        if (++view.trackIndex >= view.trackLength) {
            this._started = false;
            if (this._handler.ended) {
                this["command"]( this._handler.ended({ "type": "ended", "target": this }) || "" );
            }
        }
    }
}

function AnimationNode_start() {
    if (this._view.trackIndex >= this._view.trackLength) {
        this._view.trackIndex = 0;
    }
    if (!this._started) {
        this._started = true;
        this._adjust  = true;
    }
}
function AnimationNode_pause() {
    if (this._started) {
        this._started = false;
    }
}

function AnimationNode_command(command) {
    switch (command) {
    case "NEXT_CUE":
        this._cueIndex = (this._cueIndex + 1) % this._cues.length;
        this._cue = _getCurrentCue(this);
        this._view.trackIndex = 0;
        this._view.trackLength = this._cue.track.length * this._loops;
        this._started = true;
        break;
    case "GOTO_TOP":
        this._view.trackIndex = 0;
        this._started = true;
        break;
    }
}

function _getCurrentCue(that) {
    var cue = that._cues[that._cueIndex]; // current cue

    return {
        id:     cue.id,
        frames: cue.frames,
        delays: cue.delays,
        track:  cue.track,
    };
}

return AnimationNode; // return entity

});

