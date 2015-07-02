var ModuleTestAir = (function(global) {

var _isNodeOrNodeWebKit = !!global.global;
var _runOnNodeWebKit =  _isNodeOrNodeWebKit &&  /native/.test(setTimeout);
var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

var test = new Test("Air", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
    });

if (_runOnBrowser || _runOnNodeWebKit) {
    //test.add([]);
} else if (_runOnWorker) {
    //test.add([]);
} else if (_runOnNode) {
    //test.add([]);
}

// --- test cases ------------------------------------------

return test.run().clone();

})((this || 0).self || global);

