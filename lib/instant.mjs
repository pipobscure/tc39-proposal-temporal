/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { pad, spad, num } from './strutil.mjs';
import { ZonedInstant } from './zonedinstant.mjs';
import { fromEpoch } from './gregorian/epoch.mjs';

export const VALUE = Symbol('value');

export class Instant {
  constructor(nanos) {
    if('bigint' !== typeof nanos) { throw new TypeError('Instant must be constructed with BigInt'); }
    const milliseconds = Number(nanos / BigInt(1E6));
    const nanoseconds = Number(nanos % BigInt(1E6));
    this[VALUE] = { milliseconds, nanoseconds };
  }

  get seconds() { return Math.floor(this[VALUE].milliseconds / 1E3); }
  get milliseconds() { return this[VALUE].milliseconds; }
  get microseconds() { return this.nanoseconds / BigInt(1E3); }
  get nanoseconds() { return (BigInt(this.milliseconds) * BigInt(1E6)) + BigInt(this[VALUE].nanoseconds); }

  withZone(zone) {
    return new ZonedInstant(this, zone);
  }
  toString() {
    const { year, month, day, hour, minute, second, millisecond } = fromEpoch(this.milliseconds, 'UTC');
    const nanosecond = this[VALUE].nanoseconds
    return `${spad(year,4)}-${pad(month,2)}-${pad(day,2)}T${pad(hour,2)}:${pad(minute,2)}:${pad(second,2)}.${pad(millisecond,3)}${pad(nanosecond,6)}Z`;
  }
  toJSON() {
    return this.toString();
  }

  static fromString(string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})(\d{6})Z$/.exec(string);
    if (!match) {
      throw new Error(`invalid date-time-string ${string}`);
    }
    const milliseconds = Date.UTC(num(match[1]), num(match[2]) - 1, num(match[3]), num(match[4]), num(match[5]), num(match[6]), num(match[7]));
    const nanoseconds = num(match[8]);

    const instant = Object.create(Instant.prototype);
    instant[VALUE] = { milliseconds, nanoseconds };

    return instant;
  }

  static fromSeconds(seconds) {
    Instant.fromMilliseconds(num(seconds) * 1E3);
  }
  static fromMilliseconds(milliseconds) {
    milliseconds = num(milliseconds);
    const object = Object.create(Instant.prototype);
    object[VALUE] = {
      milliseconds,
      nanoseconds: 0
    };
    return object;
  }
  static fromMicroseconds(micros) {
    if ('bigint' !== typeof micros) { throw new TypeError('microseconds must be given as BigInt'); }
    return new Instant(micros * BigInt(1E3));
  }
  static fromNanoseconds(nanos) {
    return new Instant(nanos);
  }
}
Instant.prototype[Symbol.toStringTag] = 'Instant';
