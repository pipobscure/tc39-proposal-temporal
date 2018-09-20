/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

export function pad(num, cnt) {
  const str = `${Math.abs(+num)}`;
  const prefix = (new Array(cnt)).fill('0').join('');
  return `${prefix}${`${str}`.trim()}`.slice(-1 * Math.max(cnt, str.length));
};
export function spad(num, cnt) {
  return `${+num < 0 ? '-' : ''}${pad(num, cnt)}`;
};

export function num(number = 0) {
  if (isNaN(+number)) throw new Error(`invalid number ${number}`);
  return +number;
};