
import { z } from "zod";

export interface CarbonGoal {
  id: string;
  name: string;
  description?: string;
  targetReduction: number; // percentage
  deadline: string; // date string
  currentProgress: number; // percentage
  category: 'transport' | 'home' | 'food' | 'shopping' | 'overall';
}

export const goalFormSchema = z.object({
  name: z.string().min(3, {
    message: "Goal name must be at least 3 characters.",
  }),
  description: z.string().optional(),
  targetReduction: z.coerce.number().min(1, {
    message: "Target reduction must be at least 1%.",
  }).max(100, {
    message: "Target reduction cannot exceed 100%.",
  }),
  deadline: z.string().min(1, {
    message: "Please select a deadline.",
  }),
  category: z.enum(['transport', 'home', 'food', 'shopping', 'overall']),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;
