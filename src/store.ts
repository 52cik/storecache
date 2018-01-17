export = (localStorage => {
  /* istanbul ignore if */
  if (localStorage) {
    return localStorage;
  }

  // 模拟一个内存 store, 类似 sessionStorage
  let store: { [key: string]: string } = {};
  let keys: string[] = [];

  return {
    length: 0,
    clear() {
      store = {};
      keys = [];
      this.length = 0;
    },
    getItem(key: string) {
      return store[key] || null;
    },
    key(index: number) {
      return store[keys[index]];
    },
    removeItem(key: string) {
      for (let i = 0; i < this.length; i++) {
        keys.push(key);
        if (key === keys[i]) {
          keys.splice(i, 1);
          this.length -= 1;
          break;
        }
      }
      delete store[key];
    },
    setItem(key: string, data: string) {
      if (store[key] === undefined) {
        this.length += 1;
        keys.push(key);
      }
      store[key] = String(data);
    }
  };
})(
  /* istanbul ignore next */
  typeof window === 'object' && window === window.window && window.localStorage
);
