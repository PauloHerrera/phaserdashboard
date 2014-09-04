var gameoverState = {
    create: function() {
        // Add a background image
        //game.add.image(0, 0, 'background');

        //Music
        //if (game.global.sound) {
        //    this.music = game.add.audio('background_music'); // Add the music
        //    this.music.loop = true; // Make it loop
        //    this.music.volume = 0.5;
        //    this.music.play(); // Start the music
        //}

        game.stage.backgroundColor = '#aaa';

        //// Nome Do jogo
        this.nameLabel = game.add.text(game.world.centerX, 150, 'GAME OVER', { font: '70px Arial', fill: '#ffffff' });
        this.nameLabel.anchor.setTo(0.5, 0.5);
        //var tween = game.add.tween(nameLabel);        
        //game.add.tween(nameLabel).to({ y: 100 }, 1000).easing(Phaser.Easing.Bounce.Out).start();
        
        ////START LABEL
        //var startLabel = game.add.text(game.world.centerX, game.world.height - 80, 'aperte a tecla ENTER para começar',            { font: '25px Arial', fill: '#ffffff' });
        //game.add.tween(startLabel).to({ angle: -2 }, 500).to({ angle: 2 }, 500).loop().start();
        //startLabel.anchor.setTo(0.5, 0.5);

        //var enterKey = game.input.keyboard.addKey(13);
        //enterKey.onDown.addOnce(this.Start, this);

        this.VerifyScore();

        this.VerifySound();        

    },
    VerifyScore: function () {
        //Inicializa o recorde no local storage
        if (!localStorage.getItem('bestScore')) {            
            localStorage.setItem('bestScore', 0);
        }
        
        // Atualiza o recorde, se necessário
        if (game.global.score > localStorage.getItem('bestScore')) {            
            localStorage.setItem('bestScore', game.global.score);
        }

        // Exibe a pontuação e o recorde
        var textScore = 'Pontuação: ' + game.global.score + '\nRecorde: ' + localStorage.getItem('bestScore');
        console.log(textScore);
        this.scoreLabel = game.add.text(game.world.centerX, game.world.centerY, textScore,
        { font: '25px Geo', fill: '#ffffff', align: 'center' });
        this.scoreLabel.anchor.setTo(0.5, 0.5);

        // Reinicia o Score
        game.global.score = 0;
    },
    VerifySound: function () {
        this.muteButton = game.add.button(20, 20, 'mute', this.ToggleSound, this);
        this.muteButton.input.useHandCursor = true;
        
        if (!game.global.sound) {            
            this.muteButton.frame = 1;
        }
    },
    Start: function () {        
        game.state.start('fase03');
    },    
    ToggleSound: function () {      
        game.global.sound = !game.global.sound;        
        this.muteButton.frame = game.global.sound ? 0 : 1;
    },    
};