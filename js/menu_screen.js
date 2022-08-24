import * as me from "../MelonJS/13.0.0/esm.js";

class MenuButton extends me.GUI_Object {
    constructor() {
        var settings = {};
        settings.image = "Ball";
        // settings.framewidth = 40;
        // settings.frameheight = 40;

        super(
            me.game.viewport.width / 2,
            me.game.viewport.height / 2,
            settings,
        );
        this.pos.z = 4;
    }
    onClick() {
        me.state.change(me.state.PLAY);
        return true;
    }
};

class MenuScreen extends me.Stage {
    onResetEvent() {
        me.game.world.addChild(new me.ColorLayer("background", "#000000", 0));
        me.game.world.addChild(new MenuButton());
    }
};

export default MenuScreen;