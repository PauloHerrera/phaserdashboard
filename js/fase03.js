var game = new Phaser.Game(700, 500, Phaser.AUTO, 'target');

var platforms;
var ledge;
var playerpositionOld;


var state_02 = {

    preload: function () {
        game.load.image('cave', 'assets/lavabg.png');
        game.load.image('lava', 'assets/platform_lava.png');
        //game.load.image('ground-grass', 'assets/grass.png');
        //game.load.image('star', 'assets/star.png');
        //game.load.image('diamond', 'assets/diamond.png');

        //game.load.image('hole', 'assets/role.png');

        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

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

        //platforms = game.add.group();
        //platforms.enableBody = true;

        //ledge = platforms.create(130, 350, 'lava');
        //ledge.body.immovable = true;


        // Insere o DUDE!
        player = game.add.sprite(110, game.world.height , 'dude');
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;               
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        
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
    }
};

game.state.add('state_02', state_02);
game.state.start('state_02');