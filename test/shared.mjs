#! /usr/bin/env node -S --experimental-modules

/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import test from 'tape';

import {
  isLeapYear,
  toDayOfWeek,
  toDayOfYear,
  fromDayOfYear,
  toWeekOfYear,
  fromWeekOfYear,
  plus
} from '../lib/civil/shared.mjs';

test('isLeapYear()', ({ equal, end })=>{
  equal(isLeapYear(2018), false);
  equal(isLeapYear(2017), false);
  equal(isLeapYear(2016), true);
  equal(isLeapYear(2015), false);
  equal(isLeapYear(2014), false);
  equal(isLeapYear(2013), false);
  equal(isLeapYear(2012), true);
  equal(isLeapYear(2001), false);
  equal(isLeapYear(2000), true);
  equal(isLeapYear(1900), false);
  end();
});

test('toDayOfWeek()', ({ equal, end })=>{
  equal(toDayOfWeek(1976, 11, 14), 0);
  equal(toDayOfWeek(1976, 11, 15), 1);
  equal(toDayOfWeek(1976, 11, 16), 2);
  equal(toDayOfWeek(1976, 11, 17), 3);
  equal(toDayOfWeek(1976, 11, 18), 4);
  equal(toDayOfWeek(1976, 11, 19), 5);
  equal(toDayOfWeek(1976, 11, 20), 6);
  equal(toDayOfWeek(1976, 11, 21), 0);
  end();
});

test('toDayOfYear()', ({ equal, end })=>{
  equal(toDayOfYear(1976, 11, 18), 323);
  equal(toDayOfYear(1977, 11, 18), 322);
  equal(toDayOfYear(1978, 11, 18), 322);
  equal(toDayOfYear(1979, 11, 18), 322);
  equal(toDayOfYear(1980, 11, 18), 323);
  end();
});

test('fromDayOfYear()', ({ deepEqual, end })=>{
  deepEqual(fromDayOfYear(1976, 323), { year : 1976, month : 11, day : 18 });
  deepEqual(fromDayOfYear(1977, 322), { year: 1977, month: 11, day: 18 });
  end();
});

test('toWeekOfYear()', ({ equal, end })=>{
  equal(toWeekOfYear(1976, 11, 18), 47);
  equal(toWeekOfYear(2018, 1, 1), 1);
  equal(toWeekOfYear(2017, 1, 1), 52);
  equal(toWeekOfYear(2016, 1, 1), 53);
  equal(toWeekOfYear(2016, 1, 2), 53);
  equal(toWeekOfYear(2016, 1, 3), 53);
  equal(toWeekOfYear(2016, 1, 4), 1);
  equal(toWeekOfYear(1979, 12, 31), 1);
  equal(toWeekOfYear(1980, 12, 30), 1);
  equal(toWeekOfYear(1980, 12, 31), 1);
  end();
});

test('fromWeekOfYear()', ({ deepEqual, end })=>{
  deepEqual(fromWeekOfYear(1976, 47, 4), { year : 1976, month: 11, day : 18});
  deepEqual(fromWeekOfYear(1981, 1, 2), { year: 1980, month: 12, day: 30 });
  deepEqual(fromWeekOfYear(1981, 1, 3), { year: 1980, month: 12, day: 31 });
  deepEqual(fromWeekOfYear(2015, 53, 5), { year: 2016, month: 1, day: 1 });
  deepEqual(fromWeekOfYear(2015, 53, 6), { year: 2016, month: 1, day: 2 });
  deepEqual(fromWeekOfYear(2015, 53, 7), { year: 2016, month: 1, day: 3 });
  end();
});

test('plus should be transparent', ({ deepEqual, end }) => {
  deepEqual(plus({}, {
    years: 2015, months: 3, days: 5,
    hours: 14, minutes: 23, seconds: 51,
    milliseconds: 23, microseconds: 25, nanoseconds: 424
  }), {
    year: 2015, month: 3, day: 5,
    hour: 14, minute: 23, second: 51,
    nanosecond: 23025424
  });

  deepEqual(plus({}, {
    years: 2019, months: 3, days: 13,
    hours: 14, minutes: 24, seconds: 55,
    milliseconds: 23, microseconds: 25, nanoseconds: 4
  }), {
    year: 2019, month: 3, day: 13,
    hour: 14, minute: 24, second: 55,
    nanosecond: 23025004
  });
  end();
});

test('plus should overflow correctly', ({ deepEqual, end }) => {
  deepEqual(plus({}, {
    years: 1970, months: 1, days: 1,
    hours: 0, minutes: 0, seconds: 0,
    milliseconds: 0, microseconds: 0, nanoseconds: Number.MAX_SAFE_INTEGER
  }), {
    year: 1970, month: 4, day: 15,
    hour: 5, minute: 59,
    second: 59, nanosecond: 254740991
  });

  deepEqual(plus({}, {
    years: 1970, months: 1, days: 1,
    hours: 0, minutes: 0, seconds: 0,
    milliseconds: 0, microseconds: Number.MAX_SAFE_INTEGER / 1E3, nanoseconds: 0
  }), {
    year: 1970, month: 4, day: 15,
    hour: 5, minute: 59,
    second: 59, nanosecond: 254740990
  });

  deepEqual(plus({}, {
    years: 1970, months: 1, days: 1,
    hours: 0, minutes: 0, seconds: 0,
    milliseconds: Number.MAX_SAFE_INTEGER / 1E6, microseconds: 0, nanoseconds: 0
  }), {
    year: 1970, month: 4, day: 15,
    hour: 5, minute: 59,
    second: 59, nanosecond: 254740992
  });

  deepEqual(plus({}, {
    years: 1970, months: 1, days: 1,
    hours: 0, minutes: 0, seconds: Number.MAX_SAFE_INTEGER / 1E6,
    milliseconds: 0, microseconds: 0, nanoseconds: 0
  }), {
    year: 2255, month: 6, day: 5,
    hour: 23, minute: 47,
    second: 34, nanosecond: 0
  });

  end();
});
