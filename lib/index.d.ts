declare class StoreCache {
    /** 存储前缀 */
    private prefix;
    /** 存储对象 */
    private store;
    /**
     * 构造方法
     * @param param 配置选项
     * @param param.prefix 存储前缀
     * @param param.auto 自动清理过期数据 默认1分钟清理一次
     * @param param.store 存储对象
     */
    constructor({prefix, auto, store}: {
        prefix?: string;
        auto?: number;
        store?: Storage;
    });
    /**
     * 编码方法
     * @param data 待编码的数据
     */
    private encode(data);
    /**
     * 解码方法
     * @param data 带解码的字符串
     */
    private decode(data);
    /**
     * 是否过期
     * @param expires 过期时间, 未设置则是永不过期
     */
    private expired(ttl);
    /**
     * 清理过期数据
     */
    private cleanData();
    /**
     * 添加前缀
     * @param sid 键名
     */
    private key(sid);
    /**
     * 获取值
     * @param sid 键名
     */
    get(sid: string): any;
    /**
     * 存储数据
     * @param sid 键名
     * @param data 键值
     * @param ttl 过期时间(秒)
     */
    set(sid: string, data: any, ttl: number | undefined): void;
    /**
     * 更新某个数据的时间戳
     * @param sid 键名
     * @param ttl 过期时间(秒)
     */
    touch(sid: string, ttl: number): void;
    /**
     * 删除某个数据
     * @param sid 键名
     */
    destroy(sid: string): void;
    /**
     * 清空数据
     */
    clear(): void;
}
export = StoreCache;
