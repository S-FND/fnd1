import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, isSameDay, isWithinInterval } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Clock, MapPin, BookOpen, Calendar as CalendarIcon, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { httpClient } from '@/lib/httpClient';
import { EHSTraining } from './training-form/types/ehsTraining.types';

const EHSTrainingsCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['ehs-trainings'],
    queryFn: async () => {
      const response: any = await httpClient.get('ehs/trainings');
      return response.data || response;
    },
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading trainings...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <p className="text-red-500">Error loading trainings: {(error as Error).message}</p>
        </div>
      </div>
    );
  }

  // Extract the trainings array from the response and map _id to id
  const trainings: EHSTraining[] = (data?.data || []).map(training => ({
    ...training,
    id: training._id,
    _id: undefined
  }));

  const normalizeDate = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());
  

  const isDayWithTraining = (day: Date) => {
    const normalized = normalizeDate(day);
  
    return trainings?.some((training) => {
      const start = normalizeDate(new Date(training.startDate || training.date));
      const end = normalizeDate(new Date(training.endDate || training.startDate || training.date));
  
      return isWithinInterval(normalized, { start, end });
    });
  };

  // Filter trainings for the selected date
  const trainingsForDate = trainings?.filter((training) => {
    if (!selectedDate) return false;
  
    const normalized = normalizeDate(selectedDate);
    const start = normalizeDate(new Date(training.startDate || training.date));
    const end = normalizeDate(new Date(training.endDate || training.startDate || training.date));
  
    return isWithinInterval(normalized, { start, end });
  });

  // Function to get status variant for badge
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Function to get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Scheduled';
    }
  };

  // Function to get a relevant icon for the training name
  const getTrainingIcon = (trainingName: string) => {
    const name = trainingName.toLowerCase();
    
    if (name.includes('driver') || name.includes('transport') || name.includes('road')) {
      return <Truck className="h-5 w-5 text-primary" />;
    }
    
    return <BookOpen className="h-5 w-5 text-primary" />;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Translog EHS Training Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar 
              mode="single" 
              selected={selectedDate} 
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasTraining: (date) => isDayWithTraining(date),
              }}
              modifiersClassNames={{
                hasTraining: "bg-primary/10 font-medium text-primary",
              }}
            />
            <div className="mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/10"></div>
                <p>Days with scheduled trainings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:w-1/2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>
              {selectedDate ? (
                `Trainings on ${format(selectedDate, 'MMMM d, yyyy')}`
              ) : (
                'Select a date to view trainings'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trainingsForDate.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-center">No trainings scheduled for this date.</p>
                <p className="text-sm text-muted-foreground mt-1 text-center">Select another date or contact EHS department to schedule a training.</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {trainingsForDate.map((training) => (
                    <Card key={training.id} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              {getTrainingIcon(training.name)}
                              <h3 className="font-medium">{training.name}</h3>
                            </div>
                            <Badge variant={getStatusVariant(training.status)}>
                              {getStatusLabel(training.status)}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">{training.description.length > 100 ? 
                            `${training.description.substring(0, 100)}...` : 
                            training.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>
                              {training.startDate 
                                ? `${format(new Date(training.startDate), 'MMM d')} to ${format(new Date(training.endDate || training.startDate), 'MMM d, yyyy')}`
                                : format(new Date(training.date), 'MMM d, yyyy')
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{training.startTime || training.time} {training.endTime ? `- ${training.endTime}` : ''} ({training.duration})</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{training.attendees.length} attendees</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BookOpen className="h-4 w-4" />
                            <span>{training.trainingType === 'online' ? 'Online (LMS)' : 'Offline (In-Person)'}</span>
                          </div>
                          {training.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{training.location}</span>
                            </div>
                          )}
                          <Button size="sm" variant="outline" className="w-full mt-2" asChild>
                            <Link to={`/ehs-trainings/${training.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EHSTrainingsCalendar;