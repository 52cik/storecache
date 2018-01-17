import localStorage = require('./store');

class StoreCache {
  /** 存储前缀 */
  private prefix: string;
  /** 存储对象 */
  private store: Storage;

  /**
   * 构造方法
   * @param param 配置选项
   * @param param.prefix 存储前缀
   * @param param.auto 自动清理过期数据 默认1分钟清理一次
   * @param param.store 存储对象
   */
  constructor({ prefix = '', auto = 60 * 1000, store = localStorage }) {
    this.prefix = prefix;
    this.store = store;

    if (auto) {
      setInterval(() => this.cleanData(), auto);
    }
  }

  /**
   * 编码方法
   * @param data 待编码的数据
   */
  private encode(data: any) {
    return JSON.stringify(data);
  }

  /**
   * 解码方法
   * @param data 带解码的字符串
   */
  private decode(data: string) {
    try {
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  /**
   * 是否过期
   * @param expires 过期时间, 未设置则是永不过期
   */
  private expired(ttl) {
    if (ttl === undefined) {
      return false;
    }

    const expires = parseInt(ttl, 36);
    const now = (+new Date() / 1000) | 0;

    if (now < expires) {
      return false;
    }

    return true;
  }

  /**
   * 清理过期数据
   */
  private cleanData() {
    const store = this.store;
    for (let i = 0; i < store.length; i++) {
      const key = store.key(i);
      const str = store.getItem(key);
      const { ttl } = this.decode(str);
      if (this.expired(ttl)) {
        store.removeItem(key);
      }
    }
  }

  /**
   * 添加前缀
   * @param sid 键名
   */
  private key(sid: string) {
    if (this.prefix) {
      return `${this.prefix}:${sid}`;
    }
    return sid;
  }

  /**
   * 获取值
   * @param sid 键名
   */
  public get(sid: string) {
    this.cleanData(); // 清理过期数据

    const str = this.store.getItem(this.key(sid));

    if (!str) {
      return null; // 值为空是返回 null
    }

    const { data, ttl } = this.decode(str);

    if (this.expired(ttl)) {
      this.store.removeItem(this.key(sid));
      return null; // 删除并返回null
    }

    return data; // 有效期内返回数据
  }

  /**
   * 存储数据
   * @param sid 键名
   * @param data 键值
   * @param ttl 过期时间(秒)
   */
  public set(sid: string, data: any, ttl: number | undefined) {
    this.cleanData(); // 清理过期数据
    const now = (+new Date() / 1000) | 0;
    const str = this.encode({
      data,
      ttl: ttl ? (now + ttl).toString(36) : ttl
    });
    this.store.setItem(this.key(sid), str);
  }

  /**
   * 更新某个数据的时间戳
   * @param sid 键名
   * @param ttl 过期时间(秒)
   */
  public touch(sid: string, ttl: number) {
    this.cleanData(); // 清理过期数据

    const data = this.get(sid);
    if (data) {
      this.set(sid, data, ttl);
    }
  }

  /**
   * 删除某个数据
   * @param sid 键名
   */
  public destroy(sid: string) {
    this.store.removeItem(this.key(sid));
    this.cleanData(); // 清理过期数据
  }

  /**
   * 清空数据
   */
  public clear() {
    this.store.clear();
  }
}

export = StoreCache;
