var fase02State = {
    preload: function () {
        //WHY????
        game.load.image('cave', 'assets/images/cave/fase_caverna.png');
    },
    create: function () {
        
        this.gameControl = new GameControl(game);

        //MAPA
        //Adiciona o Mapa
        this.map = game.add.tilemap('map02');
       
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

        
        //Adiciona as portas (juntar com as fechaduras???)
        this.doors = game.add.group();
        this.doors.enableBody = true;
        game.add.sprite(6250, game.world.height - 203, 'exitPurple', 0, this.doors);
        this.doors.setAll('body.immovable', true);

        // Insere o Personagem
        this.myPlayer = new Player(game, 60, this.game.world.height - 240);

        //CRIA OS INIMIGOS              
        this.enemies = [];
        this.enemies.push(new Enemies(game, 350, game.world.height - 240, 'flame_yellow', "0", 300, 100));
        this.enemies.push(new Enemies(game, 510, 380, 'flame_yellow', "0", 80, 50));
        this.enemies.push(new Enemies(game, 1520, 55, 'flame_red', "0", 80, 70));

        this.enemies.push(new Enemies(game, 1580, game.world.height - 200, 'flame_yellow', "0", 80, 90));
        this.enemies.push(new Enemies(game, 1780, game.world.height - 200, 'flame_yellow', "0", 80, 90));
        this.enemies.push(new Enemies(game, 1880, game.world.height - 200, 'flame_yellow', "0", 80, 90));
        this.enemies.push(new Enemies(game, 1980, game.world.height - 200, 'flame_yellow', "0", 80, 90));
        this.enemies.push(new Enemies(game, 2200, game.world.height - 200, 'flame_red', "0", 80, 130));
        
        this.enemies.push(new Enemies(game, 4420, 378, 'flame_yellow', "0", 80, 50));
        this.enemies.push(new Enemies(game, 4480, 378, 'flame_yellow', "0", 80, 50));
        this.enemies.push(new Enemies(game, 4800, 70, 'flame_red', "0", 120, 100));        
        this.enemies.push(new Enemies(game, 5900, game.world.height - 200, 'flame_red', "0", 120, 130));

        this.createItens();
        
        //Add vida na tela
        this.myPlayer.addLife();
        
        EmitterObj.init(game);

        game.global.scoreText = game.add.text(16, 10, 'Pontos: ' + game.global.score, { fontSize: '20px', fill: '#fff' });
        game.global.scoreText.fixedToCamera = true;
        
        // Adiciona as chaves
        this.keysGame = game.add.group();
        this.keysGame.enableBody = true;
        game.add.sprite(5265, 420, 'keyPurple', 0, this.keysGame);
        this.keysGame.setAll('body.immovable', true);

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
        
        this.myPlayer.move();

        if (Keyboard.spaceKey.isDown) {
            this.myPlayer.fire();
        }
    },
    openExit: function (sprite, item) {

        var exitColor = item.key.replace("exit", "");

        if (this.myPlayer.hasKey(exitColor)) {
            sprite.kill();
            game.state.start('faselab01', faselab01State);
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
    losingLife: function (a, b) {
        this.myPlayer.looseLife(a, b, 60, this.game.world.height - 130);
    },
    killBullet: function (a, b) {
        a.kill();
        EmitterObj.emitter.x = a.x;
        EmitterObj.emitter.y = a.y;
        EmitterObj.emitter.start(true, 600, null, 10);
    },
    createItens: function () {
        this.food = game.add.group();
        this.food.enableBody = true;

        game.add.sprite(705, 300, 'rosquinha03', 0, this.food);

        game.add.sprite(3985, 370, 'rosquinha02', 0, this.food);
        game.add.sprite(4260, 300, 'rosquinha01', 0, this.food);

      //  game.add.sprite(5245, 370, 'rosquinha03', 0, this.food);
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
    }
};