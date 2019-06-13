//导入http内置模块
const http = require('http');
//这个核心模块，能够帮我们解析url地址，从而拿到pathname query
const urlModule=require('url');


//创建http服务器
const server = http.createServer();
//监听http服务器的request请求
server.on('request',function (req,res) {
    //const url = req.url;
    const  {pathname:url,query} =urlModule.parse(req.url,true);
    var data={
        name:"小米",
        age:"9",
        gender:"未知"
    }
    if(url == "/getscript")
    {
        //拼接一个合法的js脚本，
        console.log("--");
       // var scriptStr = "show()";
        var scriptStr = `${query.callback}(${JSON.stringify(data)})`;
        res.end(scriptStr);
    }else
    {
        res.end("404");
    }
});

//启动服务
server.listen("3000", function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
