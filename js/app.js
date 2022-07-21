const canvas = document.getElementById("myCanvas");
document.body.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
let ctx = canvas.getContext("2d");
document.body.style.zoom = "575%";
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
let currentAnimation = 0;
let animationCounter = 0;
let cdTimer = 0;
let cdDefault = 10;
let buffs = 0;
let gameMaps = []; 
let projectiles = [];
let enemyProj = []
let tempObject = null;
let goobyEXP = 0;
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
    constructor(x, y, width, height, mobType, speed, onHitLocationX, onHitLocationY){
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
        this.coolDown = 60;
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
tempObject = new Enemy(8, 24, 8, 8, "left-right", 0.1, 9, 140, 1);
tempObject.previousDirection = 'left';
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
tempObject = new Zone(112, 32, 8, 8, 1, 112, 32);
objectsTileSet1.push(tempObject);
tempObject = new Zone(6, 10, 8, 8, 1, 8, 82);
objectsTileSet1.push(tempObject);
///////////// portals^
tempObject = new Text(105, 10, 0, 0, 'LEVEL: 1');
objectsTileSet1.push(tempObject);
tempObject = new Text(105, 10, 0, 0, 'LEVEL: 1');
objectsTileSet1.push(tempObject);
/////////text display^
let bundle = new MapBundler(objectsTileSet1, tileSet1);
gameMaps.push(bundle);
 //////////////////////////////////////////////////////////zone 1
///////////////////////////////////////////////////////////zone 2
const tileSet2 = [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 9],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 9],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 9],
    [1, 2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 9],
    [1, 0, 2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 9],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9]]
const objectsTileSet2 = [];
tempObject = new Enemy(120, 116, 8, 8, "cannon", 1, 112, 32);
tempObject.health = 100000;
tempObject.previousDirection = 'right'
objectsTileSet2.push(tempObject);
tempObject = new Enemy(120, 124, 8, 8, "cannon", 1, 112, 32);
tempObject.health = 100000;
tempObject.previousDirection = 'right'
objectsTileSet2.push(tempObject);
tempObject = new Enemy(120, 130, 8, 8, "cannon", 1, 112, 32);
tempObject.health = 100000;
tempObject.previousDirection = 'right'
objectsTileSet2.push(tempObject);
tempObject = new Enemy(120, 138, 8, 8, "cannon", 1, 112, 32);
tempObject.health = 100000;
tempObject.previousDirection = 'right'
objectsTileSet2.push(tempObject);
tempObject = new Enemy(80, 82, 8, 8, "cannon", 1, 112, 32);
tempObject.health = 100000;
tempObject.previousDirection = 'right'
objectsTileSet2.push(tempObject);
tempObject = new Enemy(150, 100, 8, 8, "cannon", 1, 112, 32);
tempObject.health = 100000;
tempObject.previousDirection = 'left'
objectsTileSet2.push(tempObject);
tempObject = new Enemy(150, 65, 8, 8, "cannon", 1, 112, 32);
tempObject.health = 100000;
tempObject.previousDirection = 'left'
objectsTileSet2.push(tempObject);
tempObject = new Enemy(10, 34, 8, 8, "cannon", 1, 112, 32);
tempObject.health = 100000;
tempObject.previousDirection = 'right'
objectsTileSet2.push(tempObject);
tempObject = new Zone(9, 144, 8, 8, 1, 112, 32);
objectsTileSet2.push(tempObject);
tempObject = new Zone(8, 120, 8, 8, 2, 12, 12);
objectsTileSet2.push(tempObject);
tempObject = new Text(105, 10, 0, 0, 'LEVEL: 2');
objectsTileSet2.push(tempObject);
tempObject = new Text(105, 10, 0, 0, 'LEVEL: 2');
objectsTileSet2.push(tempObject);
bundle = new MapBundler(objectsTileSet2, tileSet2);
gameMaps.push(bundle);



/////////zone3 bossfight
const tileSet3 = [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]]
const objectsTileSet3 = [];
tempObject = new Enemy(80, 80, 8, 8, "BOSS", 0.1, 9, 140, 1);
objectsTileSet3.push(tempObject);


tempObject = new Text(86, 10, 0, 0, 'FINAL BOSS');
objectsTileSet3.push(tempObject);
tempObject = new Text(86, 10, 0, 0, 'FINAL BOSS');
objectsTileSet3.push(tempObject);

bundle = new MapBundler(objectsTileSet3, tileSet3);
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
                if(!collision(obj[i].x, obj[i].y + 3, map)){
                    obj[i].y += obj[i].speed +1;
        
                }
                switch(obj[i].random){
                case 1:
                    if(!collision(obj[i].x  - obj[i].speed, obj[i].y, map)){
                        obj[i].x -= obj[i].speed* 3;
                        if(collision(obj[i].x - obj[i].speed, obj[i].y, map)){
                            obj[i].random = 2;
                        }
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

                }if(!obj[i].currentAnimation){
                    ctx.drawImage(bitMap, 25, 0, 8, 8, obj[i].x, obj[i].y, 8, 8);

                }else if(obj[i].currentAnimation === 1){
                    ctx.drawImage(bitMap, 32, 0, 8, 7, obj[i].x, obj[i].y, 8, 8);

                }if(obj[i].animationCounter >= 6){
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

                    }if(obj[i].previousDirection === 'down' && !collision(obj[i].x, obj[i].y - 1, map)){
                        obj[i].y -= obj[i].speed + 1;
                        if(collision(obj[i].x, obj[i].y -1, map)){
                    obj[i].previousDirection = 'up';

                        }
                    }                                 
                    
                    ctx.drawImage(jumper, 8, 8.5, 8, 8, obj[i].x, obj[i].y, 8, 8);//need new image

                }if(obj[i].mobType === 'left-right'){                
                    if(obj[i].previousDirection === 'left' && !collision(obj[i].x + 1, obj[i].y, map)){
                        obj[i].x += obj[i].speed + 2;
                            if(collision(obj[i].x + 5, obj[i].y, map)){
                                obj[i].previousDirection = 'right';
                        }

                    }else if(obj[i].previousDirection === 'right' && !collision(obj[i].x - 2, obj[i].y, map)){
                        obj[i].x -= obj[i].speed + 2;
                            if(collision(obj[i].x - 2, obj[i].y, map)){
                            obj[i].previousDirection = 'left';
                        }
                    }
                    ctx.drawImage(jumper, 8, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);//need new image
                }

                if(obj[i].mobType === 'cannon'){
                    enemyProjectileDrawing(enemyProj)
                    if(obj[i].previousDirection ==='left'){
                    obj[i].coolDown--;
                    ctx.drawImage(jumper, 16, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);
                    if(obj[i].coolDown < 0){            
                        let fireBall = new Projectile(obj[i].x - 6, obj[i].y - 4, 8, 8, 2, obj[i].previousDirection, 'cannon');
                        fireBall.onHitLocationX = obj[i].onHitLocationX;
                        fireBall.onHitLocationY = obj[i].onHitLocationY;
                        enemyProj.push(fireBall);
                        obj[i].coolDown = 60;
                    }
                }if(obj[i].previousDirection === 'right'){
                    console.log('right')
                    obj[i].coolDown--;
                    ctx.drawImage(jumper, 24, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);
                    if(obj[i].coolDown < 0){            
                        let fireBall = new Projectile(obj[i].x + 10, obj[i].y - 4, 8, 8, 2, obj[i].previousDirection, 'cannon');
                        fireBall.onHitLocationX = obj[i].onHitLocationX;
                        fireBall.onHitLocationY = obj[i].onHitLocationY;
                        enemyProj.push(fireBall);
                        obj[i].coolDown = 60;
                    }
                }

            }if(obj[i].mobType === 'BOSS'){
                console.log("inboss")
                ctx.drawImage(updated, 64, 80, 64, 64, obj[i].x, obj[i].y, 64, 64);
            }

    }
        if(gameObjects[i].isText){
                ctx.fillStyle = "white";
                ctx.font = "12px Arial";
                ctx.fillText(gameObjects[i].line, gameObjects[i].x, gameObjects[i].y)
        }      
    }
}

const drawMap = level => {//Draws the canvas
    level.forEach((element, i)=> {
        element.forEach((secondElement, j)=>{
            ctx.drawImage(bitMap, secondElement*8, 0, 8, 8, j*8, i*8, 8, 8);

        })
    })
}

const drawProjectiles = (obj) => {//Draws Player Projectiles
    for(let i = 0; i < obj.length; i++){
        obj[i].distance++;
        if(obj[i].direction === 'right' && !collision(obj[i].x, obj[i].y, map) && !projectileCollision(obj[i])){
            obj[i].x+=obj[i].projSpeed;
            ctx.drawImage(jumper, 0, 8, 8, 8, obj[i].x, obj[i].y + 4, 8, 8);

        }if(obj[i].direction === 'left' && !collision(obj[i].x, obj[i].y, map) && !projectileCollision(obj[i])){
            obj[i].x -= obj[i].projSpeed;
            ctx.drawImage(jumper, 0, 8, 8, 8, obj[i].x, obj[i].y + 4, 8, 8);

        }if(collision(obj[i].x, obj[i].y, map) || projectileCollision(obj[i]) || obj[i].distance >= goobyRange){
            obj.shift();
                    
        }            
    }    
}   

const enemyProjectileDrawing= (obj) => {//Draws Enemies Projectiles
    for(let i = 0; i < obj.length; i++){
        if(obj[i].direction === 'right' && !collision(obj[i].x, obj[i].y, map) && !projectileCollision(obj[i])){
            obj[i].x+=obj[i].projSpeed/4;
            ctx.drawImage(jumper, 32, 0, 8, 8, obj[i].x, obj[i].y + 4, 8, 8);   

        }if(obj[i].direction === 'left' && !collision(obj[i].x, obj[i].y, map) && !projectileCollision(obj[i])){
            obj[i].x -= obj[i].projSpeed/4;
            ctx.drawImage(jumper, 32, 0, 8, 8, obj[i].x, obj[i].y + 4, 8, 8);

        }if(obj[i].x>= goobyX && obj[i].x<= goobyX + 4  && obj[i].y >= goobyY -4  && obj[i].y <= goobyY){
            goobyX = obj[i].onHitLocationX;
            goobyY = obj[i].onHitLocationY;
            obj.shift();
            playerHealth --;
        }
        
    }
} 

const projectileCollision = (projectile) => {

        for(let i = 0; i < gameObjects.length; i++){
            if(projectile.x >= gameObjects[i].x - 5 && projectile.x <= gameObjects[i].x + gameObjects[i].width && projectile.y >= gameObjects[i].y - 8 && projectile.y <= gameObjects[i].y + gameObjects[i].height && gameObjects[i].health > 0){
                gameObjects[i].health -= projectile.damage;
                
                if(gameObjects[i].health<= 0){
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
    if(!gameObjects.includes(playerText) && playerHealth > 0){
        gameObjects.push(playerText = new Text(0, 10, 0, 0, `LIVESx ${playerHealth}`));
    }
    for(let k = 0; k < gameObjects.length; k++){             
        if(goobyX >= gameObjects[k].x - 4 && goobyX <= gameObjects[k].x + 4 && goobyY >= gameObjects[k].y -4 && goobyY <= gameObjects[k].y + 4 && gameObjects[k].health > 0){
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
            if(goobyX >= gameObjects[k].x  && goobyX <= gameObjects[k].x + 8 && goobyY >= gameObjects[k].y  && goobyY <= gameObjects[k].y + 8){
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
        if(fireDirection === 'right'){
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
    }if(collision(goobyX, goobyY - 1.5, map)){
        airBourne = false;
        

   
    }if(airBourne){//going up
        goobyY -= jump * 2;
        setTimeout(()=>{
            airBourne = false;
        }, 350);//Jumping time in air
    
    }if(!collision(goobyX, goobyY+2, map)){
        canJump = false;

    }if(collision(goobyX, goobyY + 3, map) && !canJump){
        goobyY-=1.5;
        canJump = true;
        airBourne = false;
        currentAnimation = 0;

    }if(!airBourne && !collision(goobyX, goobyY + 2, map)){//Falling
        goobyY += jump * 1.5;

    }if(rightPressed){
        if(!collision(goobyX + 2, goobyY, map)){
        goobyX += walk;
        }

    }if(leftPressed){
        if(!collision(goobyX - 1, goobyY, map)){
            goobyX -= walk;
        }

    }if(rightPressed){
        if(currentAnimation === 0){
            ctx.drawImage(updatedRight, 200, 0, 62, 42, goobyX, goobyY, 8, 8);

        }else if(currentAnimation === 1){
            ctx.drawImage(updatedRight, 136, 0, 50, 40, goobyX, goobyY, 8, 8);

        }else if( currentAnimation === 2){
            ctx.drawImage(updatedRight, 74, 0, 50, 40, goobyX, goobyY, 8, 8);

            
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
            ctx.drawImage(updated, 0, 0, 50, 40, goobyX, goobyY, 8, 8);
        }else if(currentAnimation === 1){
            ctx.drawImage(updated, 62, 0, 50, 40, goobyX, goobyY, 8, 8);
        }else if( currentAnimation === 2){
            ctx.drawImage(updated, 128, 0, 50, 40, goobyX, goobyY, 8, 8);
            
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
                ctx.drawImage(updatedRight, 200, 42, 50, 40, goobyX+1, goobyY, 8, 8);
            break;
            case "left":
                ctx.drawImage(updated, 0, 42, 50, 40, goobyX, goobyY, 8, 8);
                break;
        }   

    }else if(!rightPressed && !leftPressed) {
        switch(lastButtonPressed){
            case "right":
            ctx.drawImage(updatedRight, 200, 0, 50, 40, goobyX+1, goobyY, 8, 8);
            break;
            case "left":
                ctx.drawImage(updated, 0, 0, 50, 40, goobyX, goobyY, 8, 8);
                break;
        }
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////End Character Drawing






        //Player input functions/////////////////////////////////////////////////////////////
const keyDownHandler = e => {
    if(e.keyCode === 65){//left
        leftPressed = true;
        fireDirection = 'left'
        lastButtonPressed = "left";

    }else if(e.keyCode === 68){//right
        rightPressed = true;
        fireDirection = 'right'
        lastButtonPressed = "right";

    }else if(e.keyCode === 87){//up
        upPressed = true;
        fireDirection = 'up'

    }else if(e.keyCode === 83){//down
        downPressed = true;
        fireDirection = 'down'

    }else if(e.keyCode === 32 && !airBourne && canJump){//spacebar
        canJump = false;
        airBourne = true;
        spaceBarPressed = true;
       

    }else if(e.keyCode === 16){//leftshift
        shiftPressed = true;
        currentAnimation = 3
    }
}

const keyUpHandler = e => {
    if(e.keyCode === 65){//left
        leftPressed = false;
        currentAnimation = 0;

    }else if(e.keyCode === 68){//right
        rightPressed = false;
        currentAnimation = 0;
        
    }else if(e.keyCode === 87){//up
        upPressed = false; 

    }else if(e.keyCode === 83){//down
        downPressed = false;  
        currentAnimation = 0;

    }else if(e.keyCode === 32){//spacebar
        spaceBarPressed = false;
    }else if(e.keyCode === 16){//leftshift
        shiftPressed = false;
    }
}
        /////DeathCheck
const isDead = () => {
    if(!playerHealth){
        return true;

    }return false;
}
//////////////////////////////////////////////////////////////////////////////////
const collision = (x, y, map) => {
    for(let i = 0; i < map.length; i++){
        for(let j = 0; j < map[i].length; j++){                    
            if(map[i][j] != 0 && map[i][j] != 2){                  
                 if(x <= j*8+6 && x >= j*8-4 && y <= i*8+4 && y >= i*8-4){
                    return true;
                }
            }                 
        }

    }return false;
}

setInterval(() => {//starts cd timer for stuns/invulnerable time to prevent double hits on player
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
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]]//Map for death screen

const draw = () => {
    setTimeout(()=> {
    ctx.fillStyle = "rgb(20,20,20)";
    ctx.fillRect(0,0,96,96);
    drawMap(map);
    drawGooby();
    objectCollision();
    drawProjectiles(projectiles);
    drawEnemy(gameObjects);
    if(isDead()){//death
        for(let i = 0; i < gameObjects.length; i++){
            gameObjects.shift();
        };
        map = deathArray;
        goobyX = -100;
        goobyY = 0;
        let deathText = new Text(50, 60, 0, 0, "YOU DIED!")
        gameObjects.push(deathText);
        deathText = new Text(50, 50, 0, 0, "YOU DIED!")
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
    */