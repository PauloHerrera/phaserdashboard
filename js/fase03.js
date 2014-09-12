var fase03State = {
    create: function () {
        //MAPA
        //Adiciona o Mapa
        this.map = game.add.tilemap('map_lava_01');

        this.map.addTilesetImage('lava_objetc_01', 'lava01');
        this.map.addTilesetImage('lava_tileset', 'lava_tileset');
        this.map.addTilesetImage('platform_large', 'platform_lava01_large');

        this.layerBackground = this.map.createLayer('Background');
        this.layerBackground.resizeWorld();

        this.layerBackground2 = this.map.createLayer('Background2');
        this.layerBackground2.resizeWorld();
        //this.map.setCollision(14, true, this.layerBackground2);
        //this.map.setCollision(15, true, this.layerBackground2);
        //this.map.setCollision(16, true, this.layerBackground2);        
        //this.map.setCollision(17, true, this.layerBackground2);
        //this.map.setCollision(18, true, this.layerBackground2);
        //this.map.setCollision(19, true, this.layerBackground2);
        //this.map.setCollision(20, true, this.layerBackground2);

        this.map.setCollision(29, true, this.layerBackground2);
        this.map.setCollision(30, true, this.layerBackground2);
        this.map.setCollision(31, true, this.layerBackground2);
        this.map.setCollision(32, true, this.layerBackground2);
        this.map.setCollision(33, true, this.layerBackground2);
        this.map.setCollision(34, true, this.layerBackground2);

        this.layerPlataforms = this.map.createLayer('Plataformas');
        this.layerPlataforms.resizeWorld();

        //Trocar pelo between
        this.map.setCollision(1, true, this.layerPlataforms);
        this.map.setCollision(2, true, this.layerPlataforms);
        this.map.setCollision(3, true, this.layerPlataforms);
        this.map.setCollision(4, true, this.layerPlataforms);
        this.map.setCollision(5, true, this.layerPlataforms);
        this.map.setCollision(6, true, this.layerPlataforms);
        this.map.setCollision(7, true, this.layerPlataforms);
        this.map.setCollision(8, true, this.layerPlataforms);
        this.map.setCollision(9, true, this.layerPlataforms);
        this.map.setCollision(10, true, this.layerPlataforms);
        this.map.setCollision(11, true, this.layerPlataforms);
        this.map.setCollision(12, true, this.layerPlataforms);

        this.layerKillPlayer = this.map.createLayer('Objetos Tira Vida');
        this.layerKillPlayer.resizeWorld();

        // Sons
        this.eatSound = game.add.audio('eat');
        this.jumpSound = game.add.audio('jump');
        this.deadSound = game.add.audio('dead');

        // Adiciona o teclado
        cursors = game.input.keyboard.createCursorKeys();

        // Adiciona o enter
        this.spaceKey = game.input.keyboard.addKey(32);

        // Insere o DUDE!
        this.player = game.add.sprite(20, 450, 'personagem');
        game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);

        //Cria o que o personagem vai atirar
        this.createBullets();

        this.enemies = [];
        this.enemies.push(new Enemies(game, 200, 450, 'flame_yellow', "1"));
        this.enemies.push(new Enemies(game, 300, 450, 'flame_yellow', "1"));
        this.enemies.push(new Enemies(game, 400, 450, 'flame_yellow', "1"));
        this.enemies.push(new Enemies(game, 1118, 250, 'flame_yellow', "1"));


        game.camera.follow(this.player);

        //SCORE
        this.scoreText = game.add.text(16, 16, 'Pontos: ' + game.global.score, { fontSize: '32px', fill: '#000' });
        this.scoreText.fixedToCamera = true;

        this.createParticles();
    },
    update: function () {

        game.physics.arcade.collide(this.player, this.layerPlataforms);
        game.physics.arcade.collide(this.player, this.layerKillPlayer);
        game.physics.arcade.collide(this.player, this.layerBackground2, this.playerDie, null, this);
        game.physics.arcade.collide(this.bullets, this.layerPlataforms, this.killBullet, null, this);

        for (var i = 0; i < this.enemies.length; i++) {
            game.physics.arcade.collide(this.enemies[i].enemy, this.layerPlataforms);
            game.physics.arcade.collide(this.player, this.enemies[i].enemy, this.losingLife, null, this);
            game.physics.arcade.overlap(this.bullets, this.enemies[i].enemy, this.hitEnemy, null, this);
            //this.enemies[i].move();
            //this.enemies[i].move();

            this.moveEnemy(this.enemies[i].enemy);
            // console.log(this.enemies[i]);
        }

        //console.log(this.player.position.x);
        //console.log(this.player.position.y);

        if (this.spaceKey.isDown) {
            this.fire();
        }

        this.movePlayer();
    },

    movePlayer: function () {

        if (cursors.left.isDown) {

            this.player.body.velocity.x = -game.global.playerSpeed;
            this.player.animations.play('left');
        }
        else if (cursors.right.isDown) {

            this.player.body.velocity.x = game.global.playerSpeed;
            this.player.animations.play('right');
        }
        else {

            this.player.body.velocity.x = 0;
            this.player.animations.stop();
            this.player.frame = 4;
        }

        if (cursors.up.isDown && this.player.body.onFloor()) {
            if (game.global.sound) this.jumpSound.play();
            this.player.body.velocity.y = -game.global.jumpSize;;
        }
    },
    moveEnemy: function (a) {

        if (aux <= 100) {
            a.body.velocity.x = 50;
            a.animations.play('right');
        } else {
            a.body.velocity.x = -50;
            a.animations.play('left');
        }

        if (aux == 200) {
            aux = 1;
        } else {
            aux = aux + 1;
        }
    },
    createParticles: function () {
        // Particulas para quando ele morrer
        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('pixel');
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.gravity = 0;
    },
    createBullets: function () {
        //  Our bullet group
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet', 2, false);
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);

        // this.bullets.animations.add('turn', [1, 2, 3, 4], 10, true);
    },
    losingLife: function (a, b) {
        this.playerDie();
        ////console.log(this.lifeCount);
        //this.lifeCount--;
        //this.life[this.lifeCount].kill();

        //var teste = 0;

        //if (this.cursor.left.isDown || this.wasd.left.isDown) {
        //    teste = 30;
        //}
        //else if (this.cursor.right.isDown || this.wasd.right.isDown) {
        //    teste = -30;
        //}

        ////console.log(b);
        ////console.log(teste);        
        //var teste2 = a.body.position.x + teste
        ////console.log(teste2);
        //a.body.position.x = teste2;

        //if (this.lifeCount == 0) {
        //    this.playerDie();
        //} else {
        //    console.log(this.player.position.x);
        //    //this.player.position.x = this.player.position.x - 10;
        //}

    },
    playerDie: function () {

        if (!this.player.alive) {
            return;
        }

        this.player.kill();
        game.global.music.stop();
        this.deadSound.play();
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 600, null, 15);

        // Call the 'startMenu' function in 1000ms
        game.time.events.add(1000, this.startMenu, this);
    },
    fire: function () {

        if (game.time.now > nextFire && this.bullets.countDead() > 0) {
            nextFire = game.time.now + fireRate;

            var bullet = this.bullets.getFirstExists(false);

            bullet.reset(this.player.x + 10, this.player.y + 40);

            //bullet.reset(this.player.x, this.player.y);
            //game.physics.arcade.moveToPointer(bullet, 300);

            if (cursors.left.isDown) {
                bullet.body.velocity.x = -400;
            } else {
                this.player.frame = 5;
                bullet.body.velocity.x = 400;
            }
            bullet.animations.add('turn', [1, 2, 3, 4], 10, true);
            bullet.animations.play('turn');
            //bullet.rotation = game.physics.arcade.moveToPointer(bullet, 10000, game.input.activePointer, 500);
        }

    },
    hitEnemy: function (a, b) {
        b.kill();
        a.kill();
        this.deadSound.play();

        this.emitter.x = a.x;
        this.emitter.y = a.y;
        this.emitter.start(true, 600, null, 15);

        game.global.score += 50;
        this.scoreText.text = 'Pontos: ' + game.global.score;
    },
    killBullet: function (a, b) {
        a.kill();
        this.emitter.x = a.x;
        this.emitter.y = a.y;
        this.emitter.start(true, 600, null, 10);
    },
    startMenu: function () {
        game.state.start('menu');
    },
    collectFood: function (a, b) {
        if (game.global.sound) this.eatSound.play();
        b.kill();
        game.global.score += this.getPoints(b.key);
        this.scoreText.text = 'Pontos: ' + game.global.score;
    },
    getPoints: function (foodType) {
        switch (foodType) {
            case 'rosquinha01':
            case 'rosquinha02':
            case 'rosquinha03':
                return 30;
            case 'frango':
                return 70;
            case 'sandwich':
                return 100;
            case 'batata':
                return 90;
            case 'refri':
            default:
                return 10;
        }
    }
};