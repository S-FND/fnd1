import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Clock, Plus } from 'lucide-react';
import { complianceItems } from '@/data/compliance/items';
import { format, startOfQuarter, endOfQuarter, isWithinInterval, addQuarters, subQuarters } from 'date-fns';
import { NewComplianceForm } from './NewComplianceForm';
import { toast } from 'sonner';

interface ComplianceCalendarViewProps {
  onClose?: () => void;
}

const ComplianceCalendarView: React.FC<ComplianceCalendarViewProps> = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewType, setViewType] = useState<'quarter' | 'year'>('quarter');
  const [currentQuarter, setCurrentQuarter] = useState(new Date());
  const [showNewComplianceForm, setShowNewComplianceForm] = useState(false);

  // Get compliance items for next quarter
  const nextQuarterItems = useMemo(() => {
    const nextQuarter = addQuarters(new Date(), 1);
    const quarterStart = startOfQuarter(nextQuarter);
    const quarterEnd = endOfQuarter(nextQuarter);
    
    return complianceItems.filter(item => {
      const deadline = new Date(item.deadline);
      return isWithinInterval(deadline, { start: quarterStart, end: quarterEnd }) && item.status !== 'Completed';
    });
  }, []);

  // Get compliance items for current quarter view
  const quarterItems = useMemo(() => {
    const quarterStart = startOfQuarter(currentQuarter);
    const quarterEnd = endOfQuarter(currentQuarter);
    
    return complianceItems.filter(item => {
      const deadline = new Date(item.deadline);
      return isWithinInterval(deadline, { start: quarterStart, end: quarterEnd });
    });
  }, [currentQuarter]);

  // Get all items for the year
  const yearItems = useMemo(() => {
    return complianceItems.map(item => ({
      ...item,
      deadline: new Date(item.deadline)
    })).sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
  }, []);

  // Get items for selected date
  const selectedDateItems = useMemo(() => {
    if (!selectedDate) return [];
    
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    return complianceItems.filter(item => 
      format(new Date(item.deadline), 'yyyy-MM-dd') === selectedDateStr
    );
  }, [selectedDate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'At Risk':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'At Risk':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    }
  };

  const navigateQuarter = (direction: 'prev' | 'next') => {
    setCurrentQuarter(prev => 
      direction === 'next' ? addQuarters(prev, 1) : subQuarters(prev, 1)
    );
  };

  // Mark dates with compliance items
  const datesWithItems = useMemo(() => {
    return complianceItems.map(item => new Date(item.deadline));
  }, []);

  const handleNewComplianceSubmit = (data: any) => {
    // Here you would typically send the data to your backend
    console.log('New compliance requirement:', data);
    toast.success('Compliance requirement added successfully!');
    
    // In a real app, you would add this to your state management or make an API call
    // For now, we'll just show a success message
  };

  return (
    <Dialog defaultOpen onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Compliance Calendar
            </DialogTitle>
            <Button 
              onClick={() => setShowNewComplianceForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Submit New Compliance
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={viewType} onValueChange={(value) => setViewType(value as 'quarter' | 'year')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quarter">Quarterly View</TabsTrigger>
            <TabsTrigger value="year">Annual View</TabsTrigger>
          </TabsList>

          <TabsContent value="quarter" className="space-y-6">
            {/* Next Quarter Alert */}
            {nextQuarterItems.length > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="h-5 w-5" />
                    Upcoming Next Quarter ({nextQuarterItems.length} items due)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {nextQuarterItems.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        {getStatusIcon(item.status)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Due: {format(new Date(item.deadline), 'MMM dd, yyyy')}</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  {nextQuarterItems.length > 4 && (
                    <p className="text-sm text-muted-foreground mt-3">
                      +{nextQuarterItems.length - 4} more items due next quarter
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Calendar View</CardTitle>
                      <CardDescription>Click on dates to see compliance items</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      hasItems: datesWithItems
                    }}
                    modifiersStyles={{
                      hasItems: { 
                        backgroundColor: 'hsl(var(--primary))', 
                        color: 'hsl(var(--primary-foreground))',
                        fontWeight: 'bold'
                      }
                    }}
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Q{Math.floor((currentQuarter.getMonth() / 3)) + 1} {currentQuarter.getFullYear()}
                      </CardTitle>
                      <CardDescription>{quarterItems.length} compliance items</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigateQuarter('prev')}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigateQuarter('next')}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-64 overflow-y-auto">
                    <div className="space-y-3">
                      {quarterItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          {getStatusIcon(item.status)}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(item.deadline), 'MMM dd')}
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {selectedDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {format(selectedDate, 'MMMM dd, yyyy')}
                      </CardTitle>
                      <CardDescription>
                        {selectedDateItems.length} compliance item(s) due
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedDateItems.length > 0 ? (
                        <div className="space-y-3">
                          {selectedDateItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                              {getStatusIcon(item.status)}
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.name}</p>
                                <Badge variant="secondary" className="text-xs mt-1">{item.category}</Badge>
                              </div>
                              <Badge variant="outline" className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No compliance items due on this date</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="year" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Annual Compliance Overview</CardTitle>
                <CardDescription>All compliance items for the year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, qIndex) => {
                    const quarterStart = new Date(new Date().getFullYear(), qIndex * 3, 1);
                    const quarterEnd = endOfQuarter(quarterStart);
                    
                    const quarterItems = yearItems.filter(item => 
                      isWithinInterval(item.deadline, { start: quarterStart, end: quarterEnd })
                    );

                    return (
                      <div key={quarter} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          {quarter} {new Date().getFullYear()}
                          <Badge variant="outline">{quarterItems.length} items</Badge>
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {quarterItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                              {getStatusIcon(item.status)}
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.name}</p>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {format(item.deadline, 'MMM dd')}
                                  </span>
                                </div>
                              </div>
                              <Badge variant="outline" className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        {quarterItems.length === 0 && (
                          <p className="text-sm text-muted-foreground">No compliance items due this quarter</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <NewComplianceForm
          open={showNewComplianceForm}
          onClose={() => setShowNewComplianceForm(false)}
          onSubmit={handleNewComplianceSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ComplianceCalendarView;