var loadState = {
    preload: function () {
        var loadingLabel = game.add.text(game.world.centerX, 150, 'carregando...', { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);        
        var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');

        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);              

        //CAREGA ITENS DO JOGO
        game.load.spritesheet('personagem', 'assets/images/personagem.png', 43, 65);
        game.load.spritesheet('personagem2', 'assets/images/personagem.png', 43, 65);
        game.load.spritesheet('mute', 'assets/images/muteButton.png', 28, 22);
        game.load.image('pixel', 'assets/images/pixel.png');
        game.load.image('heart', 'assets/images/heart.png');
        game.load.image('background', 'assets/images/bg-menu.png');

        //fase 01
        game.load.image('sky', 'assets/images/sky.png');
        game.load.image('plataform', 'assets/images/platform_wood.png');
        game.load.image('ground', 'assets/images/grass.png');
        game.load.image('hole', 'assets/images/role.png');

        //fase 02 - caverna 01
        //game.load.image('cave', 'assets/images/cave/cave_background01.png');
        //game.load.image('ground_cave', 'assets/images/cave/ground_cave.png');        
        //game.load.image('rock_plataform', 'assets/images/cave/platform_rock_three_tiles.png');
        //game.load.image('rock_plataform_small', 'assets/images/cave/platform_rock_one_tile.png');
        
        //Itens
        game.load.image('frango', 'assets/images/itens/ico-frango.png');
        game.load.image('batata', 'assets/images/itens/ico-batata2.png');
        game.load.image('refri', 'assets/images/itens/ico-refri.png');
        game.load.image('sandwich', 'assets/images/itens/ico-sanduba.png');
        game.load.image('rosquinha01', 'assets/images/itens/ico-rosq1.png');
        game.load.image('rosquinha02', 'assets/images/itens/ico-rosq2.png');
        game.load.image('rosquinha03', 'assets/images/itens/ico-rosq3.png');                     

        game.load.audio('eat', ['assets/sound/eat.ogg', 'assets/sound/eat.mp3']);
        game.load.audio('jump', ['assets/sound/jump.ogg', 'assets/sound/jump.mp3']);
        game.load.audio('background_music', ['assets/sound/background_music.ogg', 'assets/sound/background_music.mp3']);
        game.load.audio('dead', ['assets/sound/dead.ogg', 'assets/sound/dead.mp3']);


        // Fase 01   
        game.load.image('nuvens', 'assets/images/nuvens.png');
        game.load.image('grama_tileset', 'assets/images/grama_tileset.png');
        game.load.image('spine', 'assets/images/spine.png');
        game.load.image('tree', 'assets/images/tree.png');
        game.load.image('woodPlatform1', 'assets/images/woodPlatform1.png');
        game.load.tilemap('map01', 'assets/images/tilemap.json', null, Phaser.Tilemap.TILED_JSON);


        // Fase Caverna 01
        game.load.image('flame', 'assets/images/cave/flame.png');
        game.load.image('fase_caverna', 'assets/images/cave/fase_caverna.png');
        game.load.image('skull01', 'assets/images/cave/skull01.png');
        game.load.image('skull_enter', 'assets/images/cave/skull_enter.png');
        game.load.image('atocha', 'assets/images/cave/atocha.png');

        game.load.tilemap('map', 'assets/images/cave/tilemapCave01.json', null, Phaser.Tilemap.TILED_JSON);


        //game.load.spritesheet('player', 'assets/player2.png', 20, 20);
        //game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);

        //game.load.image('enemy', 'assets/enemy.png');
        //game.load.image('coin', 'assets/coin.png');
        //game.load.image('wallV', 'assets/wallVertical.png');
        //game.load.image('wallH', 'assets/wallHorizontal.png');
        //game.load.image('background', 'assets/background.png');                
        //game.load.image('pixel', 'assets/pixel.png');               

        //// Sound when the player jumps
        //game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
        //// Sound when the player takes a coin
        //game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);
        //// Sound when the player dies
        //game.load.audio('dead', ['assets/dead.ogg', 'assets/dead.mp3']);

        
    },
    create: function () {        
        game.state.start('menu');
    }
};