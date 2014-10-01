var faseTutorialState = {
    preload: function () {
        //WHY????
        game.load.image('cave', 'assets/images/cave/fase_caverna.png');
    },
    create: function () {
        this.gameControl = new GameControl(game);

        //MAPA
        //Adiciona o Mapa
        this.map = game.add.tilemap('tutorial');

        this.map.addTilesetImage('tileset_teste', 'tilesheet');
        this.map.addTilesetImage('spine40x40', 'spike40');
        
        this.layerBackground = this.map.createLayer('background');
        this.layerBackground.resizeWorld();
        
        this.layerPlataforms = this.map.createLayer('platforms');
        this.layerPlataforms.resizeWorld();
        this.map.setCollision(7, true, this.layerPlataforms);
        this.map.setCollision(9, true, this.layerPlataforms);
               
        //CRIA OS INIMIGOS              
        this.enemies = [];
        this.enemies.push(new Enemies(game, 310, 330, 'flame_yellow', "0", 50, 35));
                
        //Adiciona as portas (juntar com as fechaduras???)
        this.doors = game.add.group();
        this.doors.enableBody = true;
        game.add.sprite(670, game.world.height - 180, 'exitGreen', 0, this.doors);
        this.doors.setAll('body.immovable', true);

        // Insere o Personagem
        this.myPlayer = new Player(game, 800, this.game.world.height - 130);
        
        EmitterObj.init(game);

        this.createItens();        

        this.layerKillPlayer = this.map.createLayer('kill');      
        this.layerKillPlayer.resizeWorld();
        this.map.setTileIndexCallback(12, this.losingLife, this, this.layerKillPlayer);
            
        //Add os corações com a saúde do personagem
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
        game.add.sprite(595, 240, 'keyYellow', 0, this.keysGame);
        game.add.sprite(1915, 350, 'keyBlue', 0, this.keysGame);
        game.add.sprite(680, 530, 'keyGreen', 0, this.keysGame);
        this.keysGame.setAll('body.immovable', true);

        //Adiciona as fechaduras
        this.lockers = game.add.group();
        this.lockers.enableBody = true;
        game.add.sprite(640, 320, 'lockYellow', 0, this.lockers);
        game.add.sprite(1200, 600, 'lockYellow', 0, this.lockers);
        game.add.sprite(1560, 680, 'lockBlue', 0, this.lockers);
        this.lockers.setAll('body.immovable', true);

      
        
        if (!game.device.desktop) {
            this.addMobileButtons();
        }
      
    },
    update: function () {

        game.physics.arcade.collide(this.food, this.layerPlataforms);
        game.physics.arcade.overlap(this.myPlayer.player, this.food, this.myPlayer.collectFood, null, this);

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
        //console.log(this.myPlayer.player.position.x);
        //console.log(this.myPlayer.player.position.y);

        game.physics.arcade.overlap(this.myPlayer.player, this.doors, this.openExit, null, this);
        game.physics.arcade.overlap(this.myPlayer.player, this.keysGame, this.myPlayer.collectKeys, null, this);

        this.myPlayer.move();

        if (Keyboard.spaceKey.isDown) {
            this.myPlayer.fire();
        }        
    },
    openExit: function (sprite, item) {

        var exitColor = item.key.replace("exit", "");
        console.log(exitColor);
        if (this.myPlayer.hasKey(exitColor)) {
            sprite.kill();
            game.state.start('fase01v2State', fase01v2State);
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
    createItens: function () {
        this.food = game.add.group();
        this.food.enableBody = true;

        game.add.sprite(540, 555, 'rosquinha03', 0, this.food);

        this.food.setAll('body.gravity.y', 60);
        this.food.setAll('body.bounce.y', 0.4);
    },
    killBullet: function (a, b) {
        a.kill();
        EmitterObj.emitter.x = a.x;
        EmitterObj.emitter.y = a.y;
        EmitterObj.emitter.start(true, 600, null, 10);
    },
};