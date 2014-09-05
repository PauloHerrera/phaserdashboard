// Initialise Phaser
var game = new Phaser.Game(700, 500, Phaser.AUTO, 'target');
// Define our 'global' variable
game.global = {
    score: 0,
    playerSpeed: 150,
    jumpSize:350,
    sound: true,
    music: null
};
// Add all the states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('gameover', gameoverState);

// Fases do jogo
game.state.add('fase01', fase01State);
game.state.add('fase02', fase02State);
game.state.add('fase03', fase03State);


// Start the 'boot' state
game.state.start('boot');