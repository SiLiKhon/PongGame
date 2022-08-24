import * as me from "../MelonJS/13.0.0/esm.js";

class PlayScreen extends me.Stage {
    onResetEvent() {
        me.game.world.addChild(new me.ColorLayer("background", "#202020"));

        this.ball = me.pool.pull("ball");
        me.game.world.addChild(this.ball);
        me.game.world.addChild(me.pool.pull("mainPlayer", 100, false));
        me.game.world.addChild(me.pool.pull("mainPlayer", me.game.viewport.width - 100, false));

        this.ball.init();
        me.game.score_data["left"] = 0;
        me.game.score_data["right"] = 0;
    }
    onDestroyEvent() {
    }
};

export default PlayScreen;
