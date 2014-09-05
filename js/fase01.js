var fase01State = {
    create: function () {

    //    game.world.setBounds(0, 0, 1900, 500);        
      //  var sky = game.add.tileSprite(0, 0, 1900, 600, 'sky');             

        // Sons
        this.eatSound = game.add.audio('eat');
        this.jumpSound = game.add.audio('jump');
        this.deadSound = game.add.audio('dead');

        //if (game.global.sound) {
        //    this.music = game.add.audio('background_music'); // Add the music
        //    this.music.loop = true; // Make it loop
        //    this.music.volume = 0.2;
        //    this.music.play(); // Start the music
        //}        

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
        this.player = game.add.sprite(110, game.world.height - 240, 'personagem');
        game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;        
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.player.body.collideWorldBounds = true;

        this.layerForeground = this.map.createLayer('Foreground');
        this.layerForeground.resizeWorld();                

        // Adiciona o teclado
        cursors = game.input.keyboard.createCursorKeys();
               
        // Adiciona o buraco
        hole = game.add.sprite(3050, game.world.height - 150, 'hole');
        hole.enableBody = true;        

        //SCORE
        this.scoreText = game.add.text(16, 10, 'Pontos: 0', { fontSize: '20px', fill: '#fff' });
        this.scoreText.fixedToCamera = true;

        //Add os corações com a saúde do personagem
        this.life = new Array();
        this.lifeCount = 4;
        for (j = 0; j < 4; j++) {
            this.life[j] = this.add.image(14 + j * 30, 40, 'heart');
            this.life[j].fixedToCamera = true;
        }

        game.camera.follow(this.player);

        this.createParticles();
    },
    update: function () {              
        
        game.physics.arcade.collide(this.player, this.layerPlataforms);
        game.physics.arcade.collide(this.player, this.layerKillPlayer);
                
        game.physics.arcade.collide(this.food, this.layerPlataforms);
        game.physics.arcade.overlap(this.player, this.food, this.collectFood, null, this);
        
        this.movePlayer();
       
        if (this.player.position.y >= game.world.height - 80) {
            this.playerDie();
        }
        //console.log(this.player.position.x);
        //console.log(this.player.position.y);

        if (this.player.position.x > 3082 && this.player.position.x < 3115 && cursors.down.isDown) {
            this.player.kill();
            game.state.add('fase02', fase02State, true);                        
        }
    },
    createParticles: function(){
        // Particulas para quando ele morrer
        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('pixel');
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.gravity = 0;
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