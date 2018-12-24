const utils = require('./server/utils')
const express = require('express')
const app = express()
const WebSocket = require('ws')
// GET 请求的参数在URL中，在原生Node中，需要使用url模块来识别参数字符串。在Express 中，不需要使用url模块了。可以直接使用req.query对象。
// POST 请求在 express 中不能直接获得，可以使用 body-parser 模块。使用后，将可以用 req.body 得到参数。但是如果表单中含有文件上传，那么还是需要使用 formidable 模块。
const bodyParser = require('body-parser')

// 导入router
const uploadRouter = require('./server/routes/upload')

app.use(bodyParser.json());  //  格式化  application/json
app.use(bodyParser.urlencoded({extended: true}));  //  格式化  application/x-www-urlencoded

// 服务器端口
const server_port = 3000
const ws_port = 8888
const ws = new WebSocket.Server({ port: ws_port })

const hotAvatar = 'http://7647778.s21i-7.faiusr.com/3/ABUIABADGAAg_d7lzwUokKa3jQMw9AM4-AM.gif'
const coldAvatar = 'http://img3.duitang.com/uploads/item/201501/05/20150105094517_mQyet.jpeg'

app.all('*', function(req, res, next) {  
  res.header("Access-Control-Allow-Origin", "*");  
  res.header("Access-Control-Allow-Headers", "X-Requested-With");  
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
  res.header("X-Powered-By",' 3.2.1')  
  res.header("Content-Type", "application/json;charset=utf-8");  
  next();  
});

// WebSocket
ws.on('connection', function connection(ws) {
  // -------------------词库聊天---------------------
  // 建立连接时确定词库
  // const isHot = Math.random() > 0.5; // true  热情   false  高冷
  // var words = [];
  // ws.on('message', function (message) {    
  //   var name = JSON.parse(message).name
  //   if (!words.length) {
  //     words = utils.getChatWords(name, isHot)
  //   }
  //   const word = utils.getWordFromWords(words)
  //   var delay = 1000
  //   if (isHot) {
  //     delay = 500
  //   } else {
  //     delay = delay * Math.random() * 5
  //   }
  //   const chat = {
  //     id: utils.getId(),
  //     avatar: isHot ? hotAvatar : coldAvatar,
  //     isGuest: false,
  //     content: word,
  //   }
  //   const chatJSONString = JSON.stringify(chat)
  //   setTimeout(function () {
  //     ws.send(chatJSONString)
  //   }, delay)
  // })
  // ----------------词库聊天  end------------------------
  // -----------------图灵聊天  文字版---------------------
  ws.on('message', function(message){
    var text = JSON.parse(message).word
    console.log('用户发送的图灵的文字: ',text)
    utils.getChatWord(text).then(function (r) {
      var word = r.results[0].values.text
      console.log('图灵返回的文字: ',word)
      var response = {
        id: utils.getId(),
        avatar: hotAvatar,
        isGuest: false,
        content: word,
      }
      ws.send(JSON.stringify(response))
    }).catch(function (e) {
      ws.send(JSON.stringify(e))
    })
  })
  // -----------------图灵聊天  文字版  end---------------------
  ws.on('open', function (e) {
    // console.log('open: ',e)
  })
  ws.on('error', function (e) {
    console.log('server ws error: ',e)
    ws.close()
  })
  ws.on('close', function (e) {
    // console.log('close: ',e)
  })
})

// 静态文件支持
app.use(express.static(__dirname + '/static'))

// 手动调机器人接口
app.use('/chatRobot', function (req, res) {
  // req.body  请求体  需要body-parser中间件
  // req.query  查询参数
  // req.params 路径参数 实例：
  // Route path: /users/:userId/books/:bookId
  // Request URL: http://localhost:3000/users/34/books/8989
  // req.params: { "userId": "34", "bookId": "8989" }
  if (req.method && req.method.toLowerCase() == 'get') {
    const text = req.query.text
    utils.getChatWord(text).then(function (r) {
      var response = {
        code: 1,
        message: '请求成功',
        data: r
      }
      res.send(response)
    }).catch(function (e) {
      console.log('server err: ', e)
      res.send(e)
    })
  } else {
    var e = {
      code: 0,
      message: 'method is not Allowed,please use "get" method!'
    }
    res.status(405).send(JSON.stringify(e))
  }
})

app.use('/upload', uploadRouter)

app.listen(server_port, function () {
  console.log('listening on port ' + server_port)
})