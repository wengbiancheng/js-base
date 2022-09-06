/**
 * 深度拷贝，同时在深度拷贝的时候更改一些值，返回改变后的深度拷贝的结果，不能改变原来的值
 * 当然深度拷贝后，返回的是一个新的对象，新的对象不再具备Proxy，是一个使用Map()构建的对象！
 */
const deepClone = (data, fn) => {
    const _copyMap = new Map();
    const _proxyMap = new Map();

    function setProxy(target) {
        if (typeof target === "object" && target !== null) {
            if (_proxyMap.has(target)) {
                return _proxyMap.get(target);
            }

            const newProxy = new Proxy(target, {
                get(cur, key) {

                    // 获取可能已经改变的值，在copyMap中
                    const _copy = _copyMap.get(target) || target;

                    // 但是Proxy只监听到最表面的一层，因此在获取下一层的key的值的时候，应该再setProxy一次
                    let _proxy;
                    // if (!_proxyMap.has(_copy[key])) {
                        _proxy = setProxy(_copy[key]);
                        // setProxy已经做了下面这一步！
                        // _proxyMap.set(cur[key], _proxy);
                    // }
                    return _proxy;
                },
                set(cur, key, value) {
                    // _copyMap是对Proxy值的缓存！
                    let _copy;
                    if (_copyMap.has(cur)) {
                        _copy = cur;
                    } else {
                        _copy = Array.isArray(cur) ? cur.slice() : {...cur};
                    }
                    _copy[key] = value;
                    _copyMap.set(cur, _copy);
                    // 如果要对深层次的数据进行set操作，那么一定会触发get()方法，从而形成新的Proxy

                    return true;
                }
            });

            _proxyMap.set(target, newProxy);
            // TODO 到底是返回target还是newProxy
            return newProxy;
        }
        return target;
    }


    const _py = setProxy(data);
    typeof fn === "function" && fn(_py);

    function _returnFinalObject(target) {
        if (typeof target === "object" && target !== null) {
            if(!(_copyMap.has(target) || _proxyMap.has(target))) {
                return target;
            }

            let _copy;
            if(_copyMap.has(target)) {
                _copy = _copyMap.get(target);
            } else {
                _copy = Array.isArray(target)?target.slice():{...target};
            }

            let keys = Object.keys(_copy);
            keys.forEach((key)=> {
                _copy[key] = _returnFinalObject(_copy[key]);
            });

            _copyMap.set(target, _copy);
            return _copy;
        }
        return target;
    }

    return _returnFinalObject(data);
}



