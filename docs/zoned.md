[&laquo;][1]|[&raquo;][3]

---

# `ZonedInstant`

A `ZonedInstant` is an object that specifies a specific point in time in a specific time-zone.
It bases this on an `Instant` and a timezone `string`.

## `new ZonedInstant(instant : Instant, timeZone: string)`

The constructor may only be called as such. It takes two arguments. The first is an instance
of `Instant` and the second is a `string` representing a valid IANA timezone or an offset.

## `zoned.instant: Instant`

The instance of `Instant` that was used to create this `ZonedInstant`.

## `zoned.offsetSeconds : number`

The number of seconds the `ZonedInstant`'s time is offset from *UTC*.

## `zoned.offsetString: string`

The time-zone offset represented as a `string`.

This must always have the format: `sign``hours`:`minutes` where

 * `sign` is eitner `+` or `-`
 * `hours` is the hours offset 0-padded to 2 digits.
 * `minutes` is the minutes offset 0-padded to 2 digits.

Examples: `+00:00`, `-04:00`, `+03:00`, ...

## `zoned.ianaZone: string | undefined`

If the `ZonedInstant` was created using an IANA-Timezone (rather than an offset) this property will
return that timezone string. Otherwise this property will be `undefined`.

## `zoned.timeZone: string`

This will be `zoned.ianaZone` if available or `zone.offsetString` if it is not.

## `zoned.toString(): string`

This creates an ISO-8601 string in the following format
**`year`-`month`-`day`T`hours`:`minutes`:`seconds`.`nanoseconds``offset`** if an IANA-Zone is
not available or **`year`-`month`-`day`T`hours`:`minutes`:`seconds`.`nanoseconds``offset`[`iana`]**
if an IANA-Timezone is available.

The `year` is 0-padded to a minimum of 4 digits. `month`, `day`, `hours`, `minutes`, `seconds`
are 0-padded to a minimum of 2 digits. `nanoseconds` is 0-padded to a minimum of 9 digits. the
`offset` is the timezone offset as created by `zoned.offsetString`. `iana` is the IANA Timezone
string.

Examples:

 * `1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]` - created with `Europe/Vienna` timezone
 * `1976-11-18T15:23:30.123456789+01:00` - created with `+01:00` timezone

## `zoned.toJSON(): string`

Equivalent to `zoned.toString()`.

## `ZonedInstant.fromString(isostring: string) : ZonedInstant`

Parses a `string` in the specific ISO-8601 format emitted by `zoned.toString()`.

## `ZonedInstant.fromSeconds(seconds : number, zone : string) : ZonedInstant`

Equivalent to `new ZonedInstant(Instant.fromSeconds(seconds), zone)`.

## `ZonedInstant.fromMilliseconds(milliseconds : number, zone : string) : ZonedInstant`

Equivalent to `new ZonedInstant(Instant.fromMilliseconds(milliseconds), zone)`.

## `ZonedInstant.fromMicroseconds(micros : BigInt, zone : string) : ZonedInstant`

Equivalent to `new ZonedInstant(Instant.fromMicroseconds(micros), zone)`.

## `ZonedInstant.fromNanoseconds(nanos : BigInt, zone : string) : ZonedInstant`

Equivalent to `new ZonedInstant(Instant.fromNanoseconds(nanos), zone)`.

---

 * [Instant][1]
 * [ZonedInstant][2]
 * [CivilDateTime][3]
 * [CivilDate][4]
 * [CivilTime][5]

[1]: instant.md "Instant"
[2]: zoned.md "ZonedInstant"
[3]: civildatetime.md "CivilDateTime"
[4]: civildate.md "CivilDate"
[5]: civiltime.md "CivilTime"
