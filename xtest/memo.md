## ChangeLog
- 2015-05-18
    - Air.CanvasFrame を廃止
    - Air.Sprite(id, width, height, red, draw, options) を追加


var atlas = new Atlas();

// --- png/jpeg/gif ---
// sx, sy, sw, sh は省略可能, 画像の一部をクリッピングすることができる
// 指定する画像は読み込み済みとする(complete=trueでwidthとheightをもつ)
var frame1 = new Air.ImageFrame(atlas, "b0.png",  { sx: 0, sy: 0, sw: width, sh: height });
var frame2 = new Air.ImageFrame(atlas, "b1.png",  { sx: 0, sy: 0, sw: width, sh: height });
var frame3 = new Air.ImageFrame(atlas, "b2.png",  { sx: 0, sy: 0, sw: width, sh: height });
var frame4 = new Air.CanvasFrame(atlas, function(ctx, options) {
                                    ctx.fillStyle = options.fillStyle;
                                    ctx.fillRect(0, 0, options.width, options.height);
                                }, { width: 100, height: 100, r: 2, vx: 1, vy: 1, fillStyle: "red" });

// 単一画像は再生速度とcueを設定する必要がある
// delays.length === timeline.length であること(違ったらエラーにする)
var cue = new Air.Cue([frame1, frame2, frame3], // frames
                       [0, 100, 120, 140, 160],  // delays
                       [0, 1, 2, 1, 0]);         // timeline
// AnimationNode が食べられるのは原則 Cue か CueArray のみ。
var node = new Air.AnimationNode(cue);
var air = new Air();
air.add(node);

// -------------------------------------
var frame = new Air.CanvasFrame(atlas, function(ctx, options) { ... });


// Air.Cue(frame) とすると、自動的に Air.Cue([frame], [0], [0])として解釈する
// frame が1つしかないCueはdelayを無視したシングルフレームモードで動作する(ちょっと速い)
var cue = new Air.Cue(frame);
var node = new Air.AnimationNode(cue);
air.add(node);
node.onenterframe = function(event) {
    node.x = ...
    node.y = ...
};

// ---- mario motion ---

var standR = new Air.CanvasFrame(atlas, function(ctx, options) {
        // 右を向いた立ちポーズの描画
    });
var runR1 = new Air.CanvasFrame(atlas, function(ctx, options) {
        // 右に走る1の描画
    });
var runR2 = new Air.CanvasFrame(atlas, function(ctx, options) {
        // 右に走る2の描画
    });
var runR3 = new Air.CanvasFrame(atlas, function(ctx, options) {
        // 右に走る3の描画
    });
var jumpR = new Air.CanvasFrame(atlas, function(ctx, options) {
        // 右に飛ぶ描画
    });

var cue1 =  new Air.Cue([standR]);
var cue2 =  new Air.Cue([runR1, runR2, runR3], [0, 100, 100], [0, 1, 2]);
var cue3 =  new Air.Cue([jumpR]);
var cue4 =  new Air.Cue([standL]);
var cue5 =  new Air.Cue([runL1, runL2, runL3], [0, 100, 100], [0, 1, 2]);
var cue6 =  new Air.Cue([jumpL]);

var node = new AnimationNode([cue1, cue2, cue3, cue4, cue5, cue6], options);

node.sourceIndex = 1; // ソース切り替え

// --- apng ---
/* 未実装
var frame1 = new Air.APNGFrame(atlas, "a1.png", threadPool); // apng をデコードする
var frame2 = new Air.APNGFrame(atlas, "a2.png", threadPool);
// frame を複数配列で指定すると、マルチソースで動作する
var node   = new Air.AnimationNode([frame1, frame2]); // sources.length = 2
 */

