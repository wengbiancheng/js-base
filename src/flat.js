// 普通版


// reduce版本
function flat(array, num = 1) {
    return array.reduce(function (prev, current) {
        if (Array.isArray(current)) {
            return prev.concat(flat(current));
        } else {
            return prev.concat(current);
        }
    }, []);
}


// 通过传入整数参数控制层数
function flatNumber(array, num) {
    return array.reduce(function (prev, current) {
        if (Array.isArray(current) && num - 1 > 0) {
            return prev.concat(flatNumber(current, num - 1));
        } else {
            // concat本身就平铺了一层！[1, 2, 3, 4, [1, 2, 3]]->concat->[1, 2, 3, 4, 1, 2, 3]
            return prev.concat(current);
        }
    }, []);
}

// const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }]
// var result = flatNumber(arr, 1);
// console.log(result);


// 栈的思想
function flatStack(array) {
    stack = [].concat(array);
    while (stack.length > 0) {
        let top = stack.pop();
        if (Array.isArray(top)) {
            stack.push(...top);
        } else {
            result.unshift(top);
        }
    }

    return result;
}

var stack = [];
var result = [];
const arr1 = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }]
var result1 = flatStack(arr1, 1);
console.log(result1);



