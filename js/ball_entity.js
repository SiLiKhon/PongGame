import * as me from "../MelonJS/13.0.0/esm.js";

import PlayerEntity from "./player_entity.js";

class BallEntity extends me.Sprite {
    constructor() {
        let image = me.loader.getImage("Ball");
        image.width = 40;
        image.height = 40;

        super(
            me.game.viewport.width / 2, me.game.viewport.height / 2, {
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
        this.body.setMaxVelocity(10, 30);
        this.body.bounce = 10;

        this.reset();
    }

    reset() {
        this.pos.x = me.game.viewport.width / 2;
        this.pos.y = me.game.viewport.height / 2;
        this.body.vel.set(0, 0);
        this.body.maxVel.x = 10;
        this.moving = false;
    }

    init() {
        var playerEntities = me.game.world.getChildByType(PlayerEntity).sort(
            (a, b) => { return a.pos.x - b.pos.x; }
        );
        this.left_player = playerEntities[0];
        this.right_player = playerEntities[1];
    }

    startMoving() {
        this.body.vel.set(
            (1 - me.Math.random(0, 2) * 2) * 20,
            me.Math.randomFloat(-3, 3),
        );
        this.moving = true;
    }

    update(dt) {
        if (
            (this.pos.y - this.height / 2 < 0) ||
            (this.pos.y + this.height / 2 > me.game.viewport.height)
        ) this.body.vel.y = -this.body.vel.y;
        if (
            (this.pos.x - this.width / 2 < 0) ||
            (this.pos.x + this.width / 2 > me.game.viewport.width)
        ) {
            if (this.pos.x - this.width / 2 < 0) {
                me.game.score_data["right"] += 1;
            } else {
                me.game.score_data["left"] += 1;
            }
            console.log(me.game.score_data);
            this.reset();
        }

        if (this.moving) {
            this.body.vel.y += me.Math.randomFloat(-0.5, 0.5) * this.body.maxVel.x / 30;
        }

        this.pos.y = me.Math.clamp(this.pos.y, this.height / 2, me.game.viewport.height - this.height / 2);
        this.pos.x = me.Math.clamp(this.pos.x, this.width / 2, me.game.viewport.width - this.width / 2);
        return (super.update(dt) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    }

    onCollision(response, other) {
        if (other.body.collisionType === me.collision.types.PLAYER_OBJECT) {
            if ((this.pos.x - other.pos.x) * this.body.vel.x < 0) {
                this.body.vel.x = -this.body.vel.x;
                if (this.body.maxVel.x < 30) {
                    this.body.maxVel.x *= 1.05;
                    this.body.vel.x *= 1.05;
                }
                this.body.vel.y += other.body.vel.y * 0.25;
            }
        }
        return false;
    }
};

export default BallEntity;
