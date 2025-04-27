
import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(3, { message: "Training name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  clientCompany: z.string().min(2, { message: "Client company name is required" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  trainingType: z.enum(["online", "offline"]),
  status: z.enum(["scheduled", "in-progress", "completed"]),
  trainerName: z.string().min(2, { message: "Trainer name is required" }),
  location: z.string().optional().or(z.literal('')),
  attendees: z.array(
    z.object({
      name: z.string().min(1, { message: "Name is required" }),
      email: z.string().email({ message: "Invalid email address" }),
    })
  ).min(1, { message: "At least one attendee is required" }),
}).refine(data => {
  if (data.trainingType === "offline" && (!data.location || data.location.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Location is required for offline trainings",
  path: ["location"],
}).refine(data => {
  return data.endDate >= data.startDate;
}, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

export type FormValues = z.infer<typeof formSchema>;
