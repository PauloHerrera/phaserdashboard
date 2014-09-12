var fase02State = {    
    create: function () {
        //MAPA
        //Adiciona o Mapa
        this.map = game.add.tilemap('map');
        
        this.map.addTilesetImage('fase_caverna', 'fase_caverna');
        this.map.addTilesetImage('flame', 'flame');
        this.map.addTilesetImage('skull01', 'skull01');
        this.map.addTilesetImage('atocha', 'atocha');
        this.map.addTilesetImage('spine', 'spine');

        this.layerBackground = this.map.createLayer('Background');
        this.layerBackground.resizeWorld();

        this.layerPlataforms = this.map.createLayer('Plataformas');
        this.layerPlataforms.resizeWorld();
        this.map.setCollision(2, true, this.layerPlataforms);
        this.map.setCollision(3, true, this.layerPlataforms);
        this.map.setCollision(6, true, this.layerPlataforms);
        this.map.setCollision(7, true, this.layerPlataforms);
        this.map.setCollision(9, true, this.layerPlataforms);

        this.layerKillPlayer = this.map.createLayer('Objetos Tira Vida');
        this.layerKillPlayer.resizeWorld();
        this.map.setTileIndexCallback(21, this.losingLife, this, this.layerKillPlayer);
        this.map.setTileIndexCallback(22, this.losingLife, this, this.layerKillPlayer);

        this.layerObjetos = this.map.createLayer('Objetos Decorativos');
        this.layerObjetos.resizeWorld();

        // Sons
        this.eatSound = game.add.audio('eat');
        this.jumpSound = game.add.audio('jump');
        this.deadSound = game.add.audio('dead');

        this.createItens();
                
        hole = game.add.sprite(6100, 610, 'skull_enter');
        hole.enableBody = true;
        
        // Adiciona o teclado
        cursors = game.input.keyboard.createCursorKeys();

        // Adiciona o enter
        this.spaceKey = game.input.keyboard.addKey(32);
               
        // Insere o Personagem
        this.player = game.add.sprite(110, 300, 'personagem');
       // this.player = game.add.sprite(5900, game.world.height - 240, 'personagem');

        game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.player.body.collideWorldBounds = true;
        this.layerForeground = this.map.createLayer('Foreground');
        this.layerForeground.resizeWorld();
        
        //Cria o que o personagem vai atirar
        this.createBullets();

        this.enemies = [];
        this.enemies.push(new Enemies(game, 443, 300, 'flame_red', "1"));

        this.enemies.push(new Enemies(game, 450, 450, 'flame_yellow', "1"));
        this.enemies.push(new Enemies(game, 550, 450, 'flame_yellow', "1"));
        this.enemies.push(new Enemies(game, 650, 450, 'flame_yellow', "1"));
        this.enemies.push(new Enemies(game, 910, 450, 'flame_yellow', "1"));
        this.enemies.push(new Enemies(game, 1100, 450, 'flame_yellow', "1"));

        this.enemies.push(new Enemies(game, 1645, 660, 'flame_yellow', "1"));
        this.enemies.push(new Enemies(game, 1760, 660, 'flame_yellow', "1"));
        this.enemies.push(new Enemies(game, 1900, 660, 'flame_yellow', "1"));
        this.enemies.push(new Enemies(game, 2050, 660, 'flame_yellow', "1"));
        this.enemies.push(new Enemies(game, 2200, 660, 'flame_yellow', "1"));
        this.enemies.push(new Enemies(game, 2320, 660, 'flame_yellow', "1"));
        this.enemies.push(new Enemies(game, 2520, 660, 'flame_red', "1"));

        this.enemies.push(new Enemies(game, 4400, 370, 'flame_yellow', "1"));
        this.enemies.push(new Enemies(game, 4500, 370, 'flame_red', "1"));

        this.enemies.push(new Enemies(game, 4870, 40, 'flame_red', "1"));
        this.enemies.push(new Enemies(game, 4970, 40, 'flame_red', "1"));
        
        game.camera.follow(this.player);       

        //SCORE
        this.scoreText = game.add.text(16, 16, 'Pontos: ' + game.global.score, { fontSize: '32px', fill: '#000' });
        this.scoreText.fixedToCamera = true;
        
        this.createParticles();
    },
    update: function () {               

        game.physics.arcade.collide(this.player, this.layerPlataforms);
        game.physics.arcade.collide(this.player, this.layerKillPlayer);

        game.physics.arcade.collide(this.food, this.layerPlataforms);
        game.physics.arcade.overlap(this.player, this.food, this.collectFood, null, this);
        game.physics.arcade.collide(this.bullets, this.layerPlataforms, this.killBullet, null, this);

        this.movePlayer();
        
        console.log(this.player.position.x);
        console.log(this.player.position.y);

        for (var i = 0; i < this.enemies.length; i++) {
            game.physics.arcade.collide(this.enemies[i].enemy, this.layerPlataforms);
            game.physics.arcade.collide(this.player, this.enemies[i].enemy, this.losingLife, null, this);
            game.physics.arcade.overlap(this.bullets, this.enemies[i].enemy, this.hitEnemy, null, this);

            this.moveEnemy(this.enemies[i].enemy);            
        }

        if (this.spaceKey.isDown) {
            this.fire();
        }

        if (this.player.position.x > 6140 && this.player.position.x < 6160 && cursors.up.isDown) {
            this.player.kill();                        
            game.state.add('fase03', fase03State, true);            
        }
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
    createParticles: function () {
        // Particulas para quando ele morrer
        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('pixel');
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.gravity = 0;
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

    startMenu: function () {
        game.state.start('menu');
    },
    moveEnemy: function (a) {

        if (aux <= 150) {
            a.body.velocity.x = 50;
            a.animations.play('right');
        } else {
            a.body.velocity.x = -50;
            a.animations.play('left');
        }

        if (aux == 300) {
            aux = 1;
        } else {
            aux = aux + 1;
        }
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
    createItens: function () {
        this.food = game.add.group();
        this.food.enableBody = true;

        game.add.sprite(705, 300, 'rosquinha03', 0, this.food);

        game.add.sprite(3985, 370, 'rosquinha02', 0, this.food);
        game.add.sprite(4260, 300, 'rosquinha01', 0, this.food);

        game.add.sprite(5245, 370, 'rosquinha03', 0, this.food);
        game.add.sprite(5370, 370, 'rosquinha01', 0, this.food);
        game.add.sprite(5500, 370, 'rosquinha02', 0, this.food);
        game.add.sprite(5630, 370, 'rosquinha03', 0, this.food);
        game.add.sprite(5755, 370, 'rosquinha01', 0, this.food);
        game.add.sprite(5885, 370, 'rosquinha02', 0, this.food);

        game.add.sprite(2355, 50, 'sandwich', 0, this.food);
        game.add.sprite(2610, 435, 'sandwich', 0, this.food);

        game.add.sprite(5067, 50, 'sandwich', 0, this.food);


        game.add.sprite(1870, 50, 'frango', 0, this.food);
        game.add.sprite(1970, 50, 'frango', 0, this.food);
        game.add.sprite(2070, 50, 'frango', 0, this.food);    
        game.add.sprite(2170, 50, 'frango', 0, this.food);

        game.add.sprite(4150, 50, 'frango', 0, this.food);
        game.add.sprite(4250, 50, 'frango', 0, this.food);
        game.add.sprite(4350, 50, 'frango', 0, this.food);               

        game.add.sprite(5115, 370, 'refri', 0, this.food);
        game.add.sprite(1150, 460, 'refri', 0, this.food);

        game.add.sprite(1200, 460, 'batata', 0, this.food);
        game.add.sprite(2265, 50, 'batata', 0, this.food);

        game.add.sprite(4645, 475, 'batata', 0, this.food);
        game.add.sprite(4700, 475, 'batata', 0, this.food);

        //game.add.sprite(750, 1000, 'rosquinha02', 0, this.food);


        //game.add.sprite(3140, 955, 'rosquinha01', 0, this.food);
        //game.add.sprite(3140, 800, 'rosquinha02', 0, this.food);
        //game.add.sprite(3140, 650, 'rosquinha03', 0, this.food);
        //game.add.sprite(3140, 505, 'rosquinha01', 0, this.food);
        //game.add.sprite(3140, 348, 'rosquinha02', 0, this.food);

        //game.add.sprite(3140, 150, 'sandwich', 0, this.food);

        this.food.setAll('body.gravity.y', 60);
        this.food.setAll('body.bounce.y', 0.4);
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