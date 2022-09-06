function isObject(data) {
    return (typeof data === "object" && data !== null);
}

// 排除引用地址，比较值是否相同
function isEqual(obj1, obj2) {
    if (!isObject(obj2) || !isObject(obj1)) {
        return obj1 === obj2;
    }

    if (obj1 === obj2) {
        return true;
    }

    let key1 = Object.keys(obj1);
    let key2 = Object.keys(obj2);
    if (key1.length !== key2.length) {
        return false;
    }

    for (let key in obj1) {
        if (!isEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

