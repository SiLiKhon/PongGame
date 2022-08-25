import * as me from "./MelonJS/13.0.0/esm.js";

import DataManifest from './manifest.js';
import PlayScreen from './js/play_screen.js';
import MenuScreen from './js/menu_screen.js';
import PlayerEntity from "./js/player_entity.js";
import BallEntity from "./js/ball_entity.js"

me.device.onReady(async () => {
    if (!me.video.init(1218, 562, {parent : "screen", scale : "auto", antiAlias: true})) {
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
        me.state.set(me.state.MENU, new MenuScreen());

        // add our player entity in the entity pool
        me.pool.register("mainPlayer", PlayerEntity);
        me.pool.register("ball", BallEntity);

        // enable the keyboard
        me.input.bindKey(me.input.KEY.UP, "r_up");
        me.input.bindKey(me.input.KEY.W, "l_up");
        me.input.bindKey(me.input.KEY.DOWN, "r_down");
        me.input.bindKey(me.input.KEY.S, "l_down");
        me.input.bindKey(me.input.KEY.A, "left");
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.ESC, "quit", true);
        me.input.bindKey(me.input.KEY.SPACE, "start", true);
        me.input.bindKey(me.input.KEY.ENTER, "start", true);
        me.event.on(me.event.KEYDOWN, (action) => {
            if (action === "quit") { me.state.change(me.state.MENU); }
        });
        me.event.on(me.event.KEYDOWN, (action) => {
            if (action === "start") {
                var stage = me.state.current();
                if (stage instanceof PlayScreen) {
                    if (!stage.ball.moving) stage.ball.startMoving();
                } else if (stage instanceof MenuScreen) {
                    me.state.change(me.state.PLAY, {
                        left: stage.leftPlayerOption.optionsText[stage.leftPlayerOption.currentOption],
                        right: stage.rightPlayerOption.optionsText[stage.rightPlayerOption.currentOption],
                    });
                }
            }
        });

        me.state.transition("fade", "#010101", 100);
        me.state.change(me.state.MENU);

        me.game.score_data = {};
    });
});
