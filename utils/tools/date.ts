/**
 * Parse a YYYY-MM-DD (or YYYY.MM.DD) string into {year, month, day}.
 * Returns null if the string doesn't match.
 */
function parseDateStr(date: string): { year: number; month: number; day: number } | null {
  const m = String(date).match(/^(\d{4})[.\-](\d{1,2})[.\-](\d{1,2})/);
  if (!m) return null;
  return { year: +m[1], month: +m[2], day: +m[3] };
}

/** Convert a YYYY-MM-DD string to local Date for arithmetic only. */
function toLocalDate(date: string): Date {
  // Append T00:00:00 to force local-time interpretation (not UTC)
  return new Date(date + 'T00:00:00');
}

export const getDotDateForm = (date: string | Date): string => {
  if (date instanceof Date) {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
      date.getDate(),
    ).padStart(2, '0')}`;
  }
  const p = parseDateStr(date);
  if (!p) return String(date);
  return `${p.year}.${String(p.month).padStart(2, '0')}.${String(p.day).padStart(2, '0')}`;
};

export const getToday = () => {
  return new Date();
};

export const getDateDiff = (baseDate: string | Date, targetDate: string | Date) => {
  const date1 = typeof baseDate === 'string' ? toLocalDate(baseDate) : new Date(baseDate);
  const date2 = typeof targetDate === 'string' ? toLocalDate(targetDate) : new Date(targetDate);

  const diff = date1.getTime() - date2.getTime();

  const dateDiff = Math.floor(Math.abs(diff) / (24 * 60 * 60 * 1000));
  return dateDiff;
};

export const getStandardDateForm = (date: string | Date): string => {
  if (typeof date === 'string') {
    // If already YYYY-MM-DD, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    // Try to parse YYYY.MM.DD or similar
    const p = parseDateStr(date);
    if (p) return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
    return date;
  }
  // Date object — format without timezone conversion
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getKoreanTimeDifference = (baseDate: string | Date, targetDate: string | Date) => {
  const date1 = typeof baseDate === 'string' ? toLocalDate(baseDate) : new Date(baseDate);
  const date2 = typeof targetDate === 'string' ? toLocalDate(targetDate) : new Date(targetDate);

  const diff = date1.getTime() - date2.getTime();

  const subfix = diff > 0 ? '전' : '뒤';
  const dateDiff = getDateDiff(baseDate, targetDate);

  let prefix: string = '';

  if (dateDiff == 0) {
    return '오늘';
  } else if (dateDiff < 7) {
    switch (dateDiff) {
      case 1:
        prefix = '하루';
        break;
      case 2:
        prefix = '이틀';
        break;
      default:
        prefix = `${dateDiff}일`;
        break;
    }
  } else if (dateDiff < 35) {
    const weekDiff = Math.floor(dateDiff / 7);
    prefix = `${weekDiff}주`;
  } else if (dateDiff < 365) {
    const monthDiff = Math.floor(dateDiff / 30);
    prefix = `${monthDiff}개월`;
  } else {
    const yearDiff = Math.floor(dateDiff / 365);
    prefix = `${yearDiff}년`;
  }
  return prefix + ' ' + subfix;
};

export const getTimeDiffBeforeToday = (date: string | Date) => {
  return getKoreanTimeDifference(new Date(), date);
};

export const getDateHidingCurrentYear = (d: string | Date): string => {
  if (!d) return '';
  if (typeof d === 'string') {
    const p = parseDateStr(d);
    if (!p) return String(d);
    const currentYear = new Date().getFullYear();
    if (p.year !== currentYear) {
      return `${String(p.month).padStart(2, '0')}/${String(p.day).padStart(2, '0')}/${String(p.year).slice(-2)}`;
    }
    return `${String(p.month).padStart(2, '0')}/${String(p.day).padStart(2, '0')}`;
  }
  const currentYear = new Date().getFullYear();
  const year = d.getFullYear();
  return d.toLocaleDateString('en-US', {
    year: year !== currentYear ? '2-digit' : undefined,
    month: '2-digit',
    day: '2-digit',
  });
};

export const useKoreanDateFormat = (date: string | Date): string => {
  if (typeof date === 'string') {
    const p = parseDateStr(date);
    if (!p) return String(date);
    return `${p.year}년 ${p.month}월 ${p.day}일`;
  }
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}년 ${month}월 ${day}일`;
};
