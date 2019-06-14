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

//请求响应函数
var response_not_finded = function(res, code) {
  //console.log('not finded');
  res.type('text/json');
  res.send({success: code});
};

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

app.post('/api/addbrand',function(req,res){
    var name = req.body.name;
    //console.log( new Date().format('yyyy-MM-dd HH:mm:ss'));
    Brand.create({
     // ID: idcount++, //ID为null，数据库自增
      NAME: name,
      CTIME: new Date().format('yyyy-MM-dd HH:mm:ss')
    });
    var result = { success: 0, result:"" };
    res.type('text/json');
    res.send(result);
});  

app.post('/api/delbrand',function(req,res){
  var index = req.body.delid;
  Brand.destroy({
    where: { 
       id:index
    }
  });
  var result = { success: 0, result:"" };
  res.type('text/json');
  res.send(result);
}); 

/** 
 * 时间对象的格式化
 * @params string format 格式：参考这个：http://element-cn.eleme.io/#/zh-CN/component/date-picker#ri-qi-ge-shi
 * @example new Date().format('yyyy-M-d H:m:s');
 * @return string '2018-05-05 05:05:05';
 */
Date.prototype.format = function (format) {
	var year = this.getFullYear();
	var month = this.getMonth() + 1;
	var day = this.getDate();
	var hours = this.getHours();
	var minutes = this.getMinutes();
	var seconds = this.getSeconds();
	
	format = format.replace('yyyy', year);
	
	if ( format.indexOf('MM') !== -1 ) {
		format = format.replace('MM', month < 10 && '0' + month || month);
    } else {
		format = format.replace('M', month);
    }
	if ( format.indexOf('dd') !== -1 ) {
		format = format.replace('dd', day < 10 && '0' + day || day);
    } else {
		format = format.replace('d', day);
    }
	if ( format.indexOf('HH') !== -1 ) {
		format = format.replace('HH', hours < 10 && '0' + hours || hours);
    } else {
		format = format.replace('H', hours);
    }
	if ( format.indexOf('mm') !== -1 ) {
		format = format.replace('mm', minutes < 10 && '0' + minutes || minutes);
    } else {
		format = format.replace('m', minutes);
	}
	if ( format.indexOf('ss') !== -1 ) {
		format = format.replace('ss', seconds < 10 && '0' + seconds || seconds);
    } else {
		format = format.replace('s', seconds);
    }
    return format;
}

/**
 * 加减月份，配合format使用，自动计算增加、减去整数后的日期
 * @params integer num 整数，接受负数
 */
Date.prototype.inCreaseMonth = function (num) {
  this.setMonth(this.getMonth() + num);
  return this
}

//启动服务
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('running at http://' + host + ':' + port);
 
})