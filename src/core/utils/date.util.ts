// core/utils/date.util.ts
import { DateTime } from 'luxon';

export function parseExcelDate(value: unknown, zone: string): Date {
  if (value instanceof Date) {
    return DateTime.fromJSDate(value, { zone: 'utc' })
      .setZone(zone)
      .startOf('day')
      .toJSDate();
  }

  if (typeof value === 'number') {
    // Excel serial date
    return DateTime.fromMillis((value - 25569) * 86400 * 1000, { zone })
      .startOf('day')
      .toJSDate();
  }

  throw new Error(`Invalid excel date value: ${value}`);
}
