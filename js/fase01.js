
var fireRate = 300;
var nextFire = 0;
var aux = 1;

var fase01State = {
    create: function () {

        // Sons
        this.eatSound = game.add.audio('eat');
        this.jumpSound = game.add.audio('jump');
        this.deadSound = game.add.audio('dead');             

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
        this.player = game.add.sprite(30, game.world.height - 240, 'personagem');
        game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;        
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.player.body.collideWorldBounds = true;
        
        //CRIA OS INIMIGOS              
        this.enemies = [];
        this.enemies.push(new Enemies(game, 1150, game.world.height - 240, 'cook', "0"));
        this.enemies.push(new Enemies(game, 2370, game.world.height - 240, 'cook', "0"));        
        this.enemies.push(new Enemies(game, 2970, game.world.height - 240, 'flame_yellow', "1"));            
        //this.createEnemies();
        
        //Cria o que o personagem vai atirar
        this.createBullets();

        this.layerForeground = this.map.createLayer('Foreground');
        this.layerForeground.resizeWorld();                

        // Adiciona o teclado
        cursors = game.input.keyboard.createCursorKeys();
        
        // Adiciona o enter
        this.spaceKey = game.input.keyboard.addKey(32);
        
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

        game.physics.arcade.collide(this.bullets, this.layerPlataforms, this.killBullet, null, this);

        for (var i = 0; i < this.enemies.length; i++) {
            game.physics.arcade.collide(this.enemies[i].enemy, this.layerPlataforms);
            game.physics.arcade.collide(this.player, this.enemies[i].enemy, this.losingLife, null, this);
            game.physics.arcade.overlap(this.bullets, this.enemies[i].enemy, this.hitEnemy, null, this);
            
            this.moveEnemy(this.enemies[i].enemy);

            console.log(this.enemies[i].enemy);
        }     
    
        game.physics.arcade.collide(this.food, this.layerPlataforms);
        game.physics.arcade.overlap(this.player, this.food, this.collectFood, null, this);
        
        this.movePlayer();              
       
        if (this.player.position.y >= game.world.height - 80) {
            this.playerDie();
        }
        console.log(this.player.position.x);
        console.log(this.player.position.y);

        if (this.player.position.x > 3082 && this.player.position.x < 3115 && cursors.down.isDown) {
            this.player.kill();
            game.state.start('fase02');
            //game.state.add('fase02', fase02State, true);                        
            //game.state.add('fase03', fase03State, true);
        }


        if (this.spaceKey.isDown) {            
            this.fire();
        }
    },
    createEnemies: function () {
        this.enemies = game.add.group();
        this.enemies.setAll('anchor.x', 0.5);         
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

        // Insere o Cozinheiro
        this.cook = game.add.sprite(2370, game.world.height - 240, 'cook', 0, this.enemies);      
        this.cook.animations.add('left', [3, 4, 5], 10, true);
        this.cook.animations.add('right', [6, 7, 8], 10, true);
        

        this.enemies.setAll('body.gravity.y', 300);
        this.enemies.setAll('body.bounce.y', 0.2);

        //this.cook.body.collideWorldBounds = true;

        ////Insere a chama
        //this.flame01 = game.add.sprite(2970, game.world.height - 240, 'flame_yellow');
        //game.physics.arcade.enable(this.flame01);
        //this.flame01.body.bounce.y = 0.2;
        //this.flame01.body.gravity.y = 300;

        ////this.flame01.anchor.x = 0;
        //this.flame01.body.y = -2;
        ////this.flame01.body.bounce.setTo(1, 1);
        //this.flame01.animations.add('left', [3, 4, 5], 10, true);
        //this.flame01.animations.add('right', [6, 7, 8], 10, true);
    },
    createBullets: function () {
        //  Our bullet group
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet', 2, false);
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);

       // this.bullets.animations.add('turn', [1, 2, 3, 4], 10, true);
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
    moveEnemy: function (a) {
  
        if (aux <= 100) {
            a.body.velocity.x = 75;
            a.animations.play('right');
        } else {
            a.body.velocity.x = -75;
            a.animations.play('left');
        }

        if (aux == 200) {
            aux = 1;
        } else {
            aux = aux + 1;
        }
    },
    fire: function() {

        if (game.time.now > nextFire && this.bullets.countDead() > 0)
        {            
            nextFire = game.time.now + fireRate;

            var bullet = this.bullets.getFirstExists(false);

            bullet.reset(this.player.x + 10, this.player.y + 40);


            if (cursors.left.isDown) {
                bullet.body.velocity.x = -400;
            } else {
                this.player.frame = 5;
                bullet.body.velocity.x = 400;                
            }
            bullet.animations.add('turn', [1, 2, 3, 4], 10, true);
            bullet.animations.play('turn');            
        }

    },
    hitEnemy: function (a, b) {
        b.kill();
        a.kill();
        this.deadSound.play();

        this.emitter.x = a.x;
        this.emitter.y = a.y;
        this.emitter.start(true, 600, null, 15);

        game.global.score += 50;
        this.scoreText.text = 'Pontos: ' + game.global.score;
    },
    killBullet: function (a, b) {
        a.kill();
        this.emitter.x = a.x;
        this.emitter.y = a.y;
        this.emitter.start(true, 600, null, 10);
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