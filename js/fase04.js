var fase04State = {
    preload: function () {
        //WHY????
        game.load.image('cave', 'assets/images/cave/fase_caverna.png');
    },
    create: function () {
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

        //CRIA OS INIMIGOS              
        this.enemies = [];

        // Insere o Personagem
        this.myPlayer = new Player(game, 120, this.game.world.height - 300);

        EmitterObj.init(game);

        game.global.scoreText = game.add.text(16, 10, 'Pontos: ' + game.global.score, { fontSize: '20px', fill: '#fff' });
        game.global.scoreText.fixedToCamera = true;


        this.layerKillPlayer = this.map.createLayer('kill');
        this.layerKillPlayer.resizeWorld();
        this.map.setTileIndexCallback(12, this.losingLife, this, this.layerKillPlayer);

        //Add os corações com a saúde do personagem
        this.life = new Array();

        for (j = 0; j < this.myPlayer.health; j++) {
            this.life[j] = this.add.image(14 + j * 30, 40, 'heart');
            this.life[j].fixedToCamera = true;
        }

        // Adiciona o buraco
        this.keys = game.add.group();
        this.keys.enableBody = true;
        game.add.sprite(200, game.world.height - 70, 'keyYellow', 0, this.keys);       
        

    },
    update: function () {

        game.physics.arcade.collide(this.myPlayer.player, this.layerPlataforms);
        game.physics.arcade.collide(this.myPlayer.player, this.layerKillPlayer);
        //game.physics.arcade.collide(this.myPlayer.player, this.layerKillPlayer);
      //  game.physics.arcade.collide(this.myPlayer.player, this.layerBackground2, this.myPlayer.die(game), null, this);
        //game.physics.arcade.collide(this.myPlayer.bullets, this.layerPlataforms, this.killBullet, null, this);
        

        //for (var i = 0; i < this.enemies.length; i++) {
        //    game.physics.arcade.collide(this.enemies[i].enemy, this.layerPlataforms);
        //    game.physics.arcade.collide(this.myPlayer.player, this.enemies[i].enemy, this.losingLife, null, this);
        //    game.physics.arcade.overlap(this.myPlayer.bullets, this.enemies[i].enemy, this.enemies[i].isHit, null, this);

        //    this.enemies[i].move();

        //}

        //game.physics.arcade.collide(this.food, this.layerPlataforms);


        game.physics.arcade.overlap(this.myPlayer.player, this.keys, this.myPlayer.collectKeys, null, this);

        this.myPlayer.move();

        if (Keyboard.spaceKey.isDown) {
            this.myPlayer.fire();
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