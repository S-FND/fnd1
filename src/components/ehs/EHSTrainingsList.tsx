
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Users, Building } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchEHSTrainings } from '@/data/mockData';

const EHSTrainingsList = () => {
  const { data: trainings, isLoading } = useQuery({
    queryKey: ['ehs-trainings'],
    queryFn: fetchEHSTrainings,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="p-4">
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trainings?.map((training) => (
        <Card key={training.id} className="overflow-hidden">
          <CardHeader className="p-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{training.name}</CardTitle>
              <Badge variant={training.status === 'scheduled' ? 'outline' : 'default'}>
                {training.status === 'scheduled' ? 'Scheduled' : 'Completed'}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-1 mt-2">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(training.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              {' at '}
              {training.time}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <Building className="h-3.5 w-3.5" />
              <span>{training.clientCompany}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{training.attendees.length} attendees</span>
            </div>
          </CardContent>
          <CardFooter className="p-4">
            <Button variant="outline" className="w-full" asChild>
              <a href={`/ehs-trainings/${training.id}`}>View Training Details</a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default EHSTrainingsList;
