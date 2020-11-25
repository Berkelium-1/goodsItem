// 引入模块依赖
// const fs = require('fs');
// const path = require('path');
const jwt = require('jsonwebtoken');
const secret = 'Berkelium'; // 签名
const term = { expiresIn: 60 * 60 * 24 }; // 期限 授权时效24小时
// const term = { expiresIn: 10 }; // 测试 期限 授权时效10秒
// 创建 token 类
module.exports = {
    //生成token
    getToken(payload) {
        const token = jwt.sign(payload, secret, term);
        return token;

        // const secret = fs.readFileSync(path.join(__dirname, '../pem/private_key.pem'));//私钥 可以自己生成
        // const token = jwt.sign(payload, secret, { algorithm: 'RS256', expiresIn: 60 * 60 * 24 });
    },

    // 校验token
    verifyToken(token, callback) {
        let res = null;
        jwt.verify(token, secret, (err, payload) => {
            if (err) { // token过期 or 假token
                res = err;
            } else {
                // 返回 payload 对象
                res = payload;
            }
        });
        return res;
        // const payload = jwt.verify(token, secret, callback);

        // const secret = fs.readFileSync(path.join(__dirname, '../pem/public_key.pem'));//公钥 可以自己生成
        // const payload = jwt.verify(token, secret, { algorithms: ['RS256'] });
    }
};