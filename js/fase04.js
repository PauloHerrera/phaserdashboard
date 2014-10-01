var fase04State = {
    preload: function () {
        //WHY????
        game.load.image('cave', 'assets/images/cave/fase_caverna.png');
    },
    create: function () {
        this.gameControl = new GameControl(game);

        //MAPA
        //Adiciona o Mapa
        this.map = game.add.tilemap('labyrinth');

        this.map.addTilesetImage('tileset_teste', 'tilesheet');
        this.map.addTilesetImage('spine40x40', 'spike40');
        
        this.layerBackground = this.map.createLayer('background');
        this.layerBackground.resizeWorld();
        
        this.layerPlataforms = this.map.createLayer('platforms');
        this.layerPlataforms.resizeWorld();
        this.map.setCollision(7, true, this.layerPlataforms);
        this.map.setCollision(9, true, this.layerPlataforms);
        
        //this.layerLocks = this.map.createLayer('locks');
        //this.layerLocks.resizeWorld();

        //this.map.setCollision(13, true, this.layerLocks);
        //this.map.setCollision(14, true, this.layerLocks);        
        //this.map.setCollision(15, true, this.layerLocks);
        //this.map.setCollision(16, true, this.layerLocks);

        //CRIA OS INIMIGOS              
        this.enemies = [];
        this.enemies.push(new Enemies(game, 500, 5570, 'flame_yellow', "0", 200, 85));
        this.enemies.push(new Enemies(game, 650, 5570, 'flame_yellow', "0", 200, 85));
        this.enemies.push(new Enemies(game, 800, 5570, 'flame_yellow', "0", 200, 85));        
        this.enemies.push(new Enemies(game, 50, 5170, 'flame_yellow', "0", 80, 35));

        this.enemies.push(new Enemies(game, 505, 4850, 'flame_yellow', "0", 100, 50));


        this.enemies.push(new Enemies(game, 1325, 3530, 'flame_yellow', "0", 200, 310));
        this.enemies.push(new Enemies(game, 1825, 3530, 'flame_yellow', "0", 200, 130));
        this.enemies.push(new Enemies(game, 1725, 3530, 'flame_yellow', "0", 200, 70));
        this.enemies.push(new Enemies(game, 1625, 3530, 'flame_yellow', "0", 100, 70));
        this.enemies.push(new Enemies(game, 1525, 3530, 'flame_yellow', "0", 150, 170));
        this.enemies.push(new Enemies(game, 1425, 3530, 'flame_yellow', "0", 50, 370));
        this.enemies.push(new Enemies(game, 1900, 3530, 'flame_yellow', "0", 200, 170));


        this.enemies.push(new Enemies(game, 1176,3135, 'flame_yellow', "0", 200, 70));
        this.enemies.push(new Enemies(game, 1370,3135, 'flame_yellow', "0", 180, 70));
        this.enemies.push(new Enemies(game, 245, 3335, 'flame_yellow', "0", 180, 20));
        this.enemies.push(new Enemies(game, 50, 5170, 'flame_yellow', "0", 200, 70));
        this.enemies.push(new Enemies(game, 1250, 3695, 'flame_yellow', "0", 50, 60));
        
        exit = game.add.sprite(2900, game.world.height -180, 'exitGreen');
        exit.enableBody = true;

        // Insere o Personagem
        this.myPlayer = new Player(game, 120, this.game.world.height - 120);
        //this.myPlayer = new Player(game, 250, 3690);
        //this.myPlayer = new Player(game, 1561, 3695);
        EmitterObj.init(game);

        
        this.layerKillPlayer = this.map.createLayer('kill');      
        this.layerKillPlayer.resizeWorld();
        this.map.setTileIndexCallback(12, this.losingLife, this, this.layerKillPlayer);
            

        //Add os cora��es com a sa�de do personagem
        this.life = new Array();

        for (j = 0; j < this.myPlayer.player.health; j++) {
            this.life[j] = this.add.image(14 + j * 30, 40, 'heart');
            this.life[j].fixedToCamera = true;
        }

        game.global.scoreText = game.add.text(16, 10, 'Pontos: ' + game.global.score, { fontSize: '20px', fill: '#fff' });
        game.global.scoreText.fixedToCamera = true;


        // Adiciona as chaves
        this.keysGame = game.add.group();
        this.keysGame.enableBody = true;
        game.add.sprite(420, 7050, 'keyGreen', 0, this.keysGame);
        game.add.sprite(840, 5610, 'keyBlue', 0, this.keysGame);
        game.add.sprite(2255, 3172, 'keyYellow', 0, this.keysGame);
                
        //Adiciona as fechaduras
        this.lockers = game.add.group();
        this.lockers.enableBody = true;
        game.add.sprite(480, 7640, 'lockYellow', 0, this.lockers);
        game.add.sprite(320, 7000, 'lockBlue', 0, this.lockers);
        game.add.sprite(600, 4560, 'lockGreen', 0, this.lockers);

        this.lockers.setAll('body.immovable', true);
        //   this.map.setTileIndexCallback(13, this.testLock, this, this.layerLocks);

        if (!game.device.desktop) {
            this.addMobileButtons();
        }
      
    },
    update: function () {

        game.physics.arcade.collide(this.myPlayer.player, this.layerPlataforms);
        game.physics.arcade.collide(this.myPlayer.player, this.layerKillPlayer);
        game.physics.arcade.collide(this.myPlayer.player, this.lockers, this.testLock, null, this);
        game.physics.arcade.collide(this.myPlayer.bullets, this.layerPlataforms, this.killBullet, null, this);
        game.physics.arcade.collide(this.myPlayer.bullets, this.keysGame, this.killBullet, null, this);
        game.physics.arcade.collide(this.myPlayer.bullets, this.lockers, this.killBullet, null, this);
        //game.physics.arcade.collide(this.myPlayer.player, this.layerLocks, this.testLock, null, this);              

        for (var i = 0; i < this.enemies.length; i++) {
            game.physics.arcade.collide(this.enemies[i].enemy, this.layerPlataforms);
            game.physics.arcade.collide(this.myPlayer.player, this.enemies[i].enemy, this.losingLife, null, this);
            game.physics.arcade.overlap(this.myPlayer.bullets, this.enemies[i].enemy, this.enemies[i].isHit, null, this);

            this.enemies[i].move();
        }

        //game.physics.arcade.collide(this.food, this.layerPlataforms);

        console.log(this.myPlayer.player.position.x);
        console.log(this.myPlayer.player.position.y);

        game.physics.arcade.overlap(this.myPlayer.player, this.keysGame, this.myPlayer.collectKeys, null, this);

        this.myPlayer.move();

        if (Keyboard.spaceKey.isDown) {
            this.myPlayer.fire();
        }        
    },
    addMobileButtons: function () {
        // Add the jump button
        this.jumpButton = game.add.sprite(350, 400, 'jumpButton');
        this.jumpButton.inputEnabled = true;
        this.jumpButton.fixedToCamera = true;
        this.jumpButton.alpha = 0.5;

        // Movement variables
        this.moveLeft = false;
        this.moveRight = false;
        
        // Add the move left button
        this.leftButton = game.add.sprite(50, 400, 'leftButton');
        this.leftButton.inputEnabled = true;
        this.leftButton.fixedToCamera = true;
        this.leftButton.alpha = 0.5;
        
        // Add the move right button
        this.rightButton = game.add.sprite(130, 400, 'rightButton');
        this.rightButton.inputEnabled = true;
        this.rightButton.fixedToCamera = true;
        this.rightButton.alpha = 0.5;
               
        this.leftButton.events.onInputOver.add(function () { game.global.moveLeft = true; }, this);
        this.leftButton.events.onInputOut.add(function () { game.global.moveLeft = false; }, this);
        this.leftButton.events.onInputDown.add(function () { game.global.moveLeft = true; }, this);
        this.leftButton.events.onInputUp.add(function () { game.global.moveLeft = false; }, this);
        
        // Add the move right button        
        this.rightButton.events.onInputOver.add(function () { game.global.moveRight = true; }, this);
        this.rightButton.events.onInputOut.add(function () { game.global.moveRight = false; }, this);
        this.rightButton.events.onInputDown.add(function () { game.global.moveRight = true; }, this);
        this.rightButton.events.onInputUp.add(function () { game.global.moveRight = false; }, this);

        // Add the move right button        
        this.jumpButton.events.onInputOver.add(function () { game.global.moveJump = true; }, this);
        this.jumpButton.events.onInputOut.add(function () { game.global.moveJump = false; }, this);
        this.jumpButton.events.onInputDown.add(function () { game.global.moveJump = true; }, this);
        this.jumpButton.events.onInputUp.add(function () { game.global.moveJump = false; }, this);           

    },
    jumpPlayer: function () {

        if (this.myPlayer.player.body.onFloor())
        {
            if (game.global.sound) Sound.jump.play();
            this.myPlayer.player.body.velocity.y = -game.global.jumpSize;
        }        
    },
    testLock: function (sprite, item) {

        var keyColor = item.key.replace("lock", "");

        if (this.myPlayer.hasKey(keyColor)) {
            item.kill();
        }
    },
    openExit: function (sprite, item) {

        var exitColor = item.key.replace("exit", "");

        if (this.myPlayer.hasKey(exitColor)) {
            sprite.kill();
            game.state.start('fase04', fase04State);
        }
    },
    losingLife: function (a, b) {
        this.myPlayer.die(game);
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
    killBullet: function (a, b) {
        a.kill();
        EmitterObj.emitter.x = a.x;
        EmitterObj.emitter.y = a.y;
        EmitterObj.emitter.start(true, 600, null, 10);
    },
};