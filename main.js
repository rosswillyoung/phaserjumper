let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
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
let lastPlatformHeight
let numberOfPlatforms
let scrollSpeed
let loops
let currentScroll
let jumpSpeed
let gameStart = false
let cam
let score
let scoreText
let gameOverText
let gameStartText
let rt
let space
let pointerDownTime = 0
let allowShoot



function preload() {
    this.load.image('sky', 'assets/sky.png')
    this.load.image('ground', 'assets/platform.png')
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 })
    this.load.image('star', 'assets/star.png')
}

function create() {

    lastPlatformHeight = 400
    numberOfPlatforms = 0
    scrollSpeed = 0
    loops = 0
    jumpSpeed = 600
    // this.physics.world.setBounds(0, 0, 800, 900000)
    let background = this.add.image(400, 300, 'sky')
    scoreText = this.add.text(10, 10, "Score: 0", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })

    scoreText.setScrollFactor(0)
    // make background static
    background.setScrollFactor(0)

    space = this.input.keyboard.addKey('SPACE')


    cam = this.cameras.main

    platforms = this.physics.add.staticGroup()

    let ground = platforms.create(400, 568, 'ground').setScale(2).refreshBody()

    player = this.physics.add.sprite(100, 450, 'dude')
    player.setBounce(0.2)

    stars = this.physics.add.group({
        key: 'star',
        repeat: 0,
        setXY: { x: 900, y: 900 }
    })

    //Semi-transparent overlay to show before the game starts
    rt = this.add.renderTexture(0, 0, config.width, config.height)
    rt.fill(0x000000, 0.5)

    //109 is the width of the gamestarttext (received via console gameStartText.width). Need to convert this to a variable. 
    gameStartText = this.add.text(config.width / 2, config.height / 2, "Press ^ to Start", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
    gameStartText.x = config.width / 2 - (gameStartText.width / 2)



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

    // cursors = this.input.keyboard.createCursorKeys()
    cursors = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
    })

    this.physics.add.collider(player, ground)
}
function update() {

    // Start scrolling if the up key is pressed
    if (!gameStart) {

        if (cursors.up.isDown) {
            gameStartText.setVisible(false)
            gameStart = true
            scrollSpeed = 1
            rt.clear()
        }
    }

    scoreText.setText("Score: " + score)
    score = parseInt(cam.scrollY * -1)

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
    // console.log(pointer.downTime)

    // Logic to shoot bullets if space is held down (every 300 ms)

    if (gameStart && (this.input.keyboard.checkDown(space, 300) || (this.input.activePointer.isDown))) {
        // this.input.activePointer.getDuration()
        // console.log(parseInt(this.input.activePointer.getDuration()))

        if (this.input.activePointer.getDuration() > pointerDownTime) {
            console.log('shoot')

            let star = stars.create(player.x, player.y, 'star')

            star.body.setAllowGravity(false)

            // Calculate the actual Y location of the mouse pointer - even if the game is at y = -10000, game.input.mousePointer only gives
            // A range between 0 and the game height (800), so we have to add that to cam.scrollY
            let realY = cam.scrollY + game.input.mousePointer.y
            this.physics.moveTo(star, game.input.mousePointer.x, realY, 400)
            pointerDownTime += 300
        }

    }
    if (!this.input.activePointer.isDown) {
        pointerDownTime = 0
    }

    // Auto-Jump
    if (player.body.touching.down && gameStart) {
        player.setVelocityY(-jumpSpeed)
    }

    // Generate Platforms
    if (cam.scrollY - 800 < lastPlatformHeight + 100) {
        platform = generatePlatform()
        this.physics.add.collider(player, platform)
        // console.log(platforms)
    }


    // Scroll logic
    cam.scrollY -= scrollSpeed


    // Scroll camera faster over time
    loops += 1
    if (loops % 1000 == 0 && cam.scrollY < -1000) {
        console.log("Updating Scroll Speed")
        scrollSpeed += .2
    }

    // Scroll camera faster if player is above a certain point
    if (player.y < cam.scrollY + 100) {
        cam.scrollY -= 1
        if (player.y < cam.scrollY + 50) {
            cam.scrollY -= 2
        }
        if (player.y < cam.scrollY + 25) {
            cam.scrollY -= 3
        }
    }

    // 'gameover' functionality
    if (player.y > cam.scrollY + config.height) {
        scrollSpeed = 0
        player.setVelocityY(0)
        player.setBounce(0)
        if (gameStart) {
            // set and add gameover text
            rt = this.add.renderTexture(0, cam.scrollY, config.width, config.height)
            rt.fill(0x000000, 0.5)
            gameOverText = this.add.text(config.width / 2, config.height / 2, "Game Over. Press ^ to Restart", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
            gameOverText.x = config.width / 2 - (gameOverText.width / 2)
            gameOverText.y = cam.scrollY + (config.height / 2)
            gameStart = false
        }
        // rt.fill(0x000000, 0.5)
        if (cursors.up.isDown) {
            this.scene.restart()
        }
    }
}

function generatePlatform() {
    // Get random x + y ranges to generate the platform at
    x = Phaser.Math.Between(50, 750)
    y = Phaser.Math.Between(-10, 10)
    platform = platforms.create(x, lastPlatformHeight, 'ground')
    platform.setScale(.75, 1).refreshBody()
    lastPlatformHeight -= 150 + y

    // Ensure that sprite only collides with top of platform so that the sprite can jump up onto it
    platform.body.checkCollision.down = false
    platform.body.checkCollision.right = false
    platform.body.checkCollision.left = false

    // Remove a platform if there are more than 10
    if (numberOfPlatforms > 100) {
        platforms.children.entries[0].destroy()
        console.log('Destroyed platform at ', platforms.children.entries[0].x, platforms.children.entries[0].y)
        numberOfPlatforms--
    }
    numberOfPlatforms++

    return platform
}
