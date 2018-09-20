export class Instant {
  constructor(nanos_since_epoch : BigInt);

  readonly seconds: number;
  readonly milliseconds: number;
  readonly microseconds: BigInt;
  readonly nanoseconds: BigInt;

  withZone(timeZone : string) : ZonedInstant;
  toString() : string;
  toJSON() : string;

  static fromString(isostring: string) : Instant;
  static fromSeconds(seconds: number) : Instant;
  static fromMilliseconds(milliseconds : number) : Instant;
  static fromMicroseconds(micros: BigInt) : Instant;
  static fromNanoseconds(nanos: BigInt) : Instant;
}
export class ZonedInstant {
  constructor(instant : Instant, timeZone: string);

  readonly seconds: number;
  readonly milliseconds: number;
  readonly microseconds: BigInt;
  readonly nanoseconds: BigInt;
  readonly timeZone: string;
  readonly offsetString: string;
  readonly ianaZone: string | undefined;

  toInstant() : Instant;
  toString(): string;

  static fromString(isostring: string) : ZonedInstant;
  static fromSeconds(seconds : number, zone : string) : ZonedInstant;
  static fromMilliseconds(milliseconds : number, zone : string) : ZonedInstant;
  static fromMicroseconds(micros : BigInt, zone : string) : ZonedInstant;
  static fromNanoseconds(nanos : BigInt, zone : string) : ZonedInstant;
}

export interface GregorianDateValues {
  year?: number;
  month?: number;
  day?: number;
}
export interface GregorianTimeValues {
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
  microsecond?: number;
  nanosecond?: number;
}
export interface GregorianDateTimeValues extends GregorianTimeValues, GregorianDateValues {
}

export class GregorianDateTime implements GregorianDateTimeValues {
  constructor(years : number, months : number, days : number, hours : number, minutes : number, seconds : number = 0, nanoseconds : number = 0);

  readonly year : number;
  readonly month : number;
  readonly day : number;
  readonly hour : number;
  readonly minute : number;
  readonly second : number;
  readonly millisecond : number;
  readonly microsecond : number;
  readonly nanosecond : number;
  readonly dayOfWeek : number;
  readonly dayOfYear : number;
  readonly weekOfYear : number;

  plus(data: GregorianDateTimeValues) : GregorianDateTime;
  with(values: GregorianDateTimeValues) : GregorianDateTime;
  toGregorianDate() : GregorianDate;
  toGregorianTime() : GregorianTime;
  withZone(zone : string) : ZonedInstant;
  toString() : string;
  toJSON() : string;
  toDateTimeString() : string;
  toWeekDateTimeString() : string;
  toOrdinalDateTimeString() : string;

  static from(date?: GregorianDate, time?:GregorianTime) : GregorianDateTime;
  static fromString(isostring: string): GregorianDateTime;
  static fromZonedInstant(instant: ZonedInstant): GregorianDateTime;
}
export class GregorianDate implements GregorianDateValues {
  constructor(years : number, months: number, days : number);

  readonly year : number;
  readonly month : number;
  readonly day : number;
  readonly dayOfWeek : number;
  readonly dayOfYear : number;
  readonly weekOfYear : number;

  plus(data : GregorianDateValues) : GregorianDate;
  with(values : GregorianDateValues) : GregorianDate;
  withTime(time : GregorianTime) : GregorianDateTime;
  toString() : string;
  toJSON() : string;
  toDateString() : string;
  toWeekDateString() : string;
  toOrdinalDateString() : string;

  static fromString(isostring : string) : GregorianDate;
  static fromZonedInstant(instant : ZonedInstant) : GregorianDate;
}
export class GregorianTime implements GregorianTimeValues {
  constructor(hours : number, minutes : number, seconds? : number, nanoseconds?: number);

  readonly hour : number;
  readonly minute : number;
  readonly second : number;
  readonly millisecond : number;
  readonly microsecond : number;
  readonly nanosecond : number;

  plus(data : GregorianTimeValues) : GregorianTime;
  with(values : GregorianTimeValues) : GregorianTime;
  withDate(date : GregorianDate) : GregorianDateTime;
  toString() : string;
  toJSON() : string;

  static fromString(isostring : string) : GregorianTime;
  static fromZonedInstant(instant : ZonedInstant) : GregorianTime;
}
