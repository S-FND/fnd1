
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Users, Building, Clock, MapPin, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchEHSTrainings } from '@/data/ehs/trainings';
import type { EHSTraining } from '@/data/ehs/trainings';
import { Link } from 'react-router-dom';
import TrainingApprovalCard from './TrainingApprovalCard';

<<<<<<< HEAD
const EHSTrainingsList = ({trainingList}) => {
  const { data: trainings, isLoading } = useQuery({
=======
const EHSTrainingsList = () => {
  const { data: trainings, isLoading, refetch } = useQuery({
>>>>>>> 39f8dd471cc343e277a7a88e82b262d3f5486b4c
    queryKey: ['ehs-trainings'],
    queryFn: fetchEHSTrainings,
  });
  console.log('trainingList',trainingList)
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

  const getStatusVariant = (status: EHSTraining['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'pending-approval':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: EHSTraining['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'pending-approval':
        return 'Pending Approval';
      default:
        return 'Scheduled';
    }
  };

  // Separate pending approval trainings from others
  const pendingTrainings = trainings?.filter(training => training.status === 'pending-approval') || [];
  const otherTrainings = trainings?.filter(training => training.status !== 'pending-approval') || [];

  return (
<<<<<<< HEAD
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trainingList?.map((training) => (
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
              <Link to={`/ehs-trainings/${training._id}`}>View Training Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
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
=======
    <div className="space-y-6">
      {/* Pending Approval Section */}
      {pendingTrainings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Training Recommendations - Pending Approval</h2>
            <Badge variant="secondary">{pendingTrainings.length}</Badge>
          </div>
          <div className="grid gap-4">
            {pendingTrainings.map((training) => (
              <TrainingApprovalCard 
                key={training.id} 
                training={training} 
                onApprovalChange={refetch}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Trainings Section */}
      <div className="space-y-4">
        {pendingTrainings.length > 0 && (
          <h2 className="text-lg font-semibold">Scheduled & Completed Trainings</h2>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {otherTrainings.map((training) => (
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
      </div>
>>>>>>> 39f8dd471cc343e277a7a88e82b262d3f5486b4c
    </div>
  );
};

export default EHSTrainingsList;
