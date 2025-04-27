
export interface SDGGoal {
  id: number;
  name: string;
  number: number;
  progress: number;
}

export const sdgGoals: SDGGoal[] = [
  { id: 7, name: "No Poverty", number: 1, progress: 45 },
  { id: 8, name: "Zero Hunger", number: 2, progress: 38 },
  { id: 9, name: "Good Health and Well-being", number: 3, progress: 67 },
  { id: 10, name: "Quality Education", number: 4, progress: 82 },
  { id: 11, name: "Gender Equality", number: 5, progress: 73 },
  { id: 13, name: "Climate Action", number: 13, progress: 61 },
  { id: 14, name: "Life Below Water", number: 14, progress: 54 },
];
