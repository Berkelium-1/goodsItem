const host = 'http://localhost'; // 域名
const port = 3000; // 监听端口号
const baseURL = `${host}:${port}`;
const mysqlConfig = { // mysql数据库配置
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'my_db'
};


module.exports = {
    host,
    port,
    baseURL,
    mysqlConfig
};