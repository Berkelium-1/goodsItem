const path = require('path');
const express = require('express');
const { port } = require('./config/config');
const commonRouter = require('./routes/commonRouter');
const adminRouter = require('./routes/adminRouter');

const app = express();

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:9528");
    //这里最好不用*通配符，之前就这报错，写上指定域名例如 http://127.0.0.1:8080
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-control-Allow-Credentials", "true");
    //这个地方是最坑了，百度查了好多大佬给的方案都没加这条，报错一直报这个，加上就ok
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 路由
app.use('/public', express.static(path.join(__dirname, '/public'))); // 静态资源路由

app.use('/', commonRouter); // 公共路由
app.use('/admin', adminRouter); // 后台管理系统路由

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    // console.log(path.join(__dirname, '/public'));
});