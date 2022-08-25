import * as me from "../MelonJS/13.0.0/esm.js";

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

        this.ball.init();
        me.game.score_data["left"] = 0;
        me.game.score_data["right"] = 0;

        this.scoreText = new me.BitmapText(
            me.game.viewport.width / 2, 30, {
                font: "AtronFont", text: "0 : 0",
                anchorPoint: new me.Vector2d(0.5, 0.5),
                size: 0.25, fillStyle: "white"
            }
        );
        me.game.world.addChild(this.scoreText);
    }
    onDestroyEvent() {
    }
};

export default PlayScreen;
