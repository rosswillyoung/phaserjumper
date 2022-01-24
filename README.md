Simple Jumper Game I'm creating to test out Phaser and brush up on JavaScript/Github

- [x] Add ground and sky
- [x] Add platforms
- [x] Add Sprite
- [x] Jumping and moving mechanism for sprite
- [x] Animation frames for sprite
- [x] Auto-generate platforms
- [x] Remove off-screen platforms
- [x] Collision detection just for top of platform
- [x] Scroll speed temporarily higher when player is above a certain height
    - [x] Need to keep in mind platform creation
    - [x] Higher scroll speed depending on how much higher the player is than the defined height
- [ ] Update platform creation to be better (more varied height and widths)
    - [ ] smaller platforms as time goes on
    - [ ] breakable platforms?
- [x] GameOver on player below screenheight
    - [x] Set scroll speed and player bounce to 0
    - [x] GameOver text
    - [x] Reset button
- [x] Set scroll speed higher as time goes on
- [x] Game pause until first ^ press
- [ ] Power-ups
    - [ ] faster shooting speed?
    - [ ] Platform that covers bottom for x seconds
    - [ ] higher jumping speed
- [x] Score (positive scrollY * -1?) 
- [x] Shooting mechanism
- [x] Add WASD controls
- [ ] Switch/add pointer down as bullet fire
- [ ] Enemies
    - [ ] Spawn Enemies
    - [ ] Make them 'hover?' (enemy.y = cam.scrollY?)
    - [ ] plus points on enemy kill and chance at powerup
    - [ ] logic to "bounce" player off enemy
- [x] Pre-and-post game scenes/menus
    - [x] Overlay on screen pre-game
    - [x] Same overlay post-game
- [x] Convert game into main scene + game start
    - [x] This would require too much re-working as of now. Will finish this game up now that I have learnt the basics and start a new project with proper classes.
- [ ] Scoreboard - figure out way to store previous scores
- [ ] Create custom artwork and replace default Phaser Art


Pausing updates on this for now. I feel that I've learned a lot from it and would now be better suited learning by working on a new game using OOP 