/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { DATA } from './data.mjs';

export class TimeZone {
  constructor(zone) {
    const formatter = createFormatter(zone);
    this[DATA] = { zone, formatter };
  }
  get name() { return this[DATA].zone };
  get formatter() { return this[DATA].formatter; }
  getOffsetSeconds(ms) {
    const formatter = this[DATA].formatter;
    const { year, month, day, hour, minute, second } = formatter.formatToParts(ms).reduce((res, item) => {
      if (item.type !== 'literal') res[item.type] = parseInt(item.value, 10);
      return res;
    }, {});
    const millisecond = (ms % 1000);
    const offsetSeconds = Math.floor((Date.UTC(year, month - 1, day, hour, minute, second, millisecond) - ms) / 1000);
    return offsetSeconds;
  }
  getOffsetString(ms) {
    const offset = this.getOffsetSeconds(ms);
    const sign = (offset < 0) ? '-' : '+';
    const hour = Math.floor(Math.abs(offset) / 3600);
    const mins = Math.floor(Math.abs(offset) / 60) % 60;
    return `${sign}${pad(hour, 2)}:${pad(mins, 2)}`;
  }
  getDescriptor(ms) {
    if (this.formatter.nonGeographic) {
      return this.getOffsetString(ms);
    }
    if (this.name === 'UTC') {
      return 'Z';
    }
    return `${this.getOffsetString(ms)}[${this.name}]`;
  }
}
