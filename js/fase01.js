var fase01State = {
    create: function () {

        game.world.setBounds(0, 0, 1900, 500);        
        var sky = game.add.tileSprite(0, 0, 1900, 600, 'sky');             

        // Sons
        this.eatSound = game.add.audio('eat');
        this.jumpSound = game.add.audio('jump');
                
        //if (game.global.sound) {
        //    this.music = game.add.audio('background_music'); // Add the music
        //    this.music.loop = true; // Make it loop
        //    this.music.volume = 0.2;
        //    this.music.play(); // Start the music
        //}
        
        this.createPlataforms();

        this.createItens();

        // Insere o DUDE!
        this.player = game.add.sprite(110, game.world.height - 120, 'personagem');
        game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        
        // Adiciona o teclado
        cursors = game.input.keyboard.createCursorKeys();
               
        //// Adiciona o buraco
        hole = game.add.sprite(1780, game.world.height - 90, 'hole');
        hole.enableBody = true;        

        //SCORE
        this.scoreText = game.add.text(16, 16, 'Pontos: 0', { fontSize: '32px', fill: '#000' });
        this.scoreText.fixedToCamera = true;

        game.camera.follow(this.player);
    },
    update: function () {              
        
        game.physics.arcade.collide(this.player, this.platforms);

        game.physics.arcade.collide(this.food, this.platforms);        
        game.physics.arcade.overlap(this.player, this.food, this.collectFood, null, this);
        
        this.movePlayer();
       
        if (this.player.position.x > 1820 && this.player.position.x < 1850 && cursors.down.isDown) {
            this.player.kill();
            game.state.add('fase02', fase02State, true);
            //game.state.start('fase02', true, true);
        }            
    },
    shutdown: function (){
        this.player.destroy();
        alert("niiice!");
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
    createPlataforms: function(){        
        this.platforms = game.add.group();
        this.platforms.enableBody = true;
        
        var ground = this.platforms.create(0, game.world.height - 44, 'ground');
        ground.scale.setTo(1, 1);                      
        
        ledge = this.platforms.create(-130, 150, 'plataform');

        game.add.sprite(-130, 150, 'plataform', 0, this.platforms);
        game.add.sprite(340, 300, 'plataform', 0, this.platforms);
        game.add.sprite(550, 200, 'plataform', 0, this.platforms);
        game.add.sprite(650, 110, 'plataform', 0, this.platforms);
        game.add.sprite(1340, 280, 'plataform', 0, this.platforms);
        game.add.sprite(1840, 230, 'plataform', 0, this.platforms);

        this.platforms.setAll('body.immovable', true);
    },
    createItens: function () {
        //Rosquinhas
        this.food = game.add.group();
        this.food.enableBody = true;        
        
        game.add.sprite(40, 0, 'rosquinha01', 0, this.food);
        game.add.sprite(160, 0, 'rosquinha03', 0, this.food);
        game.add.sprite(400, 0, 'rosquinha02', 0, this.food);      
        game.add.sprite(900, 0, 'rosquinha02', 0, this.food);
        game.add.sprite(1000, 0, 'rosquinha01', 0, this.food);
        game.add.sprite(1100, 0, 'rosquinha03', 0, this.food);

        game.add.sprite(320, 0, 'refri', 0, this.food);
        game.add.sprite(1520, 0, 'refri', 0, this.food);

        game.add.sprite(700, 0, 'sandwich', 0, this.food);
        game.add.sprite(1330, 0, 'sandwich', 0, this.food);
        game.add.sprite(1840, 0, 'sandwich', 0, this.food);

        game.add.sprite(570, 0, 'frango', 0, this.food);
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
        switch(foodType) {
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