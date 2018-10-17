//保存
export function saveToLocal(id, key, value) {
    let seller = window.localStorage._seller_;
    if(!seller) {
        // 第一级
        seller = {};
        // 第二级也是个对象
        seller[id] = {};
    } else {
        seller = JSON.parse(seller);
        if(!seller[id]){
            seller[id] = {};
        }
    }
    // 赋值
    seller[id][key] = value;
    window.localStorage._seller_ = JSON.stringify(seller);
};

//读取
export function loadFromLocal(id, key, def) {
    let seller = window.localStorage._seller_;
    if(!seller){
        return def;
    }
    seller = JSON.parse(seller)[id];
    if(!seller){
        return def;
    }
    let ret = seller[key];
    return ret || def;
}
