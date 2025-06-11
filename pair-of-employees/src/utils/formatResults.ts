import { Project, PairData } from '../models/types';

const formatResults = (result: PairData): (Project & { employee1Id: number, employee2Id: number })[] => {
  if (!result || !result.projects || !Array.isArray(result.projects)) return [];
  
  return result.projects.map((project: Project, index: number) => ({
    ...project,
    id: index + 1,
    employee1Id: result.emp1Id,
    employee2Id: result.emp2Id
  }));
};

export default formatResults;
