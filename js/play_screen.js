import * as me from "../MelonJS/13.0.0/esm.js";

class PlayScreen extends me.Stage {
    onResetEvent() {
        me.game.world.addChild(new me.ColorLayer("background", "#202020"));

        me.game.world.addChild(me.pool.pull("ball"));
        me.game.world.addChild(me.pool.pull("mainPlayer", 100, true));
        me.game.world.addChild(me.pool.pull("mainPlayer", me.game.viewport.width - 100, false));
    }
    onDestroyEvent() {

    }
};

export default PlayScreen;
