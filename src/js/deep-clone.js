const mapType = "[object Map]";
const setType = "[object Set]";
const objectType = "[object Object]";
const functionType = "[object Function]";
const arrayType = "[object Array]";
const argsTag = "[object Arguments]"; // 不是很熟


const numberType = "[object Number]";
const booleanType = "[object Boolean]";
const stringType = "[object String]";
const dataType = "[object Date]";
const errorType = "[object Error]"; // 不是很熟
const regexType = "[object RegExp]"; // 不是很熟
const symbolType = "[object Symbol]"; // 不是很熟

const deepType = [mapType, setType, arrayType, objectType, argsTag];

function deepClone(target, map = new Map()) {
    // 1. 考虑引用类型和基本类型的拷贝
    // 2. 考虑循环引用的拷贝
    // 3. 考虑其它的类型：Map、Set
    // 4. 考虑其它的类型：Bool、Number、String、String、Date、Error
    // 5. 考虑Symbol类型
    // 6. 考虑function类型


    // if (typeof target !== 'object') {
    //     return target;
    // }
    if (!isObject(target)) {
        // 非引用类型直接返回
        return target;
    }

    if (map.get(target)) {
        return map.get(target);
    }


    const isArray = Array.isArray(target);
    const type = getType(target);

    let cloneTarget;
    if (deepType.includes(type)) {
        // 优化cloneTarget的初始化操作，怎么保持prototype还不太熟悉
        cloneTarget = getInit(target);
    } else {
        return cloneOtherType(target, type);
    }

    map.set(target, cloneTarget);


    // 克隆Map和Set
    // Map和Set才需要getInit()，Object可以直接使用Object.create(prototype)?
    if (type === mapType) {
        target.forEach((value, key) => {
            cloneTarget.set(key, deepClone(value, map));
        });
        return cloneTarget;
    }

    if (type === setType) {
        target.forEach(value => {
            cloneTarget.add(deepClone(value, map));
        });
        return cloneTarget;
    }


    // for (const key in target) {
    //     cloneTarget[key] = deepClone(target[key], map);
    // }

    // 克隆Object和Array
    forEach(target, (key, value) => {
        cloneTarget[key] = value;
    });



    return cloneTarget;
}

function cloneOtherType(target, type) {
    const Ctor = target.constructor;
    switch (type) {
        case booleanType:
        case numberType:
        case stringType:
        case errorType:
        case dataType:
            return new Ctor(target);
        case regexType:
            return cloneReg(target);
        case symbolType:
            return cloneSymbol(target);
        case functionType:
            return cloneFunction(target);
    }
}

function cloneReg(target) {
    // 拿到正则表达式的值
    const source = target.source;
    // 拿到正则表达式的模式
    const reFlags = /\w*$/;

    const result = new target.constructor(source, reFlags.exec(target));
    // target可能用了/g，那么lastIndex将决定它下一次开始匹配的index值
    result.lastIndex = target.lastIndex;
    return result;
}

function cloneSymbol(target) {
    // loadsh库是这样clone Symbol: Object(Symbol.prototype.valueOf.call(targe))
    // 但是得到的新的symbol: typeof cloneTarget === "object"，跟原对象比较是改变了值，
    // 因为Symbol是表示一个独一无二的值，因此我觉得应该直接返回，不应该clone
    // 同时function也一样，其实没有需要clone的场景，直接返回也是可以的，但是想要clone也是可以的
    return target;
}

// https://github.com/ConardLi/ConardLi.github.io/blob/master/demo/deepClone/src/clone_6.js
function cloneFunction(target) {
    // 两种类型的function
    // clone的时候是 target[key] = deepClone(xxx)，因此不需要考虑名称，只需要考虑function

    // \s表示匹配所有的空白字符
    const paramsReg = /(?<=\().+(?=\)\s+{)/;
    // /m表示多行匹配；/g表示全局匹配，要匹配多个结果，而不是匹配第一个结果就结束匹配；/i表示匹配不在乎大小写
    const bodyReg = /(?<={)(.|\n)+(?=})/m;

    const funcString = target.toString();

    // 箭头函数没有prototype
    if (target.prototype) {

        // 解析出body和params，然后新建一个新的function进行返回
        const params = paramsReg.exec(funcString);
        const body = bodyReg.exec(funcString);
        if (body) {
            if (params) {
                const paramsArray = params[0].split(",");
                // new Function，使用字符串创建方法，不懂可以看：https://zh.javascript.info/new-function
                // let temp = new Function(["a","b"], "return a+b;")这两种写法都可以
                // let temp = new Function("a","b", "return a+b;")这两种写法都可以
                return new Function(...paramsArray, body[0]);
            } else {
                // new Function，使用字符串创建方法，不懂可以看：https://zh.javascript.info/new-function
                return new Function(body[0]);
            }
        } else {
            return null;
        }

    } else {
        return eval(funcString);
    }
}

function forEach(target, callback) {
    // for..in效率时最低的，但是原因还没完全参透，后面再看看：遍历方法效率比较
    // for in 会遍历所有可枚举属性，造成不必要的循环导致的性能问题吗？这里我们已经通过hasOwnProperty去除了原型上的属性，所以不会带来这个问题。
    const keys = Object.keys(target);
    const len = keys.length;
    let i = 0;
    while (i < len) {
        const key = keys[i];
        callback(key, target[key]);
        i++;
    }
}

function getInit(target) {
    const Ctor = target.constructor;
    return new Ctor();
}


function getType(target) {
    return Object.prototype.toString.call(target);
}

function isObject(value) {
    // 如果value是非null的引用类型，则返回true，注意typeof new Map()也是object, typeof new Set()也是Object
    const type = typeof value;
    return (type !== null) && (type === "object" || type === "function");
}
