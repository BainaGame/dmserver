var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require("body-parser");
var log4js = require("log4js");
var wechat = require("wechat");

log4js.configure("log4js.json");

var logger = log4js.getLogger("logInfo");

app.use(bodyParser.urlencoded({extended: false}));

//get/post 访问方法一样
app.use(function (req, res, next) {
    if (req.method == "GET") {
        req.body = req.query;
    }
    next();
})

app.get('/input.html', function (req, res) {
    res.sendFile(__dirname + '/input.html');
});

app.get('/client.html', function (req, res) {
    console.log("readfile:client.html")
    res.sendFile(__dirname + '/client.html');
});

app.get('/socket.io-1.2.0.js', function (req, res) {
    res.sendFile(__dirname + '/socket.io-1.2.0.js');
});

app.use('/baina', wechat("baina", wechat.text(function (message, req, res, next) {

    // { ToUserName: 'gh_6d72c20eb836',
    //     FromUserName: 'o-8wiwkwWxP4KQamySqMdlKEP7NE',
    //     CreateTime: '1460950280',
    //     MsgType: 'text',
    //     Content: '你好',
    //     MsgId: '6274733674086114390' }

    logger.info(message);
    io.emit("dm", message.Content);
    res.reply('发送成功!');

})));

app.get('/sendmsg', function (req, res) {

    var msg = req.body.msg;
    io.emit('dm', msg);
    res.send("success");
})

app.post("/sendwx", function (req, res) {

})

app.post("/*", function (req, res) {
    console.log(req)
})

app.get("/*", function (req, res) {
    console.log(req.url)
})

io.on('connection', function (socket) {
    socket.on('dm', function (msg) {
        io.emit('dm', msg);
    });
});

http.listen(80, function () {
    console.log('listening on *:80');
});
