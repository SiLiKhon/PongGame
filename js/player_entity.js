import * as me from "../MelonJS/13.0.0/esm.js";

class PlayerEntity extends me.Sprite {
    constructor() {
        let image = me.loader.getImage("playerPad");
        image.width /= 2;
        image.height /= 2;

        super(
            40, me.game.viewport.height / 2, {
                image : image,
                width: image.width,
                height: image.height,
                anchorPoint: new me.Vector2d(0.5, 0.5)
            }
        );

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // this.body = new me.Body(this, new me.Rect(0, 0, this.width, this.height));
        this.body = new me.Body(this, new me.Rect(-this.width / 2, -this.height / 2, this.width, this.height));
        this.body.ignoreGravity = true;
        this.body.setMaxVelocity(0, 5);
        this.body.setFriction(0, 1.5);
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;
    }

    update(dt) {
        if (me.input.isKeyPressed("up")) {
            this.body.force.y = -this.body.maxVel.y;
        } else if (me.input.isKeyPressed("down")) {
            this.body.force.y = this.body.maxVel.y;
        }

        this.pos.y = me.Math.clamp(this.pos.y, this.height / 2, me.game.viewport.height - this.height / 2);
        return (super.update(dt) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    }

    onCollision(response, other) {
        return false;
    }
};

export default PlayerEntity;
