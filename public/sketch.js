
let socket = io();
let r,g,b;
let paddleL, paddleR, ball, topWall, botWall;
let mouse;
let speed = 10;
let gameCounter;
let scoreL = 0;
let scoreR = 0;

socket.on('connect', ()=> {
    console.log('connected');
});

// socket.on('newBall', (data)=> {
//     // console.log(data);
// });

function setup() {
    createCanvas(700, 500);
    background('black');

    r = random(255);
    g = random(255);
    b = random(255);

    paddleL = createSprite(50, height/2, 10, 100);
    paddleL.immovable = true;

    paddleR = createSprite(width-50, height/2, 10, 100);
    paddleR.immovable = true;

    topWall = createSprite(width/2, -50/2, width, 50);
    topWall.immovable = true;

    botWall = createSprite(width/2, height+50/2, width, 50);
    botWall.immovable = true;

    ball = createSprite(width/2, height/2, 20, 20);
    ball.maxSpeed = speed;
    ball.setSpeed(speed, -180);
}

function draw() {
    noStroke();
    // background('black');

    // gameCounter = 0;

    // if (gameCounter == 0) {
    //     gameIntro();
    // } else if (gameCounter == 1) {
    //     game();
    // }
    game();
}

// function gameIntro() {
//     textAlign(CENTER);
//     fill('white');
//     textSize(50);
//     text("PONG", width/2, 150);
//     textSize(30);
//     text("Ready?", width/2, height/2);
//     let ybutton = createButton('Yes');
//     ybutton.position(width/3, 350);
//     ybutton.mousePressed(startGame);

//     let nbutton = createButton('No');
//     nbutton.position(2*width/3, 350);
// }

// function startGame() {
//     gameCounter = 1;
// }

function game() {
    background('black');
    //sets the paddle original positions and determine that they are followed by the user's mouse
    paddleL.position.y = constrain(mouseY, paddleL.height/2, height-paddleL.height/2);
    paddleR.position.y = constrain(mouseY, paddleR.height/2, height-paddleR.height/2);

    //has the ball bounce off the top and bottom of the canvas
    ball.bounce(topWall);
    ball.bounce(botWall);

    let changePos;


    //sets boundaries if ball collides with the paddles then it boucnes and changes direction
    if (ball.bounce(paddleL)) {
        changePos = (ball.position.y - paddleL.position.y)/3;
        ball.setSpeed(speed, ball.getDirection()+changePos);
        scoreL +=1;
        console.log(scoreL, scoreR);
    }

    if (ball.bounce(paddleR)) {
        changePos = (ball.position.y - paddleR.position.y)/3;
        ball.setSpeed(speed, ball.getDirection()-changePos);
        scoreR +=1;
        console.log(scoreL, scoreR);
    }

    //if ball hits the wall behind the paddles, the ball resets and the game starts over
    if (ball.position.x<0) {
        ball.position.x = width/2;
        ball.position.y = height/2;
        ball.setSpeed(speed, 0);
        scoreL = 0;
    }

    if (ball.position.x>width) {
        ball.position.x = width/2;
        ball.position.y = height/2;
        ball.setSpeed(speed, 180);
        scoreR = 0;
    }

    drawSprites();

    // let newMousePos = {
    //     y: mouseY
    // }

    // socket.emit('data', newMousePos);
}

// class Ball {
//     constructor(x,y,col) {
//         this.x = x;
//         this.y = y;
//         this.width = 40;
//         this.height = 40;
//         this.col = col;
//     }

//     display() {
//         fill(this.col);
//         ellipse(this.x, this.y, this.width, this.height);
//     }

//     newBall() {
//         let newBallInfo = {
//             x: random(50,windowWidth),
//             y: random(50, windowHeight),
//             width: this.width,
//             height: this.height,
//             red: r,
//             green: g,
//             blue: b, 
//             mousePos: mouse
//         };

//         socket.emit('data', newBallInfo);
//     }
// }