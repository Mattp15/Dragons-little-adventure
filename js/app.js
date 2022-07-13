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
let lastButtonPressed = 'down';
let spaceBarPressed = false;
let goobyX = 88;
let goobyY = 8;
let animationCounter = 0;
const gameObjects = [];
const maps = [];
let gameMap = null;
const tileSet1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]


const drawMap = level => {
    for(let i = 0; i < level.length; i++){
        for(let j = 0; j < level[i].length; j++){
            ctx.drawImage(bitMap, level[i][j]*8, 0, 8, 8, i*8, j*8, 8, 8);
        }
    }
}

const drawGooby = () => {
    let walk = 2;
    animationCounter++;

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
            } else if(e.keyCode === 32){
                spaceBarPressed = true;
            }
        }

        const keyUpHandler = e => {//key-up (stopped pressing)
            if(e.keyCode === 37){//left
                leftPressed = false;
            } else if(e.keyCode === 39){//right
                rightPressed = false;
            } else if(e.keyCode === 38){//up
                upPressed = false;         
            } else if(e.keyCode === 40){//down
                downPressed = false;  
            } else if(e.keyCode === 32){
                spaceBarPressed = false;
            }
        }

const draw = () => {
    setTimeout(() => {
        requestAnimationFrame(draw);
        ctx.fillStyle = "rgb(20,20,20)";
        ctx.fillRect(0,0,96,96);
        drawMap(tileSet1);
    }),1000/fps;
}
draw();
// document.addEventListener("keydown", keyDownHandler, false);
// document.addEventListener('keyup', keyUpHandler, false);
