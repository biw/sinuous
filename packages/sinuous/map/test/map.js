import test from 'tape';
import * as api from 'sinuous/observable';
import { o, h } from 'sinuous';
import map from 'sinuous/map';

const root = api.root;
let dispose;

(function() {
  console.log('Basic map tests');

  const list = o([h(['a', 1]), h(['b', 2]), h(['c', 3]), h(['d', 4])]);
  const div = document.createElement('div');
  div.appendChild(document.createElement('i'));
  div.appendChild(document.createElement('b'));
  root(d => {
    dispose = d;
    div.appendChild(map(list, item => item));
  });

  test('create', t => {
    t.equal(div.innerHTML, '<i></i><b></b>a1b2c3d4');
    t.end();
  });

  test('update', t => {
    list([h(['b', 2, 99]), h(['a', 1]), h(['c'])]);
    t.equal(div.innerHTML, '<i></i><b></b>b299a1c');
    t.end();
  });

  test('clear', t => {
    list([]);
    t.equal(div.innerHTML, '<i></i><b></b>');
    t.end();
  });

  test('dispose', t => {
    dispose();
    t.end();
  });
})();

(function() {
  console.log('Testing an only child map control flow');

  let div;
  const n1 = 'a',
    n2 = 'b',
    n3 = 'c',
    n4 = 'd';
  const list = o([n1, n2, n3, n4]);
  const Component = () =>
    root(d => {
      dispose = d;
      div = h('div', map(list, item => item));
    });

  function apply(t, array) {
    list(array);
    t.equal(div.innerHTML, array.join(''));
    list([n1, n2, n3, n4]);
    t.equal(div.innerHTML, 'abcd');
  }

  test('Create map control flow', t => {
    Component();

    t.equal(div.innerHTML, 'abcd');
    t.end();
  });

  test('1 missing', t => {
    apply(t, [n2, n3, n4]);
    apply(t, [n1, n3, n4]);
    apply(t, [n1, n2, n4]);
    apply(t, [n1, n2, n3]);
    t.end();
  });

  test('2 missing', t => {
    apply(t, [n3, n4]);
    apply(t, [n2, n4]);
    apply(t, [n2, n3]);
    apply(t, [n1, n4]);
    apply(t, [n1, n3]);
    apply(t, [n1, n2]);
    t.end();
  });

  test('3 missing', t => {
    apply(t, [n1]);
    apply(t, [n2]);
    apply(t, [n3]);
    apply(t, [n4]);
    t.end();
  });

  test('all missing', t => {
    apply(t, []);
    t.end();
  });

  test('swaps', t => {
    apply(t, [n2, n1, n3, n4]);
    apply(t, [n3, n2, n1, n4]);
    apply(t, [n4, n2, n3, n1]);
    t.end();
  });

  test('rotations', t => {
    apply(t, [n2, n3, n4, n1]);
    apply(t, [n3, n4, n1, n2]);
    apply(t, [n4, n1, n2, n3]);
    t.end();
  });

  test('reversal', t => {
    apply(t, [n4, n3, n2, n1]);
    t.end();
  });

  test('full replace', t => {
    apply(t, ['e', 'f', 'g', 'h']);
    t.end();
  });

  test('swap backward edge', t => {
    list(['milk', 'bread', 'chips', 'cookie', 'honey']);
    list(['chips', 'bread', 'cookie', 'milk', 'honey']);
    t.end();
  });

  test('dispose', t => {
    dispose();
    t.end();
  });
})();

(function() {
  console.log('Testing an multi child map control flow');

  const div = document.createElement('div');
  const n1 = 'a',
    n2 = 'b',
    n3 = 'c',
    n4 = 'd';
  const list = o([n1, n2, n3, n4]);
  const Component = () =>
    root(d => {
      dispose = d;
      return map(list, item => item);
    });

  function apply(t, array) {
    list(array);
    t.equal(div.innerHTML, array.join(''));
    list([n1, n2, n3, n4]);
    t.equal(div.innerHTML, 'abcd');
  }

  test('Create map control flow', t => {
    const comp = Component();
    div.appendChild(comp);
    t.equal(div.innerHTML, 'abcd');
    t.end();
  });

  test('1 missing', t => {
    apply(t, [n2, n3, n4]);
    apply(t, [n1, n3, n4]);
    apply(t, [n1, n2, n4]);
    apply(t, [n1, n2, n3]);
    t.end();
  });

  test('2 missing', t => {
    apply(t, [n3, n4]);
    apply(t, [n2, n4]);
    apply(t, [n2, n3]);
    apply(t, [n1, n4]);
    apply(t, [n1, n3]);
    apply(t, [n1, n2]);
    t.end();
  });

  test('3 missing', t => {
    apply(t, [n1]);
    apply(t, [n2]);
    apply(t, [n3]);
    apply(t, [n4]);
    t.end();
  });

  test('all missing', t => {
    apply(t, []);
    t.end();
  });

  test('swaps', t => {
    apply(t, [n2, n1, n3, n4]);
    apply(t, [n3, n2, n1, n4]);
    apply(t, [n4, n2, n3, n1]);
    t.end();
  });

  test('rotations', t => {
    apply(t, [n2, n3, n4, n1]);
    apply(t, [n3, n4, n1, n2]);
    apply(t, [n4, n1, n2, n3]);
    t.end();
  });

  test('reversal', t => {
    apply(t, [n4, n3, n2, n1]);
    t.end();
  });

  test('full replace', t => {
    apply(t, ['e', 'f', 'g', 'h']);
    t.end();
  });

  test('swap backward edge', t => {
    list(['milk', 'bread', 'chips', 'cookie', 'honey']);
    list(['chips', 'bread', 'cookie', 'milk', 'honey']);
    t.end();
  });

  test('dispose', t => {
    dispose();
    t.end();
  });
})();

(function() {
  console.log('Testing an only child map control flow with array children');

  let div;
  const n1 = 'a',
    n2 = 'b',
    n3 = 'c',
    n4 = 'd';
  const list = o([n1, n2, n3, n4]);

  const Component = () =>
    root(d => {
      dispose = d;
      return (div = h('div', map(list, item => h([item, item]))));
    });

  function apply(t, array) {
    list(array);
    t.equal(div.innerHTML, array.map(p => `${p}${p}`).join(''));
    list([n1, n2, n3, n4]);
    t.equal(div.innerHTML, 'aabbccdd');
  }

  test('Create map control flow', t => {
    Component();

    t.equal(div.innerHTML, 'aabbccdd');
    t.end();
  });

  test('1 missing', t => {
    apply(t, [n2, n3, n4]);
    apply(t, [n1, n3, n4]);
    apply(t, [n1, n2, n4]);
    apply(t, [n1, n2, n3]);
    t.end();
  });

  test('2 missing', t => {
    apply(t, [n3, n4]);
    apply(t, [n2, n4]);
    apply(t, [n2, n3]);
    apply(t, [n1, n4]);
    apply(t, [n1, n3]);
    apply(t, [n1, n2]);
    t.end();
  });

  test('3 missing', t => {
    apply(t, [n1]);
    apply(t, [n2]);
    apply(t, [n3]);
    apply(t, [n4]);
    t.end();
  });

  test('all missing', t => {
    apply(t, []);
    t.end();
  });

  test('swaps', t => {
    apply(t, [n2, n1, n3, n4]);
    apply(t, [n3, n2, n1, n4]);
    apply(t, [n4, n2, n3, n1]);
    t.end();
  });

  test('rotations', t => {
    apply(t, [n2, n3, n4, n1]);
    apply(t, [n3, n4, n1, n2]);
    apply(t, [n4, n1, n2, n3]);
    t.end();
  });

  test('reversal', t => {
    apply(t, [n4, n3, n2, n1]);
    t.end();
  });

  test('full replace', t => {
    apply(t, ['e', 'f', 'g', 'h']);
    t.end();
  });

  test('swap backward edge', t => {
    list(['milk', 'bread', 'chips', 'cookie', 'honey']);
    list(['chips', 'bread', 'cookie', 'milk', 'honey']);
    t.end();
  });

  test('dispose', t => {
    dispose();
    t.end();
  });
})();
