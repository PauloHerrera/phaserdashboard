var bootState = {
    preload: function () {
        // Load the image
        game.load.image('progressBar', 'assets/images/progressBar.png');
        game.load.image('background', 'assets/images/bg-menu.png');
    },
    create: function () {
        // Set some game settings                
        game.stage.backgroundColor = '#3498db';

        game.physics.startSystem(Phaser.Physics.ARCADE);
        // Start the load state
        game.state.start('load');

        Keyboard.init(game);

        Sound.init();

        game.global.scoreText = game.add.text(16, 10, 'Pontos: ' + game.global.score, { fontSize: '20px', fill: '#fff' });
        game.global.scoreText.fixedToCamera = true;
    }
};