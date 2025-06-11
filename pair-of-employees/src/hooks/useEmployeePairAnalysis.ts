import { useState, useCallback } from 'react';
import { Employee, PairData } from '../models/types';
import { DateFormat, isValidDateFormat } from '../utils/parseDate';
import findLongestWorkingPair from '../utils/findLongestWorkingPair';
import formatResults from '../utils/formatResults';

export function useEmployeePairAnalysis() {
  const [result, setResult] = useState<PairData | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const processData = useCallback((data: Employee[] | null, dateFormat: DateFormat) => {
    try {
      if (!data) {
        setError('No data to process');
        return null;
      }
      
      setIsLoading(true);
      console.log('Processing data with date format:', dateFormat);
      
      const invalidDates = data.some(entry => 
        !isValidDateFormat(entry.DateFrom, dateFormat) || 
        !isValidDateFormat(entry.DateTo, dateFormat)
      );
      
      if (invalidDates) {
        setError('The file contains entries with invalid date format, please upload another file or choose different date format.');
        setIsLoading(false);
        return null;
      }
      
      const processedResult = findLongestWorkingPair(data, dateFormat);
      console.log('Result from findLongestWorkingPair:', processedResult);
      
      if (processedResult) {
        const projectsWithIds = formatResults(processedResult);
        processedResult.projects = projectsWithIds;
      }
      
      setResult(processedResult);
      setError('');
      
      return processedResult;
    } catch (err) {
      console.error('Error processing data:', err);
      setError('Error processing data. Please check the file format and try again.');
      setResult(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  return {
    result,
    error,
    isLoading,
    processData,
    clearResult
  };
}
