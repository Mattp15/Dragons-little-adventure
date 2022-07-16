const canvas = document.getElementById("myCanvas");
document.body.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
let ctx = canvas.getContext("2d");
document.body.style.zoom = "500%";
const fps = 60;
const bitMap = new Image();
bitMap.src = "images/bitmap-terrain-slime-character-attacks.png";
const gooby = new Image();
gooby.src = "images/peaceful-dragon.png";
let rightPressed = false;
let downPressed = false;
let leftPressed = false;
let upPressed = false;
let lastButtonPressed = 'right';
let spaceBarPressed = false;
let shiftPressed = false;
let goobyX = 8;
let goobyY = 82;
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
let jumpCount = 1;

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
    constructor(x, y, width, height, mobType, speed, random, health = 1){
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
    constructor(x, y, width, height){
        super(x, y, width, height);
        this.enemy = false;
        this.text = true;
        this.line = ""; 
    }
}
class Zone extends DefaultObject{
    constructor(x, y, width, height, newZoneNumber){
        super(x, y, width, height);
        this.newZoneNumber = newZoneNumber;
        this.isZone = true;
    }
}

class MapBundler{
    constructor(o, m){
    this.gameObject = o;
    this.map = m;
}
}


const tileSet1 = [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
const objectsTileSet1 = [];
tempObject = new Enemy(24, 32, 8, 8, 'blueSlime', 0.1, 2);
tempObject.movementGenerator();
objectsTileSet1.push(tempObject);
tempObject = new Enemy(40, 40, 8, 8, "blueSlime", 0.1, 4);
tempObject.movementGenerator();
objectsTileSet1.push(tempObject);
tempObject = new Zone(88, 88, 8, 8, 2);
objectsTileSet1.push(tempObject);

let bundle = new MapBundler(objectsTileSet1, tileSet1);
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
        else if(obj[i].text){
                
            }
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
                if(obj[i].direction === 'up' && !collision(obj[i].x, obj[i].y, map) && !projectileCollision(obj[i])){  //add object collison conditional !projectileCollision(obj[i], gameObjects);            
                obj[i].y -= obj[i].projSpeed;
                ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);    //need new image     
                }
                if(obj[i].direction === 'right' && !collision(obj[i].x, obj[i].y, map) && !projectileCollision(obj[i])){
                obj[i].x+=obj[i].projSpeed;
                ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);//need new image
                }
                if(obj[i].direction === 'down' && !collision(obj[i].x, obj[i].y, map) && !projectileCollision(obj[i])){
                obj[i].y += obj[i].projSpeed;
                ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);//need new image
                }
                if(obj[i].direction === 'left' && !collision(obj[i].x, obj[i].y, map) && !projectileCollision(obj[i])){
                obj[i].x -= obj[i].projSpeed;
                ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);  //need new image  
                } 
                if(collision(obj[i].x, obj[i].y, map) || projectileCollision(obj[i]) || obj[i].distance >= goobyRange){
                    //death image
                    obj.shift();
                } 
            }
            //add if here
        }   
    }

const projectileCollision = (projectile) => {

        for(let i = 0; i < gameObjects.length; i++){
            if(projectile.x >= gameObjects[i].x - 5 && projectile.x <= gameObjects[i].x + 5 && projectile.y >= gameObjects[i].y - 4 && projectile.y <= gameObjects[i].y + 5 && gameObjects[i].health > 0){
                gameObjects[i].health -= projectile.damage;
                return true;
            }
        }
        return false;
} 
//notes for sidescroller transition > if(!spaceBarPressed && collision(x, y-1, map)) //if spacebarPressed = true && !collision(x, y -4, map) && !collision(x+1, y, map)>reduce velocity for rest of up //if !spaceBarPressed ** !collision(x, y-4, map), increase velocity, 
const objectCollision = () => {
                    for(let k = 0; k < gameObjects.length; k++){
                if(goobyX >= gameObjects[k].x - 4 && goobyX <= gameObjects[k].x + 4 && goobyY >= gameObjects[k].y -4 && goobyY <= gameObjects[k].y + 4 && gameObjects[k].health > 0){
                        // switch(lastButtonPressed){this won't work, pushes player into walls
                        //     case 'left':
                        //         goobyX += 4;
                        //         break;
                        //     case 'right':
                        //         goobyX -= 4;
                        //         break;
                        //     case 'up':
                        //         goobyY += 4;
                        //         break;
                        //     case 'down':
                        //         goobyY -= 4;
                        //         break;
                        // }
                    gameObjects[k].isStunned = true;
                    setTimeout(() => {
                        gameObjects[k].isStunned = false;
                    }, gameObjects[k].selfStun);
                    stunTimer = gameObjects[k].stunLength;

                    return true;
                }
                }
}

const drawGooby = () => {
    let walk = 1;
    animationCounter++;
    cdTimer++;
    if(shiftPressed && cdTimer > cdDefault-buffs){
        if(lastButtonPressed === 'up'){
        ctx.drawImage(bitMap, 8, 8, 8, 8, goobyX, goobyY, 8, 8)//need new image
        let fireBall = new Projectile(goobyX, goobyY-4, 8, 8, 2, 'up', 'gooby');
        projectiles.push(fireBall);
        shiftPressed = false;
       
        } 
        else if(lastButtonPressed === 'right'){
        ctx.drawImage(bitMap, 16, 8, 8, 8, goobyX, goobyY, 8, 8)//need new image
        let fireBall = new Projectile(goobyX+4, goobyY, 8, 8, 2, 'right', 'gooby');
        projectiles.push(fireBall);
        shiftPressed = false;
        } 
        else if(lastButtonPressed === 'down'){
        ctx.drawImage(bitMap, 0, 8, 8, 8, goobyX, goobyY, 8, 8)//need new image
        let fireBall = new Projectile(goobyX, goobyY+4, 8, 8, 2, 'down', 'gooby');
        projectiles.push(fireBall);
        shiftPressed = false;
        } 
        else if(lastButtonPressed === 'left'){
        ctx.drawImage(bitMap, 24, 8, 8, 8, goobyX, goobyY, 8, 8)//need new image
        let fireBall = new Projectile(goobyX-4, goobyY, 8, 8, 2, 'left', 'gooby');
        projectiles.push(fireBall);
        shiftPressed = false;
        }   
        cdTimer = 0;
                    
}   
    if(spaceBarPressed && !collision(goobyX, goobyY - walk, map) && jumpTimer){
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
               
        } else if(!spaceBarPressed && !collision(goobyX, goobyY + walk, map)){
        //     if(collision(goobyX + 1, goobyY, map) || collision(goobyX -1, goobyY, map)){
        //     goobyY +=walk/2;
        //     ctx.drawImage(gooby, 32, 0, 8, 8, goobyX, goobyY, 8, 8);             
        // }
            if(!rightPressed && !leftPressed){
            goobyY += walk;
            ctx.drawImage(gooby, 32, 0, 8, 8, goobyX, goobyY, 8, 8);//need new image
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
    }  else if(rightPressed && !collision(goobyX + walk, goobyY, map) && stunTimer <= 0){
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
    
  
     } else if(leftPressed && !collision(goobyX - walk, goobyY, map) && stunTimer <= 0){
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
    if(leftPressed && collision(goobyX - walk, goobyY, map) && !collision(goobyX, goobyY + 1, map)){
        if(!spaceBarPressed) {
            
            goobyY += 1;
            ctx.drawImage(gooby, 58, 0, 8, 8, goobyX, goobyY, 8, 8);
        }
        }  if(rightPressed && collision(goobyX + walk, goobyY, map) && !collision(goobyX, goobyY + 1, map)){

        if(!spaceBarPressed) {
            
            goobyY += 1;
            ctx.drawImage(gooby, 58, 0, 8, 8, goobyX, goobyY, 8, 8);
            }
        }
         else if(collision(goobyX, goobyY + 1, map)){
            ctx.drawImage(gooby, 58, 0, 8, 8, goobyX, goobyY, 8, 8);
        }
    if(collision(goobyX, goobyY + 1, map)){
        jumpTimer = true;
        jumpCount = 1;
    }


}



        //Player movement functions
        const keyDownHandler = e => {
            if(e.keyCode === 65){//left
                leftPressed = true;
                lastButtonPressed = "left";
            } else if(e.keyCode === 68){//right
                rightPressed = true;
                lastButtonPressed = "right";
            } else if(e.keyCode === 87){//up
                upPressed = true;
                lastButtonPressed = "up";
            } else if(e.keyCode === 83){//down
                downPressed = true;
                lastButtonPressed = "down";
            } else if(e.keyCode === 32 && jumpCount){//spacebar
                jumpCount = 0;
                spaceBarPressed = true;
            } else if(e.keyCode === 16){//leftshift
                shiftPressed = true;
            }
        }

        const keyUpHandler = e => {
            if(e.keyCode === 65){//left
                leftPressed = false;
            } else if(e.keyCode === 68){//right
                rightPressed = false;
            } else if(e.keyCode === 87){//up
                upPressed = false;         
            } else if(e.keyCode === 83){//down
                downPressed = false;  
            } else if(e.keyCode === 32){//spacebar
                // spaceBarPressed = false;
            } else if(e.keyCode === 16){//leftshift
                shiftPressed = false;
            }
        }

        const collision = (x, y, map) => {
            for(let i = 0; i < map.length; i++){
                for(let j = 0; j < map[i].length; j++){
                    
                    if(map[i][j] != 0){                  
                         if(x <= j*8+6 && x >= j*8-4 && y <= i*8+4 && y >= i*8-4){//x = 8  to 88
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
    requestAnimationFrame(draw);
    },1000 / fps);
}
draw();
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
