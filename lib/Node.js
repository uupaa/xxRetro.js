(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("Node", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function Node(resp) { // @arg ResourcePoolObject
                      // @desc Generic Node
    this._resp      = resp;

    this._type      = "node";
    this._parent    = null; // parent node.
    this._visible   = true;
    this._children  = [];   // children node list.
}

Node["prototype"] = Object.create(Node, {
    "constructor":  { "value": Node             }, // new Node():Node
    "tick":         { "value": function() {}    }, // Node#tick(timeStamp:Number, deltaTime:Number):void
    "start":        { "value": function() {}    }, // Node#start():void
    "pause":        { "value": function() {}    }, // Node#pause():void
    // --- node tree ---
    "add":          { "value": Node_add         }, // Node#add(node:Node):Node
    "swap":         { "value": Node_swap        }, // Node#swap(node:Node, refNode:Node):Node
    "insert":       { "value": Node_insert      }, // Node#insert(node:Node, refNode:Node):Node
    "remove":       { "value": Node_remove      }, // Node#remove(node:Node):Node
    "reorder":      { "value": Node_reorder     }, // Node#reorder():void
    "sortOrder":    { "value": Node_sortOrder   }, // Node#sortOrder():void
    // --- accessors ---
    "type":         { "get": function()  { return this._type; } },
    "parent":       { "get": function()  { return this._parent; },
                      "set": function(v) { this._parent = v;
                                           this._resp["render"]["notify"](this, "Node#setParent", v); } },
    "children":     { "get": function()  { return this._children; } },
    "first":        { "get": function()  { return this._children[0]; } },
    "last":         { "get": function()  { return this._children[this._children.length - 1]; } },
    "nth":          { "get": function()  { return this._children[n]; } },
    "order":        { "get": function()  { return this._order; },
                      "set": function(v) { this._order = v || 1;
                                           this._parent.sortOrder();
                                           this._resp["render"]["notify"](this, "Node#setOrder", this._order); } },
    "visible":      { "get": function()  { return this._visible; },
                      "set": function(v) { this._visible = !!v;
                                           this._resp["render"]["notify"](this, "Node#setVisible", !!v); } },
});

// --- implements ------------------------------------------
function Node_add(node) { // @arg Node - child node
                          // @ret Node - added node
                          // @desc DOM.Node.appendChild like
    if (node["parent"]) { // already attached? -> remove -> add
        node["parent"]["remove"](node);
    }
    node["parent"] = this; // set parent node
    this._children.push(node);
    this._resp["render"]["notify"](this, "Node#add", node);
    return node;
}

function Node_swap(node,      // @arg Node - child node
                   refNode) { // @arg Node - replace target child node
                              // @ret Node - replaced node
                              // @desc DOM.Node.replaceChild like
                              // refNode が見つからない場合は add と同様に機能します
    var pos = this._children.indexOf(refNode);
    if (pos >= 0) {
        if (node["parent"]) { // already attached? -> remove
            node["parent"]["remove"](node);
        }
        node["parent"] = this;
        this._children.splice(pos, 1, node);
        this._resp["render"]["notify"](this, "Node#swap", node, refNode);
        return refNode;
    }
    return this["add"](node);
}

function Node_insert(node,      // @arg Node - child node
                     refNode) { // @arg Node - insert target child node
                                // @desc DOM.Node.insertBefore like
                                // refNode が見つからない場合は add と同様に機能します
    if (refNode) {
        var pos = this._children.indexOf(refNode);
        if (pos >= 0) {
            node["parent"] = this; // set parent node
            this._children.splice(pos, 0, node);
            this._resp["render"]["notify"](this, "Node#insert", node, refNode);
            return node;
        }
    }
    return this["add"](node);
}

function Node_remove(node) { // @arg Node - remove target child node
                             // @ret Node - return removed node
                             // @desc DOM.Node.removeChild like
    var pos = this._children.indexOf(node);
    if (pos >= 0) {
        this._children.splice(pos, 1);
        node["parent"] = null; // clear parent node
        this._resp["render"]["notify"](this, "Node#remove", node);
    }
    return node;
}

function Node_reorder() { // @desc 現在のNode順に従いorderを再割当てします。先頭のNodeのorderは1に、末尾のNodeのorderはchildren.lengthと等しくなります。
    for (var i = 0, iz = this._children.length; i < iz; ++i) {
        this._children[i].order = i + 1;
    }
    this._resp["render"]["notify"](this, "Node#reorder");
}

function Node_sortOrder() {
    this._children.sort(function(a, b) {
        return a["order"] - b["order"];
    });
    this._resp["render"]["notify"](this, "Node#sortOrder");
}

return Node; // return entity

});

