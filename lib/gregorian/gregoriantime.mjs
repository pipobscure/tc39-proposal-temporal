/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { plus } from './shared.mjs';
import { pad } from '../strutil.mjs';
import { GregorianDateTime } from './gregoriandatetime.mjs';
import { fromEpoch } from './epoch.mjs';

const DATA = Symbol('data');

export class GregorianTime {
  constructor(hours, minutes, seconds = 0, nanoseconds = 0) {
    const { hour, minute, second, nanosecond } = plus({}, { hours, minutes, seconds, nanoseconds });
    this[DATA] = { hour, minute, second, nanosecond };
  }

  get hour() { return this[DATA].hour; }
  get minute() { return this[DATA].minute; }
  get second() { return this[DATA].second; }
  get millisecond() { return Math.floor(this[DATA].nanosecond / 1e6); }
  get microsecond() { return Math.floor(this[DATA].nanosecond / 1e3); }
  get nanosecond() { return this[DATA].nanosecond; }

  plus(data) {
    const {
      hour,
      minute,
      second,
      nanosecond
    } = plus(this, data);
    return new GregorianTime(hour, minute, second, nanosecond);
  }
  with({ hour = this.hour, minute = this.minute, second = this.second, millisecond = 0, microsecond = 0, nanosecond = this.nanosecond } = {}) {
    return new GregorianTime(hour, minute, second, nanosecond + (microsecond * 1e3) + (millisecond * 1e6));
  }
  withDate(date) {
    return new GregorianDateTime.from(date, this);
  }
  toString() {
    const { hour, minute, second, millisecond, nanosecond } = this;
    return `${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}.${pad(nanosecond, 9)}`;
  }
  toJSON() { return this.toString(); }

  static fromString(string) {
    const match = /^(\d{2}):(\d{2}):(\d{2})\.(\d{9})$/.exec(string);
    if (!match) {
      throw new Error(`invalid time-string ${string}`);
    }
    return new GregorianTime(+match[1], +match[2], +match[3], +match[4]);
  }
  static fromZonedInstant(instant) {
    const { hour, minute, second, millisecond } = fromEpoch(instant.milliseconds, instant.timeZone);
    const nanosecond = instant.nanoseconds;
    return new GregorianTime(hour, minute, second, millisecond, nanosecond);
  }
};
GregorianTime.prototype[Symbol.toStringTag] = 'GregorianTime';
