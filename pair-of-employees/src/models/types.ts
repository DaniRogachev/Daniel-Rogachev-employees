export interface Employee {
  EmpID: number;
  ProjectID: number;
  DateFrom: string;
  DateTo: string;
}

export interface EmployeeTimeEntry {
  empId: number;
  dateFrom: Date;
  dateTo: Date;
}

export interface Project {
  projectId: number;
  daysWorked: number;
  startDate: Date;
  endDate: Date;
  id?: number;
}

export interface PairData {
  emp1Id: number;
  emp2Id: number;
  totalDuration: number;
  projects: Project[];
}
