
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { VendorLayout } from '@/components/layout/VendorLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, isWithinInterval } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchVendorTrainings } from '@/data';
import { Clock, MapPin, Users, Calendar as CalendarIcon } from 'lucide-react';

const VendorTrainings = () => {
  const { isAuthenticated, user, isVendor } = useAuth();
  const vendorId = user?.vendorInfo?.id;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState('list');
  
  const { data: trainings, isLoading } = useQuery({
    queryKey: ['vendor-trainings', vendorId],
    queryFn: () => fetchVendorTrainings(vendorId || ''),
    enabled: !!vendorId
  });

  if (!isAuthenticated || !isVendor()) {
    return <Navigate to="/login" />;
  }

  // Function to check if a day has any training activities
  const isDayWithTraining = (day: Date) => {
    return trainings?.some(training => {
      // For backwards compatibility with existing data format
      const startDate = training.startDate ? new Date(training.startDate) : new Date(training.date);
      const endDate = training.endDate ? new Date(training.endDate) : new Date(training.date);
      
      try {
        // Check if the day is between start and end dates (inclusive)
        return isWithinInterval(day, { start: startDate, end: endDate });
      } catch (error) {
        // Fallback to checking if it's the same day as the training date
        return isSameDay(new Date(training.date), day);
      }
    });
  };

  // Filter trainings for the selected date
  const trainingsForDate = trainings?.filter(training => {
    if (!selectedDate) return false;
    
    const startDate = training.startDate ? new Date(training.startDate) : new Date(training.date);
    const endDate = training.endDate ? new Date(training.endDate) : new Date(training.date);
    
    try {
      return isWithinInterval(selectedDate, { start: startDate, end: endDate });
    } catch (error) {
      return isSameDay(new Date(training.date), selectedDate);
    }
  }) || [];

  const renderTrainingCard = (training) => (
    <Card key={training.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{training.name}</h3>
            <p className="text-sm text-muted-foreground">{training.description}</p>
          </div>
          <Badge variant={training.bidOpen ? "outline" : (training.assignedVendorId === vendorId ? "default" : "secondary")}>
            {training.bidOpen ? "Open for Bids" : (training.assignedVendorId === vendorId ? "Assigned to You" : "Assigned to Other")}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(training.date), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{training.time} ({training.duration})</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{training.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{training.attendees.length} attendees</span>
          </div>
        </div>

        <div className="mt-4">
          {training.bidOpen ? (
            <Button size="sm" className="w-full" asChild>
              <Link to={`/vendor/bid/${training.id}`}>Submit Bid</Link>
            </Button>
          ) : training.assignedVendorId === vendorId ? (
            <Button size="sm" variant="outline" className="w-full" asChild>
              <Link to={`/vendor/training/${training.id}`}>View Details</Link>
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="w-full" disabled>
              Not Available
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Training Opportunities</h1>
          <p className="text-muted-foreground">
            View available trainings and submit your bids
          </p>
        </div>
        
        <Tabs defaultValue="list" value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="pt-4">
            {isLoading ? (
              <div>Loading...</div>
            ) : trainings && trainings.length > 0 ? (
              <div>
                <h2 className="text-lg font-semibold mb-4">Available Trainings</h2>
                {trainings.filter(t => t.bidOpen).map(renderTrainingCard)}
                
                <h2 className="text-lg font-semibold mt-8 mb-4">Assigned Trainings</h2>
                {trainings.filter(t => t.assignedVendorId === vendorId).length > 0 ? (
                  trainings.filter(t => t.assignedVendorId === vendorId).map(renderTrainingCard)
                ) : (
                  <p className="text-muted-foreground">No trainings are currently assigned to you.</p>
                )}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No trainings found.</p>
            )}
          </TabsContent>
          
          <TabsContent value="calendar" className="pt-4">
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
                          {trainingsForDate.map(training => renderTrainingCard(training))}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </VendorLayout>
  );
};

export default VendorTrainings;
