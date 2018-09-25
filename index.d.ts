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

  readonly instant: Instant;
  readonly offsetSeconds : number;
  readonly offsetString: string;
  readonly ianaZone: string | undefined;
  readonly timeZone: string;

  toString(): string;
  toJSON(): string;

  static fromString(isostring: string) : ZonedInstant;
  static fromSeconds(seconds : number, zone : string) : ZonedInstant;
  static fromMilliseconds(milliseconds : number, zone : string) : ZonedInstant;
  static fromMicroseconds(micros : BigInt, zone : string) : ZonedInstant;
  static fromNanoseconds(nanos : BigInt, zone : string) : ZonedInstant;
}

export interface CivilDateValues {
  years?: number;
  months?: number;
  days?: number;
}
export interface CivilTimeValues {
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  microseconds?: number;
  nanoseconds?: number;
}
export interface CivilDateTimeValues extends CivilTimeValues, CivilDateValues {
}

export class CivilDateTime {
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

  plus(data: CivilDateTimeValues) : CivilDateTime;
  with(values: CivilDateTimeValues) : CivilDateTime;
  withZone(zone : string) : ZonedInstant;
  toString() : string;
  toJSON() : string;
  toDateTimeString() : string;
  toWeekDateTimeString() : string;
  toOrdinalDateTimeString() : string;

  static fromDateTimeString(isostring : string): string;
  static fromWeekDateTimeString(isostring : string): string;
  static fromOrdinalDateTimeString(isostring : string): string;
  static fromString(isostring: string): CivilDateTime;
  static fromZonedInstant(instant: ZonedInstant): CivilDateTime;
}
export class CivilDate {
  constructor(years : number, months: number, days : number);

  readonly year : number;
  readonly month : number;
  readonly day : number;
  readonly dayOfWeek : number;
  readonly dayOfYear : number;
  readonly weekOfYear : number;

  plus(data : CivilDateValues) : CivilDate;
  with(values : CivilDateValues) : CivilDate;
  withTime(time : CivilTime) : CivilDateTime;
  toString() : string;
  toJSON() : string;
  toDateString() : string;
  toWeekDateString() : string;
  toOrdinalDateString() : string;

  static fromString(isostring : string) : CivilDate;
  static fromZonedInstant(instant : ZonedInstant) : CivilDate;
  static fromDateTime(datetime : CivilDateTime) : CivilDate;
}
export class CivilTime {
  constructor(hours : number, minutes : number, seconds? : number, nanoseconds?: number);

  readonly hour : number;
  readonly minute : number;
  readonly second : number;
  readonly millisecond : number;
  readonly microsecond : number;
  readonly nanosecond : number;

  plus(data : CivilTimeValues) : CivilTime;
  with(values : CivilTimeValues) : CivilTime;
  withDate(date : CivilDate) : CivilDateTime;
  toString() : string;
  toJSON() : string;

  static fromString(isostring : string) : CivilTime;
  static fromZonedInstant(instant : ZonedInstant) : CivilTime;
  static fromDateTime(datetime: CivilDateTime): CivilTime;
}
