var loadState = {
    preload: function () {
        var loadingLabel = game.add.text(game.world.centerX, 150, 'Carregando', { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);
        loadingLabel.alpha = 0;
        game.add.tween(loadingLabel).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);


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

        //Enemies
        game.load.spritesheet('cook', 'assets/images/cook_large.png', 43, 65);
        game.load.spritesheet('flame_yellow', 'assets/images/enemies/flame_yellow.png', 48, 64);
        game.load.spritesheet('flame_blue', 'assets/images/enemies/flame_blue.png', 48, 64);
        game.load.spritesheet('flame_green', 'assets/images/enemies/flame_green.png', 48, 64);
        game.load.spritesheet('flame_red', 'assets/images/enemies/flame_red.png', 48, 64);
        //game.load.spritesheet('cook', 'assets/images/cook_large.png', 43, 65);

        // Comidas que ele ataca
        game.load.spritesheet('bullet', 'assets/images/itens attack/apple_sprite.png', 24, 24);

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
        game.load.tilemap('map02', 'assets/images/cave/tilemapCave01.json', null, Phaser.Tilemap.TILED_JSON);
        
        // Fase Lava 01
        game.load.image('lava01', 'assets/images/lava/lava_objetc_01.png');
        game.load.image('lava_tileset', 'assets/images/lava/lava_tileset.png');
        game.load.image('platform_lava01_large', 'assets/images/lava/platform_large.png');
        game.load.tilemap('map_lava_01', 'assets/images/lava/tilemapLava01.json', null, Phaser.Tilemap.TILED_JSON);
        
    },
    create: function () {        
        game.state.start('menu');
    }
};