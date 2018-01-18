# storecache

> Storage with expiration time based on localStorage


## Requirements

> node6 or higher


## How to use it

### Install

```sh
$ yarn add storecache.js
# or
$ npm i -S storecache.js
```

### Usage

```js
const StoreCache = require('storecache.js');

const store = new StoreCache();

store.set('obj', { a: 1, b: { c: 'str' } });
console.log(store.get('obj')); // { a: 1, b: { c: 'str' } }

store.set('expired', { id: 123 }, 3); // expire after 3 seconds
console.log(store.get('expired')); // { id: 123 }
setTimeout(() => {
  console.log(store.get('expired')); // null
}, 4000);
```


## API

#### StoreCache([options])

##### options

Type: `Object`

###### prefix

Type: `string`

Default: ''

###### store

Type: `Storage`

Default: localStorage


#### StoreCache#set(sid, data, ttl)

###### sid

Type: `string`

###### data

Type: `any`

###### ttl

Type: `number`

Default: 0


#### StoreCache#get(sid)

###### sid

Type: `string`

#### StoreCache#touch(sid, ttl)

###### sid

Type: `string`

###### ttl

Type: `number`

Default: 0

#### StoreCache#destroy(sid)

###### sid

Type: `string`

#### StoreCache#clear()
