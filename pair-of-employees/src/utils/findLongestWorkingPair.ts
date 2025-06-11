import { isAfter, isBefore, isEqual } from 'date-fns';
import { Employee, EmployeeTimeEntry, Project, PairData } from '../models/types';
import parseDate, { DateFormat } from './parseDate';

const findLongestWorkingPair = (data: Employee[], dateFormat: DateFormat): PairData | null => {
  console.log('Finding longest working pair for data:', data);
  if (!data || data.length === 0) {
    console.log('No data provided to findLongestWorkingPair');
    return null;
  }
  
  const projectMap = new Map<number, EmployeeTimeEntry[]>();
  
  data.forEach((entry, index) => {
    try {
      if (!entry.ProjectID || isNaN(entry.ProjectID)) {
        console.warn(`Invalid ProjectID at index ${index}:`, entry);
        return;
      }
      
      const projectId = parseInt(String(entry.ProjectID), 10);
      if (!projectMap.has(projectId)) {
        projectMap.set(projectId, []);
      }
      
      const dateFrom = parseDate(entry.DateFrom, dateFormat);
      const dateTo = parseDate(entry.DateTo, dateFormat);
      
      if (isNaN(dateFrom.getTime())) {
        console.warn(`Invalid DateFrom at index ${index}:`, entry);
        return;
      }
      
      projectMap.get(projectId)?.push({
        empId: parseInt(String(entry.EmpID), 10),
        dateFrom: dateFrom,
        dateTo: dateTo
      });
    } catch (err) {
      console.error(`Error processing entry at index ${index}:`, entry, err);
    }
  });
  
  console.log('Project map:', projectMap);

  const pairMap = new Map<string, PairData>();
  let maxDuration = 0;
  let bestPair: PairData | null = null;
  let commonProjects: Project[] = [];

  projectMap.forEach((employees, projectId) => {
    projectId = parseInt(String(projectId), 10);
    for (let i = 0; i < employees.length; i++) {
      for (let j = i + 1; j < employees.length; j++) {
        const emp1 = employees[i];
        const emp2 = employees[j];
        
        if (emp1.empId === emp2.empId) continue;
        
        const start = isAfter(emp1.dateFrom, emp2.dateFrom) ? emp1.dateFrom : emp2.dateFrom;
        const end = isBefore(emp1.dateTo, emp2.dateTo) ? emp1.dateTo : emp2.dateTo;
        
        if (isBefore(start, end) || isEqual(start, end)) {
          const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)); // Duration in days
          
          const [id1, id2] = [emp1.empId, emp2.empId].sort((a, b) => a - b);
          const pairKey = `${id1}-${id2}`;
          
          if (!pairMap.has(pairKey)) {
            pairMap.set(pairKey, {
              emp1Id: id1,
              emp2Id: id2,
              totalDuration: 0,
              projects: []
            } as PairData);
          }
          
          const pair = pairMap.get(pairKey) as PairData;
          pair.totalDuration += duration;
          pair.projects.push({
            projectId: projectId,
            daysWorked: duration,
            startDate: start,
            endDate: end
          });
          
          if (pair.totalDuration > maxDuration) {
            maxDuration = pair.totalDuration;
            bestPair = pair;
            commonProjects = pair.projects;
          }
        }
      }
    }
  });

  if (bestPair) {
    const typedBestPair = bestPair as unknown as {
      emp1Id: number;
      emp2Id: number;
      totalDuration: number;
      projects: Project[];
    };
    
    return {
      emp1Id: typedBestPair.emp1Id,
      emp2Id: typedBestPair.emp2Id,
      totalDuration: maxDuration,
      projects: commonProjects
    } as PairData;
  }
  return null;
};

export default findLongestWorkingPair;
