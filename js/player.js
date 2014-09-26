Player = function (game) {

    this.game = game;

    this.player = game.add.sprite(2000, this.game.world.height - 240, 'personagem');
    this.game.physics.arcade.enable(this.player);
    this.health = 3;

    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);
    this.player.body.collideWorldBounds = true;

    this.game.camera.follow(this.player);

    // Bullets
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet', 2, false);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    
    this.bulletsFireRate = 300;
    this.bulletsNextFire = 0;   

}

Player.prototype = {
    move: function () {
        if (Keyboard.cursorKeys.left.isDown) {
            this.player.body.velocity.x = -game.global.playerSpeed;
            this.player.animations.play('left');
        }
        else if (Keyboard.cursorKeys.right.isDown) {
            this.player.body.velocity.x = game.global.playerSpeed;
            this.player.animations.play('right');
        }
        else {
            this.player.body.velocity.x = 0;
            this.player.animations.stop();
            this.player.frame = 4;
        }

        if (Keyboard.cursorKeys.up.isDown && this.player.body.onFloor()) {
            if (game.global.sound) Sound.jump.play();
            this.player.body.velocity.y = -game.global.jumpSize;
        }
    },
    fire: function () {        
        if (this.game.time.now > this.bulletsNextFire && this.bullets.countDead() > 0)
        {            
            this.bulletsNextFire = this.game.time.now + this.bulletsFireRate;

            var bullet = this.bullets.getFirstExists(false);
            bullet.reset(this.player.x + 10, this.player.y + 40);

            if (Keyboard.cursorKeys.left.isDown) {
                bullet.body.velocity.x = -400;
            } else {
                this.player.frame = 5;
                bullet.body.velocity.x = 400;                
            }

            bullet.animations.add('turn', [1, 2, 3, 4], 10, true);
            bullet.animations.play('turn');            
        }
    },
    collectFood: function (a, b) {
        if (game.global.sound) Sound.eat.play();
        b.kill();              
        
        this.gameControl.setItemScore(b.key);
    },
    die: function (game) {
        if (!this.player.alive) {
            return;
        }

        this.player.kill();
        game.global.music.stop();
        Sound.dead.play();
        
        EmitterObj.emitter.x = this.player.x;
        EmitterObj.emitter.y = this.player.y;
        EmitterObj.emitter.start(true, 600, null, 15);
        
        game.time.events.add(1000, this.startMenu, this);

    },
    startMenu: function () {        
        game.state.start('menu');
    }
}