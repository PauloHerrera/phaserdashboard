var fase01State = {
    create: function () {

        this.gameControl = new GameControl(game);
        
        this.createItens();

        //MAPA
        //Adiciona o Mapa
        this.map = game.add.tilemap('map01');
        this.map.addTilesetImage('nuvens', 'nuvens');
        this.map.addTilesetImage('grama_tileset', 'grama_tileset');
        this.map.addTilesetImage('spine', 'spine');
        this.map.addTilesetImage('tree', 'tree');
        this.map.addTilesetImage('woodPlatform1', 'woodPlatform1');

        this.layerPlataforms = this.map.createLayer('Plataformas');
        this.layerPlataforms.resizeWorld();
        this.map.setCollision(1, true, this.layerPlataforms);
        this.map.setCollision(4, true, this.layerPlataforms);
        this.map.setCollision(5, true, this.layerPlataforms);
        this.map.setCollision(6, true, this.layerPlataforms);

        this.map.setCollision(11, true, this.layerPlataforms);
        this.map.setCollision(12, true, this.layerPlataforms);
        this.map.setCollision(13, true, this.layerPlataforms);
        this.map.setCollision(14, true, this.layerPlataforms);
        this.map.setCollision(15, true, this.layerPlataforms);
        this.map.setCollision(16, true, this.layerPlataforms);

        this.layerKillPlayer = this.map.createLayer('Objetos Tira Vida');
        this.layerKillPlayer.resizeWorld();

        this.map.setTileIndexCallback(17, this.losingLife, this, this.layerKillPlayer);

        this.layerObjetos = this.map.createLayer('Objetos Decorativos');
        this.layerObjetos.resizeWorld();

        //Adiciona as portas (juntar com as fechaduras???)
        this.doors = game.add.group();
        this.doors.enableBody = true;
        game.add.sprite(3120, game.world.height - 235, 'exitGreen', 0, this.doors);
        this.doors.setAll('body.immovable', true);

        // Insere o Personagem
        this.myPlayer = new Player(game, 100, this.game.world.height - 240);     
                
        //CRIA OS INIMIGOS              
        this.enemies = [];
        this.enemies.push(new Enemies(game, 1150, game.world.height - 240, 'cook', "0", 400, 75));
        this.enemies.push(new Enemies(game, 1150, game.world.height - 240, 'flame_yellow', "0", 200, 85));
        this.enemies.push(new Enemies(game, 2150, game.world.height - 240, 'cook', "0", 100, 200));
        this.enemies.push(new Enemies(game, 2250, game.world.height - 240, 'cook', "0", 200, 100));

        this.enemies.push(new Enemies(game, 2850, game.world.height - 240, 'flame_yellow', "0", 100, 200));
      
        this.layerForeground = this.map.createLayer('Foreground');
        this.layerForeground.resizeWorld();                

        // Adiciona o buraco
        hole = game.add.sprite(2870, game.world.height - 150, 'hole');
        hole.enableBody = true;                      

        //Add vida na tela
        this.myPlayer.addLife();

        EmitterObj.init(game);

        game.global.scoreText = game.add.text(16, 10, 'Pontos: ' + game.global.score, { fontSize: '20px', fill: '#fff' });
        game.global.scoreText.fixedToCamera = true;
        
        // Adiciona as chaves
        this.keysGame = game.add.group();
        this.keysGame.enableBody = true;
        game.add.sprite(3160, 380, 'keyGreen', 0, this.keysGame);
        this.keysGame.setAll('body.immovable', true);

        //Adiciona as fechaduras
        this.lockers = game.add.group();
        this.lockers.enableBody = true;

        if (!game.device.desktop) {
            this.addMobileButtons();
        }

        //if (this.myPlayer.player.position.y >= game.world.height - 80) {
        //    this.myPlayer.die(game);
        //}
    },
    update: function () {                      

        game.physics.arcade.collide(this.food, this.layerPlataforms);
        game.physics.arcade.overlap(this.myPlayer.player, this.food, this.myPlayer.collectFood, null, this);

        game.physics.arcade.collide(this.myPlayer.player, this.layerPlataforms);
        game.physics.arcade.collide(this.myPlayer.player, this.layerKillPlayer);

        game.physics.arcade.collide(this.myPlayer.player, this.lockers, this.testLock, null, this);
        game.physics.arcade.overlap(this.myPlayer.player, this.keysGame, this.myPlayer.collectKeys, null, this);
        game.physics.arcade.overlap(this.myPlayer.player, this.doors, this.openExit, null, this);

        game.physics.arcade.collide(this.myPlayer.bullets, this.layerPlataforms, this.killBullet, null, this);
        game.physics.arcade.collide(this.myPlayer.bullets, this.keysGame, this.killBullet, null, this);
        game.physics.arcade.collide(this.myPlayer.bullets, this.lockers, this.killBullet, null, this);

        for (var i = 0; i < this.enemies.length; i++) {
            game.physics.arcade.collide(this.enemies[i].enemy, this.layerPlataforms);
            game.physics.arcade.collide(this.enemies[i].enemy, this.lockers);
            game.physics.arcade.collide(this.myPlayer.player, this.enemies[i].enemy, this.losingLife, null, this);
            game.physics.arcade.overlap(this.myPlayer.bullets, this.enemies[i].enemy, this.enemies[i].isHit, null, this);

            this.enemies[i].move();
        }
       
        if (this.myPlayer.player.position.x > 2900 && this.myPlayer.player.position.x < 2935 && Keyboard.cursorKeys.down.isDown) {

            this.myPlayer.player.kill();
            game.state.start('fase02', fase02State);                            
        }
        
        //console.log(this.myPlayer.player.position.x);
        //console.log(this.myPlayer.player.position.y);

        if (Keyboard.spaceKey.isDown) {
            this.myPlayer.fire();
        }

        this.myPlayer.move();

    },
    openExit: function (sprite, item) {

        var exitColor = item.key.replace("exit", "");

        if (this.myPlayer.hasKey(exitColor)) {
            sprite.kill();
            game.state.start('faseTutorial', faseTutorialState);
        }
    },
    jumpPlayer: function () {

        if (this.myPlayer.player.body.onFloor()) {
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
    killBullet: function (a, b) {
        a.kill();

        EmitterObj.emitter.x = a.x;
        EmitterObj.emitter.y = a.y;
        EmitterObj.emitter.start(true, 600, null, 10);
    },
    losingLife: function (a, b) {
        this.myPlayer.looseLife(a, b, 100, this.game.world.height - 240);
    },
    createItens: function () {        
        this.food = game.add.group();
        this.food.enableBody = true;
                
        game.add.sprite(160, 800, 'rosquinha03', 0, this.food);
        game.add.sprite(200, 500, 'rosquinha01', 0, this.food);
        game.add.sprite(200, 200, 'rosquinha02', 0, this.food);            

        game.add.sprite(200, 10, 'sandwich', 0, this.food);


        game.add.sprite(270, 950, 'frango', 0, this.food);
        game.add.sprite(340, 950, 'frango', 0, this.food);
        game.add.sprite(410, 950, 'frango', 0, this.food);


        game.add.sprite(920, 700, 'refri', 0, this.food);
        game.add.sprite(995, 700, 'batata', 0, this.food);

        game.add.sprite(750, 1000, 'rosquinha02', 0, this.food);


        game.add.sprite(3140, 955, 'rosquinha01', 0, this.food);
        game.add.sprite(3140, 800, 'rosquinha02', 0, this.food);
        game.add.sprite(3140, 650, 'rosquinha03', 0, this.food);
        game.add.sprite(3140, 505, 'rosquinha01', 0, this.food);
        //game.add.sprite(3140, 348, 'rosquinha02', 0, this.food);

        game.add.sprite(3140, 150, 'sandwich', 0, this.food);

        this.food.setAll('body.gravity.y', 60);
        this.food.setAll('body.bounce.y', 0.4);
    },
    
};