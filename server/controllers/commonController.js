const { baseURL } = require('../config/config');
const dbConfig = require('../config/dbconfig');

const multer = require('multer');
let path = require("path");
//上传文件配置  
const storage = multer.diskStorage({
    //文件存储位置  
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    //文件名  
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, `${Date.now()}_${Math.ceil(Math.random() * 1000)}_multer.${file.originalname.split('.').pop()}`);
    }
});
const uploadCfg = {
    storage,
    limits: {
        //上传文件的大小限制,单位bytes  
        fileSize: 1024 * 1024 * 20
    }
};
module.exports = {
    // 处理上传图片
    uploadImg(req, res, next) {
        console.log(req.body);
        console.log(req.file);
        const file = req.file;
        file.url = `${baseURL}/public/uploadImg/${file.filename}`;
        const responseData = {
            code: 200,
            file
        };
        res.send(responseData);
    },
    uploads(req, res, next) {
        let upload = multer(uploadCfg).any();
        upload(req, res, async (err) => {
            console.log(req.file);
            console.log(req.body);
            let uploadFile = req.files[0];
            if (err) {
                res.json({ path: `//uploads/${uploadFile.filename}` });
                console.log(err);
                return;
            };
            console.log(req.files);
            res.json({ path: `//uploads/${uploadFile.filename}` });
        });
    }
};