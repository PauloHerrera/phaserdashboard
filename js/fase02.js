//var game = new Phaser.Game(700, 500, Phaser.AUTO, 'target');

var platforms;
var ledge;
var playerpositionOld;


var state_02 = {

    preload: function () {
        game.load.image('cave', 'assets/cave.png');
        game.load.image('lava', 'assets/platform_lava.png');
        game.load.image('ground', 'assets/ground_cave.png');
        //game.load.image('star', 'assets/star.png');
        //game.load.image('diamond', 'assets/diamond.png');


        game.load.image('frango', 'assets/th/ico-frango.png');
        game.load.image('batata', 'assets/th/ico-batata2.png');
        game.load.image('refri', 'assets/th/ico-refri.png');
        game.load.image('sandwich', 'assets/th/ico-sanduba.png');
        game.load.image('rosquinha01', 'assets/th/ico-rosq1.png');
        game.load.image('rosquinha02', 'assets/th/ico-rosq2.png');
        game.load.image('rosquinha03', 'assets/th/ico-rosq3.png');

        game.load.image('plataform', 'assets/platform_rock_three_tiles.png');
        game.load.image('plataform_one_tile', 'assets/platform_rock_one_tile.png');
        game.load.image('hole', 'assets/holeskull.png');

        game.load.image('exit', 'assets/signExit.png');

        //game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.spritesheet('dude', 'assets/th/personagem.png', 43, 65);

        //game.load.audio('hit', ['assets/hit.wav']);
        //game.load.audio('pickup', ['assets/pickup.wav']);
    },
    create: function () {

        game.world.setBounds(0, 0, 1900, 500);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Cria o background - Céu
        //var sky = game.add.sprite(0, 0, 'sky');
        var cave = game.add.tileSprite(0, 0, 1900, 600, 'cave');
        //sky.fixedToCamera = true;                

        platforms = game.add.group();
        platforms.enableBody = true;

        //ledge = platforms.create(130, 350, 'lava');
        //ledge.body.immovable = true;

        var ground = platforms.create(0, game.world.height - 44, 'ground');
        ground.scale.setTo(1, 1);
        ground.body.immovable = true;

        ledge = platforms.create(340, 300, 'plataform');
        ledge.body.immovable = true;
        
        ledge = platforms.create(600, 120, 'plataform_one_tile');
        ledge.body.immovable = true;

        ledge = platforms.create(900, 300, 'plataform_one_tile');
        ledge.body.immovable = true;

        ledge = platforms.create(1100, 200, 'plataform_one_tile');
        ledge.body.immovable = true;

        ledge = platforms.create(1300, 100, 'plataform_one_tile');
        ledge.body.immovable = true;


        ledge = platforms.create(1650, 300, 'plataform');
        ledge.body.immovable = true;


        //Rosquinhas
        rosquinhas = game.add.group();
        rosquinhas.enableBody = true;

        var r1 = new Array();
        r1[0] = rosquinhas.create(40, 0, 'rosquinha01');
        r1[0].body.gravity.y = 60;
        r1[0].body.bounce.y = 0.4;

        r1[1] = rosquinhas.create(160, 0, 'rosquinha03');
        r1[1].body.gravity.y = 60;
        r1[1].body.bounce.y = 0.4;

        r1[2] = rosquinhas.create(470, 0, 'rosquinha02');
        r1[2].body.gravity.y = 60;
        r1[2].body.bounce.y = 0.4;

        r1[6] = rosquinhas.create(350, 0, 'rosquinha02');
        r1[6].body.gravity.y = 60;
        r1[6].body.bounce.y = 0.4;


        r1[3] = rosquinhas.create(900, 0, 'rosquinha02');
        r1[3].body.gravity.y = 60;
        r1[3].body.bounce.y = 0.4;
        r1[4] = rosquinhas.create(1000, 0, 'rosquinha01');
        r1[4].body.gravity.y = 60;
        r1[4].body.bounce.y = 0.4;
        r1[5] = rosquinhas.create(1100, 0, 'rosquinha03');
        r1[5].body.gravity.y = 60;
        r1[5].body.bounce.y = 0.4;

        //Refri
        refris = game.add.group();
        refris.enableBody = true;

        var ref = new Array();
        ref[0] = refris.create(410, 0, 'refri');
        ref[0].body.gravity.y = 40;
        ref[0].body.bounce.y = 0.4;

        ref[1] = refris.create(1520, 0, 'refri');
        ref[1].body.gravity.y = 40;
        ref[1].body.bounce.y = 0.4;

        //Hamburger
        hamburgers = game.add.group();
        hamburgers.enableBody = true;

        var hamburger = new Array();
        hamburger[0] = hamburgers.create(700, 0, 'sandwich');
        hamburger[0].body.gravity.y = 40;
        hamburger[0].body.bounce.y = 0.4;

        hamburger[1] = hamburgers.create(1310, 0, 'sandwich');
        hamburger[1].body.gravity.y = 40;
        hamburger[1].body.bounce.y = 0.4;

        hamburger[2] = hamburgers.create(1820, 0, 'sandwich');
        hamburger[2].body.gravity.y = 10;
        hamburger[2].body.bounce.y = 0.4;

        //Frango
        frangos = game.add.group();
        frangos.enableBody = true;

        var frango = new Array();
        frango[0] = frangos.create(610, 0, 'frango');
        frango[0].body.gravity.y = 40;
        frango[0].body.bounce.y = 0.4;

        frango[1] = frangos.create(1180, 0, 'frango');
        frango[1].body.gravity.y = 40;
        frango[1].body.bounce.y = 0.4;

        frango[2] = frangos.create(1260, 0, 'frango');
        frango[2].body.gravity.y = 40;
        frango[2].body.bounce.y = 0.4;

        frango[3] = frangos.create(1650, 0, 'frango');
        frango[3].body.gravity.y = 40;
        frango[3].body.bounce.y = 0.4;

        frango[4] = frangos.create(1750, 0, 'frango');
        frango[4].body.gravity.y = 40;
        frango[4].body.bounce.y = 0.4;

        //Batata Frita
        batatas = game.add.group();
        batatas.enableBody = true;

        var batata = new Array();
        batata[0] = batatas.create(800, 0, 'batata');
        batata[0].body.gravity.y = 40;
        batata[0].body.bounce.y = 0.4;

        batata[1] = batatas.create(1430, 0, 'batata');
        batata[1].body.gravity.y = 40;
        batata[1].body.bounce.y = 0.4;


        // Insere o DUDE!
        player = game.add.sprite(110, 30 , 'dude');
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;               
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        hole = game.add.sprite(1610, 0, 'hole');
        hole.enableBody = true;

        //exit = game.add.sprite(610, 0, 'exit');
        //exit.enableBody = true;
        
        // Adiciona o teclado
        cursors = game.input.keyboard.createCursorKeys();

        //SCORE
        scoreText = game.add.text(16, 16, 'Pontos: ' + score, { fontSize: '32px', fill: '#000' });
        scoreText.fixedToCamera = true;
        game.camera.follow(player);
    },

    update: function () {       

        var playerSpeed = 150;

        game.physics.arcade.collide(player, platforms);

        player.body.velocity.x = 0;

        //
        if (cursors.left.isDown) {
            player.body.velocity.x = -playerSpeed;
            player.animations.play('left');
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = playerSpeed;
            player.animations.play('right');
        }
        else {
            player.animations.stop();
            player.frame = 4;
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.body.velocity.y = -350;
        }

        game.physics.arcade.collide(rosquinhas, platforms);
        game.physics.arcade.overlap(player, rosquinhas, this.collectRosquinhas, null, this);

        game.physics.arcade.collide(hamburgers, platforms);
        game.physics.arcade.overlap(player, hamburgers, this.collectHamburgers, null, this);

        game.physics.arcade.collide(refris, platforms);
        game.physics.arcade.overlap(player, refris, this.collectRefris, null, this);

        game.physics.arcade.collide(frangos, platforms);
        game.physics.arcade.overlap(player, frangos, this.collectFrangos, null, this);

        game.physics.arcade.collide(batatas, platforms);
        game.physics.arcade.overlap(player, batatas, this.collectBatatas, null, this);
    },
    collectHamburgers: function (a, b) {
        b.kill();
        score += 100;
        scoreText.text = 'Pontos: ' + score;
    },
    collectBatatas: function (a, b) {
        b.kill();
        score += 90;
        scoreText.text = 'Pontos: ' + score;
    },
    collectFrangos: function (a, b) {
        b.kill();
        score += 70;
        scoreText.text = 'Pontos: ' + score;
    },
    collectRefris: function (a, b) {
        b.kill();
        score += 10;
        scoreText.text = 'Pontos: ' + score;
    },
    collectRosquinhas: function (a, b) {
        b.kill();
        score += 30;
        scoreText.text = 'Pontos: ' + score;
    },
};

//game.state.add('state_02', state_02);
//game.state.start('state_02');