const test = require('tape');
const { Instant, ZonedInstant } = require('../../');

test('ZonedInstant', ({ test, end})=>{
  test('simple', ({ equal, end })=>{

    end();
  });

  test('construct', ({ equal, end })=>{
    const instant = Instant.fromMilliseconds(217175010450);
    const instance = new ZonedInstant(instant, 'Europe/Vienna');

    equal(typeof instance, 'object');
    equal(instance instanceof ZonedInstant, true);
    equal(instance.milliseconds, 217175010450);
    equal(instance.microseconds, 217175010450000n);
    equal(instance.nanoseconds, 217175010450000000n);
    equal(instance.toString(), '1976-11-18T15:23:30.450000000+01:00[Europe/Vienna]');
    end();
  });

  test('fromString', ({ equal, throws, end })=>{
    const one = ZonedInstant.fromString('1976-11-18T15:23:30.450000100+01:00[Europe/Berlin]');
    equal(one instanceof ZonedInstant, true);
    equal(one.milliseconds, Date.parse('1976-11-18T15:23:30.450000100+01:00'));
    equal(one.nanoseconds, (BigInt(one.milliseconds) * BigInt(1E6)) + 100n);
    equal(one.timeZone, 'Europe/Berlin');
    equal(one.offsetString, '+01:00');
    equal(one.ianaZone, 'Europe/Berlin');

    const two = ZonedInstant.fromString('1976-11-18T15:23:30.450000100+01:00');
    equal(two instanceof ZonedInstant, true);
    equal(two.milliseconds, Date.parse('1976-11-18T15:23:30.450000100+01:00'));
    equal(two.timeZone, '+01:00');
    equal(two.offsetString, '+01:00');
    equal(two.ianaZone, undefined);

    throws(()=>{
      ZonedInstant.fromString('1976-11-18T15:23:30.450000100[Europe/Vienna]');
    });
    throws(()=>{
      ZonedInstant.fromString('1976-11-18T15:23:30.450000100+05:00[Europe/Vienna]');
    });
    throws(()=>{
      ZonedInstant.fromString('1976-11-18T15:23:30.450000100');
    });

    end();
  });

  end();
});
