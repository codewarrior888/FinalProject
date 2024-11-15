import { format, parse } from 'date-fns';

export const formatDate = (date: string | Date, forInput = false): string => {
  const parsedDate = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date;
  return format(parsedDate, forInput ? 'yyyy-MM-dd' : 'dd-MM-yyyy');
};