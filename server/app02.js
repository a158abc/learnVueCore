//导入http内置模块
//const http = require('http');
//这个核心模块，能够帮我们解析url地址，从而拿到pathname query
//const urlModule=require('url');

//database
var Sequelize = require('sequelize');

var express = require('express');
var app = express();
//www-form-urlencoded
//这是http的post请求默认的数据格式，需要body-parser中间件的支持
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended:true
}));

var mydb = new Sequelize('database',null,null, {
  "dialect": "sqlite",
  "storage": "db/cloud.db",
  "define": {
    "timestamps": false,
    "freezeTableName": false
  }
});
//验证数据库连接
mydb.authenticate().then(function() {
  console.log('Connection has been established successfully.');
}).catch(function(err) {
  console.error('Unable to connect to the database:', err);
});

var Brand = mydb.define('T_BRAND', {
    ID: {type: Sequelize.INTEGER, primaryKey: true},
    NAME: Sequelize.STRING(50),
    CTIME: Sequelize.DATE,
  });

app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

app.get('/api/getallbrand', function (req, res) {
    var queryClause = {};
    queryClause["order"] = [['id','ASC'], ['name','ASC']];
    Brand.findAll(queryClause).then(function(rows){
      if (rows && rows.length > 0) {
        var cars = JSON.stringify(rows);
        //console.log(cars);
        var result = { success: 0, result: JSON.parse(cars)};
        res.type('text/json');
        res.send(result);
      }
      else
      {
        response_not_finded(res,-1);
      }
    });
});

var idcount = 3;
app.post('/api/addbrand',function(req,res){
    var name = req.body.name;
    Brand.create({
     // ID: idcount++,
      NAME: name,
      CTIME: '2016-01-22 18:37:22'
  });
});  

//启动服务
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('running at http://' + host + ':' + port);
 
})