let socket = io('/private');
let r, g, b;
let paddleL, paddleR, ball, topWall, botWall;
let speed = 10;
let score = 0;
let chatBox = document.querySelector("#chatBoxMessages");
let msg = document.querySelector("#chatInputMsg");
let submitBtn = document.querySelector("#submitBtn");
let start = document.querySelector("#start");
let newUserName, roomName;

//------------------------------------------------------
// code for sockets
window.addEventListener('load', ()=> {
    roomName = window.prompt('Enter the room name');
    socket.emit('room-name', {room: roomName});
});

socket.on('connect', () => {
    console.log('connected');
});

socket.on('newBall', (data) => {
    console.log(data);
    game(data);
});

//socket for chat function
socket.on('msg', (data) => {
    userName = data.name;
    let newMessage = data.name + ":" + data.message;
    let msgElement = document.createElement('p');
    msgElement.innerHTML = newMessage;

    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

//posting peoples scores in the chat once the game is over
socket.on('score', (data)=> {
    let scoreMsg = data.score;
    let newScoreMsg = document.createElement('p'); 
    newScoreMsg.innerHTML = scoreMsg;
    chatScoreMsg = newUserName + " just scored " + scoreMsg + "!";
    // console.log(newScoreMsg, userName);
    chatBox.innerHTML = chatScoreMsg;
});

socket.on('joined', (data)=> {
    chatBox.innerHTML = "Hi " + newUserName + ". Welcome to " + roomName + " room!";
});

//------------------------------------------------------
//code for the game
function setup() {
    newUserName = prompt("Please enter your user name");

    if (!newUserName) {
        newUserName = prompt("User name is required", "Name");
    }

    alert("Hello " + newUserName + ". Welcome to Pong! \n\nThe rules of the game are simple. Use the paddle to stop the ball from hitting the wall on the right and left. Use your mouse to control both paddles. The ball will start moving automatically after you click ok, so make sure that you are ready to play once you click 'ok'. \n\nFeel free to pause the game at anytime to chat with others who are also playing the game or you can join a room with another player to play privately.\n\n Enjoy!");

    let myCanvas = createCanvas(700, 500);
    myCanvas.parent("canvas");

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

    // let timer = 30;
    for (let timer=20; timer<0; timer--) {
        console.log(timer);
    }

    game();
}

function game() {
    background('black');

    fill('white');
    textSize(30);
    text("Score: " + score, 20, 35);
    strokeWeight(10);
    stroke('white');
    line(width / 2, 0, width / 2, height);

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
    if (ball.position.x < 0 || ball.position.x > width) {
        ball.position.x = width / 2;
        ball.position.y = height / 2;
        ball.setSpeed(speed, 0)
        ball.visible = false;
        paddleL.visible = false;
        paddleR.visible = false;
        restart();
    }

    drawSprites();
}

function restart() {
    let tryAgain = prompt("You lose. \n\nDo you want to play again?");
    let universalAns = tryAgain.toLowerCase();

    // console.log(score);
    let currentScore = {"score": score};
    socket.emit('score', currentScore);

    if (universalAns == "yes" || universalAns == "yea" || universalAns == "yeah") {
        score = 0;
        ball.visible = true;
        paddleR.visible = true;
        paddleL.visible = true;
        draw();
    } else if (universalAns == "no" || universalAns == "nope") {
        score = "NaN";
        ball.life = 10;
        paddleL.life = 10;
        paddleR.life = 10;
    } else {
        tryAgain = prompt("Sorry I didn't understand what you said. Try again.")
    }

    start.addEventListener('click', () => {
        location.reload();
        // console.log('start was clicked');
    });
}

//-----------------------------------------------------
//code for the chat box function
submitBtn.addEventListener('click', () => {
    let inputMsg = msg.value;
    let messageObject = {
        "name": newUserName,
        "message": inputMsg
    };

    socket.emit('msg', messageObject);
    inputMsg.innerHTML = "";
});

