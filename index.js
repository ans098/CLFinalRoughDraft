let express = require('express');
let app = express();
app.use('/', express.static('public'));

let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('server is listening at ' + port);
});

let io = require('socket.io');
io = new io.Server(server);

io.sockets.on('connection', (socket) => {
    console.log('we have a new client: ' + socket.id);

    socket.on('msg', (data) => {
        console.log(data.name);
        io.sockets.emit('msg', data);

        //broadcast that there is a new user in the space
        // socket.broadcast.emit('msg', data);
    });

    socket.on('score', (data)=> {
        io.sockets.emit('score', data);
    });

    socket.on('disconnect', () => {
        console.log('client has disconnected: ' + socket.id);
    });
});

//private space---------------------------------------------------------------
let private = io.of('/private');

private.on('connection', (socket)=> {
    console.log("We have a new client: " + socket.id);

    socket.on('room-name', (data)=> {
        console.log(data);
        socket.join(data.room);
        socket.room = data.room;

        let welcomeMsg = "Welcome to '" + data.room + "' room.";
        socket.emit('joined', {msg: welcomeMsg});
     });

    socket.on('msg', (data) => {
        // console.log(data.name);
        private.to(socket.room).emit('msg', data);

        //broadcast that there is a new user in the space
        // socket.broadcast.emit('msg', data);
    });

    socket.on('score', (data)=> {
        private.to(socket.room).emit('score', data);
    });

    socket.on('disconnect', () => {
        console.log('client has disconnected: ' + socket.id + ' and left room: ' + socket.room);
        socket.leave(socket.room);
    });
});

