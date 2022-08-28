import * as me from "../MelonJS/13.0.0/esm.js";

class MenuButton extends me.GUI_Object {
    constructor() {
        var settings = {};
        settings.image = "PlayButton";
        // settings.framewidth = 40;
        // settings.frameheight = 40;

        super(
            me.game.viewport.width / 2, 225,
            settings,
        );
        this.pos.z = 4;
    }
    onClick() {
        var stage = me.state.current();
        me.state.change(me.state.PLAY,  {
            left: stage.leftPlayerOption.optionsText[stage.leftPlayerOption.currentOption],
            right: stage.rightPlayerOption.optionsText[stage.rightPlayerOption.currentOption],
        });
        return true;
    }
};

class MenuItem extends me.BitmapText {
    constructor(x, y, text, options, scale) {
        super(x, y, {
            font: "MontserratFont", textBaseline: "middle",
            anchorPoint: new me.Vector2d(0.5, 0.5),
            size: scale, fillStyle: "white"
        });
        this.currentOption = 0;
        this.optionsText = options;
        this.baseText = text;
        this.updateText();
    }

    cycleFwd() {
        this.currentOption += 1;
        if (this.currentOption >= this.optionsText.length) this.currentOption = 0;
        this.updateText();
    }

    cycleBck() {
        this.currentOption -= 1;
        if (this.currentOption < 0) this.currentOption = this.optionsText.length - 1;
        this.updateText();
    }

    updateText() {
        this.setText("" + this.baseText + "   " + this.optionsText[this.currentOption]);
    };
};

class MenuScreen extends me.Stage {
    onResetEvent() {
        me.game.world.addChild(new me.ColorLayer("background", "#0E2839", 0));
        me.game.world.addChild(new me.BitmapText(
            me.game.viewport.width / 2, 100, {
                font: "AtronFont", text: "--- pong ---",
                anchorPoint: new me.Vector2d(0.5, 0.5),
                size: 0.5, fillStyle: "white"
            }
        ));
        var btn = new MenuButton()
        me.game.world.addChild(btn);
        me.game.world.addChild(new me.BitmapText(
            btn.pos.x, btn.pos.y, {
                font: "MontserratFont", text: "start",
                anchorPoint: new me.Vector2d(0.5, 0.5),
                textBaseline: "middle",
                size: 0.5, fillStyle: "white"
            }
        ));

        this.leftPlayerOption = new MenuItem(
            me.game.viewport.width / 2, 300,
            "Left player:", ["Human (WSAD)", "CPU"], 0.5
        );
        this.rightPlayerOption = new MenuItem(
            me.game.viewport.width / 2, 350,
            "Right player:", ["CPU", "Human (Arrows)"], 0.5
        );
        this.menuOptions = [this.leftPlayerOption, this.rightPlayerOption];
        this.menuOptions.forEach(element => {
            me.game.world.addChild(element);
        });
        this.selectedItem = 0;
        this.cursor = new me.BitmapText(
            0, 0, {
                font: "MontserratFont", text: ">>", textBaseline: "middle",
                anchorPoint: new me.Vector2d(1.0, 0.5),
                size: 0.5, fillStyle: "white"
            }
        );
        me.game.world.addChild(this.cursor);
        this.updateCursorPos();

        this.listener = this.inputHandler.bind(this);
        this.pointerListener = this.pointerHandler.bind(this);
        me.event.on(me.event.KEYDOWN, this.listener);
        me.input.registerPointerEvent("pointerdown", me.game.viewport, this.pointerListener);
    }

    onDestroyEvent() {
        me.event.off(me.event.KEYDOWN, this.listener);
        me.input.releasePointerEvent("pointerdown", me.game.viewport, this.pointerListener);
    }

    inputHandler(action) {
        if (action === "l_down" || action == "r_down") {
            this.selectedItem += 1;
            if (this.selectedItem >= this.menuOptions.length) this.selectedItem = 0;
            this.updateCursorPos();
        } else if (action === "l_up" || action == "r_up") {
            this.selectedItem -= 1;
            if (this.selectedItem < 0) this.selectedItem = this.menuOptions.length - 1;
            this.updateCursorPos();
        } else if (action === "right") {
            this.menuOptions[this.selectedItem].cycleFwd();
            this.updateCursorPos();
        } else if (action === "left") {
            this.menuOptions[this.selectedItem].cycleBck();
            this.updateCursorPos();
        } else if (action === "start") {
            me.state.change(me.state.PLAY, {
                left: this.leftPlayerOption.optionsText[this.leftPlayerOption.currentOption],
                right: this.rightPlayerOption.optionsText[this.rightPlayerOption.currentOption],
            });
        }
    }

    pointerHandler(pointer) {
        this.menuOptions.forEach(
            (elem) => {
                if (Math.abs(elem.pos.y - pointer.gameY) < 0.6 * elem.getBounds().height) elem.cycleFwd();
                this.updateCursorPos();
            }
        )

        return true;
    }

    updateCursorPos() {
        var curItem = this.menuOptions[this.selectedItem];
        this.cursor.pos.x = curItem.pos.x - curItem.getBounds().width * curItem.anchorPoint.x - 20;
        this.cursor.pos.y = curItem.pos.y;
    }
};

export default MenuScreen;
