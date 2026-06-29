import { format, parse, isToday, isYesterday, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';

export const formatDate = (date: string | number | Date, formatStr = 'dd MMM yyyy') => {
  const d = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : new Date(date);
  return format(d, formatStr, { locale: tr });
};

export const formatRelativeDate = (date: string | number | Date) => {
  const d = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : new Date(date);
  if (isToday(d)) return 'Bugün';
  if (isYesterday(d)) return 'Dün';
  const days = differenceInDays(new Date(), d);
  if (days < 7) return `${days} gün önce`;
  return formatDate(d, 'dd MMM');
};

export const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}s ${minutes % 60}dk`;
  if (minutes > 0) return `${minutes}dk`;
  return `${seconds}s`;
};

export const calculateNet = (correct: number, wrong: number, blank: number = 0) => {
  return Math.max(0, correct - wrong / 4);
};

export const calculateAccuracy = (correct: number, wrong: number, blank: number = 0) => {
  const total = correct + wrong + blank;
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

export const calculateStreak = (activityDates: Date[]): number => {
  if (activityDates.length === 0) return 0;

  const sortedDates = activityDates.sort((a, b) => b.getTime() - a.getTime());
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const date of sortedDates) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const diff = differenceInDays(currentDate, d);

    if (diff === 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (diff === 1) {
      streak++;
      currentDate = d;
    } else {
      break;
    }
  }

  return streak;
};

export const calculateLevel = (xp: number): { level: number; xpIntoLevel: number; xpNeeded: number } => {
  let level = 1;
  let remaining = xp;
  let needed = 100;

  while (remaining >= needed) {
    remaining -= needed;
    level++;
    needed = 100 + (level - 1) * 60;
  }

  return {
    level,
    xpIntoLevel: remaining,
    xpNeeded: needed,
  };
};

export const calculateDaysUntilExam = (examDate: string): number => {
  const exam = parse(examDate, 'yyyy-MM-dd', new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  exam.setHours(0, 0, 0, 0);
  return differenceInDays(exam, today);
};

export const classnames = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const truncate = (str: string, length: number = 50): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const randomId = (prefix = '') => {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2)}`;
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

export const getDaysArray = (days: number = 7): string[] => {
  const result = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push(date.toISOString().split('T')[0]);
  }
  return result.reverse();
};

export const getWeeksArray = (weeks: number = 12): string[] => {
  const result = [];
  for (let i = 0; i < weeks; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 7);
    result.push(date.toISOString().split('T')[0]);
  }
  return result.reverse();
};
