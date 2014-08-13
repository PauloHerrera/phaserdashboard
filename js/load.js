var loadState = {
    preload: function () {
        var loadingLabel = game.add.text(game.world.centerX, 150, 'carregando...', { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);        
        var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');

        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);              

        //CAREGA ITENS DO JOGO
        game.load.spritesheet('personagem', 'assets/images/personagem.png', 43, 65);
        game.load.spritesheet('mute', 'assets/images/muteButton.png', 28, 22);

        game.load.image('sky', 'assets/images/sky.png');
        game.load.image('plataform', 'assets/images/platform_wood.png');
        game.load.image('ground', 'assets/images/grass.png');
        game.load.image('hole', 'assets/images/role.png');

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