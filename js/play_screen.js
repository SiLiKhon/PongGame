import * as me from "../MelonJS/13.0.0/esm.js";

class DragControl extends me.Draggable {
    constructor(leftPad) {
        var x = leftPad ? 0 : me.game.viewport.width / 2;
        var _xReset = x + me.game.viewport.width / 4;
        var _yReset = me.game.viewport.height / 2;
        super(
            _xReset, _yReset,
            me.game.viewport.width / 2,
            me.game.viewport.height
        );
        this._xReset = _xReset;
        this._yReset = _yReset;
        this.leftPad = leftPad;
        this.trigUp = false;
        this.trigDown = false;
    }

    dragMove(e) {
        super.dragMove(e);
        if (this.dragging === true) {
            if (this.pos.y < this._yReset) {
                this.trigUp = true;
                this.trigDown = false;
            } else if (this.pos.y > this._yReset) {
                this.trigDown = true;
                this.trigUp = false;
            }
        }
    }

    dragEnd() {
        if (super.dragEnd() === false) {
            this.resetPos();
            return false;
        }
    }

    resetPos() {
        this.pos.set(this._xReset, this._yReset);
        this.trigUp = false;
        this.trigDown = false;
    };
};

class PlayScreen extends me.Stage {
    onResetEvent(options) {
        me.game.world.addChild(
            new me.Sprite(0, 0, {
                width: me.game.viewport.width,
                height: me.game.viewport.height,
                image: "Background",
                anchorPoint: new me.Vector2d(0.0, 0.0)
            })
        );

        this.ball = me.pool.pull("ball");
        me.game.world.addChild(this.ball);
        me.game.world.addChild(me.pool.pull("mainPlayer", 100, options.left !== "CPU"));
        me.game.world.addChild(me.pool.pull("mainPlayer", me.game.viewport.width - 100, options.right !== "CPU"));
        this.leftControl = new DragControl(true);
        this.rightControl = new DragControl(false);
        me.game.world.addChild(this.leftControl);
        me.game.world.addChild(this.rightControl);

        this.ball.init();
        me.game.score_data["left"] = 0;
        me.game.score_data["right"] = 0;

        this.scoreText = new me.BitmapText(
            me.game.viewport.width / 2, 30, {
                font: "MontserratFont", text: "0 : 0",
                anchorPoint: new me.Vector2d(0.5, 0.5),
                size: 0.5, fillStyle: "white"
            }
        );
        me.game.world.addChild(this.scoreText);

        this.listener = this.inputHandler.bind(this);
        this.pointerListener = this.pointerHandler.bind(this);
        this.centerBox = new me.Rect(
            (me.game.viewport.width - me.game.viewport.height) / 2, 0,
            me.game.viewport.height, me.game.viewport.height
        );
        me.event.on(me.event.KEYDOWN, this.listener);
        me.input.registerPointerEvent("pointerdown", me.game.viewport, this.pointerListener);
    }

    onDestroyEvent() {
        me.event.off(me.event.KEYDOWN, this.listener);
        me.input.releasePointerEvent("pointerdown", me.game.viewport, this.pointerListener);
    }

    inputHandler(action) {
        if (action === "start") {
            if (!this.ball.moving) this.ball.startMoving();
        } else if (action === "quit") {
            me.state.change(me.state.MENU);
        }
    }

    pointerHandler(pointer) {
        if (this.centerBox.contains(pointer.gameX, pointer.gameY)) {
            if (!this.ball.moving) this.ball.startMoving();
        }
        return true;
    }
};

export default PlayScreen;
