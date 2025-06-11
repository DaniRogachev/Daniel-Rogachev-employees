export type DateFormat = 
  | 'YYYY-MM-DD' 
  | 'DD-MM-YYYY' 
  | 'MM-DD-YYYY' 
  | 'YYYY/MM/DD' 
  | 'DD/MM/YYYY' 
  | 'MM/DD/YYYY'
  | 'MM.DD.YYYY'
  | 'DD.MM.YYYY'
  | 'YYYY.MM.DD';

const getSeparator = (format: DateFormat): string => {
  if (format.includes('-')) return '-';
  if (format.includes('/')) return '/';
  if (format.includes('.')) return '.';
  return '';
};

export const isValidDateFormat = (dateStr: string, format: DateFormat): boolean => {
  if (!dateStr || dateStr.toString().toLowerCase() === 'null' || dateStr === '') {
    return true;
  }
  
  const separator = getSeparator(format);
  if (!separator) return false;
  
  const dateParts = dateStr.toString().split(separator);
  if (dateParts.length !== 3) {
    return false;
  }
  
  let year: number, month: number, day: number;
  
  switch (format) {
    case 'YYYY-MM-DD':
    case 'YYYY/MM/DD':
    case 'YYYY.MM.DD':
      year = parseInt(dateParts[0], 10);
      month = parseInt(dateParts[1], 10) - 1;
      day = parseInt(dateParts[2], 10);
      break;
    case 'DD-MM-YYYY':
    case 'DD/MM/YYYY':
    case 'DD.MM.YYYY':
      day = parseInt(dateParts[0], 10);
      month = parseInt(dateParts[1], 10) - 1;
      year = parseInt(dateParts[2], 10);
      break;
    case 'MM-DD-YYYY':
    case 'MM/DD/YYYY':
    case 'MM.DD.YYYY':
      month = parseInt(dateParts[0], 10) - 1;
      day = parseInt(dateParts[1], 10);
      year = parseInt(dateParts[2], 10);
      break;
    default:
      return false;
  }
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return false;
  }
  
  const date = new Date(year, month, day);
  
  return (
    !isNaN(date.getTime()) && 
    date.getFullYear() === year && 
    date.getMonth() === month && 
    date.getDate() === day
  );
};

const parseDate = (dateStr: string | Date | null | undefined, format: DateFormat): Date => {
  if (!dateStr || dateStr.toString().toLowerCase() === 'null' || dateStr === '') {
    return new Date();
  }
  
  if (dateStr instanceof Date) {
    return dateStr;
  }
  
  const separator = getSeparator(format);
  if (!separator) {
    return new Date();
  }
  
  const dateParts = dateStr.toString().split(separator);
  if (dateParts.length === 3) {
    let year: number, month: number, day: number;
    
    switch (format) {
      case 'YYYY-MM-DD':
      case 'YYYY/MM/DD':
      case 'YYYY.MM.DD':
        year = parseInt(dateParts[0], 10);
        month = parseInt(dateParts[1], 10) - 1;
        day = parseInt(dateParts[2], 10);
        break;
      case 'DD-MM-YYYY':
      case 'DD/MM/YYYY':
      case 'DD.MM.YYYY':
        day = parseInt(dateParts[0], 10);
        month = parseInt(dateParts[1], 10) - 1;
        year = parseInt(dateParts[2], 10);
        break;
      case 'MM-DD-YYYY':
      case 'MM/DD/YYYY':
      case 'MM.DD.YYYY':
        month = parseInt(dateParts[0], 10) - 1;
        day = parseInt(dateParts[1], 10);
        year = parseInt(dateParts[2], 10);
        break;
      default:
        return new Date();
    }
    
    const date = new Date(year, month, day);
    
    if (
      !isNaN(date.getTime()) && 
      date.getFullYear() === year && 
      date.getMonth() === month && 
      date.getDate() === day
    ) {
      return date;
    }
  }
  
  console.warn('Invalid date format, using current date instead:', dateStr);
  return new Date();
};

export const getSupportedDateFormats = (): DateFormat[] => [
  'YYYY-MM-DD',
  'DD-MM-YYYY',
  'MM-DD-YYYY',
  'YYYY/MM/DD',
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'YYYY.MM.DD',
  'DD.MM.YYYY',
  'MM.DD.YYYY'
];

export default parseDate;
