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
let lastButtonPressed = 'up';
let spaceBarPressed = false;
let goobyX = 8;
let goobyY = 80;
let projX = goobyX;
let projY = goobyY;
let currentAnimation = 0;
let animationCounter = 0;
let cdTimer = 0;
let cdDefault = 60;
let buffs = 0;
let gameMaps = []; 
let projectiles = [];
let tempObject = null; 

class DefaultObject {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
class Projectile extends DefaultObject{
    constructor(x, y, width, height, isProjectile, projSpeed, direction){
        super(x, y, width, height);
        this.isProjectile = isProjectile;
        this.projSpeed = projSpeed;
        this.direction = direction;
    }
}
class Enemy extends DefaultObject{
    constructor(x, y, width, height, mobType, firesProjectiles){
        super(x, y, width, height);
        this.mobType = mobType;
        this.fireProjectiles = firesProjectiles;
        this.speed = 1;
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
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
const objectsTileSet1 = [];
tempObject = new Enemy(40, 40, 8, 8, 'blueSlime', false);
objectsTileSet1.push(tempObject);

let bundle = new MapBundler(objectsTileSet1, tileSet1);
gameMaps.push(bundle);
 






let map = gameMaps[0].map;
gameObjects = gameMaps[0].gameObject;


const drawEnemy = obj => {
    for(let i = 0; i < obj.length; i++){
        console.log(obj[i].mobType);
    if(obj[i].mobType === 'blueSlime'){
        console.log(obj[i]);
        ctx.drawImage(bitMap, 24, 0, 8, 8, obj[i].x, obj[i].y, 8, 8);
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
            if(obj[i].direction === 'up' && !collision(obj[i].x, obj[i].y, tileSet1)){               
                obj[i].y -= obj[i].projSpeed;
                ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);         
            }
            if(obj[i].direction === 'right' && !collision(obj[i].x, obj[i].y, tileSet1)){
                obj[i].x+=obj[i].projSpeed;
                ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);
            }
            if(obj[i].direction === 'down' && !collision(obj[i].x, obj[i].y, tileSet1)){
                obj[i].y += obj[i].projSpeed;
                ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);
            }
            if(obj[i].direction === 'left' && !collision(obj[i].x, obj[i].y, tileSet1)){
                obj[i].x -= obj[i].projSpeed;
                ctx.drawImage(bitMap, 48, 8, 8, 8, obj[i].x, obj[i].y, 8, 8);    
        }
    }
   
}//learn this
const drawGooby = () => {
    let walk = 1;
    animationCounter++;
    cdTimer++;
    if(spaceBarPressed && cdTimer > cdDefault-buffs){//and cdTimer > number//fireBall = true;
        if(lastButtonPressed === 'up'){
            ctx.drawImage(bitMap, 8, 8, 8, 8, goobyX, goobyY, 8, 8)
            let fireBall = new Projectile(goobyX, goobyY-4, 8, 8, true, 3, 'up');
            projectiles.push(fireBall);
            spaceBarPressed = false;
           
            } 
        else if(lastButtonPressed === 'right'){
            ctx.drawImage(bitMap, 16, 8, 8, 8, goobyX, goobyY, 8, 8)
            let fireBall = new Projectile(goobyX+4, goobyY, 8, 8, true, 3, 'right');
            projectiles.push(fireBall);
            spaceBarPressed = false;
        } 
        else if(lastButtonPressed === 'down'){
            ctx.drawImage(bitMap, 0, 8, 8, 8, goobyX, goobyY, 8, 8)
            let fireBall = new Projectile(goobyX, goobyY+4, 8, 8, true, 3, 'down');
            projectiles.push(fireBall);
            spaceBarPressed = false;
        } 
        else if(lastButtonPressed === 'left'){
            ctx.drawImage(bitMap, 24, 8, 8, 8, goobyX, goobyY, 8, 8)
            let fireBall = new Projectile(goobyX-4, goobyY, 8, 8, true, 3, 'left');
            projectiles.push(fireBall);
            spaceBarPressed = false;
        }
        setTimeout(() => {cdTimer = 0;
                        },1000/fps );
    } else if(upPressed && !collision(goobyX, goobyY - walk, tileSet1)){
        goobyY -= walk;
        if(currentAnimation === 0){
            ctx.drawImage(gooby, 0, 0, 8, 8, goobyX, goobyY, 8, 8);
        } else if(currentAnimation === 1){
            ctx.drawImage(gooby, 8, 0, 8, 8, goobyX, goobyY, 8, 8);
        }
        if(animationCounter >= 6){
            currentAnimation++;
            animationCounter = 0;
            if(currentAnimation > 1){
                currentAnimation = 0;
            }
        }
    } else if(downPressed && !collision(goobyX, goobyY + walk, tileSet1)){
        goobyY += walk;
        if(currentAnimation === 0){
            ctx.drawImage(gooby, 32, 0, 8, 8, goobyX, goobyY, 8, 8);
        }else if(currentAnimation === 1){
            ctx.drawImage(gooby, 40, 0, 8, 8, goobyX, goobyY, 8, 8);
        }
        if(animationCounter >= 6){
            currentAnimation++;
            animationCounter = 0;
            if(currentAnimation > 1){
                currentAnimation = 0;
            }
        }
    } else if(rightPressed && !collision(goobyX + walk, goobyY, tileSet1)){
        goobyX += walk;
        if(currentAnimation === 0){
            ctx.drawImage(gooby, 16, 0, 8, 8, goobyX, goobyY, 8, 8);
        }else if(currentAnimation === 1){
            ctx.drawImage(gooby, 22, 0, 8, 8, goobyX, goobyY, 8, 8);
        }
        if(animationCounter >= 6){
            currentAnimation++;
            animationCounter = 0;
            if(currentAnimation > 1){
                currentAnimation = 0;
            }
        }
     } else if(leftPressed && !collision(goobyX - walk, goobyY, tileSet1)){
        goobyX -= walk;
        if(currentAnimation === 0){
            ctx.drawImage(gooby, 50, 0, 8, 8, goobyX, goobyY, 8, 8);
        }else if(currentAnimation === 1){
            ctx.drawImage(gooby, 58, 0, 8, 8, goobyX, goobyY, 8, 8);
        }
        if(animationCounter >= 6){
            currentAnimation++;
            animationCounter = 0;
            if(currentAnimation > 1){
                currentAnimation = 0;
            }
        }
     }  else {
        switch(lastButtonPressed){
            case 'up':
                ctx.drawImage(gooby, 0, 0, 8, 8, goobyX, goobyY, 8, 8);
                break;
            case 'down':
                ctx.drawImage(gooby, 32, 0, 8, 8, goobyX, goobyY, 8, 8);
                break;
            case 'left':
                ctx.drawImage(gooby, 50, 0, 8, 8, goobyX, goobyY, 8, 8);
                break;
            case 'right':
                ctx.drawImage(gooby, 16, 0, 8, 8, goobyX, goobyY, 8, 8);
                break;
        }
    }

}

        //Player movement functions
        const keyDownHandler = e => {//key-pressed
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
            } else if(e.keyCode === 32){//spacebar
                spaceBarPressed = true;
            }
        }

        const keyUpHandler = e => {//key-up (stopped pressing)
            if(e.keyCode === 65){//left
                leftPressed = false;
            } else if(e.keyCode === 68){//right
                rightPressed = false;
            } else if(e.keyCode === 87){//up
                upPressed = false;         
            } else if(e.keyCode === 83){//down
                downPressed = false;  
            } else if(e.keyCode === 32){//spacebar
                spaceBarPressed = false;
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

 
const draw = () => {
    setTimeout(()=> {
    ctx.fillStyle = "rgb(20,20,20)";
    ctx.fillRect(0,0,96,96);
    drawMap(map);
    drawGooby();
    drawProjectiles(projectiles);
    drawEnemy(gameObjects);
    requestAnimationFrame(draw);
    },1000 / fps);
}
draw();
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
