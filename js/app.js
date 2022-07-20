const canvas = document.getElementById("myCanvas");
document.body.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
let ctx = canvas.getContext("2d");
document.body.style.zoom = "500%";
let fps = 60;
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



const jumper = new Image();
jumper.src = "images/newchar.png";
let rightPressed = false;
let downPressed = false;
let leftPressed = false;
let upPressed = false;
let lastButtonPressed = 'right';
let spaceBarPressed = false;
let shiftPressed = false;
let goobyX = 9;
let goobyY = 140;
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
let fireDirection = 'right';
let isStunned = false;
let healthX = 0;
let healthY = 8;
let playerHealth = 3;

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
    constructor(x, y, width, height, mobType, speed, onHitLocationX, onHitLocationY, health){
        super(x, y, width, height);
        this.mobType = mobType;
        this.speed = speed;
        this.onHitLocationX = onHitLocationX;
        this.onHitLocationY = onHitLocationY;
        this.health = 1;
        this.random = 1;
        this.firesProjectiles = false;
        this.animationCounter = 0;
        this.currentAnimation = 0;
        this.movement = 0;
        this.previousDirection = 'up';
        this.expValue = 1;
        this.enemy = true;
        this.text = false;
    }
    movementGenerator() {
        setInterval(() => {
            this.random = Math.floor(Math.random() * 2) +1;
        }, 500 / this.speed);
    }
}
class Text extends DefaultObject{
    constructor(x, y, width, height, line){
        super(x, y, width, height);
        this.enemy = false;
        this.isText = true;
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
class Trigger extends DefaultObject{
    constructor(x, y, width, height, triggerType){
        super(x, y, width, height);
        this.trigerType = triggerType;
        this.isTrigger = true;
    }
    monsterSummon(){
        tempObject = new Enemy(56, 24, 8, 8, this.triggerType, 0.1, 1);
        tempObject.movementGenerator();
        gameObjects.push(tempObject);
    }
}

class MapBundler{
    constructor(o, m){
    this.gameObject = o;
    this.map = m;
}
}
//Interface handler///////////////////////////////////



//Do interface drawing here also
//textArray.push(interfaceDrawing);
let playerText = new Text(0, 10, 0, 0, `LIVESx ${playerHealth}`);

////////////////////////////////////////////////////////////////zone1 20 rows, 25 collumns
const tileSet1 = [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 9],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 9],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 9],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 9],
    [1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 9],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 9],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 9],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9]]
const objectsTileSet1 = [];
tempObject = new Enemy(112, 32, 8, 8, 'blueSlime', 0.1, 9, 140, 2);
tempObject.movementGenerator();
objectsTileSet1.push(tempObject);
tempObject = new Enemy(8, 16, 8, 8, "left-right", 0.1, 9, 140, 1);
tempObject.movementGenerator();
objectsTileSet1.push(tempObject);
tempObject = new Enemy(100, 88, 8, 8, "blueSlime", 0.1, 9, 140, 1);
tempObject.movementGenerator();
objectsTileSet1.push(tempObject);
tempObject = new Enemy(40, 124, 8, 8, "blueSlime", 0.1, 9, 140, 1);
tempObject.movementGenerator();
objectsTileSet1.push(tempObject);
tempObject = new Enemy(130, 140, 8, 8, "up-down", 0.1, 9, 140, 1);
tempObject.health = 100000000;
objectsTileSet1.push(tempObject);
tempObject = new Enemy(136, 140, 8, 8, "up-down", 0.1, 9, 140, 1);
tempObject.health = 1000000000;
objectsTileSet1.push(tempObject);
tempObject = new Enemy(40, 40, 8, 8, "up-down", 0.1, 9, 140, 1);
tempObject.health = 100000000;
objectsTileSet1.push(tempObject);
//////////////mobs^
tempObject = new Zone(112, 32, 8, 8, 1, 8, 82);
objectsTileSet1.push(tempObject);
tempObject = new Zone(6, 10, 8, 8, 1, 8, 82);
objectsTileSet1.push(tempObject);
///////////// portals^
tempObject = new Text(100, 10, 0, 0, 'LEVEL: 1');
objectsTileSet1.push(tempObject);
tempObject = new Text(100, 10, 0, 0, 'LEVEL: 1');
objectsTileSet1.push(tempObject);
/////////text display^
let bundle = new MapBundler(objectsTileSet1, tileSet1);
gameMaps.push(bundle);
 //////////////////////////////////////////////////////////zone 1
///////////////////////////////////////////////////////////zone 2
const tileSet2 = [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9]]
const objectsTileSet2 = [];

bundle = new MapBundler(objectsTileSet2, tileSet2);
gameMaps.push(bundle);
























//sets starting zone
let map = gameMaps[0].map;
gameObjects = gameMaps[0].gameObject;
console.log(gameObjects);

//consider something to create an agro radius, something like monsterx - goobyx < certain number?
//consider the logic from before, if obj[i].x > goobyX then obj[i].x - speed. Lets try to get some sort of timing to prevent a hard b-line for player on dumber mobs-possible extension goal

const drawEnemy = obj => {
    for(let i = 0; i < obj.length; i++){
        if(obj[i].enemy && obj[i].health>0){
            obj[i].animationCounter += obj[i].speed;
            
            if(obj[i].mobType === 'blueSlime'){
                if(!collision(obj[i].x, obj[i].y + 1, map)){
                    obj[i].y += obj[i].speed +1;
        
                    }
                
                switch(obj[i].random){
                case 1:
                    if(!collision(obj[i].x  - obj[i].speed, obj[i].y, map)){
                    obj[i].x -= obj[i].speed* 3;
                    if(collision(obj[i].x - obj[i].speed, obj[i].y, map)){
                        obj[i].random = 2;
                    }
                    console.log('incase1')
                    }
                    break;
                case 2:
                    if(!collision(obj[i].x + obj[i].speed, obj[i].y, map)){
                    obj[i].x += obj[i].speed * 3;
                    if(collision(obj[i].x + obj[i].speed, obj[i].y, map)){
                        obj[i].random = 1;
                    }
                   
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
                if(obj[i].mobType === 'up-down'){
                
                    
                    if(obj[i].previousDirection === 'up' && !collision(obj[i].x, obj[i].y+1, map)){
                    obj[i].y += obj[i].speed + 1;
                        if(collision(obj[i].x, obj[i].y + 1, map)){
                            obj[i].previousDirection = 'down';
                        }
                    }
                    
               
                    if(obj[i].previousDirection === 'down' && !collision(obj[i].x, obj[i].y - 1, map)){
                        obj[i].y -= obj[i].speed + 1;
                        if(collision(obj[i].x, obj[i].y -1, map)){
                    obj[i].previousDirection = 'up';

                        }
                    }                                 
                    
                ctx.drawImage(jumper, 8, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);//need new image
                }
                
                    
                
            }

            //End of blue slime AI
        if(gameObjects[i].isText){
            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.fillText(gameObjects[i].line, gameObjects[i].x, gameObjects[i].y)
        }
        
        
    }
}


const drawMap = level => {
    // console.log(level.length)
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
                ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);    
                }
                if(obj[i].direction === 'right' && !collision(obj[i].x, obj[i].y, map) && !projectileCollision(obj[i])){
                obj[i].x+=obj[i].projSpeed;
                ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x, obj[i].y + 4, 8, 8);
                }
                if(obj[i].direction === 'down' && !collision(obj[i].x, obj[i].y, map) && !projectileCollision(obj[i])){
                obj[i].y += obj[i].projSpeed;
                ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);//same with this
                }
                if(obj[i].direction === 'left' && !collision(obj[i].x, obj[i].y, map) && !projectileCollision(obj[i])){
                obj[i].x -= obj[i].projSpeed;
                ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x, obj[i].y + 4, 8, 8);
                } 
                if(collision(obj[i].x, obj[i].y, map) || projectileCollision(obj[i]) || obj[i].distance >= goobyRange){
                    if(obj[i].health<0){
                        console.log(obj[i].health)
                    obj.shift();
                    }
                }
                
            }
            //add if here
        }   
    }

const projectileCollision = (projectile) => {

        for(let i = 0; i < gameObjects.length; i++){
            if(projectile.x >= gameObjects[i].x - 5 && projectile.x <= gameObjects[i].x + 5 && projectile.y >= gameObjects[i].y - 8 && projectile.y <= gameObjects[i].y + 2 && gameObjects[i].health > 0){
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

   let playerIndex = gameObjects.indexOf(playerText)
    gameObjects.splice(playerIndex, 1)
    if(!gameObjects.includes(playerText)){
        gameObjects.push(playerText = new Text(0, 10, 0, 0, `LIVESx ${playerHealth}`));
    }
        for(let k = 0; k < gameObjects.length; k++){
                        
            if(goobyX >= gameObjects[k].x - 4 && goobyX <= gameObjects[k].x + 4 && goobyY >= gameObjects[k].y -4 && goobyY <= gameObjects[k].y + 4 && gameObjects[k].health > 0){
                console.log('in enemy')
                if(gameObjects[k].enemy && !iFrames){
                    iFrames = true;
                    setTimeout(() => {
                        iFrames = false;
                    },gameObjects[k].stunLength + 3000);
                    playerHealth--;
                    goobyX = gameObjects[k].onHitLocationX;
                    goobyY = gameObjects[k].onHitLocationY;
                    }

            }if(gameObjects[k].isZone){
                ctx.drawImage(jumper, 56, 0, 8, 8, gameObjects[k].x, gameObjects[k].y, 8, 8);
                if(goobyX >= gameObjects[k].x  && goobyX <= gameObjects[k].x + 2 && goobyY >= gameObjects[k].y  && goobyY <= gameObjects[k].y + 8){
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
    healthX = 0;
    const jump = 1;//rate of jump speed up
    let walk = 1;//left-right speed
    animationCounter++;
    cdTimer++;
    //Attack animation
    if(shiftPressed && cdTimer > cdDefault-buffs){
        if(fireDirection === 'up'){
        let fireBall = new Projectile(goobyX, goobyY, 8, 8, 2, 'up', 'gooby');
        projectiles.push(fireBall);
        shiftPressed = false;
       
        
        }else if(fireDirection === 'down'){
        let fireBall = new Projectile(goobyX, goobyY, 8, 8, 2, 'down', 'gooby');
        projectiles.push(fireBall);
        shiftPressed = false;
        
        }else if(fireDirection === 'right'){
            let fireBall = new Projectile(goobyX, goobyY-4, 8, 8, 2, 'right', 'gooby');
            projectiles.push(fireBall);
            shiftPressed = false;

        }else if(fireDirection === 'left'){
            let fireBall = new Projectile(goobyX, goobyY-4, 8, 8, 2, 'left', 'gooby');
            projectiles.push(fireBall);
            shiftPressed = false;

        }   
        cdTimer = 0;
        console.log(fireDirection)
    }if(collision(goobyX, goobyY - 1, map)){
        airBourne = false;
        

   
    }   if(airBourne){//going up
            goobyY -= jump * 2;
            setTimeout(()=>{
            airBourne = false;
            }, 350);//Jumping time in air
    
    }if(!collision(goobyX, goobyY+1, map)){
        canJump = false;

    }if(collision(goobyX, goobyY + 2, map) && !canJump){
        goobyY-=1.5;
        canJump = true;
        currentAnimation = 0;

    }if(!airBourne && !collision(goobyX, goobyY + 1, map)){//Falling
        goobyY += jump * 1.5;

    }if(rightPressed){
        if(!collision(goobyX + 2, goobyY, map)){
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
            ctx.drawImage(jumper, 0, 0, 8, 8, goobyX, goobyY, 6, 6);

        }else if(currentAnimation === 1){
            ctx.drawImage(jumper, 0, 0, 8, 8, goobyX, goobyY, 6, 6);

        }else if( currentAnimation === 2){
            ctx.drawImage(jumper, 0, 0, 8, 8, goobyX, goobyY, 6, 6);

            
        }
        if(animationCounter >= 12){
            currentAnimation++;
            animationCounter = 0;
            if(currentAnimation > 2){
                currentAnimation = 0;
            }
        } 

    }if(leftPressed){
        if(currentAnimation === 0){
            ctx.drawImage(jumper, 8, 0, 8, 8, goobyX, goobyY, 6, 6);
        }else if(currentAnimation === 1){
            ctx.drawImage(jumper, 8, 0, 8, 8, goobyX, goobyY, 6, 6);
        }else if( currentAnimation === 2){
            ctx.drawImage(jumper, 8, 0, 8, 8, goobyX, goobyY, 6, 6);
            
        }
        if(animationCounter >= 12){
            animationCounter = 0;
            if(currentAnimation > 2){
                currentAnimation = 0;
            }
        } 

    }if(currentAnimation === 3){
        switch(lastButtonPressed){
            case "right":
            ctx.drawImage(jumper, 0, 0, 8, 8, goobyX, goobyY, 6, 6);
            break;
            case "left":
                ctx.drawImage(jumper, 8, 0, 8, 8, goobyX, goobyY, 6, 6);
                break;
        }   

    }else if(!rightPressed && !leftPressed) {
        switch(lastButtonPressed){
            case "right":
            ctx.drawImage(jumper, 0, 0, 8, 8, goobyX+1, goobyY, 6, 6);
            break;
            case "left":
                ctx.drawImage(jumper, 8, 0, 8, 8, goobyX, goobyY, 6, 6);
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
                fireDirection = 'left'
                lastButtonPressed = "left";
            } else if(e.keyCode === 68){//right
                rightPressed = true;
                fireDirection = 'right'
                lastButtonPressed = "right";
            } else if(e.keyCode === 87){//up
                upPressed = true;
                fireDirection = 'up'
                // lastButtonPressed = "up";
            } else if(e.keyCode === 83){//down
                downPressed = true;
                // lastButtonPressed = "down";
                fireDirection = 'down'
            } else if(e.keyCode === 32 && !airBourne && canJump){//spacebar
                canJump = false;
                airBourne = true;
                spaceBarPressed = true;
                currentAnimation = 3;

            } else if(e.keyCode === 16){//leftshift

                
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
        /////DeathCheck
        const isDead = () => {
            if(!playerHealth){
                return true;
            }
            return false;
        }
//////////////////////////////////////////////////////////////////////////////////
        const collision = (x, y, map) => {
            for(let i = 0; i < map.length; i++){
                for(let j = 0; j < map[i].length; j++){
                    
                    if(map[i][j] != 0){                  
                         if(x <= j*8+6 && x >= j*8-4 && y <= i*8+4 && y >= i*8-4){
                            // (x <= j*8 && x >= j*64 && y <= i*40 + 40 && y >= i*40)
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
        const deathArray = [
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]]
const draw = () => {
    setTimeout(()=> {
    ctx.fillStyle = "rgb(20,20,20)";
    ctx.fillRect(0,0,96,96);
    drawMap(map);
    drawGooby();
    objectCollision();
    drawProjectiles(projectiles);
    drawEnemy(gameObjects);
    if(isDead()){
        map = deathArray;
        let deathText = new Text(40, 40, 0, 0, "YOU DIED!")
        gameObjects.push(deathText);
        setTimeout(() => {
        fps = 0.0001
        }, 3000)
    };
    requestAnimationFrame(draw);
    },1000 / fps);
}
draw();
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
/*blank level template
    [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
    */