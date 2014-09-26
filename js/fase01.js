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

        // Insere o Personagem
        this.myPlayer = new Player(game);
        
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
        hole = game.add.sprite(3050, game.world.height - 150, 'hole');
        hole.enableBody = true;                      

        //Add os corações com a saúde do personagem
        this.life = new Array();
        
        for (j = 0; j < this.myPlayer.health; j++) {
            this.life[j] = this.add.image(14 + j * 30, 40, 'heart');
            this.life[j].fixedToCamera = true;
        }       

        EmitterObj.init(game);

        game.global.scoreText = game.add.text(16, 10, 'Pontos: ' + game.global.score, { fontSize: '20px', fill: '#fff' });
        game.global.scoreText.fixedToCamera = true;
    },
    update: function () {              
        
        game.physics.arcade.collide(this.myPlayer.player, this.layerPlataforms);
        game.physics.arcade.collide(this.myPlayer.player, this.layerKillPlayer);

        game.physics.arcade.collide(this.myPlayer.bullets, this.layerPlataforms, this.killBullet, null, this);

        for (var i = 0; i < this.enemies.length; i++) {
            game.physics.arcade.collide(this.enemies[i].enemy, this.layerPlataforms);
            game.physics.arcade.collide(this.myPlayer.player, this.enemies[i].enemy, this.losingLife, null, this);
            game.physics.arcade.overlap(this.myPlayer.bullets, this.enemies[i].enemy, this.enemies[i].isHit, null, this);
            
            this.enemies[i].move();
        }     
    
        game.physics.arcade.collide(this.food, this.layerPlataforms);
        game.physics.arcade.overlap(this.myPlayer.player, this.food, this.myPlayer.collectFood, null, this);
        
        this.myPlayer.move();
       
        if (this.myPlayer.player.position.y >= game.world.height - 80) {
            this.myPlayer.die(game);
        }        
        //console.log(this.myPlayer.player.position.x);
        if (this.myPlayer.player.position.x > 3082 && this.myPlayer.player.position.x < 3115 && Keyboard.cursorKeys.down.isDown) {

            this.myPlayer.player.kill();
            game.state.start('fase02', fase02State);                            
        }

        if (Keyboard.spaceKey.isDown) {
            this.myPlayer.fire();
        }
    },
    killBullet: function (a, b) {
        a.kill();

        EmitterObj.emitter.x = a.x;
        EmitterObj.emitter.y = a.y;
        EmitterObj.emitter.start(true, 600, null, 10);
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
    playerDie: function () {

        if (!this.player.alive) {
            return;
        }

        this.player.kill();
        game.global.music.stop();
        this.SoundList.dead.play();
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 600, null, 15);

        // Call the 'startMenu' function in 1000ms
        game.time.events.add(1000, this.startMenu, this);
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
        game.add.sprite(3140, 348, 'rosquinha02', 0, this.food);

        game.add.sprite(3140, 150, 'sandwich', 0, this.food);

        this.food.setAll('body.gravity.y', 60);
        this.food.setAll('body.bounce.y', 0.4);
    },
    
};