function flat(array) {
    return array.reduce((prev, current) => {
        if (Array.isArray((current))) {
            return prev.concat(flat(current));
        } else {
            return prev.concat(current);
        }
    });
}


// [1, 2, [1, 2, [1, 2, [3, 4]]]
// 如果num=1，就会消去两层了，因此必须是num-1>0
function flat1(array, num = 1) {
    // num=1表示只解构一层，flat(current, num - 1)=flat(current, 0)
    return array.reduce((prev, current) => {
        if (Array.isArray(current) && num - 1 > 0) {
            return prev.concat(flat1(current, num - 1));
        } else {
            return prev.concat(current);
        }
    }, [])
}

flat1([1, 2, [1, 2, [1, 2, [3, 4]]]], 2)


function flatStack(array) {
    const stack = [].concat(array);

    // 开始弹出栈
    const result = [];
    while (stack.length > 0) {
        const item = stack.pop();
        if (Array.isArray(item)) {
            stack.push(...item);
        } else {
            // 如果不是数组，直接插入到结果数组前头
            result.unshift(item);
        }
    }

    return result;
}