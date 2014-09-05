var fase02State = {
    preload: function () {
        game.load.image('cave', 'assets/images/cave/cave_background01.png');   
    },
    create: function () {

        game.world.setBounds(0, 0, 1900, 500);
        var cave = game.add.tileSprite(0, 0, 1900, 600, 'cave');       

        // Sons
        this.eatSound = game.add.audio('eat');
        this.jumpSound = game.add.audio('jump');                           

        this.createPlataforms();   
        this.createItens();
        
        // Adiciona o teclado
        cursors = game.input.keyboard.createCursorKeys();

        // Insere o DUDE!
        this.player = game.add.sprite(110, game.world.height - 120, 'personagem');
        game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);

        hole = game.add.sprite(1610, 0, 'skull_enter');
        hole.enableBody = true;

        game.camera.follow(this.player);

        //SCORE
        this.scoreText = game.add.text(16, 16, 'Pontos: ' + game.global.score, { fontSize: '32px', fill: '#000' });
        this.scoreText.fixedToCamera = true;
        
    },
    update: function () {               

        game.physics.arcade.collide(this.player, this.platforms);

        game.physics.arcade.collide(this.food, this.platforms);
        game.physics.arcade.overlap(this.player, this.food, this.collectFood, null, this);
        
        this.movePlayer();
        
        if (this.player.position.x > 1640 && this.player.position.x < 1680 && this.player.position.y < 80) {
            this.player.kill();                        
            game.state.add('fase03', fase03State, true);            
        }
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
            this.player.body.velocity.y = -game.global.jumpSize;;
        }
    },
    createPlataforms: function () {
        this.platforms = game.add.group();
        this.platforms.enableBody = true;

        var ground = this.platforms.create(0, game.world.height - 44, 'ground_cave');
        ground.scale.setTo(1, 1);               

        game.add.sprite(340, 300, 'rock_plataform', 0, this.platforms);
        game.add.sprite(600, 120, 'rock_plataform_small', 0, this.platforms);
        game.add.sprite(900, 300, 'rock_plataform_small', 0, this.platforms);
        game.add.sprite(1100, 200, 'rock_plataform_small', 0, this.platforms);
        game.add.sprite(1300, 100, 'rock_plataform_small', 0, this.platforms);
        game.add.sprite(1650, 300, 'rock_plataform', 0, this.platforms);

        this.platforms.setAll('body.immovable', true);
    },
    createItens: function () {
        //Rosquinhas
        this.food = game.add.group();
        this.food.enableBody = true;

        game.add.sprite(40, 0, 'rosquinha01', 0, this.food);
        game.add.sprite(160, 0, 'rosquinha03', 0, this.food);
        game.add.sprite(470, 0, 'rosquinha02', 0, this.food);
        game.add.sprite(350, 0, 'rosquinha02', 0, this.food);
        game.add.sprite(900, 0, 'rosquinha01', 0, this.food);
        game.add.sprite(1000, 0, 'rosquinha03', 0, this.food);
        game.add.sprite(1100, 0, 'rosquinha03', 0, this.food);

        game.add.sprite(410, 0, 'refri', 0, this.food);
        game.add.sprite(1520, 0, 'refri', 0, this.food);

        game.add.sprite(700, 0, 'sandwich', 0, this.food);
        game.add.sprite(1310, 0, 'sandwich', 0, this.food);
        game.add.sprite(1820, 0, 'sandwich', 0, this.food);

        game.add.sprite(610, 0, 'frango', 0, this.food);
        game.add.sprite(1180, 0, 'frango', 0, this.food);
        game.add.sprite(1260, 0, 'frango', 0, this.food);
        game.add.sprite(1650, 0, 'frango', 0, this.food);
        game.add.sprite(1750, 0, 'frango', 0, this.food);

        game.add.sprite(800, 0, 'batata', 0, this.food);
        game.add.sprite(1430, 0, 'batata', 0, this.food);

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