/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { pad } from './strutil.mjs';
import { zones } from './zones.mjs';
import { guessOffset } from './gregorian/epoch.mjs';

export function validZone(zone) {
  if (zone === 'UTC') { return 'UTC'; }
  zone = (zone === 'SYSTEM') ? systemTimeZone() : zone;
  const match = /([+-])?(\d{1,2})(:?(\d{1,2}))?/.exec(zone);
  if (!match) {
    const found = new Intl.DateTimeFormat('en-us', { timeZone: zone, timeZoneName: 'short' }).formatToParts().find((i) => (i.type === 'timeZoneName'));
    if (!found || !found.value) {
      throw new Error(`invalid timezone: ${zone}`);
    }
    return zone;
  }
  const sign = match[1] || '+';
  const offset = (+match[2] * 60) + (+match[3] || 0);
  const hours = Math.floor(offset / 60);
  const minutes = Math.floor(offset % 60);
  return `${sign}${pad(hours, 2)}:${pad(minutes, 2)}`;
}

function systemTimeZone() {
  const zone = new Intl.DateTimeFormat('en-us', { timeZoneName: 'long' }).formatToParts().find((i) => (i.type === 'timeZoneName'));
  if (zones[zone.value]) { return zone.value; }

  const iana = Object.keys(zones);
  for (let iananame of iana) {
    const data = zones[iananame];
    if (Object.keys(data).find((off) => (data[off] === zone.value))) {
      return iananame;
    };
  }

  const offset = (new Date()).getTimezoneOffset();
  const sign = offset < 0 ? '-' : '+';
  const hours = ('00' + Math.floor(Math.abs(offset) / 60)).slice(-2);
  const minutes = ('00' + Math.floor(Math.abs(offset) % 60)).slice(-2);
  const short = `${sign}${hours}:${minutes}`;

  for (let iananame of iana) {
    const data = iana[iananame];
    if (data[short]) { return iananame; }
  }
  return short;
}

export function zoneOffset(ts, zone) {
  const offset = Math.floor(guessOffset(ts, zone) / 60000);
  const sign = offset <= 0 ? '+' : '-';
  const hours = ('00' + Math.floor(Math.abs(offset) / 60)).slice(-2);
  const minutes = ('00' + Math.abs(offset % 60)).slice(-2);

  return `${sign}${hours}:${minutes}`;
}
