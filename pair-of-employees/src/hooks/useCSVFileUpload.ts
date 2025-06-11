import { useState, useCallback } from 'react';
import { parse } from 'papaparse';
import { Employee } from '../models/types';

export function useCSVFileUpload() {
  const [parsedData, setParsedData] = useState<Employee[] | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload started');
    
    const file = e.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    
    setFileName(file.name);
    setIsLoading(true);
    
    const reader = new FileReader();
    
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const csvData = event.target?.result as string;
        console.log('File read successfully');
        
        console.log('Parsing CSV data...');
        const firstLine = csvData.split('\n')[0];
        console.log('First line of CSV:', firstLine);
        
        parse(csvData, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            console.log('CSV parse complete. Rows:', results.data.length);
            
            try {
              const processedData = (results.data as string[][])
                .filter(row => row && row.length >= 4)
                .map((row, index) => {
                  const empId = parseInt(row[0], 10);
                  const projectId = parseInt(row[1], 10);
                  const dateFrom = row[2];
                  const dateTo = row[3] || 'NULL';
                  
                  if (index < 3) {
                    console.log(`Row ${index + 1}:`, { empId, projectId, dateFrom, dateTo });
                  }
                  
                  if (isNaN(empId) || isNaN(projectId) || !dateFrom) {
                    console.warn('Skipping invalid row:', row);
                    return null;
                  }
                  
                  return {
                    EmpID: empId,
                    ProjectID: projectId,
                    DateFrom: dateFrom,
                    DateTo: dateTo
                  };
                })
                .filter(Boolean) as Employee[];
              
              console.log('Processed data sample:', processedData.slice(0, 3));
              
              setParsedData(processedData);
              setError('');
              setIsLoading(false);
            } catch (err) {
              console.error('Processing Error:', err);
              setError('Error processing the file. Please check the format and try again.');
              setParsedData(null);
              setIsLoading(false);
            }
          },
          error: (error: Error) => {
            console.error('CSV Parse Error:', error);
            setError('Error parsing the CSV file. Please check the format and try again.');
            setParsedData(null);
            setIsLoading(false);
          }
        });
      } catch (err) {
        console.error('File Read Error:', err);
        setError('Error reading the file. Please try again.');
        setParsedData(null);
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      console.error('FileReader error');
      setError('Error reading the file. Please try again.');
      setParsedData(null);
      setIsLoading(false);
    };
    
    reader.readAsText(file);
  }, []);

  const resetData = useCallback(() => {
    setParsedData(null);
    setFileName('');
    setError('');
  }, []);

  return {
    parsedData,
    fileName,
    isLoading,
    error,
    handleFileChange,
    resetData
  };
}
