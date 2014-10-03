Player = function (game,posicaoX,posicaoY) {
    this.game = game;

    this.player = game.add.sprite(posicaoX, posicaoY, 'personagem');
    this.game.physics.arcade.enable(this.player);

    console.log(this.player.health);

    this.player.health = this.player.health == 1 ? 3 : this.player.health;
    this.player.life = new Array();

    this.player.ishurt = false;// Controla quando é atingido

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

    // Keys Control
    this.player.keyCount = 0;
    this.player.keys = [];

}

Player.prototype = {
    move: function () {
        //console.log(this.game.global.moveLeft);
        if (Keyboard.cursorKeys.left.isDown || this.game.global.moveLeft == true) {
            this.moveLeft();
            console.log("teste2");
        }
        else if (Keyboard.cursorKeys.right.isDown || this.game.global.moveRight == true) {
            this.moveRight();
        }
        else {
            this.player.body.velocity.x = 0;
            this.player.animations.stop();
            this.player.frame = 4;
        }

        if ((Keyboard.cursorKeys.up.isDown || this.game.global.moveJump == true) && this.player.body.onFloor()) {
            this.jump();
        }        
    },
    moveRight: function (){
        this.player.body.velocity.x = game.global.playerSpeed;
        this.player.animations.play('right');
    },
    moveLeft: function (){
        this.player.body.velocity.x = -game.global.playerSpeed;
        this.player.animations.play('left');
    },
    jump: function (){
        if (game.global.sound) Sound.jump.play();
        this.player.body.velocity.y = -game.global.jumpSize;
    },
    addLife: function (){
        //Add os corações com a saúde do personagem       
        for (j = 0; j < this.player.health; j++) {
            this.player.life[j] = this.game.add.image(14 + j * 30, 40, 'heart');
            this.player.life[j].fixedToCamera = true;
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
    collectKeys: function (player, keyCollected) {        
                            
        keyCollected.kill();

        for (var i = 0; i < player.keys.length; i++) {
            if (player.keys[i].color == keyCollected.key) {
                return true;
            }
        }

        this.key = this.game.add.image(15 + (player.keyCount * 35), 70, keyCollected.key);
        this.key.fixedToCamera = true;
        this.key.enableBody = true;
        player.keys.push(new KeyControl(keyCollected.key));

        player.keyCount += 1; 
        
    },
    removeKey: function (keyColor) {

        //console.log(this.player.keys);
        //for (var i = 0; i < this.player.keys.length; i++) {
        //    //console.log(this.player.keys)
        //    console.log(this.player.keys[i].color);
        //    if (this.player.keys[i].color == keyColor) {
        //        this.player.keys.splice(i, 1);
        //        return;
        //    }
        //}
        //console.log(this.player.keys);
    },
    hasKey: function (keyColor) {
        
        for (var i = 0; i < this.player.keys.length; i++) {            
            if (this.player.keys[i].color.replace("key", "") == keyColor) {
                return true; 
            }
        }
        return false;
    },
    looseLife: function (sprite, enemy, x, y){

        if (!this.player.ishurt) {
            this.player.ishurt = true;

            this.player.health -= 1;
            this.player.life[this.player.health].kill();
            console.log(this.player.life)

            if (this.player.health == 0) {
                this.die();
            }
            
            game.time.events.add(1000, this.backToStart, this); 
            this.player.body.position.x = x;
            this.player.body.position.y = y;

        }
       
    },
    backToStart: function (positionX, positionY){


        this.player.ishurt = false;
    },
    die: function () {
        if (!this.player.alive) {
            return;
        }

        this.player.kill();
        this.game.global.music.stop();
        Sound.dead.play();
        
        EmitterObj.emitter.x = this.player.x;
        EmitterObj.emitter.y = this.player.y;
        EmitterObj.emitter.start(true, 600, null, 15);
        
        this.game.time.events.add(1000, this.startMenu, this);

    },
    startMenu: function () {        
        game.state.start('menu');
    }
}

KeyControl = function (keyColor) {
    this.color = keyColor;    
}