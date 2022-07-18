const canvas = document.getElementById("myCanvas");
document.body.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
let ctx = canvas.getContext("2d");
document.body.style.zoom = "500%";
const fps = 60;
const background = new Image();
background.src = "images/background.png"
const bitMap = new Image();
bitMap.src = "images/bitmap-terrain-slime-character-attacks.png";
const gooby = new Image();
gooby.src = "images/peaceful-dragon.png";
const updatedRight = new Image();
updatedRight.src = "images/bitmapDragonRight.png";
const updated = new Image();
updated.src = "images/bitmapDragon.png";
const fireBallSound = new Audio();
fireBallSound.src = "sounds/Fireball.mp3";
const jumpSound = new Audio();
jumpSound.src = "sounds/wing-flap.mp3";
let rightPressed = false;
let downPressed = false;
let leftPressed = false;
let upPressed = false;
let lastButtonPressed = 'right';
let spaceBarPressed = false;
let shiftPressed = false;
let goobyX = 9;
let goobyY = 97;
let projX = goobyX;
let projY = goobyY;
let currentAnimation = 0;
let animationCounter = 0;
let cdTimer = 0;
let cdDefault = 30;
let buffs = 0;
let gameMaps = []; 
let projectiles = [];
let tempObject = null;
let goobyEXP = 0;
let goobyHealth = 4; 
let stunTimer = 0;
let goobyRange = 15;
let jumpTimer = true;
let canJump = false;
let airBourne = false;
let iFrames = false;
const textArray = [];

class DefaultObject {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
class Projectile extends DefaultObject{
    constructor(x, y, width, height, projSpeed, direction, projectileSource){
        super(x, y, width, height);
        this.projSpeed = projSpeed;
        this.direction = direction;
        this.projectileSource = projectileSource;
        this.damage = 1;
        this.distance = 0;
    }
}
class Enemy extends DefaultObject{
    constructor(x, y, width, height, mobType, speed, random, health = 1, expValue = 1){
        super(x, y, width, height);
        this.mobType = mobType;
        this.speed = speed;
        this.random = random;
        this.firesProjectiles = false;
        this.animationCounter = 0;
        this.currentAnimation = 0;
        this.movement = 0;
        this.previousDirection = 'right';
        this.health = health;
        this.expValue = expValue;
        this.enemy = true;
        this.text = false;
        this.stunLength = 1.5;
        this.isStunned = false;
        this.selfStun = 2000;
    }
    movementGenerator() {
        setInterval(() => {
            this.random = Math.floor(Math.random() * 3) +1;
        }, 500 / this.speed);
    }
}
class Text extends DefaultObject{
    constructor(x, y, width, height, line){
        super(x, y, width, height);
        this.enemy = false;
        this.text = true;
        this.line = line 
    }
}
class Zone extends DefaultObject{
    constructor(x, y, width, height, newZoneNumber, newZoneStartX, newZoneStartY){
        super(x, y, width, height);
        this.newZoneNumber = newZoneNumber;
        this.newZoneStartX = newZoneStartX;
        this.newZoneStartY = newZoneStartY;
        this.isZone = true;
    }
}

class MapBundler{
    constructor(o, m){
    this.gameObject = o;
    this.map = m;
}
}

//Interface handler///////////////////////////////////
const scoreText = new Text(0, 10, 0, 0, "SCORE:");
textArray.push(scoreText);
//Do interface drawing here also
//textArray.push(interfaceDrawing);

///////////////////////////////////////////////////////end interface handler

////////////////////////////////////////////////////////////////zone1 20 rows, 25 collumns
const tileSet1 = [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
const objectsTileSet1 = [];
// tempObject = new Enemy(40, 40, 8, 8, 'blueSlime', 0.1, 2);
// tempObject.movementGenerator();
// objectsTileSet1.push(tempObject);
// tempObject = new Enemy(40, 40, 8, 8, "blueSlime", 0.1, 4);
// tempObject.movementGenerator();
// objectsTileSet1.push(tempObject);
tempObject = new Zone(76, 74, 8, 8, 1, 8, 82);
objectsTileSet1.push(tempObject);
tempObject = new Zone(76, 82, 8, 8, 1, 8, 82);
objectsTileSet1.push(tempObject);
let bundle = new MapBundler(objectsTileSet1, tileSet1);
gameMaps.push(bundle);
 //////////////////////////////////////////////////////////zone 1
///////////////////////////////////////////////////////////zone 2
const tileSet2 = [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
const objectsTileSet2 = [];

bundle = new MapBundler(objectsTileSet2, tileSet2);
gameMaps.push(bundle);
























//sets starting zone
let map = gameMaps[0].map;
gameObjects = gameMaps[0].gameObject;


//consider something to create an agro radius, something like monsterx - goobyx < certain number?
//consider the logic from before, if obj[i].x > goobyX then obj[i].x - speed. Lets try to get some sort of timing to prevent a hard b-line for player on dumber mobs-possible extension goal

const drawEnemy = obj => {
    for(let i = 0; i < obj.length; i++){
        if(obj[i].enemy && obj[i].health>0){
            obj[i].animationCounter += obj[i].speed;
            if(obj[i].mobType === 'blueSlime'){
            //do the if/else here for chase
            //switch in the else{}
            switch(obj[i].currentAnimation){
                case 0:
            if(!collision(obj[i].x, obj[i].y + 3, map)){
                obj[i].y += obj[i].speed + 1;
            }
        }   
                switch(obj[i].random){
                case 1:
                    if(!collision(obj[i].x  - obj[i].speed - 2, obj[i].y, map) && !obj[i].isStunned){
                    obj[i].x -= obj[i].speed;
                    obj[i].previousDirection = 'left';//I don't think I need this
                    }
                    break;
                case 2:
                    if(!collision(obj[i].x + obj[i].speed + 2, obj[i].y, map) && !obj[i].isStunned){
                    obj[i].x += obj[i].speed;
                    obj[i].previousDirection = 'right';
                    }
                    break;
                default:
                    //jump
                    break;
                }


    
                if(!obj[i].currentAnimation){
                    ctx.drawImage(bitMap, 25, 0, 8, 8, obj[i].x, obj[i].y, 8, 8);//need new image
                } else if(obj[i].currentAnimation === 1){
                    ctx.drawImage(bitMap, 32, 0, 8, 8, obj[i].x, obj[i].y, 8, 8);//need new image
                }
                if(obj[i].animationCounter >= 6){
                    obj[i].currentAnimation++;
                    obj[i].animationCounter = 0;
                    if(obj[i].currentAnimation > 1){
                        obj[i].currentAnimation = 0;
                    }
               
                }
            }
        }
    }
}
const drawText = texts => {
    for(let i = 0; i < texts.length; i++){
        if(texts[i].text){
            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.fillText(texts[i].line + goobyEXP, texts[i].x, texts[i].y)

        }//if(interface => draw interface)
    }
}

const drawMap = level => {
    for(let i = 0; i < level.length; i++){
        for(let j = 0; j < level[i].length; j++){
            ctx.drawImage(bitMap, level[i][j]*8, 0, 8, 8, j*8, i*8, 8, 8);
        } 
    }
}



const drawProjectiles = (obj) => {
    for(let i = 0; i < obj.length; i++){
        obj[i].distance++;
        if(obj[i].projectileSource === "gooby"){
                // if(obj[i].direction === 'up' && !collision(obj[i].x, obj[i].y, map) && !projectileCollision(obj[i])){  //add object collison conditional !projectileCollision(obj[i], gameObjects);            
                // obj[i].y -= obj[i].projSpeed;
                // ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);    unsure if i'm putting this in
                // }
                if(obj[i].direction === 'right' && !collision(obj[i].x, obj[i].y, map) && !projectileCollision(obj[i])){
                obj[i].x+=obj[i].projSpeed;
                ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x + 10, obj[i].y + 4, 8, 8);
                }
                // if(obj[i].direction === 'down' && !collision(obj[i].x, obj[i].y, map) && !projectileCollision(obj[i])){
                // obj[i].y += obj[i].projSpeed;
                // ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);//same with this
                // }
                if(obj[i].direction === 'left' && !collision(obj[i].x, obj[i].y, map) && !projectileCollision(obj[i])){
                obj[i].x -= obj[i].projSpeed;
                ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x + 6, obj[i].y + 4, 8, 8);
                } 
                if(collision(obj[i].x, obj[i].y, map) || projectileCollision(obj[i]) || obj[i].distance >= goobyRange){
                    obj.shift();
                }
                fireBallSound.play();
            }
            //add if here
        }   
    }

const projectileCollision = (projectile) => {

        for(let i = 0; i < gameObjects.length; i++){
            if(projectile.x >= gameObjects[i].x - 5 && projectile.x <= gameObjects[i].x + 5 && projectile.y >= gameObjects[i].y - 4 && projectile.y <= gameObjects[i].y + 5 && gameObjects[i].health > 0){
                gameObjects[i].health -= projectile.damage;
                console.log(gameObjects[i].health);
                if(!gameObjects[i].health){
                    goobyEXP+= gameObjects[i].expValue;
                }
                return true;
            }
        }
        return false;
} 
//notes for sidescroller transition > if(!spaceBarPressed && collision(x, y-1, map)) //if spacebarPressed = true && !collision(x, y -4, map) && !collision(x+1, y, map)>reduce velocity for rest of up //if !spaceBarPressed ** !collision(x, y-4, map), increase velocity, 
const objectCollision = () => {
                    for(let k = 0; k < gameObjects.length; k++){
                        
                if(goobyX >= gameObjects[k].x - 4 && goobyX <= gameObjects[k].x + 4 && goobyY >= gameObjects[k].y -4 && goobyY <= gameObjects[k].y + 4 && gameObjects[k].health > 0){
                    if(gameObjects[k].enemy && !iFrames){
                        iFrames = true;
                        setTimeout(() => {
                            iFrames = false;
                        },gameObjects[k].stunLength + 3000);
                    gameObjects[k].isStunned = true;
                    setTimeout(() => {
                        gameObjects[k].isStunned = false;
                    }, gameObjects[k].selfStun);
                    stunTimer = gameObjects[k].stunLength;
                    }
                }
                if(gameObjects[k].isZone){
                    if(goobyX >= gameObjects[k].x  && goobyX <= gameObjects[k].x + gameObjects[k].width && goobyY >= gameObjects[k].y  && goobyY <= gameObjects[k].y + + gameObjects[k].height){
                    goobyX = gameObjects[k].newZoneStartX;
                    goobyY = gameObjects[k].newZoneStartY;
                    map = gameMaps[gameObjects[k].newZoneNumber].map;
                    gameObjects = gameMaps[gameObjects[k].newZoneNumber].gameObject;
                    }
                }
            }
        }
    
//Character Drawing///////////////////////////////////////////////////////////////////
const drawGooby = () => {
    const jump = 1;//rate of jump speed up
    let walk = 1;//left-right speed
    animationCounter++;
    cdTimer++;
    //Attack animation
    if(shiftPressed && cdTimer > cdDefault-buffs){
        if(lastButtonPressed === 'up'){
        let fireBall = new Projectile(goobyX, goobyY-4, 8, 8, 2, 'up', 'gooby');
        projectiles.push(fireBall);
        shiftPressed = false;
       
        }else if(lastButtonPressed === 'right'){
        let fireBall = new Projectile(goobyX+4, goobyY, 8, 8, 2, 'right', 'gooby');
        projectiles.push(fireBall);
        shiftPressed = false;

        }else if(lastButtonPressed === 'down'){
        let fireBall = new Projectile(goobyX, goobyY+4, 8, 8, 2, 'down', 'gooby');
        projectiles.push(fireBall);
        shiftPressed = false;

        }else if(lastButtonPressed === 'left'){
        let fireBall = new Projectile(goobyX-4, goobyY, 8, 8, 2, 'left', 'gooby');
        projectiles.push(fireBall);
        shiftPressed = false;
        }   
        cdTimer = 0;

    }if(collision(goobyX, goobyY - 1, map)){
        airBourne = false;

   
    }   if(airBourne){//going up
        jumpSound.play();
        console.log("going up")
        goobyY -= jump * 1.25;
            setTimeout(()=>{
            airBourne = false;
            }, 350);//Jumping time in air
        }
    
    if(collision(goobyX, goobyY + 1, map)){
        canJump = true;

    }if(!airBourne && !collision(goobyX, goobyY + 1, map)){//Falling
        console.log('going down')
        goobyY += jump;

    }if(rightPressed){
        if(!collision(goobyX + 1, goobyY, map)){
        goobyX += walk;

        }if(airBourne && collision(goobyX + 1, goobyY, map)){
            goobyY += walk * 0.75;//Reduces fallspeed/jumpspeed when pressing into walls
        }
        //animationCounter++;
        //add Animation incrementer in the left and right

    }if(leftPressed){
        if(!collision(goobyX - 1, goobyY, map)){
            goobyX -= walk;
            
        }if(airBourne && collision(goobyX - 1, goobyY, map)){
            goobyY += walk * 0.75;//Reduces fallspeed/jumpspeed when pressing into walls
        }

    }if(rightPressed){
        if(currentAnimation === 0){
            ctx.drawImage(updatedRight, 200, 0, 64, 40, goobyX, goobyY, 32, 16);

        }else if(currentAnimation === 1){
            ctx.drawImage(updatedRight, 140, 0, 64, 40, goobyX, goobyY, 32, 16);

        }else if( currentAnimation === 2){
            ctx.drawImage(updatedRight, 62, 0, 64, 40, goobyX, goobyY, 32, 16);

            
        }
        if(animationCounter >= 12){
            console.log(animationCounter, 'animationCounter');
            console.log(currentAnimation, 'currentAnimation')
            currentAnimation++;
            animationCounter = 0;
            if(currentAnimation > 2){
                currentAnimation = 0;
            }
        } 

    }if(leftPressed){
        if(currentAnimation === 0){
            ctx.drawImage(updated, 0, 0, 64, 40, goobyX, goobyY, 32, 16);

        }else if(currentAnimation === 1){
            ctx.drawImage(updated, 64, 0, 64, 40, goobyX, goobyY, 32, 16);

        }else if( currentAnimation === 2){
            ctx.drawImage(updated, 128, 0, 64, 40, goobyX, goobyY, 32, 16);

            
        }
        if(animationCounter >= 12){
            console.log(animationCounter, 'animationCounter');
            console.log(currentAnimation, 'currentAnimation')
            currentAnimation++;
            animationCounter = 0;
            if(currentAnimation > 2){
                currentAnimation = 0;
            }
        } 

    }if(currentAnimation === 3){
        switch(lastButtonPressed){
            case "right":
            ctx.drawImage(updatedRight, 192, 42, 64, 40, goobyX - 10, goobyY +2, 32, 16);
            break;
            case "left":
                ctx.drawImage(updated, 0, 42, 64, 40, goobyX + 10, goobyY + 2, 32, 16);
                break;
        }   

    }else if(!rightPressed && !leftPressed) {
        switch(lastButtonPressed){
            case "right":
            ctx.drawImage(updatedRight, 200, 0, 64, 40, goobyX, goobyY, 32, 16);
            break;
            case "left":
                ctx.drawImage(updated, 0, 0, 64, 40, goobyX, goobyY, 32, 16);
                break;
        }
    }
   /*
    if(spaceBarPressed && !collision(goobyX, goobyY - walk, map) && jumpTimer && stunTimer <= 0){
       walk = 1;
       if(collision(goobyX, goobyY - 2, map)){
        spaceBarPressed = false;
       }
       else{
        setTimeout(() => {
            spaceBarPressed = false;
        }, 400)
        }

            
        if(!rightPressed && !leftPressed){
            goobyY -= walk;
            ctx.drawImage(gooby, 32, 0, 8, 8, goobyX, goobyY, 8, 8);//need new image
        } else if(rightPressed && !collision(goobyX + 1, goobyY, map)){

            goobyY -= walk;
            goobyX += walk/2;
            ctx.drawImage(gooby, 32, 0, 8, 8, goobyX, goobyY, 8, 8);//need new image
        } else if(leftPressed && !collision(goobyX - 1, goobyY, map)){
            goobyY -= walk;
            goobyX -= walk/2;
            ctx.drawImage(gooby, 32, 0, 8, 8, goobyX, goobyY, 8, 8);//need new image
        } else{
            goobyY -= walk;
            ctx.drawImage(gooby, 32, 0, 8, 8, goobyX, goobyY, 8, 8);//need new image
        }
               
        } else if(!spaceBarPressed && !collision(goobyX, goobyY + 1, map)){
        //     if(collision(goobyX + 1, goobyY, map) || collision(goobyX -1, goobyY, map)){
        //     goobyY +=walk/2;
        //     ctx.drawImage(gooby, 32, 0, 8, 8, goobyX, goobyY, 8, 8);             
        // }
            if(!rightPressed && !leftPressed){
            goobyY += walk;
        } else if(rightPressed && !collision(goobyX + 1, goobyY, map)){

            goobyY += walk;
            goobyX += walk/2;
            ctx.drawImage(gooby, 32, 0, 8, 8, goobyX, goobyY, 8, 8);//need new image
        } else if(leftPressed && !collision(goobyX - 1, goobyY, map)){
            goobyY += walk;
            goobyX -= walk/2;
            ctx.drawImage(gooby, 32, 0, 8, 8, goobyX, goobyY, 8, 8);//need new image
        } 
    }   else if(upPressed && !collision(goobyX, goobyY - walk, map) && stunTimer <= 0){
        if(currentAnimation === 0){
            //need looking up image
        }
    }  else if(rightPressed){
        if(!collision(goobyX + walk, goobyY, map) && stunTimer <= 0){
        goobyX += walk;
        if(currentAnimation === 0){
            ctx.drawImage(gooby, 16, 0, 8, 8, goobyX, goobyY, 8, 8);//need new image
        }else if(currentAnimation === 1){
            ctx.drawImage(gooby, 22, 0, 8, 8, goobyX, goobyY, 8, 8);//newed new image
        }
        if(animationCounter >= 6){
            currentAnimation++;
            animationCounter = 0;
            if(currentAnimation > 1){
                currentAnimation = 0;
            }
        }
        }
        else{
            if(currentAnimation === 0){
                ctx.drawImage(gooby, 16, 0, 8, 8, goobyX, goobyY, 8, 8);//need new image
            }else if(currentAnimation === 1){
                ctx.drawImage(gooby, 22, 0, 8, 8, goobyX, goobyY, 8, 8);//newed new image
            }
            if(animationCounter >= 6){
                currentAnimation++;
                animationCounter = 0;
                if(currentAnimation > 1){
                    currentAnimation = 0;
                }
            }
        }
     } else if(leftPressed){
          if(!collision(goobyX - walk, goobyY, map) && stunTimer <= 0){
            goobyX -= walk;
            if(currentAnimation === 0){
            ctx.drawImage(gooby, 50, 0, 8, 8, goobyX, goobyY, 8, 8);//need new image
            }else if(currentAnimation === 1){
            ctx.drawImage(gooby, 58, 0, 8, 8, goobyX, goobyY, 8, 8);//need new image
            }
            if(animationCounter >= 6){
                currentAnimation++;
                animationCounter = 0;
                if(currentAnimation > 1){
                    currentAnimation = 0;
                }
            }
        }   
        else{
            if(currentAnimation === 0){
                ctx.drawImage(gooby, 50, 0, 8, 8, goobyX, goobyY, 8, 8);//need new image
                }else if(currentAnimation === 1){
                ctx.drawImage(gooby, 58, 0, 8, 8, goobyX, goobyY, 8, 8);//need new image
                }
                if(animationCounter >= 6){
                    currentAnimation++;
                    animationCounter = 0;
                    if(currentAnimation > 1){
                        currentAnimation = 0;
                    }
                }
        }
    
    }   
    if(leftPressed && collision(goobyX - walk, goobyY, map) && !collision(goobyX, goobyY + 1, map)){
        if(!spaceBarPressed) {
            
            goobyY += 1;
            ctx.drawImage(gooby, 58, 0, 8, 8, goobyX, goobyY, 8, 8);
        }
        }  if(rightPressed && collision(goobyX + 1, goobyY, map) && !collision(goobyX, goobyY + 1, map)){

            if(!spaceBarPressed) {
            goobyY += 1;
            ctx.drawImage(gooby, 58, 0, 8, 8, goobyX, goobyY, 8, 8);
            }

        }
        else if(!rightPressed && !leftPressed && !spaceBarPressed && !upPressed && !downPressed){
            ctx.drawImage(gooby, 58, 0, 8, 8, goobyX, goobyY, 8, 8);
        }
     
    if(collision(goobyX, goobyY + 1.5, map)){
        jumpTimer = true;
        jumpCount = 1;
    }*/
}
///////////////////////////////////////////////////////////////////////////////////////////////////////End Character Drawing

///audioHandler




        //Player input functions/////////////////////////////////////////////////////////////
        const keyDownHandler = e => {
            if(e.keyCode === 65){//left
                leftPressed = true;
                lastButtonPressed = "left";
            } else if(e.keyCode === 68){//right
                rightPressed = true;
                lastButtonPressed = "right";
            } else if(e.keyCode === 87){//up
                upPressed = true;
                // lastButtonPressed = "up";
            } else if(e.keyCode === 83){//down
                downPressed = true;
                // lastButtonPressed = "down";
            } else if(e.keyCode === 32 && !airBourne && canJump){//spacebar
                canJump = false;
                airBourne = true;
                spaceBarPressed = true;
            } else if(e.keyCode === 16){//leftshift

                currentAnimation = 3;
                setTimeout(() => {
                    currentAnimation = 0;
                }, 300)
                shiftPressed = true;
            }
        }

        const keyUpHandler = e => {
            if(e.keyCode === 65){//left
                leftPressed = false;
                currentAnimation = 0;
            } else if(e.keyCode === 68){//right
                rightPressed = false;
                currentAnimation = 0;
            } else if(e.keyCode === 87){//up
                upPressed = false;         
            } else if(e.keyCode === 83){//down
                downPressed = false;  
                currentAnimation = 0;
            } else if(e.keyCode === 32){//spacebar
                // spaceBarPressed = false;
            } else if(e.keyCode === 16){//leftshift
                shiftPressed = false;
            }
        }
//////////////////////////////////////////////////////////////////////////////////
        const collision = (x, y, map) => {
            for(let i = 0; i < map.length; i++){
                for(let j = 0; j < map[i].length; j++){
                    
                    if(map[i][j] != 0){                  
                         if(x <= j*8 + 4 && x >= j*8-24   && y <= i*8+16 && y >= i*8-14){
                            // (x <= j*16+6 && x >= j*16 && y <= i*16+16 && y >= i*16)
                            return true;
                        }
                    }                 
                }
            }         
            return false;
        }

        setInterval(() => {
            stunTimer--;
        }, 500);
const draw = () => {
    setTimeout(()=> {
    ctx.fillStyle = "rgb(20,20,20)";
    ctx.fillRect(0,0,96,96);
    drawMap(map);
    drawGooby();
    objectCollision();
    drawProjectiles(projectiles);
    drawEnemy(gameObjects);
    drawText(textArray);
    requestAnimationFrame(draw);
    },1000 / fps);
}
draw();
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
/*blank level template
    [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
    */