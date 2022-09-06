const mapType = "[object Map]";
const setType = "[object Set]";
const arrayType = "[object Array]";
const objectType = "[object Object]";
const functionType = "[object Function]";
const argsType = "[object Arguments]";

const numberType = "[object Number]";
const stringType = "[object String]";
const booleanType = "[object Boolean]";
const dateType = "[object Date]";
const errorType = "[object Error]";
const regexTyep = "[object Regex]";
const symbolType = "[object Symbol]";

const deepCloneType = [mapType, setType, argsType, objectType, argsType];

function deepClone(target, map = new Map()) {
    if (!isObject(target)) {
        return target;
    }

    if (map.has(target)) {
        return map.get(target);
    }

    const type = getStringType(target);
    if (!deepCloneType.includes(type)) {
        return cloneOtherType(target, type);
    }

    let cloneTarget = getCtorInit(target);
    map.set(target, cloneTarget);

    if (type === mapType) {
        target.forEach((key, value) => {
            cloneTarget[key] = deepClone(value, map);
        });

        return cloneTarget;
    }

    if (type === setType) {
        target.forEach((value) => {
            cloneTarget.add(deepClone(value, map));
        });

        return cloneTarget;
    }

    forEach(target, (key, value) => {
        cloneTarget[key] = deepClone(value, map);
    });

    return cloneTarget;

}

function forEach(target, callback) {
    const keys = Object.keys(target);
    const len = keys.length;
    let i = 0;
    while (i < len) {
        const key = keys[i++];
        callback(key, target[key]);
    }
}

function getCtorInit(target) {
    const Ctor = target.constructor;
    return new Ctor();
}

function getStringType(target) {
    return Object.prototype.toString.call(target);
}

function isObject(target) {
    const type = typeof target;
    return target !== null && (type === "function" || type === "object");
}


function cloneOtherType(targe, type) {
    switch (type) {
        case functionType:
            return cloneFunction(targe);
        case regexType:
            return cloneRegex(targe);
        case symbolType:
            return targe;
        default:
            const Ctor = targe.constructor;
            return new Ctor(targe);
    }
}

function cloneFunction(target) {
    const paramsRegex = /(?<=\().+(?=\)\s+{)/;
    const bodyRegex = /(?<={)(.|\n)+(?=})/m;

    const functionString = target.toString();

    if (target.prototype) {
        const body = bodyRegex.exec(target);
        const params = paramsRegex.exec(target);

        if (body) {
            if (params) {
                const paramsArray = params[0].split(",");
                return new Function(...paramsArray, body[0]);
            } else {
                return new Function(body[0]);
            }
        } else {
            return null;
        }
    } else {
        return eval(functionString);
    }
}

function cloneRegex(target) {
    const source = target.source;
    const mode = /\w*$/;

    const newObject = new target.constructor(source, mode.exec(target));
    newObject.lastIndex = target.lastIndex;
    return newObject;
}
