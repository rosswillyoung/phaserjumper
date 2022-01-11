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
let playerHeight
let currentHeight = -600
let lastPlatformHeight = 600

function preload() {
    this.load.image('sky', 'assets/sky.png')
    this.load.image('ground', 'assets/platform.png')
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 })
}

function create() {
    // this.physics.world.setBounds(0, 0, 800, 900000)
    let background = this.add.image(400, 300, 'sky')
    // make background static
    background.setScrollFactor(0)

    platforms = this.physics.add.staticGroup()

    let ground = platforms.create(400, 568, 'ground').setScale(2).refreshBody()



    player = this.physics.add.sprite(100, 450, 'dude')
    player.setBounce(0.2)
    // player.setCollideWorldBounds(true)

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: 'turn',
        frames: [{
            key: 'dude', frame: 4
        }],
        frameRate: 20
    })

    cursors = this.input.keyboard.createCursorKeys()

    this.physics.add.collider(player, ground)
}
function update() {
    let cam = this.cameras.main

    // console.log(player.y)
    if (cursors.left.isDown) {
        player.setVelocityX(-160)
        player.anims.play('left', true)
        if (player.x < 0) {
            player.x += 800
        }
    } else if (cursors.right.isDown) {
        player.setVelocityX(160)
        player.anims.play('right', true)
        if (player.x > 800) {
            player.x -= 800
        }
    } else {
        player.setVelocityX(0)
        player.anims.play('turn')
    }

    if (player.body.touching.down) {
        player.setVelocityY(-330)
    }

    // Generate Platforms

    if (currentHeight < lastPlatformHeight) {
        platform = generatePlatform()
        this.physics.add.collider(player, platform)
    }

    currentHeight -= .2
    console.log(currentHeight, lastPlatformHeight)
    // move camera up
    cam.scrollY -= .2

}

function generatePlatform() {
    x = Phaser.Math.Between(0, 800)
    y = Phaser.Math.Between(-10, 10)
    platform = platforms.create(x, lastPlatformHeight, 'ground')
    lastPlatformHeight -= 150 + y
    console.log('platform created', platform.x, platform.y)
    platform.body.checkCollision.down = false
    platform.body.checkCollision.right = false
    platform.body.checkCollision.left = false
    return platform

}