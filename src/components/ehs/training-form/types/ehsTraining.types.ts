export enum TrainingStatus {
    PENDING_APPROVAL = 'pending-approval',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    COMPLETED = 'completed',
    IN_PROGRESS = 'in-progress'
  }
  
  export enum TrainingType {
    ONLINE = 'online',
    OFFLINE = 'offline'
  }
  
  // Define attendee interface
  export interface Attendee {
    name: string;
    email: string;
  }
  
  export interface EHSTraining {
    id: string;
    name: string;
    description: string;
    clientCompany: string;
    trainingType: TrainingType;
    startDate?: string;
    endDate?: string;
    date?: string;
    startTime?: string;
    time?: string;
    endTime?: string;
    duration: string;
    location?: string;
    attendees: Attendee[]; // Changed from string[] to Attendee[]
    status: TrainingStatus;
    createdBy?: string;
    approvedBy?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface EHSTrainingDto {
    name: string;
    description: string;
    clientCompany?: string;
    trainingType?: TrainingType;
    startDate?: string;
    endDate?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    duration: string;
    location?: string;
    attendees?: Attendee[]; // Changed from string[] to Attendee[]
    status?: TrainingStatus;
    createdBy?: string;
    approvedBy?: string;
  }
  
  export interface UpdateTrainingStatusDto {
    status: TrainingStatus;
  }