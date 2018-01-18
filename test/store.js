import test from 'ava';
import store from '../lib/store';

test.afterEach(t => {
	store.clear();
});

test('store init length', (t) => {
  t.is(store.length, 0);
});

test('store set get', (t) => {
  store.setItem('test', 'test');
  t.is(store.length, 1);
  t.is(store.getItem('test'), 'test');
});

test('store set number', (t) => {
  store.setItem('test', 123);
  t.is(store.length, 1);
  t.is(store.getItem('test'), '123');
});

test('store remove', (t) => {
  store.setItem('aaa', 123);
  store.setItem('bbb', 123);
  t.is(store.length, 2);
  store.removeItem('bbb');
  t.is(store.length, 1);
  t.is(store.getItem('aaa'), '123');
  t.is(store.getItem('bbb'), null);
});

test('store key', (t) => {
  store.setItem('aaa', 123);
  store.setItem('bbb', 123);
  t.is(store.key(1), 'bbb');
});


test('store key', (t) => {
  store.setItem('aaa', 123);
  store.setItem('bbb', 111);
  store.setItem('bbb', 222);
  t.is(store.length, 2);
  t.is(store.key(1), 'bbb');
});
