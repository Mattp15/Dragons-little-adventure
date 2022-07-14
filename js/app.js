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
const gameObjects = [];
const maps = [];
let gameMap = null;
const tileSet1 = [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],//12
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
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]//12
]

class DefaultObject {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
class Projectile extends DefaultObject{
    constructor(x, y, width, height, isProjectile, projSpeed){
        super(x, y, width, height);
        this.isProjectile = isProjectile;
        this.projSpeed = projSpeed;
    }
}
const fireBall = new Projectile(goobyX, goobyY, 8, 8, true, 1);

const drawMap = level => {
    for(let i = 0; i < level.length; i++){
        for(let j = 0; j < level[i].length; j++){
            ctx.drawImage(bitMap, level[i][j]*8, 0, 8, 8, j*8, i*8, 8, 8);
        }
    }
}

const drawGooby = () => {
    let walk = 1;
    animationCounter++;
    cdTimer++;
    if(spaceBarPressed && cdTimer > cdDefault-buffs){//and cdTimer > number//fireBall = true;
        if(lastButtonPressed === 'up'){
            ctx.drawImage(bitMap, 8, 8, 8, 8, goobyX, goobyY, 8, 8)
            if(currentAnimation === 0){
            ctx.drawImage(bitMap, 48, 8, 8, 8, goobyX, (goobyY-8), 8, 8);
            } else if(currentAnimation === 1){
            ctx.drawImage(bitMap, 56, 8, 8, 8, goobyX, (goobyY-8), 8, 8);
            }
            if(animationCounter >= 6){
                currentAnimation++;
                animationCounter = 0;
                if(currentAnimation > 1){
                    currentAnimation = 0;
                }
            }
        } 
        else if(lastButtonPressed === 'right'){
            ctx.drawImage(bitMap, 16, 8, 8, 8, goobyX, goobyY, 8, 8)
            if(currentAnimation === 0){
                ctx.drawImage(bitMap, 56, 0, 8, 8, goobyX + 8, goobyY, 8, 8);
            } else if(currentAnimation === 1){
                    ctx.drawImage(bitMap, 64, 0, 8, 8, goobyX + 8, goobyY, 8, 8);
            }
            if(animationCounter >= 6){
                    currentAnimation++;
                    animationCounter = 0;
                if(currentAnimation > 1){
                        currentAnimation = 0;
                 }
            }
        } 
        else if(lastButtonPressed === 'down'){
            ctx.drawImage(bitMap, 0, 8, 8, 8, goobyX, goobyY, 8, 8)
            if(currentAnimation === 0){
                ctx.drawImage(bitMap, 32, 8, 8, 8, goobyX, goobyY + 8, 8, 8);
            } else if(currentAnimation === 1){
                    ctx.drawImage(bitMap, 40, 8, 8, 8, goobyX, goobyY + 8, 8, 8);
            }
            if(animationCounter >= 6){
                    currentAnimation++;
                    animationCounter = 0;
                if(currentAnimation > 1){
                        currentAnimation = 0;
                }
            }
        } 
        else if(lastButtonPressed === 'left'){
            ctx.drawImage(bitMap, 24, 8, 8, 8, goobyX, goobyY, 8, 8)
            if(currentAnimation === 0){
                ctx.drawImage(bitMap, 64, 8, 8, 8, goobyX-8, goobyY, 8, 8)
            } else if(currentAnimation === 1){
            ctx.drawImage(bitMap, 72, 8, 8, 8, goobyX-8, goobyY, 8, 8)
            }
            if(animationCounter >= 6){
                currentAnimation++;
                animationCounter = 0;
                if(currentAnimation > 1){
                    currentAnimation = 0;
                }
            }
        }
        setTimeout(() => {spaceBarPressed = false;
                          cdTimer = 0;
                        }, fps);
    } else if(upPressed && !goobyCollision(goobyX, goobyY - walk, tileSet1)){
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
    } else if(downPressed && !goobyCollision(goobyX, goobyY + walk, tileSet1)){
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
    } else if(rightPressed && !goobyCollision(goobyX + walk, goobyY, tileSet1)){
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
     } else if(leftPressed && !goobyCollision(goobyX - walk, goobyY, tileSet1)){
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

        const goobyCollision = (x, y, map) => {
            for(let i = 0; i < map.length; i++){
                for(let j = 0; j < map[i].length; j++){
                    if(map[i][j] != 0){
                        console.log(x, y, "x, y");                   
                         if(x <= j*8+6 && x >= j*8-4 && y <= i*8+4 && y >= i*8-4){//x = 8  to 88
                            return true;
                        }
                    }
                }
            }
            return false;
        }

const draw = () => {

    ctx.fillStyle = "rgb(20,20,20)";
    ctx.fillRect(0,0,96,96);
    drawMap(tileSet1);
    drawGooby();
    requestAnimationFrame(draw);
}
draw();
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
