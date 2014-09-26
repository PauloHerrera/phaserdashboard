var GameControl = function (game) {
    //this.scoreText = game.add.text(16, 10, 'Pontos: ' + game.global.score, { fontSize: '20px', fill: '#fff' });
    //this.scoreText.fixedToCamera = true;
};

GameControl.prototype = {
    changeScore: function (score) {
        game.global.score += score;
        game.global.scoreText.text = 'Pontos: ' + game.global.score;
    },
    setItemScore: function (itemType) {
        var score = 0;
        switch (itemType) {
            case 'rosquinha01':
            case 'rosquinha02':
            case 'rosquinha03':
                score = 30;
                break;
            case 'frango':
                score = 70;
                break;
            case 'sandwich':
                score = 100;
                break;
            case 'batata':
                score = 90;
                break;
            case 'refri':
            default:
                score = 10;
                break;
        }
        
        this.changeScore(score);
    }
}

//SOUND 
function Sound() { }

Sound.init = function () {
    Sound.jump = game.add.audio('jump');
    Sound.eat = game.add.audio('eat');    
    Sound.dead = game.add.audio('dead');
}

// KeyBoard Control
function Keyboard() { }
Keyboard.init = function (game) {
    Keyboard.cursorKeys = game.input.keyboard.createCursorKeys();    
    Keyboard.spaceKey = game.input.keyboard.addKey(32);
}

//Emitter
function EmitterObj() { }

EmitterObj.init = function (game) {
    // Particulas para quando ele morrer
    EmitterObj.emitter = game.add.emitter(0, 0, 15);
    EmitterObj.emitter.makeParticles('pixel');
    EmitterObj.emitter.setYSpeed(-150, 150);
    EmitterObj.emitter.setXSpeed(-150, 150);
    EmitterObj.emitter.gravity = 0;
}

