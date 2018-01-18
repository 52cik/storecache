import test from 'ava';
import localStorage from 'node-localstorage-lite';
import StoreCache from '..';

let store = new StoreCache();

test.afterEach(t => {
  store.clear();
});

test('store.set/get', t => {
  store.set('set-get', { a: 1, b: { c: 'haha' } });
  t.deepEqual(store.get('set-get'), { a: 1, b: { c: 'haha' } });
});

test.cb('store expired', t => {
  const s = new StoreCache({ store: localStorage });
  t.plan(2);
  s.set('expired', 123, 1);
  t.is(s.get('expired'), 123);
  setTimeout(() => {
    t.is(s.get('expired'), null);
    t.end();
  }, 1100);
});

test.cb('store.touch', t => {
  const s = new StoreCache({ store: localStorage });
  t.plan(2);
  s.set('touch', 123, 1);
  t.is(s.get('touch'), 123);
  s.touch('touch', 2);
  setTimeout(() => {
    t.is(s.get('touch'), 123);
    t.end();
  }, 1100);
});

test('store.destroy', t => {
  store.set('prefix', 123);
  store.destroy('prefix');
  t.is(store.get('prefix'), null);
});

test('store.clear', t => {
  store.set('clear', 123);
  store.destroy('clear');
  t.is(store.get('clear'), null);
});

test('store opt prefix', t => {
  store = new StoreCache({ prefix: 'prefix' });
  store.set('prefix', 123);
  t.is(store.get('prefix'), 123);
});

test('store.decode', t => {
  t.deepEqual(store.decode('clear'), {});
});



