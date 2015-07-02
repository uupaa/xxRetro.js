(function(global) {

function Jump(clock, velocity, y, fn) {
    this._clock     = clock;
    this._run       = true;
    this._velocity  = velocity;
    this._py        = 0;        // previous y
    this._cy        = velocity; // current y
    this._iy        = y;
    this._cv        = -1;       // current velocity
    this._fn        = fn;
    this._tick      = Jump_tick.bind(this);

    clock.on(this._tick);
}

Jump["prototype"] = Object.create(Jump, {
    "constructor":  { "value": Jump },
    "reuse":        { "value": Jump_reuse },
});

function Jump_reuse() {
    this._py = 0;
    this._cy = this._velocity;
    this._cv = -1;
    this._clock.on(this._tick);
}
function Jump_tick() {
    var y  = this._iy - this._cy;
    var cy = this._cy;

    this._cy += (this._cy - this._py) + this._cv;
    this._py = cy;

    var result = this._fn(y, this._cy, this._iy);
    if (result === true) {
        // end
        this._run = false;
        this._clock.off(this._tick);
    } else {
        ;
    }
}

global["Jump"] = Jump;

})((this || 0).self || global);

