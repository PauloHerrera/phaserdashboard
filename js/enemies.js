var Enemies = function (game, positionX, positionY, sprite, index) {

    this.MoveAux = 0;
    this.enemy = game.add.sprite(positionX, positionY, sprite);
    game.physics.arcade.enable(this.enemy);
    this.enemy.body.bounce.y = 0.2;
    this.enemy.body.gravity.y = 300;
    this.enemy.name = "Enemy" + index;

    this.enemy.animations.add('left', [3, 4, 5], 10, true);
    this.enemy.animations.add('right', [6, 7, 8], 10, true);

};


Enemies.prototype.move = function () {
    //var movement = 300;
    //var speedy = 75;

    //if (this.MoveAux <= (movement / 2)) {
    //    this.enemy.body.velocity.x = speedy;
    //    this.enemy.animations.play('right');
    //} else {
    //    this.enemy.body.velocity.x = - speedy;
    //    this.enemy.animations.play('left');
    //}

    //if (this.MoveAux == movement) {
    //    this.MoveAux = 1;
    //} else {
    //    this.MoveAux = this.MoveAux + 1;
    //}
    alert("Aeeeee!!!");
}
