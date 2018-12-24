const express = require('express');
const router = express.Router();
const multer = require('multer');  //  格式化  multipart/form-data
const fs = require('fs');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 接收到文件后输出的保存路径（若不存在则需要创建）
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
    cb(null, Date.now() + "-" + file.originalname);  
  }
});
var upload = multer({ storage: storage });

router.post('/', upload.single('file'), function(req, res){
  var file = req.file;
  console.log('文件类型：%s', file.mimetype);
  console.log('原始文件名：%s', file.originalname);
  console.log('文件大小：%s', file.size);
  console.log('文件保存路径：%s', file.path);
  res.json({res_code: '0'});
})
module.exports = router