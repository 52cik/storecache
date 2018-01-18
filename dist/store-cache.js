/*!
 * StoreCache v1.0.0
 * (c) 2018-2018 楼教主 <fe.52cik@gmail.com> (http://www.52cik.com/)
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.StoreCache = factory());
}(this, (function () { 'use strict';

var store = (function (localStorage) {
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

var StoreCache = /** @class */ (function () {
    /**
     * 构造方法
     * @param param 配置选项
     * @param param.prefix 存储前缀
     * @param param.store 存储对象
     */
    function StoreCache(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.prefix, prefix = _c === void 0 ? '' : _c, _d = _b.store, store$$1 = _d === void 0 ? store : _d;
        this.prefix = prefix;
        this.store = store$$1;
    }
    /**
     * 编码方法
     * @param data 待编码的数据
     */
    StoreCache.prototype.encode = function (data) {
        return JSON.stringify(data);
    };
    /**
     * 解码方法
     * @param data 带解码的字符串
     */
    StoreCache.prototype.decode = function (data) {
        try {
            return JSON.parse(data);
        }
        catch (error) {
            return {};
        }
    };
    /**
     * 是否过期
     * @param expires 过期时间, 未设置则是永不过期
     */
    StoreCache.prototype.expired = function (ttl) {
        if (ttl === undefined) {
            return false;
        }
        var expires = parseInt(ttl, 36);
        var now = (+new Date() / 1000) | 0;
        if (now < expires) {
            return false;
        }
        return true;
    };
    /**
     * 清理过期数据
     */
    StoreCache.prototype.cleanData = function () {
        var store$$1 = this.store;
        for (var i = 0; i < store$$1.length; i++) {
            var key = store$$1.key(i);
            var str = store$$1.getItem(key);
            var ttl = this.decode(str).ttl;
            if (this.expired(ttl)) {
                store$$1.removeItem(key);
            }
        }
    };
    /**
     * 添加前缀
     * @param sid 键名
     */
    StoreCache.prototype.key = function (sid) {
        if (this.prefix) {
            return this.prefix + ":" + sid;
        }
        return sid;
    };
    /**
     * 获取值
     * @param sid 键名
     */
    StoreCache.prototype.get = function (sid) {
        this.cleanData(); // 清理过期数据
        var str = this.store.getItem(this.key(sid));
        if (!str) {
            return null; // 值为空是返回 null
        }
        var data = this.decode(str).data;
        return data;
    };
    /**
     * 存储数据
     * @param sid 键名
     * @param data 键值
     * @param ttl 过期时间(秒)
     */
    StoreCache.prototype.set = function (sid, data, ttl) {
        this.cleanData(); // 清理过期数据
        var now = (+new Date() / 1000) | 0;
        var str = this.encode({
            data: data,
            ttl: ttl ? (now + ttl).toString(36) : ttl
        });
        this.store.setItem(this.key(sid), str);
    };
    /**
     * 更新某个数据的时间戳
     * @param sid 键名
     * @param ttl 过期时间(秒)
     */
    StoreCache.prototype.touch = function (sid, ttl) {
        this.cleanData(); // 清理过期数据
        var data = this.get(sid);
        this.set(sid, data, ttl);
    };
    /**
     * 删除某个数据
     * @param sid 键名
     */
    StoreCache.prototype.destroy = function (sid) {
        this.store.removeItem(this.key(sid));
        this.cleanData(); // 清理过期数据
    };
    /**
     * 清空数据
     */
    StoreCache.prototype.clear = function () {
        this.store.clear();
    };
    return StoreCache;
}());
var lib = StoreCache;

return lib;

})));
