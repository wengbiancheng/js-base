function isObject(obj) {
    return (typeof obj === "object" && null !== obj);
}


// 简易版本的判断是否相等(内容是否相等)：没考虑循环调用、function等情况
function isEqual(obj1, obj2) {
    // 1. 判断是不是引用类型
    if (!isObject(obj1) || !isObject(obj2)) {
        return obj1 === obj2;
    }

    // 2. 比较是否为同一个内存地址
    if (obj1 === obj2) {
        return true;
    }

    // 3. 比较key的数量
    const obj1KeyLength = Object.keys(obj1).length;
    const obj2KeyLength = Object.keys(obj2).length;
    if (obj1KeyLength !== obj2KeyLength) return false;

    // 4. 递归比较value的值
    for (let key in obj1) {
        const result = isEqual(obj1[key], obj2[key]);
        if (!result) return false;
    }

    return true;
}
