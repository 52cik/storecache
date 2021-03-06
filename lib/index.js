"use strict";
var localStorage = require("./store");
var StoreCache = /** @class */ (function () {
    /**
     * 构造方法
     * @param param 配置选项
     * @param param.prefix 存储前缀
     * @param param.store 存储对象
     */
    function StoreCache(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.prefix, prefix = _c === void 0 ? '' : _c, _d = _b.store, store = _d === void 0 ? localStorage : _d;
        this.prefix = prefix;
        this.store = store;
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
        var store = this.store;
        for (var i = 0; i < store.length; i++) {
            var key = store.key(i);
            var str = store.getItem(key);
            var ttl = this.decode(str).ttl;
            if (this.expired(ttl)) {
                store.removeItem(key);
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
module.exports = StoreCache;
//# sourceMappingURL=index.js.map