var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require("body-parser");
var log4js = require("log4js");
var wechat = require("wechat");

var numlist = {
    1:"勇哥真帅!",
    2:"再创佳绩",
    3:"老虎机",
    4:"炸金花威武",
    5:"斗牛威武",
    6:"麻将威武",
    7:"德州威武",
    8:"大家加油!"
}

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

    logger.info(message.Content);

    var showText = message.Content;

    for(var i=1;i<=numlist.length;i++){
        if (message.Content == i.toString()){
            showText = numlist[i];
            break;
        }
    }

    io.emit("dm", showText);

    var result = "";
    for(var i=1;i<=numlist.length;i++){
        result += "发送[+"+i+"+]以弹出'"+numlist[i]+"'\n";
    }
    res.reply(result);

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
