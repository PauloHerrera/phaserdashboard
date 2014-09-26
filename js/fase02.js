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

        // Insere o Personagem
        this.myPlayer = new Player(game);

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
    }
};