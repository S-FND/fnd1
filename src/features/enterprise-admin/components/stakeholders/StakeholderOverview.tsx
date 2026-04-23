import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Network,
  Users,
  Building2,
  UserCircle,
  Briefcase,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  ChevronRight,
  Mail,
  Phone,
  Tag
} from "lucide-react";
import { defaultStakeholderSubcategories } from '../../data/stakeholders';
import { httpClient } from '@/lib/httpClient';
import { API_ENDPOINTS } from '@/lib/apiEndpoints';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// Define types
interface ApiStakeholder {
  _id: string;
  name: string;
  organization?: string;
  email: string;
  phone: string;
  subcategoryId: string;
  notes?: string;
  engagementLevel: 'low' | 'medium' | 'high';
  influence: 'low' | 'medium' | 'high';
  interest: 'low' | 'medium' | 'high';
  userId?: string;
  lastContact?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StakeholderOverviewProps {
  onNavigateToManage?: () => void;
}

const StakeholderOverview: React.FC<StakeholderOverviewProps> = ({ onNavigateToManage }) => {
  const [stakeholders, setStakeholders] = useState<ApiStakeholder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Fetch stakeholders on component mount
  useEffect(() => {
    fetchStakeholders();
  }, []);

  const fetchStakeholders = async () => {
    try {
      setIsLoading(true);
      const response = await httpClient.get<ApiStakeholder[]>(API_ENDPOINTS.STAKEHOLDERS.LIST);

      if (response.status === 200 && response.data) {
        if (Array.isArray(response.data)) {
          setStakeholders(response.data);
          // Generate recent activities from stakeholders
          generateRecentActivities(response.data);
        } else {
          console.error('Response data is not an array:', response.data);
          toast.error('Invalid data format received');
        }
      }
    } catch (error: any) {
      console.error('Error fetching stakeholders:', error);
      toast.error(error.response?.data?.message || 'Failed to load stakeholders');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecentActivities = (data: ApiStakeholder[]) => {
    const activities = data.slice(0, 5).map(s => ({
      id: s._id,
      type: 'stakeholder_added',
      name: s.name,
      category: s.subcategoryId,
      time: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recently',
      icon: getCategoryIcon(s.subcategoryId)
    }));
    setRecentActivities(activities);
  };

  // Calculate statistics
  const internalCount = stakeholders.filter(s => {
    const subcategory = defaultStakeholderSubcategories.find(sc => sc.id === s.subcategoryId);
    return subcategory?.category === 'internal';
  }).length;

  const externalCount = stakeholders.filter(s => {
    const subcategory = defaultStakeholderSubcategories.find(sc => sc.id === s.subcategoryId);
    return subcategory?.category === 'external';
  }).length;

  const highEngagement = stakeholders.filter(s => s.engagementLevel === 'high').length;
  const mediumEngagement = stakeholders.filter(s => s.engagementLevel === 'medium').length;
  const lowEngagement = stakeholders.filter(s => s.engagementLevel === 'low').length;

  const categoryCount = new Set(stakeholders.map(s => s.subcategoryId)).size;

  // Get stakeholders by category
  const internalStakeholders = stakeholders.filter(s => {
    const subcategory = defaultStakeholderSubcategories.find(sc => sc.id === s.subcategoryId);
    return subcategory?.category === 'internal';
  });

  const externalStakeholders = stakeholders.filter(s => {
    const subcategory = defaultStakeholderSubcategories.find(sc => sc.id === s.subcategoryId);
    return subcategory?.category === 'external';
  });

  // Group stakeholders by subcategory
  const getStakeholdersBySubcategory = (stakeholderList: ApiStakeholder[]) => {
    const grouped: Record<string, ApiStakeholder[]> = {};
    stakeholderList.forEach(s => {
      if (!grouped[s.subcategoryId]) {
        grouped[s.subcategoryId] = [];
      }
      grouped[s.subcategoryId].push(s);
    });
    return grouped;
  };

  const internalBySubcategory = getStakeholdersBySubcategory(internalStakeholders);
  const externalBySubcategory = getStakeholdersBySubcategory(externalStakeholders);

  const getCategoryIcon = (subcategoryId: string) => {
    const subcategory = defaultStakeholderSubcategories.find(sc => sc.id === subcategoryId);
    switch (subcategory?.category) {
      case 'internal':
        return <UserCircle className="h-4 w-4 text-blue-500" />;
      case 'external':
        return <Building2 className="h-4 w-4 text-amber-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-blue-600 bg-blue-50';
      case 'low':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getEngagementIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <TrendingUp className="h-3 w-3" />;
      case 'medium':
        return <Minus className="h-3 w-3" />;
      case 'low':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const analyticsCards = [
    {
      title: "Total Stakeholders",
      value: stakeholders.length,
      description: "Registered in the system",
      icon: Network,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      trend: "+12% from last month"
    },
    {
      title: "Internal",
      value: internalCount,
      description: "Team members & leadership",
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-50",
      trend: `${((internalCount / (stakeholders.length || 1)) * 100).toFixed(1)}% of total`
    },
    {
      title: "External",
      value: externalCount,
      description: "Partners & stakeholders",
      icon: Building2,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      trend: `${((externalCount / (stakeholders.length || 1)) * 100).toFixed(1)}% of total`
    },
  ];

  const handleRefresh = () => {
    fetchStakeholders();
  };

  const handleNavigateToManage = () => {
    if (onNavigateToManage) {
      onNavigateToManage();
    }
  };

  const getSubcategoryName = (subcategoryId: string) => {
    return defaultStakeholderSubcategories.find(sc => sc.id === subcategoryId)?.name || subcategoryId;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex flex-col gap-3">
        {/* Header */}
          <div style={{ marginTop: '18px' }}>
            <h2 className="text-2xl font-bold tracking-tight">
              Stakeholder Overview
            </h2>
            <p className="text-muted-foreground">
              Monitor and analyze your stakeholder relationships
            </p>
        </div>

        {/* Button below header */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                <p className="text-xs text-muted-foreground/60 mt-2">{card.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Engagement Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Engagement Overview</CardTitle>
          <CardDescription>Stakeholder engagement levels distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  High Engagement
                </span>
                <span className="font-medium">{highEngagement}</span>
              </div>
              <Progress value={(highEngagement / (stakeholders.length || 1)) * 100} className="h-2 bg-gray-100" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Minus className="h-4 w-4 text-blue-500" />
                  Medium Engagement
                </span>
                <span className="font-medium">{mediumEngagement}</span>
              </div>
              <Progress value={(mediumEngagement / (stakeholders.length || 1)) * 100} className="h-2 bg-gray-100" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-gray-500" />
                  Low Engagement
                </span>
                <span className="font-medium">{lowEngagement}</span>
              </div>
              <Progress value={(lowEngagement / (stakeholders.length || 1)) * 100} className="h-2 bg-gray-100" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Stakeholder Management</CardTitle>
          <CardDescription>Manage and categorize your stakeholders</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="internal">Internal</TabsTrigger>
              <TabsTrigger value="external">External</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {stakeholders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-50 rounded-full">
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No stakeholders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Get started by adding your first stakeholder
                  </p>
                  <Button onClick={handleNavigateToManage}>
                    Add Your First Stakeholder
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Internal Stakeholders Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        Internal Stakeholders
                        <Badge variant="secondary" className="ml-2">
                          {internalCount}
                        </Badge>
                      </h4>
                    </div>
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-2">
                        {internalStakeholders.slice(0, 5).map((stakeholder) => (
                          <div key={stakeholder._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                                {getInitials(stakeholder.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{stakeholder.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{stakeholder.organization || 'No organization'}</p>
                            </div>
                            <Badge variant="outline" className={`text-xs ${getEngagementColor(stakeholder.engagementLevel)}`}>
                              {stakeholder.engagementLevel}
                            </Badge>
                          </div>
                        ))}
                        {internalCount > 5 && (
                          <Button
                            variant="ghost"
                            className="w-full mt-2 text-sm"
                            onClick={handleNavigateToManage}
                          >
                            View all {internalCount} internal stakeholders
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* External Stakeholders Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-amber-500" />
                        External Stakeholders
                        <Badge variant="secondary" className="ml-2">
                          {externalCount}
                        </Badge>
                      </h4>
                    </div>
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-2">
                        {externalStakeholders.slice(0, 5).map((stakeholder) => (
                          <div key={stakeholder._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-amber-100 text-amber-700 text-xs">
                                {getInitials(stakeholder.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{stakeholder.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{stakeholder.organization || 'No organization'}</p>
                            </div>
                            <Badge variant="outline" className={`text-xs ${getEngagementColor(stakeholder.engagementLevel)}`}>
                              {stakeholder.engagementLevel}
                            </Badge>
                          </div>
                        ))}
                        {externalCount > 5 && (
                          <Button
                            variant="ghost"
                            className="w-full mt-2 text-sm"
                            onClick={handleNavigateToManage}
                          >
                            View all {externalCount} external stakeholders
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="internal" className="space-y-4">
              {internalCount === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No internal stakeholders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(internalBySubcategory).map(([catId, stakeholders]) => (
                      <Card key={catId} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <UserCircle className="h-4 w-4 text-blue-500" />
                              {getSubcategoryName(catId)}
                            </span>
                            <Badge variant="secondary">{stakeholders.length}</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {stakeholders.slice(0, 3).map(s => (
                              <div key={s._id} className="text-xs flex justify-between items-center">
                                <span className="truncate">{s.name}</span>
                                <Badge variant="outline" className={`text-xs ${getEngagementColor(s.engagementLevel)}`}>
                                  {s.engagementLevel}
                                </Badge>
                              </div>
                            ))}
                            {stakeholders.length > 3 && (
                              <p className="text-xs text-muted-foreground mt-2">
                                +{stakeholders.length - 3} more
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <Button onClick={handleNavigateToManage} variant="outline">
                      Manage All Internal Stakeholders
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="external" className="space-y-4">
              {externalCount === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No external stakeholders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(externalBySubcategory).map(([catId, stakeholders]) => (
                      <Card key={catId} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-amber-500" />
                              {getSubcategoryName(catId)}
                            </span>
                            <Badge variant="secondary">{stakeholders.length}</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {stakeholders.slice(0, 3).map(s => (
                              <div key={s._id} className="text-xs flex justify-between items-center">
                                <span className="truncate">{s.name}</span>
                                <Badge variant="outline" className={`text-xs ${getEngagementColor(s.engagementLevel)}`}>
                                  {s.engagementLevel}
                                </Badge>
                              </div>
                            ))}
                            {stakeholders.length > 3 && (
                              <p className="text-xs text-muted-foreground mt-2">
                                +{stakeholders.length - 3} more
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <Button onClick={handleNavigateToManage} variant="outline">
                      Manage All External Stakeholders
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {recentActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your stakeholders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-gray-50">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Added to {getSubcategoryName(activity.category)}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StakeholderOverview;