var fps = 60;
var gameStarted = false;
var score = 0;
var pause = false;
var currentLevelNumber = 0;
var currentLevelObject ;
var startingBricksPositionX = 20;
var startingBricksPositionY = 40;
var canvas = document.createElement("canvas");
initialiseCanvas();
var context=canvas.getContext("2d");
initialiseCanvasContext();

var level1 ={
    arr : [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,3,1,0],
        [1,2,3,4,5,6,7],
    ],
    nrBricks : 0
};

var levels =[
    level1
];

var brick = {
  width : 60,
  height : 20,
};


var colorsBrick = {
  1 : "blue",
  2 : "purple",
  3 : "green",
  4 : "red",
  5 : "green",
  6 : "orange",
  7 : "violet",
  8 : "StateBlue",
  9 : "gray",
};

var paddle = new function(){
  this.width = 60,
  this.height = 20,
  this.posX = canvas.width/2,//center
  this.posY = canvas.height - 40 //upper coordinate(yMin)
};

Object.defineProperty(paddle, "boundingBox", {
    get: function() {
        return new BoundingBox(this.posX-this.width/2,this.posY,this.posX+this.width/2,this.posY+this.height);
    }
});

var ball = new function(){
    this.diameter = 20,
    this.posX = paddle.posX,
    this.posY = paddle.posY-11,
    this.direction = 135,
    this.speed = 5
}

Object.defineProperty(ball, "boundingBox", {
    get: function() {
        return new BoundingBox(this.posX-this.diameter/2-2,this.posY-this.diameter/2-2,this.posX+this.diameter/2+4,this.posY+this.diameter/2+4);
    }
});

function BoundingBox(xMin,yMin, xMax, yMax){
  this.xMin=xMin;
  this.yMin=yMin;
  this.xMax=xMax;
  this.yMax=yMax;
}


window.addEventListener("load", startGame);
window.onload = function() {
  document.body.insertBefore(canvas, document.body.childNodes[0]);
  canvas.onmousemove=function(evt){
    var mousePos = getMousePos(evt);
    movePaddle(mousePos.x);
  };
};

canvas.onmousedown = function(e){
    if(gameStarted === false){
        gameStarted=true;
        updateGameplay();
    }
}
window.onkeyup = function(e){
    if(e.key === "p") {
        pause = !pause;
        if(pause)
            writeMessage(canvas.width/2-60, canvas.height/2, "GAME PAUSED");
        else  writeMessage(canvas.width/2-60, canvas.height/2, "");
    }
}

function startGame() {
    chooseLevel();
    writeMessage(20,20,"Score: "+score);
    drawPaddle();
    drawBall();
    drawSceneBricks();
}

function initialiseCanvas(){
  canvas.width = 480;
  canvas.height = 600;
}

function initialiseCanvasContext(){
  context.fillStyle="#FFFFFF";
}


function chooseLevel(){
    currentLevelObject = levels[currentLevelNumber];
    //count number of bricks
    var arr = currentLevelObject.arr;
    var nrBricks = currentLevelObject.nrBricks;

    for (var i=0, len=arr.length; i<len; i++)
        for (var j=0, len2=arr[i].length; j<len2; j++)
            if(arr[i][j]>0)
                nrBricks ++;

    currentLevelObject.nrBricks = nrBricks;
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function writeMessage(x,y,message) {
    context.clearRect(x, y-25, 200, 25);
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, x, y,200);
}

function drawBall(){
    context.fillStyle = "rgb(51,51,0)";
    context.beginPath();
    context.arc(ball.posX,ball.posY,ball.diameter/2,0,2*Math.PI);
    context.fill();
}

function drawPaddle(){
    context.fillStyle = "rgb(0,51,0)";
    context.fillRect(paddle.posX-paddle.width/2, paddle.posY, paddle.width, paddle.height);
}

function clearBall(){
    context.clearRect(ball.posX-ball.diameter/2-1, ball.posY-ball.diameter/2-1, ball.diameter+2, ball.diameter+2);
}

function clearSceneBricks(){
    context.clearRect(0, 0, canvas.width, canvas.height/2);
}

function drawSceneBricks(){
  var arr = currentLevelObject.arr;
  var startingPositionX = startingBricksPositionX;
  var startingPositionY = startingBricksPositionY;
  for (var i=0, len=arr.length; i<len; i++) {
    for (var j=0, len2=arr[i].length; j<len2; j++) {
        if(arr[i][j]!==0){
          context.beginPath();
          context.fillStyle = colorsBrick[arr[i][j]];
          context.fillRect(startingPositionX+j*brick.width,startingPositionY+i*brick.height , brick.width, brick.height);
          context.rect(startingPositionX+j*brick.width,startingPositionY+i*brick.height , brick.width, brick.height);
          context.stroke();
          context.closePath();
        }
      }
    }
}

function updateGameplay(){
  ball.speed = ball.speed * (60/fps);
  var refresh=1000/fps;
  setInterval(function(){
      if(!pause) {
          writeMessage(20,20,"Score: "+score);
          clearBall();
          moveBall();
          drawBall();
      }
      }, refresh);
}


function movePaddle(x){
    if(!pause){
        context.clearRect(paddle.posX-paddle.width/2, paddle.posY, paddle.width, paddle.height);
        paddle.posX = x;
        drawPaddle();
    }
}

function moveBall(){
  var x = ball.posX, y = ball.posY;
  var speed = ball.speed;
  var direction = ball.direction;

  switch(direction){
    case 0:x+=speed; break;
    case 45:x+=speed;y-=speed; break;
    case 90:y-=speed; break;
    case 135:x-=speed;y-=speed; break;
    case 180:x-=speed; break;
    case 225:x-=speed;y+=speed; break;
    case 270:y+=speed; break;
    case 315:x+=speed;y+=speed; break;
  }
  ball.posX = x;
  ball.posY = y;

  //check if ball is outside canvas
  calcDirOnWallCollision();

  //check if ball collides with paddle
  calcDirOnPaddleCollision();

  checkIfCollisionWithBrick();
}

function checkIfCollisionWithBrick(){
    //check if ball collides with a brick
    //first calculate the position of the ball corresponding to the 2d array where the
    //bricks are stored
    var arr = currentLevelObject.arr;
    var x = ball.posX, y = ball.posY;
    var ballInArrayCoordX = (x - startingBricksPositionX)/brick.width;
    var ballInArrayCoordY = (y - startingBricksPositionY)/brick.height;
    var positionArrayX = Math.floor(ballInArrayCoordX);
    var positionArrayY = Math.floor(ballInArrayCoordY);
    if(positionArrayX >=0 && positionArrayX < arr[1].length)
        if(positionArrayY >=0 && positionArrayY < arr.length)
            if(arr[positionArrayY][positionArrayX]>0){
                //increment score(score depends on brick type)
                score += arr[positionArrayY][positionArrayX];
                //decrement brick number
                currentLevelObject.nrBricks--;
                //collision
                arr[positionArrayY][positionArrayX] = 0;
                clearSceneBricks();
                drawSceneBricks();
                //calculate new position for the ball
                calcDirOnBrickCollision(ballInArrayCoordX,ballInArrayCoordY, positionArrayY,positionArrayX);
                if(currentLevelObject.nrBricks == 0){
                    pause = true;
                    writeMessage(canvas.width/2-60, canvas.height/2, "Level Cleared");
                }
            }
}

function calcDirOnWallCollision() {
    var x = ball.posX, y = ball.posY;
    var direction = ball.direction;

    if(x>canvas.width){
        x = canvas.width;
        if(direction === 315) direction = 225;
        else if(direction === 45) direction = 135;
    }

    if(x<0){
        x = 0;
        if(direction === 225) direction = 315;
        else if(direction === 135) direction = 45;
    }

    if(y>canvas.height){
        //game over
        score = 0;
        pause = true;
        writeMessage(canvas.width/2-60, canvas.height/2, "Game Over");
    }

    if(y<0){
        if(direction === 135) direction = 225;
        else if(direction === 45) direction = 315;
        y=0;
    }

    ball.posX = x;
    ball.posY = y;
    ball.direction = direction;
}


function calcDirOnPaddleCollision(){
    var x = ball.posX, y = ball.posY;
    var direction = ball.direction;
    if(onCollide(ball.boundingBox, paddle.boundingBox) === true){
        if(direction === 225) direction = 135;
        else if(direction === 315) direction = 45;
        //move ball outside of the paddle
        y = paddle.posY - 11;
        //redraw paddle
        movePaddle(paddle.posX);
    }
    ball.posX = x;
    ball.posY = y;
    ball.direction = direction;
}

function calcDirOnBrickCollision(x, y, brickPosY, brickPosX) {
    var direction = ball.direction;
    if((direction === 45 || direction === 315) && x < brickPosX)
        calcDirLeftSideBrick();
    else if((direction === 135 || direction === 225) && x > brickPosX)
        calcDirRightSideBrick();
    else if(direction === 225 || direction === 315)
        calcDirUpperSideBrick();
    else if(direction === 135 || direction === 45)
        calcDirLowerSideBrick();
}


function calcDirLeftSideBrick(){
    // 45 -> 135
    // 315 -> 225
    if(ball.direction === 45) ball.direction = 135;
    else if(ball.direction === 315) ball.direction = 225;
}

function calcDirRightSideBrick(){
    // 135 -> 45
    // 225 -> 315
    if(ball.direction === 135) ball.direction = 45;
    else if(ball.direction === 225) ball.direction = 315;
}

function calcDirUpperSideBrick(){
    // 225 -> 135
    // 315 -> 45
    if(ball.direction === 225) ball.direction = 135;
    else if(ball.direction === 315) ball.direction = 45;
}

function calcDirLowerSideBrick(){
    // 135 -> 225
    // 45 -> 315
    if(ball.direction === 135) ball.direction = 225;
    else if(ball.direction === 45) ball.direction = 315;
}

function onCollide(bbox1, bbox2){
    if(pointInBoundingBox(bbox1.xMin,bbox1.yMin,bbox2)===true)
        return true;
    if(pointInBoundingBox(bbox1.xMin,bbox1.yMax,bbox2)===true)
        return true;
    if(pointInBoundingBox(bbox1.xMax,bbox1.yMin,bbox2)===true)
        return true;
    if(pointInBoundingBox(bbox1.xMax,bbox1.yMax,bbox2)===true)
        return true;
    return false;
}

function pointInBoundingBox(x,y,bbox){
    if(x>=bbox.xMin && x<=bbox.xMax && y>=bbox.yMin && y <= bbox.yMax)
        return true;
    return false;
}