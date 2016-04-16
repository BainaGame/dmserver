var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: false}));

//get/post 访问方法一样
app.use(function(req,res,next){
    if(req.method == "GET"){
        req.body = req.query;
    }
    next();
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/client.html', function (req, res) {
    console.log("readfile:client.html")
    res.sendFile(__dirname + '/client.html');
});

app.get('/socket.io-1.2.0.js', function (req, res) {
    res.sendFile(__dirname + '/socket.io-1.2.0.js');
});

app.get('/sendmsg', function (req, res) {

    var msg = req.body.msg;
    io.emit('dm', msg);
    res.send("success");
})

io.on('connection', function (socket) {
    socket.on('dm', function (msg) {
        io.emit('dm', msg);
    });
});

http.listen(4000, function () {
    console.log('listening on *:4000');
});
