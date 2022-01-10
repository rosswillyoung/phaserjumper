let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

let game = new Phaser.Game(config)

let player
let stars
let bombs
let platforms
let cursors

function preload() {
    this.load.image('sky', 'assets/sky.png')
    this.load.image('ground', 'assets/platform.png')
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHieght: 48 })

}
function create() {
    this.add.image(400, 300, 'sky')
    platforms = this.physics.add.staticGroup()

    platforms.create(400, 568, 'ground').setScale(2).refreshBody()
}
function update() {

}