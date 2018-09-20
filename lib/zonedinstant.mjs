/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { pad, num, spad  } from './strutil.mjs';
import { validZone, zoneOffset } from './zoneutil.mjs';
import { fromEpoch, toEpoch } from './gregorian/epoch.mjs';

import { Instant, VALUE } from './instant.mjs';

const INSTANT = Symbol('instant');
const ZONE = Symbol('zone');

export class ZonedInstant{
  constructor(instant, zone = 'SYSTEM') {
    zone = validZone(zone);
    this[INSTANT] = instant;
    this[ZONE] = zone;
  }

  get seconds() { return this[INSTANT].seconds; }
  get milliseconds() { return this[INSTANT].milliseconds; }
  get microseconds() { return this[INSTANT].microseconds; }
  get nanoseconds() { return this[INSTANT].nanoseconds; }
  get timeZone() { return this[ZONE]; }

  get offsetString() {
    if (/^[+-]\d{2}\:\d{3}$/.test(this.timeZone)) {
      return this.timeZone;
    }
    return zoneOffset(this.milliseconds, this.timeZone);
  }
  get ianaZone() {
    if (/^[+-]\d{2}\:\d{3}$/.test(this.timeZone)) {
      return undefined;
    }
    return this.timeZone;
  }

  toInstant() {
    return this[INSTANT];
  }
  toString() {
    const ts = this[INSTANT].milliseconds;
    const { year, month, day, hour, minute, second } = fromEpoch(ts, this[ZONE]);
    const millisecond = ts % 1E3;
    const nanosecond = this[INSTANT][VALUE].nanoseconds;
    const offset = this.offsetString;
    const ianazn = this.ianaZone;
    const zonestr = `${offset}${ianazn ? `[${ianazn}]` : ''}`;
    return `${spad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}T${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}.${pad(millisecond, 3)}${pad(nanosecond, 6)}${zonestr}`;
  }
  toJSON() {
    return this.toString();
  }

  static fromString(string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})(\d{6})(Z|[+-]\d{2}\:\d{2})(?:\[([\w|_]+\/[\w|_]+)\])?$/.exec(string);
    if (!match) {
      throw new Error(`invalid date-time-string ${string}`);
    }

    const offset = (match[9] === 'Z') ? '+00:00' : match[9];
    const ianazn = match[10];
    const milliseconds = toEpoch({
      year: num(match[1]),
      month: num(match[2]),
      day: num(match[3]),
      hour: num(match[4]),
      minute: num(match[5]),
      second: num(match[6]),
      millisecond: num(match[7])
    }, ianazn, offset);
    const nanoseconds = num(match[8]);

    const instant = Object.create(Instant.prototype);
    instant[VALUE] = { milliseconds, nanoseconds };

    const result = new ZonedInstant(instant, ianazn || offset);
    if (result.offsetString !== offset) {
      throw new TypeError('invalid date-time-string ${string}');
    }
    return result;
  }

  static fromSeconds(seconds, zone) {
    return ZonedInstant.fromMilliseconds(num(seconds) * 1000, zone);
  }
  static fromMilliseconds(milliseconds, zone) {
    return Instant.fromMilliseconds(milliseconds).withZone(zone);
  }
  static fromMicroseconds(micros, zone) {
    return Instant.fromMicroseconds(micros).withZone(zone);
  }
  static fromNanoseconds(nanos, zone) {
    return Instant.fromNanoseconds(nanos).withZone(zone);
  }
};
ZonedInstant.prototype[Symbol.toStringTag] = 'ZonedInstant';
