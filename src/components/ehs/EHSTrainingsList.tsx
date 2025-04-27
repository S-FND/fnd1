
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Users, Building, Clock, MapPin, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchEHSTrainings } from '@/data';
import { Link } from 'react-router-dom';

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

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Scheduled';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trainings?.map((training) => (
        <Card key={training.id} className="overflow-hidden">
          <CardHeader className="p-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{training.name}</CardTitle>
              <Badge variant={getStatusVariant(training.status)}>
                {getStatusLabel(training.status)}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-1 mt-2">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(training.startDate || training.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              {training.endDate && (' to ' + 
                new Date(training.endDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <Building className="h-3.5 w-3.5" />
              <span>{training.clientCompany}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <Users className="h-3.5 w-3.5" />
              <span>{training.attendees.length} attendees</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{training.trainingType === 'online' ? 'Online (LMS)' : 'Offline (In-Person)'}</span>
            </div>
            {training.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{training.location}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to={`/ehs-trainings/${training.id}`}>View Training Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default EHSTrainingsList;
