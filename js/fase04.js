var fase04State = {
    create: function () {

    //    game.world.setBounds(0, 0, 1900, 500);        
      //  var sky = game.add.tileSprite(0, 0, 1900, 600, 'sky');             

        // Sons
        this.eatSound = game.add.audio('eat');
        this.jumpSound = game.add.audio('jump');
                
        //if (game.global.sound) {
        //    this.music = game.add.audio('background_music'); // Add the music
        //    this.music.loop = true; // Make it loop
        //    this.music.volume = 0.2;
        //    this.music.play(); // Start the music
        //}
        
      //  this.createPlataforms();

        // this.createItens();

        //MAPA
        //Adiciona o Mapa
        this.map = game.add.tilemap('map01');
        this.map.addTilesetImage('nuvens', 'nuvens');
        this.map.addTilesetImage('grama_tileset', 'grama_tileset');
        this.map.addTilesetImage('spine', 'spine');
        this.map.addTilesetImage('tree', 'tree');

        this.layerPlataforms = this.map.createLayer('Plataformas');
        this.layerPlataforms.resizeWorld();
        this.map.setCollision(13, true, this.layerPlataforms);
        this.map.setCollision(14, true, this.layerPlataforms);
        this.map.setCollision(15, true, this.layerPlataforms);
        this.map.setCollision(16, true, this.layerPlataforms);

        this.map.setCollision(25, true, this.layerPlataforms);
        this.map.setCollision(28, true, this.layerPlataforms);
        this.map.setCollision(29, true, this.layerPlataforms);
        this.map.setCollision(30, true, this.layerPlataforms);
        this.map.setCollision(31, true, this.layerPlataforms);

        this.layerKillPlayer = this.map.createLayer('Objetos Tira Vida');
        this.layerKillPlayer.resizeWorld();

        this.layerObjetos = this.map.createLayer('Objetos Decorativos');
        this.layerObjetos.resizeWorld();

        // Insere o DUDE!
        this.player = game.add.sprite(110, game.world.height - 240, 'personagem');
        game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        
        this.layerForeground = this.map.createLayer('Foreground');
        this.layerForeground.resizeWorld();                

        // Adiciona o teclado
        cursors = game.input.keyboard.createCursorKeys();
               
        //// Adiciona o buraco
        //hole = game.add.sprite(1780, game.world.height - 90, 'hole');
        //hole.enableBody = true;        

        //SCORE
        this.scoreText = game.add.text(16, 16, 'Pontos: 0', { fontSize: '20px', fill: '#0d075f' });
        this.scoreText.fixedToCamera = true;

        //Add os corações com a saúde do personagem
        this.life = new Array();
        this.lifeCount = 4;
        for (j = 0; j < 4; j++) {
            this.life[j] = this.add.image(14 + j * 30, 45, 'heart');
            this.life[j].fixedToCamera = true;
        }

        game.camera.follow(this.player);
    },
    update: function () {              
        
        game.physics.arcade.collide(this.player, this.layerPlataforms);

        //game.physics.arcade.collide(this.food, this.platforms);        
        //game.physics.arcade.overlap(this.player, this.food, this.collectFood, null, this);
        
        this.movePlayer();
       
        //if (this.player.position.x > 1820 && this.player.position.x < 1850 && cursors.down.isDown) {
        //    this.player.kill();
        //    game.state.add('fase02', fase02State, true);
        //    //game.state.start('fase02', true, true);
        //}            
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
};