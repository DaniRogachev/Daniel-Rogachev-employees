import React, { useState, useCallback } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Button, 
  LinearProgress, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  Stack
} from '@mui/material';

import { DateFormat, getSupportedDateFormats } from './utils/parseDate';
import { useCSVFileUpload } from './hooks/useCSVFileUpload';
import { useEmployeePairAnalysis } from './hooks/useEmployeePairAnalysis';

function App(): React.ReactElement {
  const [dateFormat, setDateFormat] = useState<DateFormat>('YYYY-MM-DD');
  
  const { 
    parsedData, 
    fileName, 
    isLoading: fileLoading, 
    error: fileError, 
    handleFileChange 
  } = useCSVFileUpload();
  
  const {
    result,
    error: processingError,
    isLoading: processingData,
    processData
  } = useEmployeePairAnalysis();
  
  const isLoading = fileLoading || processingData;
  const error = fileError || processingError;

  const handleDateFormatChange = (event: SelectChangeEvent) => {
    setDateFormat(event.target.value as DateFormat);
  };
  
  const handleProcessClick = useCallback(() => {
    processData(parsedData, dateFormat);
  }, [parsedData, dateFormat, processData]);

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: '#', 
      width: 70,
      headerAlign: 'center',
      align: 'center'
    },
    { 
      field: 'employee1Id', 
      headerName: 'Employee 1', 
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      minWidth: 120
    },
    { 
      field: 'employee2Id', 
      headerName: 'Employee 2', 
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      minWidth: 120
    },
    { 
      field: 'projectId', 
      headerName: 'Project ID', 
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      minWidth: 120
    },
    { 
      field: 'daysWorked', 
      headerName: 'Days Worked', 
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      minWidth: 120
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Employee Pair Analysis
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Upload CSV
        </Typography>
        <Typography variant="body1" gutterBottom>
          Upload a CSV file with employee project data to find the pair of employees who have worked together on common projects for the longest period.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          The CSV format should have columns: EmpID, ProjectID, DateFrom, DateTo. You can use "NULL" for ongoing projects.
        </Typography>
        
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="date-format-label">Date Format</InputLabel>
              <Select
                labelId="date-format-label"
                id="date-format-select"
                value={dateFormat}
                label="Date Format"
                onChange={handleDateFormatChange}
                disabled={isLoading}
              >
                {getSupportedDateFormats().map((format) => (
                  <MenuItem key={format} value={format}>
                    {format}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Button
              variant="contained"
              component="label"
              disabled={isLoading}
              key={fileName}
            >
              Choose File
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={handleFileChange}
                onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                disabled={isLoading}
              />
            </Button>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleProcessClick}
              disabled={isLoading || !parsedData}
            >
              Process Data
            </Button>
          </Box>
        </Stack>
        
        {fileName && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected file: {fileName} | Format: {dateFormat}
          </Typography>
        )}
        
        {isLoading && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
          </Box>
        )}
        
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>
      
      {result && result.projects && result.projects.length > 0 ? (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Results
          </Typography>
          
          <Typography variant="h6" gutterBottom>
            Employees {result?.emp1Id} and {result?.emp2Id} worked together for {result?.totalDuration} days
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>
            Common Projects:
          </Typography>
          
          <Box sx={{ width: '100%', display: 'flex' }}>
            <DataGrid
              rows={result?.projects || []}
              columns={columns}
              disableRowSelectionOnClick
              sx={{ 
                width: '100%', 
                '& .MuiDataGrid-main': { width: '100%' },
                '& .MuiDataGrid-columnHeaders': { width: '100% !important' },
                '& .MuiDataGrid-virtualScroller': { width: '100% !important' },
                '& .MuiDataGrid-footerContainer': { width: '100% !important' },
                '& .MuiDataGrid-columnHeadersInner': { width: '100% !important' }
              }}
              density="comfortable"
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10, 25]}
            />
          </Box>
        </Paper>
      ) : result ? (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography>No overlapping work periods found for any employee pair.</Typography>
        </Paper>
      ) : null}
    </Container>
  );
}

export default App;
