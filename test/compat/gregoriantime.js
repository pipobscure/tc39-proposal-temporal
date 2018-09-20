const test = require('tape');
const { GregorianTime } = require('../..');

test('GregorianTime', ({ test, end })=>{
  test('construct', ({ equal, end })=>{
    const instance = new GregorianTime(15, 23, 30, 45012345);

    equal(typeof instance, 'object');
    equal(instance instanceof GregorianTime, true);
    equal(instance.year, undefined);
    equal(instance.month, undefined);
    equal(instance.day, undefined);
    equal(instance.hour, 15);
    equal(instance.minute, 23);
    equal(instance.second, 30);
    equal(instance.millisecond, 45);
    equal(instance.microsecond, 45012);
    equal(instance.nanosecond, 45012345);
    equal(instance.toString(), '15:23:30.045012345');

    end();
  });

  test('fromString', ({ equal, throws, end })=>{
    const one = GregorianTime.fromString('15:23:30.450000100');
    equal(one instanceof GregorianTime, true);
    equal(one.hour, 15);
    equal(one.minute, 23);
    equal(one.second, 30);
    equal(one.millisecond, 450);
    equal(one.microsecond, 450000);
    equal(one.nanosecond, 450000100);

    throws(()=>{
      GregorianTime.fromString('1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
    });
    throws(()=>{
      GregorianTime.fromString('1976-11-18T15:23:30.450000100[Europe/Vienna]');
    });
    throws(()=>{
      GregorianTime.fromString('1976-11-18T15:23:30.450000100+01:00');
    });
    throws(()=>{
      GregorianTime.fromString('1976-11-18T15:23:30.450000100');
    });
    throws(()=>{
      GregorianTime.fromString('15:23:30.123');
    });
    throws(()=>{
      GregorianTime.fromString('15:23:30');
    });
    throws(()=>{
      GregorianTime.fromString('15:23');
    });

    end();
  });

  end();
});
