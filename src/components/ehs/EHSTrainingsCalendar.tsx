
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Clock } from 'lucide-react';
import { fetchEHSTrainings } from '@/data/mockData';
import { Link } from 'react-router-dom';

const EHSTrainingsCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const { data: trainings } = useQuery({
    queryKey: ['ehs-trainings'],
    queryFn: fetchEHSTrainings,
  });

  // Function to highlight dates with trainings
  const isDayWithTraining = (day: Date) => {
    return trainings?.some(training => 
      isSameDay(new Date(training.date), day)
    );
  };

  // Filter trainings for the selected date
  const trainingsForDate = trainings?.filter(training => 
    selectedDate && isSameDay(new Date(training.date), selectedDate)
  ) || [];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>Training Schedule</CardTitle>
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
              <p className="text-muted-foreground py-8 text-center">No trainings scheduled for this date.</p>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {trainingsForDate.map((training) => (
                    <Card key={training.id} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{training.name}</h3>
                            <span className="text-sm">{training.time}</span>
                          </div>
                          <p className="text-muted-foreground">{training.clientCompany}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{training.attendees.length} attendees</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{training.duration}</span>
                          </div>
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
