/* 公共js */
module.exports = {
    // 格式化时间
    formatTime(time) {
        const date = new Date(time);
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }
};