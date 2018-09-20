const test = require('tape');

const { plus, pad, spad } = require('./strutil.js');

test('plus', ({ equal, end })=>{
  end();
});

test('pad', ({ equal, end })=>{
  equal(pad('13', 3), '013');
  equal(pad('1343', 3), '1343');
  equal(pad('012', 5), '00012');
  equal(pad(12, 3), '012');
  equal(pad(-12, 3), '012');
  end();
});
test('spad', ({ equal, end })=>{
  equal(spad('13', 3), '013');
  equal(spad('1343', 3), '1343');
  equal(spad('012', 5), '00012');
  equal(spad(12, 3), '012');
  equal(spad(-12, 3), '-012');
  end();
});
