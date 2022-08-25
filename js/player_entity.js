import * as me from "../MelonJS/13.0.0/esm.js";

import BallEntity from "./ball_entity.js"

class PlayerEntity extends me.Sprite {
    constructor(x, isPlayer) {
        let image = me.loader.getImage("PlayerPad");
        image.width = 25;
        image.height = 150;

        super(
            x, me.game.viewport.height / 2, {
                image : image,
                width: image.width,
                height: image.height,
                anchorPoint: new me.Vector2d(0.5, 0.5)
            }
        );
        this.isPlayer = isPlayer;

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // this.body = new me.Body(this, new me.Rect(0, 0, this.width, this.height));
        this.body = new me.Body(this, new me.Rect(-this.width / 2, -this.height / 2, this.width, this.height));
        this.body.ignoreGravity = true;
        this.body.setMaxVelocity(0, 7);
        this.body.setFriction(0, 1.5);
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;
        if (x > me.game.viewport.width / 2) {
            this.up_action = "r_up";
            this.down_action = "r_down"
        } else {
            this.up_action = "l_up";
            this.down_action = "l_down";
        }

        this.ballEntity = me.game.world.getChildByType(BallEntity)[0];
    }

    update(dt) {
        if (this.isPlayer) {
            if (me.input.isKeyPressed(this.up_action)) {
                this.body.force.y = -this.body.maxVel.y;
            } else if (me.input.isKeyPressed(this.down_action)) {
                this.body.force.y = this.body.maxVel.y;
            }
        } else {
            var x_dist = (this.pos.x - this.ballEntity.pos.x)
            if (x_dist * this.ballEntity.body.vel.x > 0) {
                x_dist -= (this.width + this.ballEntity.width) / 2 * Math.sign(x_dist);
                var y_dist = x_dist / this.ballEntity.body.vel.x * this.ballEntity.body.vel.y;
                var adj_vp_height = me.game.viewport.height - this.ballEntity.height;
                var target_y = (
                    y_dist + this.ballEntity.pos.y - this.ballEntity.height / 2
                ) % (
                    2 * adj_vp_height
                );
                if (target_y < 0) target_y = 2 * adj_vp_height + target_y;
                if (target_y > adj_vp_height) target_y = 2 * adj_vp_height - target_y;
                target_y += this.ballEntity.height / 2;
                if (this.pos.y - target_y > 15) this.body.force.y = -this.body.maxVel.y;
                else if (this.pos.y - target_y < -15) this.body.force.y = this.body.maxVel.y;
            }
        }

        this.pos.y = me.Math.clamp(this.pos.y, this.height / 2, me.game.viewport.height - this.height / 2);
        return (super.update(dt) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    }

    onCollision(response, other) {
        return false;
    }
};

export default PlayerEntity;
