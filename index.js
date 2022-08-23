import * as me from "./MelonJS/13.0.0/esm.js";

import DataManifest from './manifest.js';
import PlayScreen from './js/play_screen.js';
import PlayerEntity from "./js/player_entity.js";
import BallEntity from "./js/ball_entity.js"

me.device.onReady(async () => {
    if (!me.video.init(1218, 562, {parent : "screen", scale : "auto"})) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // initialize the debug plugin in development mode.
    await import('./js/plugin/debug/debugPanel.js').then((plugin) => {
        // automatically register the debug panel
        me.utils.function.defer(me.plugin.register, this, plugin.DebugPanelPlugin, "debugPanel");
    });

    // me.audio.init("mp3,ogg");

    // me.loader.crossOrigin = "anonymous";

    me.loader.preload(DataManifest, function() {
        me.state.set(me.state.PLAY, new PlayScreen());

        // add our player entity in the entity pool
        me.pool.register("mainPlayer", PlayerEntity);
        me.pool.register("ball", BallEntity);

        // enable the keyboard
        me.input.bindKey(me.input.KEY.UP,  "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");

        me.state.change(me.state.PLAY);
    });
});
