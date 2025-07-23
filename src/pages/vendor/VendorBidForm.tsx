
import React, { useState } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { VendorLayout } from '@/components/layout/VendorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CalendarIcon, Clock, MapPin, Upload, Users } from 'lucide-react';
import { fetchEHSTrainingById } from '@/data';
import { toast } from 'sonner';
import { format } from 'date-fns';

const VendorBidForm = () => {
  const { isAuthenticated, user, isVendor,isAuthenticatedStatus } = useAuth();
  const navigate = useNavigate();
  const { trainingId } = useParams<{ trainingId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidData, setBidData] = useState({
    contentFee: '',
    trainingFee: '',
    travelFee: '',
    notes: '',
    trainerResumes: [] as File[]
  });

  const { data: training, isLoading } = useQuery({
    queryKey: ['training-for-bid', trainingId],
    queryFn: () => fetchEHSTrainingById(trainingId as string),
    enabled: !!trainingId
  });

  if (!isAuthenticatedStatus() || !isVendor() || !trainingId) {
    return <Navigate to="/" />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBidData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setBidData(prev => ({ ...prev, trainerResumes: [...prev.trainerResumes, ...filesArray] }));
    }
  };

  const removeFile = (indexToRemove: number) => {
    setBidData(prev => ({
      ...prev,
      trainerResumes: prev.trainerResumes.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate bid submission
    setTimeout(() => {
      toast.success("Your bid has been submitted successfully!");
      navigate("/vendor/bids");
    }, 1500);
  };

  if (isLoading) {
    return (
      <VendorLayout>
        <div className="p-6">Loading training details...</div>
      </VendorLayout>
    );
  }

  if (!training || !training.bidOpen) {
    return (
      <VendorLayout>
        <div className="p-6">
          <p>This training is not available for bidding.</p>
          <Button variant="outline" asChild className="mt-4">
            <Link to="/vendor/trainings">Back to Trainings</Link>
          </Button>
        </div>
      </VendorLayout>
    );
  }

  const totalFee = 
    (parseFloat(bidData.contentFee) || 0) + 
    (parseFloat(bidData.trainingFee) || 0) + 
    (parseFloat(bidData.travelFee) || 0);

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link to="/vendor/trainings">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Trainings
            </Link>
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight">Submit Bid for Training</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Training Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{training.name}</h3>
                <p className="text-sm text-muted-foreground">{training.description}</p>
                
                <div className="grid gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(training.date), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{training.time} ({training.duration})</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{training.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{training.attendees.length} attendees</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Bid</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="contentFee">Content Development Fee ($)</Label>
                      <Input
                        id="contentFee"
                        name="contentFee"
                        type="number"
                        min="0"
                        placeholder="e.g., 1500"
                        value={bidData.contentFee}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="trainingFee">Training Delivery Fee ($)</Label>
                      <Input
                        id="trainingFee"
                        name="trainingFee"
                        type="number"
                        min="0"
                        placeholder="e.g., 2500"
                        value={bidData.trainingFee}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="travelFee">Travel & Accommodation Fee ($)</Label>
                      <Input
                        id="travelFee"
                        name="travelFee"
                        type="number"
                        min="0"
                        placeholder="e.g., 800"
                        value={bidData.travelFee}
                        onChange={handleInputChange}
                        required={training.trainingType === 'offline'}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label htmlFor="totalFee">Total Bid Amount</Label>
                        <span className="text-lg font-bold">${totalFee.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Add any additional details about your bid..."
                        value={bidData.notes}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="trainerResume">Upload Trainer Resumes</Label>
                      <div className="mt-2 flex flex-col gap-2">
                        <div className="flex items-center">
                          <Input
                            id="trainerResume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Button type="button" variant="outline" onClick={() => document.getElementById('trainerResume')?.click()} className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Resume
                          </Button>
                        </div>
                        
                        {bidData.trainerResumes.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-1">Uploaded Files:</p>
                            <ul className="space-y-1">
                              {bidData.trainerResumes.map((file, index) => (
                                <li key={index} className="text-sm flex justify-between items-center p-2 bg-muted/50 rounded">
                                  <span>{file.name}</span>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removeFile(index)} 
                                    className="h-6 w-6 p-0"
                                  >
                                    &times;
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload trainer resumes in PDF, DOC, or DOCX format.
                      </p>
                    </div>
                    
                    <Button type="submit" className="mt-4" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Bid'}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorBidForm;
