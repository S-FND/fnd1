import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  FileText,
  MapPin,
  UploadCloud,
  User,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchEHSTrainingById } from '@/data';

const EHSTrainingDetails = () => {
  const { trainingId } = useParams<{ trainingId: string }>();
  const { data: training, isLoading } = useQuery({
    queryKey: ['ehs-training', trainingId],
    queryFn: () => fetchEHSTrainingById(trainingId || ''),
    enabled: !!trainingId,
  });

  if (isLoading) {
    return <div>Loading training details...</div>;
  }

  if (!training) {
    return <div>Training not found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Button asChild variant="ghost">
          <Link to="/ehs-trainings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trainings
          </Link>
        </Button>
      </div>

      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{training.name}</CardTitle>
          <CardDescription>{training.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{new Date(training.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{training.time} ({training.duration})</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{training.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{training.attendees.length} attendees</span>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-2">
              <h3 className="text-lg font-semibold">Training Overview</h3>
              <p>
                This training covers essential safety procedures for all employees.
                Participants will learn about hazard identification, risk assessment,
                and emergency response protocols.
              </p>
              
              <div className="mt-4">
                <h4 className="text-md font-semibold">Key Topics:</h4>
                <ul className="list-disc list-inside">
                  <li>Hazard Identification</li>
                  <li>Risk Assessment</li>
                  <li>Emergency Response</li>
                  <li>Safety Protocols</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="materials" className="space-y-2">
              <h3 className="text-lg font-semibold">Training Materials</h3>
              <p>Downloadable resources for the training session:</p>
              
              <div className="mt-2 space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Training Manual <Download className="ml-auto h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Presentation Slides <Download className="ml-auto h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  External Resources <ExternalLink className="ml-auto h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="attendees" className="space-y-2">
              <h3 className="text-lg font-semibold">Attendees</h3>
              <p>List of participants for this training session:</p>
              
              <ul className="mt-2 space-y-2">
                {training.attendees.map((attendee) => (
                  <li key={attendee.id} className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {attendee.name}
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EHSTrainingDetails;