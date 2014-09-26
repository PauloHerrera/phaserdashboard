var fase03State = {
    preload: function () {
        //WHY????
        game.load.image('cave', 'assets/images/cave/fase_caverna.png');
    },
    create: function () {
        //MAPA
        //Adiciona o Mapa
        this.map = game.add.tilemap('map_lava_01');

        this.map.addTilesetImage('lava_objetc_01', 'lava01');
        this.map.addTilesetImage('lava_tileset', 'lava_tileset');
        this.map.addTilesetImage('spine', 'spine');
        this.map.addTilesetImage('platform_large', 'platform_lava01_large');

        this.layerBackground = this.map.createLayer('Background');
        this.layerBackground.resizeWorld();

        this.layerBackground2 = this.map.createLayer('Background2');
        this.layerBackground2.resizeWorld();
        this.map.setCollision(14, true, this.layerBackground2);
        this.map.setCollision(15, true, this.layerBackground2);
        this.map.setCollision(16, true, this.layerBackground2);        
        this.map.setCollision(17, true, this.layerBackground2);
        this.map.setCollision(18, true, this.layerBackground2);
        this.map.setCollision(19, true, this.layerBackground2);
        this.map.setCollision(20, true, this.layerBackground2);

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

        //CRIA OS INIMIGOS              
        this.enemies = [];

        // Insere o Personagem
        this.myPlayer = new Player(game, 100, this.game.world.height - 450);

        EmitterObj.init(game);

        game.global.scoreText = game.add.text(16, 10, 'Pontos: ' + game.global.score, { fontSize: '20px', fill: '#fff' });
        game.global.scoreText.fixedToCamera = true;

        //Add os corações com a saúde do personagem
        this.life = new Array();

        for (j = 0; j < this.myPlayer.health; j++) {
            this.life[j] = this.add.image(14 + j * 30, 40, 'heart');
            this.life[j].fixedToCamera = true;
        }

    },
    update: function () {

        game.physics.arcade.collide(this.myPlayer.player, this.layerPlataforms);
        game.physics.arcade.collide(this.myPlayer.player, this.layerKillPlayer);
      //  game.physics.arcade.collide(this.myPlayer.player, this.layerBackground2, this.myPlayer.die(game), null, this);
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