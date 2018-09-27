/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { DATA } from '../data.mjs';
import { getInstantInfo, typeCheck } from '../utils.mjs';
import { CivilDateTime } from './datetime.mjs';

export class Zoned {
  constructor(zone, instant) {
    const ms = instant[DATA].milliseconds;
    const ns = instant[DATA].nanoseconds;
    const { year, month, day, hour, minute, second, nanosecond } = getInstantInfo(ms, ns, zone.name, zone.formatter)
    const datetime = new CivilDateTime(year, month, day, hour, minute, second, 0, 0, nanosecond);
    this[DATA] = { instant, zone, datetime };
  }

  get instant() { return this[DATA].instant; }
  get timeZone() { return this[DATA].zone; }

  get year() { return this.dateTime.year; }
  get month() { return this.dateTime.month; }
  get day() { return this.dateTime.day; }
  get hour() { return this.dateTime.hour; }
  get minute() { return this.dateTime.minute; }
  get second() { return this.dateTime.second; }

  get millisecond() { return this.dateTime.microsecond; }
  get microsecond() { return this.dateTime.microsecond; }
  get nanosecond() { return this.dateTime.nanosecond; }

  get dayOfWeek() { return this.dateTime.dayOfWeek; }
  get dayOfYear() { return this.dateTime.dayOfYear; }
  get weekOfYear() { return this.dateTime.weekOfYear; }

  plus({ years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, minutes = 0, seconds = 0, milliseconds = 0, microseconds = 0, nanoseconds = 0 }) {
    nanoseconds += (microseconds * 1E3);
    nanoseconds += this.instant[DATA].nanoseconds;

    while (nanoseconds < 0) { nanoseconds += 1E6; milliseonds -= 1; }
    while (nanoseconds > 1E6) { nanoseconds -= 1E6; milliseonds += 1; }

    milliseconds += (seconds * 1E3);
    milliseconds += (minutes * 60 * 1E3);
    milliseconds += (hours * 3600 * 1E3);
    milliseconds += (days * 86400 * 1E3);
    milliseconds += this.instant[DATA].milliseconds;

    let { year, month, day, hour, minute, second, nanosecond, offsetSeconds } = getInstantInfo(milliseconds, nanoseconds, thise.timeZone.name, this.timeZone.formatter);
    month += months;

    while (month < 1) { month += 12; year -= 1; }
    while (month > 12) { month -= 12; year += 1; }

    year += years;

    const civil = new CivilDateTime(year, month, day, hour, minute, second, 0, 0, nanosecond);
    return Zoned.fromCivilDateTime(this.timeZone, civil, (item, idx, all)=>{
      if (item.offsetSeconds === offsetSeconds) { return true; }
      return (all.length - 1) === idx;
    });
  }
  with({ years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, minutes = 0, seconds = 0, milliseconds = 0, microseconds = 0, nanoseconds = 0 }) {
    const civil = new CivilDateTime(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    return Zoned.fromCivilDateTime(this.timeZone, civil, (item, idx, all) => {
      if (item.offsetSeconds === offsetSeconds) { return true; }
      return (all.length - 1) === idx;
    });
  }

  toDateTime() { return this[DATA].datetime; }
  toDate() { return this[DATA].datetime.toDate(); }
  toTime() { return this[DATA].datetime.toTime(); }

  toDateTimeString() {
    const dt = this.dateTime.toDateTimeString();
    const tz = this.timeZone.getDescriptor(this.instant.milliseconds);
    return `${dt}${tz}`;
  }
  toWeekDateTimeString() {
    const dt = this.dateTime.toWeekDateTimeString();
    const tz = this.timeZone.getDescriptor(this.instant.milliseconds);
    return `${dt}${tz}`;
  }
  toOrdinalDateTimeString() {
    const dt = this.dateTime.toOrdinalDateTimeString();
    const tz = this.timeZone.getDescriptor(this.instant.milliseconds);
    return `${dt}${tz}`;
  }
  toString() {
    return this.toDateTimeString();
  }
  toJSON() {
    return this.toString();
  }

  static fromInstant(zone, instant) {
    typeCheck(zone, 'TimeZone');
    typeCheck(instant, 'Instant');

    const ms = instant[DATA].milliseconds;
    const ns = instant[DATA].nanoseconds;
    const { year, month, day, hour, minute, second, nanosecond } = getInstantInfo(ms, ns, zone.name, zone.formatter)
    const datetime = new CivilDateTime(year, month, day, hour, minute, second, 0, 0, nanosecond);

    const result = Object.create(Zoned.prototype);
    result[DATA] = { instant, zone, datetime };

    return result;
  }
  static fromCivilDateTime(zone, datetime, filter) {
    typeCheck(zone, 'TimeZone');
    typeCheck(datetime, 'CivilDateTime');

    const zoned = findTimestamp(datetime, zone, filter);
    if (!zoned) {
      throw new Error(`invalid time in zone ${zone}`);
    }
    const instant = Object.create(Instant.prototype);
    instant[DATA] = zoned;

    const result = Object.create(Zoned.prototype);
    result[DATA] = { instant, zone, datetime };
    return result;
  }
  static fromDateTimeString(string) {
    const match = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{9})(?:([+-]\d{2}\:\d{2})(?:\[([\w_]+(?:\/[\w_]+)+)\])|Z)$/.exec('' + string);
    if (!match) { throw new Error(`invalid date-time-string ${string}`); }
    const civil = CivilDateTime.fromDateTimeString(match[1]);
    const zone = new TimeZone(match[3] || match[2]);
    return Zoned.fromCivilDateTime(zone, civil, match[2]);
  }
  static fromWeekDateTimeString(string) {
    const match = /^(\d{4}-W\d{2}-\d{1}T\d{2}:\d{2}:\d{2}\.\d{9})(?:([+-]\d{2}\:\d{2})(?:\[([\w_]+(?:\/[\w_]+)+)\])|Z)$/.exec('' + string);
    const civil = CivilDateTime.WeekDateTimeString(match[1]);
    const zone = new TimeZone(match[3] || match[2]);
    return Zoned.fromCivilDateTime(zone, civil, match[2]);
  }
  static fromOrdinalDateTimeString(string) {
    const match = /^(\d{4}-\d{3}T\d{2}:\d{2}:\d{2}\.\d{9})(?:([+-]\d{2}\:\d{2})(?:\[([\w_]+(?:\/[\w_]+)+)\])|Z)$/.exec('' + string);
    if (!match) { throw new Error(`invalid date-ordinaltime-string ${string}`); }
    const civil = CivilDateTime.fromOrdinalDateTimeString(match[1]);
    const zone = new TimeZone(match[3] || match[2]);
    return Zoned.fromCivilDateTime(zone, civil, match[2]);
  }
  static fromString(string) {
    try {
      return Zoned.fromDateTimeString(string);
    } catch (ex) { }
    try {
      return Zoned.fromWeekDateTimeString(string);
    } catch (ex) { }
    try {
      return Zoned.fromOrdinalDateTimeString(string);
    } catch (ex) { }
    throw new Error('invalid iso-date-time string');
  }
}

Zoned.prototype[Symbol.toStringTag] = 'ZonedCivilDateTime';

function findTimestamp(data = {}, zone, filter) {
  const { year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0, microsecond = 0, nanosecond = 0 } = data;
  const base = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
  const nanoseconds = (microsecond * 1E3) + nanosecond;

  const opts = possibleOffsets(year, zone).sort().map((offset) => {
    const milliseconds = base - (offset * 1E3);
    const info = getInstantInfo(milliseconds, nanoseconds, zone.name, zone.formatter);
    if (info.hour !== hour) return undefined;
    if (info.year !== year) return undefined;
    if (info.month !== month) return undefined;
    if (info.day !== day) return undefined;
    if (info.minute !== minute) return undefined;
    if (info.second !== second) return undefined;
    return { milliseconds, nanoseconds };
  }).filter(x => !!x);

  switch (typeof filter) {
    case 'string':
      return zoned.find((zoned) => (zoned.offsetString === filter));
    case 'number':
      return zoned.find((zoned) => (zoned.offsetSeconds === filter));
    case 'function':
      return zoned.find(filter);
    default:
      return zoned.shift();
  }
}

function possibleOffsets(year, zone) {
  const base = new Date(year, 0, 2, 9);

  const res = new Set();
  (new Array(12).fill(0)).forEach((_, month) => {
    base.setMonth(month);
    res.add(zone.offsetSeconds(base.getTime()));
  });

  return Array.from(res);
}
