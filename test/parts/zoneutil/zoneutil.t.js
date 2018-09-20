const test = require('tape');

const { validZone, zoneOffset } = require('./zoneutil.js');

test('validZone', ({ equal, throws, end }) => {
  equal(validZone('UTC'), 'UTC');
  equal(validZone('+1'), '+01:00');
  equal(validZone('-8:00'), '-08:00');
  equal(validZone('-05:00'), '-05:00');

  equal(validZone('Europe/Berlin'), 'Europe/Berlin');
  equal(validZone('Europe/Vienna'), 'Europe/Vienna');
  equal(validZone('America/New_York'), 'America/New_York');
  equal(validZone('America/Los_Angeles'), 'America/Los_Angeles');
  equal(validZone('Australia/Melbourne'), 'Australia/Melbourne');
  equal(validZone('Asia/Beirut'), 'Asia/Beirut');
  equal(validZone('Asia/Shanghai'), 'Asia/Shanghai');

  throws(() => validZone('Central European Time'));
  throws(() => validZone('America/San_Francisco'));
  throws(() => validZone('Atlantis/Fantasy'));
  throws(() => validZone('EST'));
  throws(() => validZone('EDT'));
  throws(() => validZone('PST'));
  throws(() => validZone('EDST'));
  throws(() => validZone('CST'));
  throws(() => validZone('CET'));
  throws(() => validZone('CEDT'));

  end();
});

test('zoneOffset', ({ equal, end }) => {
  equal(
    zoneOffset(Date.parse('2018-11-18T15:23:30.100Z'), 'Europe/Vienna'),
    '+01:00'
  );

  equal(
    zoneOffset(Date.parse('2018-07-18T15:23:30.100Z'), 'Europe/Vienna'),
    '+02:00'
  );

  equal(
    zoneOffset(Date.parse('2018-11-18T15:23:30.100Z'), 'Europe/London'),
    '+00:00'
  );

  equal(
    zoneOffset(Date.parse('2018-07-18T15:23:30.100Z'), 'Europe/London'),
    '+01:00'
  );

  equal(
    zoneOffset(Date.parse('2018-11-18T15:23:30.100Z'), 'America/New_York'),
    '-05:00'
  );

  equal(
    zoneOffset(Date.parse('2018-07-18T15:23:30.100Z'), 'America/New_York'),
    '-04:00'
  );

  equal(
    zoneOffset(Date.parse('2018-11-18T15:23:30.100Z'), 'America/Los_Angeles'),
    '-08:00'
  );

  equal(
    zoneOffset(Date.parse('2018-07-18T15:23:30.100Z'), 'America/Los_Angeles'),
    '-07:00'
  );

  end();
});
