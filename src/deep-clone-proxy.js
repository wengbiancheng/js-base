const deepClone = (data, fn) => {

    const copyMap = new Map(); // 保存暂时改变的key
    const proxyMap = new Map(); // 保存已经转化为代理的key


    const _handle = {
        get(target, key) {
            // 如果得到的key是已经set过的，那么就得从缓存copyMap中获取
            const _copy = copyMap.get(target) || target;

            // 如果data[key]已经是Proxy，那么就可以直接返回，如果不是，则需要转化为Proxy
            const _targetProxy = setProxy(_copy[key]);
            return _targetProxy;
        },
        set(target, key, value) {
            let _copy;
            // 如果已经是缓存，则直接拿copyMap
            if (copyMap.has(target)) {
                _copy = copyMap.get(target);
            }
            // 如果没有缓存，则需要深拷贝一次
            else {
                _copy = Array.isArray(target) ? target.slice() : { ...target };
            }

            _copy[key] = value;
            copyMap.set(target, _copy);

            return true;
        }
    }

    function setProxy(target) {
        // 将对象转化为proxy，进行劫持

        if (Object.prototype.toString.call(target) === "[object Object]" || Array.isArray(target)) {
            if (proxyMap.has(target)) {
                return proxyMap.get(target);
            }


            const targetProxy = new Proxy(target, _handle);
            proxyMap.set(target, targetProxy);
            return targetProxy;
        }

        return target;
    }

    const _py = setProxy(data);
    typeof fn === "function" && fn(_py);


    function _handleMap(data) {
        if (Object.prototype.toString.call(data) === "[object Object]" || Array.isArray(data)) {
            if (!(proxyMap.has(data) || copyMap.has(data))) {
                return data;
            }

            // 先拿缓存的数据进行拼接，然后对没有缓存的数据进行拼接

            // TODO 这里为什么老是弄错！！！！
            // let _co = copyMap.get(data) || (Array.isArray(data) ? data.slice() : { ...data });
            // Object.keys(_co).forEach((key) => {
            //     _co[key] = _handleMap(_co[key]);
            // });

            let _copy;
            if (copyMap.has(target)) {
                _copy = copyMap.get(target);
            } else {
                _copy = Array.isArray(data) ? data.slice() : { ...data };
                copyMap.set(target, _copy);
            }

            const _co = copyMap.get(target);
            Object.keys(_co).forEach(key => {
                _co[key] = _handleMap(_co[key]);
            });

            return _co;
        }

        return data;
    }

    // 返回深度拷贝的对象：部分改变使用copyMap，没有改变则进行slice() + {...target}
    return _handleMap(_py);
}


