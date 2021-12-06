let socket = io();
let r, g, b;
let paddleL, paddleR, ball, topWall, botWall;
let speed = 10;
let score = 0;
let chatBox = document.querySelector("#chatBoxMessages");
let userName = document.querySelector("#chatUserName");
let msg = document.querySelector("#chatInputMsg");
let submitBtn = document.querySelector("#submitBtn");
let newCanvas = document.querySelector("#canvas");

//------------------------------------------------------
// code for sockets
socket.on('connect', () => {
    console.log('connected');
});

socket.on('newBall', (data) => {
    console.log(data);
    game(data);
});

//socket for chat function
socket.on('msg', (data) => {
    let newMessage = data.name + ":" + data.message;
    let msgElement = document.createElement('p');
    msgElement.innerHTML = newMessage;

    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

//------------------------------------------------------
//code for the game
function setup() {
    let name = prompt("Please enter your user name", "Name");
    alert("Hello " + name + ". Welcome to Pong! \n\nThe rules of the game are simple. Use the paddle to stop the ball from hitting the wall on the right and left. Use your mouse to control both paddles. The ball will start moving automatically after you click ok, so make sure that you are ready to play once you click 'ok'. \n\nFeel free to pause the game at anytime to chat with others who are also playing the game or you can join a room with another player to play privately.\n\n Enjoy!");
    
    createCanvas(700, 500);

    background('black');

    r = random(255);
    g = random(255);
    b = random(255);

    paddleL = createSprite(50, height / 2, 10, 100);
    paddleL.immovable = true;

    paddleR = createSprite(width - 50, height / 2, 10, 100);
    paddleR.immovable = true;

    topWall = createSprite(width / 2, -50 / 2, width, 50);
    topWall.immovable = true;

    botWall = createSprite(width / 2, height + 50 / 2, width, 50);
    botWall.immovable = true;

    ball = createSprite(width / 2, height / 2, 20, 20);
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

    fill('white');
    textSize(30);
    text("Score: " + score, 20, 35);
    strokeWeight(10);
    stroke('white');
    line(width / 2, 0, width / 2, height);

    let pause = createButton("Pause");
    pause.position(120, 135);
    pause.addEventListener('click', ()=> {
        console.log('pause is clicked');
    });

    let leftPaddle = mouseY;
    let rightPaddle = mouseY;

    //sets the paddle original positions and determine that they are followed by the user's mouse
    paddleL.position.y = constrain(leftPaddle, paddleL.height / 2, height - paddleL.height / 2);
    paddleR.position.y = constrain(rightPaddle, paddleR.height / 2, height - paddleR.height / 2);

    //has the ball bounce off the top and bottom of the canvas
    ball.bounce(topWall);
    ball.bounce(botWall);

    let changePos;

    //sets boundaries if ball collides with the paddles then it boucnes and changes direction
    if (ball.bounce(paddleL)) {
        changePos = (ball.position.y - paddleL.position.y) / 3;
        ball.setSpeed(speed, ball.getDirection() + changePos);
        score += 1;
        // console.log(scoreL, scoreR);
    }

    if (ball.bounce(paddleR)) {
        changePos = (ball.position.y - paddleR.position.y) / 3;
        ball.setSpeed(speed, ball.getDirection() - changePos);
        score += 1;
        // console.log(scoreL, scoreR);
    }

    //if ball hits the wall behind the paddles, the ball resets and the game starts over
    if (ball.position.x < 0) {
        ball.position.x = width / 2;
        ball.position.y = height / 2;
        ball.setSpeed(speed, 0)
        score = 0;
    }

    if (ball.position.x > width) {
        ball.position.x = width / 2;
        ball.position.y = height / 2;
        ball.setSpeed(speed, 180);
        score = 0;
    }

    drawSprites();
}

function pause() {
    console.log('pause clicked');
    // ball.visible = false;
}

//-----------------------------------------------------
//code for the chat box function
submitBtn.addEventListener('click', ()=> {
    let inputName = userName.value;
    let inputMsg = msg.value;
    let messageObject = {
        "name": inputName,
        "message": inputMsg
    };

    socket.emit('msg', messageObject);
});

