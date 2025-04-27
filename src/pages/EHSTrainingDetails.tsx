
import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Building, BookOpen, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EHSTraining, fetchEHSTrainingById } from '@/data/mockData';
import { toast } from 'sonner';

const EHSTrainingDetails = () => {
  const { isAuthenticated } = useAuth();
  const { trainingId } = useParams();

  let { data: training, isLoading } = useQuery({
    queryKey: ['ehs-training', trainingId],
    queryFn: () => fetchEHSTrainingById(trainingId as string),
  });



  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const [trainingData, setTrainingData] = useState({})

  console.log('trainingId', trainingId)
  const getTrainingDetails = async () => {
    // Here you would typically save the data to your backend

    // setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}` + "/admin/trainings?id=" + trainingId, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("fandoro-token")}` },
      });
      if (!res.ok) {
        toast.error("Invalid credentials");
        // setIsLoading(false);
        return;
      }
      else {
        const jsondata = await res.json();
        const data:EHSTraining = jsondata['data'][0];
        console.log('data', data)
        setTrainingData(data)
        // if(!training){
        //   training=data[0]
        // }
      }
    } catch (error) {
      console.error("Api call:", error);
      toast.error("API Call failed. Please try again.");
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    getTrainingDetails()
  }, [])

  // Function to get status variant for badge
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

  // Function to get status label
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
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
        {training && <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" size="sm" asChild className="mb-2">
                <Link to="/ehs-trainings">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Trainings
                </Link>
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">
                {isLoading ? (
                  <Skeleton className="h-8 w-64" />
                ) : (
                  training?.name
                )}
              </h1>
            </div>
            {!isLoading && training && (
              <Badge variant={getStatusVariant(training.status)} className="text-sm">
                {getStatusLabel(training.status)}
              </Badge>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            </div>
          ) : training ? (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Training Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{training.description}</p>

                    <div className="grid gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {training.startDate ? (
                            <>
                              From {new Date(training.startDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                              {' to '}
                              {new Date(training.endDate || training.startDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </>
                          ) : (
                            new Date(training.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {training.startTime ? `${training.startTime} to ${training.endTime}` : training.time}
                          {' '}({training.duration})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{training.trainingType === 'online' ? 'Online (LMS based)' : 'Offline (In-Person)'}</span>
                      </div>

                      {training.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{training.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{training.clientCompany}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{training.attendees.length} attendees</span>
                      </div>

                      {training.trainerName && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>Trainer: {training.trainerName}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attendees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {training.attendees.map((attendee, index) => (
                          <TableRow key={index}>
                            <TableCell>{attendee.name}</TableCell>
                            <TableCell>{attendee.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <p className="text-center py-8">Training not found</p>
          )}
        </div>}

        {trainingData && <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" size="sm" asChild className="mb-2">
                <Link to="/ehs-trainings">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Trainings
                </Link>
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">
                {isLoading ? (
                  <Skeleton className="h-8 w-64" />
                ) : (
                  trainingData['name']
                )}
              </h1>
            </div>
            {!isLoading && trainingData && (
              <Badge variant={getStatusVariant(trainingData['status'])} className="text-sm">
                {getStatusLabel(trainingData['status'])}
              </Badge>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            </div>
          ) : trainingData ? (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Training Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{trainingData['description']}</p>
                    
                    <div className="grid gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {trainingData['startDate'] ? (
                            <>
                              From {new Date(trainingData['startDate']).toLocaleDateString('en-US', { 
                                weekday: 'long',
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                              {' to '}
                              {new Date(trainingData['endDate'] || training.startDate).toLocaleDateString('en-US', { 
                                weekday: 'long',
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </>
                          ) : (
                            new Date(trainingData['date']).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })
                          )}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {trainingData['startTime'] ? `${trainingData['startTime']} to ${trainingData['endTime']}` : trainingData['time']} 
                          {' '}({trainingData['duration']})
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{trainingData['trainingType'] === 'online' ? 'Online (LMS based)' : 'Offline (In-Person)'}</span>
                      </div>
                      
                      {trainingData['location'] && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{trainingData['location']}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{trainingData['clientCompany']}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{trainingData['attendees'].length} attendees</span>
                      </div>

                      {trainingData['trainerName'] && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>Trainer: {trainingData['trainerName']}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attendees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trainingData['attendees'].map((attendee, index) => (
                          <TableRow key={index}>
                            <TableCell>{attendee.name}</TableCell>
                            <TableCell>{attendee.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <p className="text-center py-8">Training not found</p>
          )}
        </div>}

      </SidebarLayout>
    </div>
  );
};

export default EHSTrainingDetails;
