"use strict";
module.exports = (function (localStorage) {
    /* istanbul ignore if */
    if (localStorage) {
        return localStorage;
    }
    // 模拟一个内存 store, 类似 sessionStorage
    var store = {};
    var keys = [];
    return {
        length: 0,
        clear: function () {
            store = {};
            keys = [];
            this.length = 0;
        },
        getItem: function (key) {
            return store[key] || null;
        },
        key: function (index) {
            return keys[index];
        },
        removeItem: function (key) {
            for (var i = 0; i < this.length; i++) {
                keys.push(key);
                if (key === keys[i]) {
                    keys.splice(i, 1);
                    this.length -= 1;
                    break;
                }
            }
            delete store[key];
        },
        setItem: function (key, data) {
            if (store[key] === undefined) {
                this.length += 1;
                keys.push(key);
            }
            store[key] = String(data);
        }
    };
})(
/* istanbul ignore next */
typeof window === 'object' && window === window.window && window.localStorage);
//# sourceMappingURL=store.js.map