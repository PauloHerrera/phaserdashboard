var fase03State = {
    preload: function () {
        game.load.image('lava', 'assets/images/lava/lava_background01.png');        
    },   
    create: function () {

        game.world.setBounds(0, 0, 1900, 500);
        var cave = game.add.tileSprite(0, 0, 1900, 600, 'lava');

        // Sons
        this.eatSound = game.add.audio('eat');
        this.jumpSound = game.add.audio('jump');
        this.deadSound = game.add.audio('dead');

        this.createPlataforms();
        
       this.createItens();
        
        // Adiciona o teclado
        cursors = game.input.keyboard.createCursorKeys();

        // Insere o DUDE!
        this.player = game.add.sprite(40, 120, 'personagem');
        game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);


        game.camera.follow(this.player);

        //SCORE
        this.scoreText = game.add.text(16, 16, 'Pontos: ' + game.global.score, { fontSize: '32px', fill: '#000' });
        this.scoreText.fixedToCamera = true;

        this.createEmitter();
    },
    update: function () {

        game.physics.arcade.collide(this.player, this.platforms);
                
        game.physics.arcade.collide(this.food, this.platforms);
        game.physics.arcade.overlap(this.player, this.food, this.collectFood, null, this);

        if (this.player.position.y > 350) {
            this.playerDie();
        }

        this.movePlayer();
    },
    createItens: function () {
        //Rosquinhas
        this.food = game.add.group();
        this.food.enableBody = true;


        game.add.sprite(200, 0, 'frango', 0, this.food);
        game.add.sprite(410, 0, 'frango', 0, this.food);
        game.add.sprite(710, 0, 'frango', 0, this.food);
        game.add.sprite(1210, 0, 'frango', 0, this.food);
        game.add.sprite(1760, 0, 'sandwich', 0, this.food);

        this.food.setAll('body.gravity.y', 60);
        this.food.setAll('body.bounce.y', 0.4);
    },
    createPlataforms: function () {
        this.platforms = game.add.group();
        this.platforms.enableBody = true;


        game.add.sprite(30, 300, 'rock_plataform', 0, this.platforms);
        game.add.sprite(400, 180, 'rock_plataform_small', 0, this.platforms);
        game.add.sprite(700, 300, 'rock_plataform_small', 0, this.platforms);
        game.add.sprite(1010, 200, 'rock_plataform_small', 0, this.platforms);
        game.add.sprite(1200, 100, 'rock_plataform_small', 0, this.platforms);
        game.add.sprite(1450, 300, 'rock_plataform', 0, this.platforms);
        game.add.sprite(1750, 300, 'rock_plataform', 0, this.platforms);

        this.platforms.setAll('body.immovable', true);
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

        if (cursors.up.isDown && this.player.body.touching.down) {
            if (game.global.sound) this.jumpSound.play();
            this.player.body.velocity.y = -game.global.jumpSize;      
        }
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
    },
    createEmitter: function(){
        // Create the emitter with 15 particles. We don't need to set the x and y
        // Since we don't know where to do the explosion yet
        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('pixel');
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.gravity = 0;
    },
    playerDie: function () {
        // If the player is already dead, do nothing
        if (!this.player.alive) {
            return;
        }

        this.player.kill();
        // Start the sound and the particles
        if (game.global.sound) this.deadSound.play();

        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 600, null, 15);
        //this.music.stop();

        // Call the 'startMenu' function in 1000ms
        game.time.events.add(1000, this.startMenu, this);
    },
    startMenu: function () {
        game.state.start('gameover');
    },
};