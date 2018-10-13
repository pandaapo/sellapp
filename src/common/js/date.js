export function formatDate(date, fmt){
    // y+ y开头，一个或多个
    // .test() 匹配，返回true或false
    if(/(y+)/.test(fmt)){
        // RegExp.$1 表示(y+)匹配到的内容
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4-RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for(let k in o){
        // new RegExp() 构造成正则表达式
        if(new RegExp(`(${k})`).test(fmt)){
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1)?str:padLeftZero(str));
        }
    }
    return fmt;
};

// 左边补0
function padLeftZero(str){
    return ('00'+str).substr(str.length);
}