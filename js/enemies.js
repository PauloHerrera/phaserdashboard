var Enemies = function (game, positionX, positionY, sprite, index, movement, speedy) {

    //Properties
    this.MoveAux = 0;
    this.Movement = movement;
    this.Speedy = speedy;
    
    this.enemy = game.add.sprite(positionX, positionY, sprite);
    game.physics.arcade.enable(this.enemy);
    this.enemy.body.bounce.y = 0.2;
    this.enemy.body.gravity.y = 300;
    this.enemy.name = "Enemy" + index;

    this.enemy.animations.add('left', [3, 4, 5], 10, true);
    this.enemy.animations.add('right', [6, 7, 8], 10, true);

};

Enemies.prototype = {    
    move: function () {
        if (this.MoveAux <= (this.Movement / 2)) {
            this.enemy.body.velocity.x = this.Speedy;
            this.enemy.animations.play('right');
        } else {
            this.enemy.body.velocity.x = - this.Speedy;
            this.enemy.animations.play('left');
        }

        if (this.MoveAux == this.Movement) {
            this.MoveAux = 1;
        } else {
            this.MoveAux = this.MoveAux + 1;
        }
    },
    isHit: function (a, b) {
        b.kill();
        a.kill();
        Sound.dead.play();


        EmitterObj.emitter.x = a.x;
        EmitterObj.emitter.y = a.y;
        EmitterObj.emitter.start(true, 600, null, 15);

        this.gameControl.changeScore(50);
    }
}