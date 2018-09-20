/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { pad, spad } from '../strutil.mjs';
import { plus, dayOfWeek, dayOfYear, weekOfYear  } from './shared.mjs';
import { toEpoch, fromEpoch } from './epoch.mjs';
import { GregorianDate } from './gregoriandate.mjs';
import { GregorianTime } from './gregoriantime.mjs';
import { VALUE, Instant } from '../instant.mjs';
import { ZonedInstant } from '../zonedinstant.mjs';

const DATA = Symbol('data');

export class GregorianDateTime {
  constructor(years, months, days, hours, minutes, seconds = 0, nanoseconds = 0) {
    this[DATA] = plus({}, { years, months, days, hours, minutes, seconds, nanoseconds });
  }

  get year() { return this[DATA].year; }
  get month() { return this[DATA].month; }
  get day() { return this[DATA].day; }
  get hour() { return this[DATA].hour; }
  get minute() { return this[DATA].minute; }
  get second() { return this[DATA].second; }
  get millisecond() { return Math.floor(this[DATA].nanosecond / 1e6); }
  get microsecond() { return Math.floor(this[DATA].nanosecond / 1e3); }
  get nanosecond() { return this[DATA].nanosecond; }

  get dayOfWeek() { return dayOfWeek(this.year, this.month, this.day); }
  get dayOfYear() { return dayOfYear(this.year, this.month, this.day); }
  get weekOfYear() { return weekOfYear(this.year, this.month, this.day); }

  plus(data) {
    const { year, month, day, hour, minute, second, nanosecond } = plus(this, data);
    return new GregorianDateTime(year, month, day, hour, minute, second, nanosecond);
  }
  with({ year = this.year, month = this.month, day = this.day, hour = this.hour, minute = this.minute, second = this.second, millisecond = 0, microsecond = 0, nanosecond = this.nanosecond } = {}) {
    return new GregorianDateTime(year, month, day, hour, minute, second, nanosecond + (microsecond * 1e3) + (millisecond * 1e6));
  }
  toGregorianDate() {
    const { year, month, day } = this;
    return new GregorianDate(year, month, day);
  }
  toGregorianTime() {
    const { hour, minute, second, millisecond, nanosecond } = this;
    return new GregorianTime(hour, minute, second, millisecond, nanosecond);
  }
  withZone(zone) {
    const milliseconds = toEpoch(this, zone);
    const nanoseconds = this.nanosecond;
    const instant = Object.create(Instant.prototype);
    instant[VALUE] = { milliseconds, nanoseconds };
    return new ZonedInstant(instant, zone);
  }
  toString() { return this.toDateTimeString(); }
  toJSON() { return this.toString(); }
  toDateTimeString() {
    const { year, month, day, hour, minute, second, nanosecond } = this;
    return `${spad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}T${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}.${pad(nanosecond, 9)}`;
  }
  toWeekDateTimeString() {
    const { year, weekOfYear, dayOfWeek, hour, minute, second, nanosecond } = this;
    return `${spad(year, 4)}-W${pad(weekOfYear, 2)}-${pad(dayOfWeek, 2)}T${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}.${pad(nanosecond, 9)}`;
  }
  toOrdinalDateTimeString() {
    const { year, dayOfYear, hour, minute, second, millisecond, nanosecond } = this;
    return `${spad(year, 4)}-${pad(dayOfYear, 3)}T${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}.${pad(nanosecond, 9)}`;
  }

  static from(date = {}, time = {}) {
    const { year, month, day } = date;
    const { hour, minute, second, nanosecond } = time;
    return new GregorianDateTime(year, month, day, hour, minute, second, nanosecond);
  }
  static fromString(string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{9})$/.exec(string);
    if (!match) {
      throw new Error(`invalid date-time-string ${string}`);
    }
    return new GregorianDateTime(+match[1], +match[2], +match[3], +match[4], +match[5], +match[6], +match[7]);
  }
  static fromZonedInstant(instant) {
    const { year, month, day, hour, minute, second, millisecond } = fromEpoch(instant.milliseconds, instant.timeZone);
    const nanosecond = instant.nanoseconds;
    return new GregorianDateTime(year, month, day, hour, minute, second, millisecond, nanosecond);
  }
};
GregorianDateTime.prototype[Symbol.toStringTag] = 'GregorianDateTime';
