import { format } from 'date-fns';

export interface TimeExceptionLike {
  date: string;
  time: string;
  duration: number;
}

export interface EventOccurrence {
  date: Date;
  dateKey: string;
  time: string;
  duration: number;
  hasException: boolean;
}

export const toDateKey = (value: Date | string): string => {
  if (typeof value === 'string') {
    const normalized = value.trim();
    const match = normalized.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return format(parsed, 'yyyy-MM-dd');
};

export const dateFromDateKey = (dateKey: string): Date => new Date(`${dateKey}T12:00:00`);

export const normalizeEventDates = (dates?: Array<Date | string>, fallbackDate?: Date | string): Date[] => {
  const source = dates && dates.length > 0 ? dates : fallbackDate ? [fallbackDate] : [];

  return source
    .map((value) => (value instanceof Date ? value : new Date(value)))
    .filter((value) => !Number.isNaN(value.getTime()));
};

interface BuildOccurrencesInput {
  dates?: Array<Date | string>;
  fallbackDate?: Date | string;
  defaultTime: string;
  defaultDuration: number;
  exceptions?: TimeExceptionLike[];
}

export const buildEventOccurrences = ({
  dates,
  fallbackDate,
  defaultTime,
  defaultDuration,
  exceptions = [],
}: BuildOccurrencesInput): EventOccurrence[] => {
  const uniqueDates = new Map<string, Date>();

  normalizeEventDates(dates, fallbackDate).forEach((date) => {
    const key = toDateKey(date);
    if (key && !uniqueDates.has(key)) uniqueDates.set(key, date);
  });

  const exceptionsMap = new Map<string, TimeExceptionLike>();
  exceptions.forEach((exception) => {
    const key = toDateKey(exception.date);
    if (!key) return;
    exceptionsMap.set(key, {
      date: key,
      time: exception.time,
      duration: exception.duration,
    });
  });

  return Array.from(uniqueDates.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, date]) => {
      const exception = exceptionsMap.get(dateKey);
      return {
        date,
        dateKey,
        time: exception?.time || defaultTime,
        duration: exception?.duration || defaultDuration,
        hasException: Boolean(exception),
      };
    });
};
