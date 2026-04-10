import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MaterialTopic } from '../../enterprise-admin/data/frameworkTopics';
import { httpClient } from '@/lib/httpClient';

interface StakeholderResultsViewProps {
  stakeholderName: string;
  groupName: string;
  topics: MaterialTopic[];
}

interface AggregatedResult {
  topicId: string;
  averageBusinessImpact: number;
  averageSustainabilityImpact: number;
  medianBusinessImpact: number;
  medianSustainabilityImpact: number;
  totalResponses: number;
  comments: string[];
  stakeholderBreakdown?: {
    byEngagementLevel: Array<{ key: string; count: number; percentage: number }>;
    byInfluence: Array<{ key: string; count: number; percentage: number }>;
    byInterest: Array<{ key: string; count: number; percentage: number }>;
  };
  materialityMatrix: {
    x: number;
    y: number;
  };
}

interface GroupStatistics {
  success: boolean;
  groupName: string;
  groupDetails?: any;
  totalStakeholders: number;
  submittedAssessments: number;
  pendingAssessments: number;
  completionRate: number;
  stakeholderMetrics?: {
    engagementBreakdown: Record<string, number>;
    influenceBreakdown: Record<string, number>;
    interestBreakdown: Record<string, number>;
    organizations: string[];
    uniqueOrganizations: number;
  };
}

const StakeholderResultsView: React.FC<StakeholderResultsViewProps> = ({
  stakeholderName,
  groupName,
  topics
}) => {
  const [aggregatedResults, setAggregatedResults] = useState<AggregatedResult[]>([]);
  const [groupStats, setGroupStats] = useState<GroupStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAssessments, setTotalAssessments] = useState(0);

  // Load aggregated results and statistics from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load aggregated results
        const resultsResponse: any = await httpClient.get(`stakeholders-materiality/aggregated?groupName=${encodeURIComponent(groupName)}`);
        console.log('Aggregated results response:', resultsResponse);
        
        if (resultsResponse?.success && resultsResponse.results) {
          setAggregatedResults(resultsResponse.results);
          setTotalAssessments(resultsResponse.totalAssessments || 0);
        } else if (resultsResponse?.data?.success && resultsResponse.data.results) {
          setAggregatedResults(resultsResponse.data.results);
          setTotalAssessments(resultsResponse.data.totalAssessments || 0);
        }

        // Load group statistics
        const statsResponse: any = await httpClient.get(`stakeholders-materiality/statistics?groupName=${encodeURIComponent(groupName)}`);
        console.log('Statistics response:', statsResponse);
        
        if (statsResponse?.success) {
          setGroupStats(statsResponse);
        } else if (statsResponse?.data?.success) {
          setGroupStats(statsResponse.data);
        }
      } catch (error) {
        console.error('Error loading aggregated data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (groupName) {
      loadData();
    }
  }, [groupName]);

  // Calculate topic priorities based on aggregated results
  const topicsWithScores = topics.map(topic => {
    const result = aggregatedResults.find(r => r.topicId === topic.id);
    
    const businessImpact = result?.averageBusinessImpact || 5;
    const sustainabilityImpact = result?.averageSustainabilityImpact || 5;
    
    return {
      ...topic,
      businessImpact: businessImpact,
      sustainabilityImpact: sustainabilityImpact,
      medianBusinessImpact: result?.medianBusinessImpact || businessImpact,
      medianSustainabilityImpact: result?.medianSustainabilityImpact || sustainabilityImpact,
      totalResponses: result?.totalResponses || 0,
      stakeholderBreakdown: result?.stakeholderBreakdown,
      comments: result?.comments || []
    };
  });

  // Calculate dynamic thresholds based on actual data
  const calculateDynamicThresholds = () => {
    if (topicsWithScores.length === 0) {
      return { highThreshold: 7.5, mediumThreshold: 5 };
    }
    
    const allScores = topicsWithScores.flatMap(t => [t.businessImpact, t.sustainabilityImpact]);
    const maxScore = Math.max(...allScores);
    const minScore = Math.min(...allScores);
    const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    
    // Dynamic thresholds based on data distribution
    const highThreshold = maxScore * 0.7; // Top 30% of max value
    const mediumThreshold = avgScore; // Average score
    
    return { highThreshold, mediumThreshold, maxScore, minScore, avgScore };
  };

  const { highThreshold, mediumThreshold, maxScore } = calculateDynamicThresholds();

  // Determine priority based on dynamic thresholds
  const highPriorityTopics = topicsWithScores.filter(
    topic => topic.businessImpact >= highThreshold && topic.sustainabilityImpact >= highThreshold
  );

  const mediumPriorityTopics = topicsWithScores.filter(
    topic => (topic.businessImpact >= highThreshold && topic.sustainabilityImpact < highThreshold) || 
            (topic.businessImpact < highThreshold && topic.sustainabilityImpact >= highThreshold)
  );

  const lowPriorityTopics = topicsWithScores.filter(
    topic => topic.businessImpact < highThreshold && topic.sustainabilityImpact < highThreshold
  );

  const effectiveTotalAssessments = totalAssessments;
  const effectiveSubmittedAssessments = groupStats?.submittedAssessments || totalAssessments;
  const effectiveCompletionRate = totalAssessments > 0 ? 100 : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading results...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stakeholder Participation Card */}
      <Card>
        <CardHeader>
          <CardTitle>Stakeholder Participation</CardTitle>
          <CardDescription>
            Overview of stakeholder engagement in the {groupName} group
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{effectiveTotalAssessments}</div>
              <div className="text-sm text-blue-600">Total Assessments</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{effectiveSubmittedAssessments}</div>
              <div className="text-sm text-green-600">Submitted Assessments</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{Math.round(effectiveCompletionRate)}%</div>
              <div className="text-sm text-purple-600">Completion Rate</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(effectiveCompletionRate)}%</span>
            </div>
            <Progress value={effectiveCompletionRate} className="h-2" />
          </div>

          {/* Show message about assessments */}
          {totalAssessments > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-700 text-sm">
                ✓ {totalAssessments} assessment{totalAssessments !== 1 ? 's' : ''} completed
              </p>
            </div>
          )}

          {/* Show dynamic threshold info */}
          {topicsWithScores.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                📊 Priority Threshold: Topics with both impacts ≥ {highThreshold.toFixed(1)} are High Priority
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Based on data range (max: {maxScore.toFixed(1)})
              </p>
            </div>
          )}

          {/* Stakeholder Breakdown - Only show if data exists */}
          {groupStats?.stakeholderMetrics && Object.keys(groupStats.stakeholderMetrics.engagementBreakdown).length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">By Engagement Level</h4>
                <div className="space-y-2">
                  {Object.entries(groupStats.stakeholderMetrics.engagementBreakdown).map(([level, count]) => {
                    const percentage = (count / groupStats.totalStakeholders) * 100;
                    return (
                      <div key={level}>
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{level}</span>
                          <span>{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-1" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">By Influence Level</h4>
                <div className="space-y-2">
                  {Object.entries(groupStats.stakeholderMetrics.influenceBreakdown).map(([level, count]) => {
                    const percentage = (count / groupStats.totalStakeholders) * 100;
                    return (
                      <div key={level}>
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{level}</span>
                          <span>{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-1" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">By Interest Level</h4>
                <div className="space-y-2">
                  {Object.entries(groupStats.stakeholderMetrics.interestBreakdown).map(([level, count]) => {
                    const percentage = (count / groupStats.totalStakeholders) * 100;
                    return (
                      <div key={level}>
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{level}</span>
                          <span>{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-1" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Priority Summary Cards with Dynamic Threshold */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-700">{highPriorityTopics.length}</div>
          <div className="text-sm text-green-600">High Priority Topics (Focus & Act)</div>
          <div className="text-xs text-green-500 mt-1">
            ≥ {highThreshold.toFixed(1)} in both dimensions
          </div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">{mediumPriorityTopics.length}</div>
          <div className="text-sm text-blue-600">Medium Priority Topics (Manage)</div>
          <div className="text-xs text-blue-500 mt-1">
            ≥ {highThreshold.toFixed(1)} in one dimension
          </div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-700">{lowPriorityTopics.length}</div>
          <div className="text-sm text-gray-600">Lower Priority Topics (Monitor)</div>
          <div className="text-xs text-gray-500 mt-1">
            &lt; {highThreshold.toFixed(1)} in both dimensions
          </div>
        </div>
      </div>

      {/* High Priority Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-700">High Priority Topics (Focus & Act)</CardTitle>
          <CardDescription>
            These topics have high impact on both business and sustainability (≥ {highThreshold.toFixed(1)}/10). Priority for immediate action.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {highPriorityTopics.map((topic: any) => (
              <div key={topic.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{topic.name}</h3>
                      <Badge variant="outline">{topic.category}</Badge>
                      <Badge variant="secondary">{topic.framework}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                    
                    {/* Impact Scores */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Business Impact</div>
                        <div className="flex items-center gap-2">
                          <Progress value={(topic.businessImpact / maxScore) * 100} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{topic.businessImpact.toFixed(1)}/10</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Median: {topic.medianBusinessImpact.toFixed(1)}/10
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Sustainability Impact</div>
                        <div className="flex items-center gap-2">
                          <Progress value={(topic.sustainabilityImpact / maxScore) * 100} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{topic.sustainabilityImpact.toFixed(1)}/10</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Median: {topic.medianSustainabilityImpact.toFixed(1)}/10
                        </div>
                      </div>
                    </div>

                    {/* Stakeholder Breakdown */}
                    {topic.stakeholderBreakdown && (
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Engagement:</span>
                          {topic.stakeholderBreakdown.byEngagementLevel?.map((item: any) => (
                            <div key={item.key} className="capitalize">
                              {item.key}: {item.count} ({item.percentage.toFixed(1)}%)
                            </div>
                          ))}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Influence:</span>
                          {topic.stakeholderBreakdown.byInfluence?.map((item: any) => (
                            <div key={item.key} className="capitalize">
                              {item.key}: {item.count} ({item.percentage.toFixed(1)}%)
                            </div>
                          ))}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Interest:</span>
                          {topic.stakeholderBreakdown.byInterest?.map((item: any) => (
                            <div key={item.key} className="capitalize">
                              {item.key}: {item.count} ({item.percentage.toFixed(1)}%)
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comments Section */}
                    {topic.comments && topic.comments.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <span className="text-xs text-muted-foreground">Stakeholder Comments:</span>
                        {topic.comments.slice(0, 3).map((comment: string, idx: number) => (
                          <p key={idx} className="text-sm italic text-muted-foreground mt-1">
                            "{comment}"
                          </p>
                        ))}
                        {topic.comments.length > 3 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            +{topic.comments.length - 3} more comments
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <Badge className="ml-4 bg-green-100 text-green-700">
                    {topic.totalResponses} {topic.totalResponses === 1 ? 'response' : 'responses'}
                  </Badge>
                </div>
              </div>
            ))}
            {highPriorityTopics.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No high priority topics identified</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Medium Priority Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700">Medium Priority Topics (Manage)</CardTitle>
          <CardDescription>
            These topics have moderate impact (one dimension ≥ {highThreshold.toFixed(1)}/10, other &lt; {highThreshold.toFixed(1)}/10). Important to manage but not immediate priority.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mediumPriorityTopics.map((topic: any) => (
              <div key={topic.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{topic.name}</h3>
                      <Badge variant="outline">{topic.category}</Badge>
                      <Badge variant="secondary">{topic.framework}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Business Impact</div>
                        <div className="flex items-center gap-2">
                          <Progress value={(topic.businessImpact / maxScore) * 100} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{topic.businessImpact.toFixed(1)}/10</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Sustainability Impact</div>
                        <div className="flex items-center gap-2">
                          <Progress value={(topic.sustainabilityImpact / maxScore) * 100} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{topic.sustainabilityImpact.toFixed(1)}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className="ml-4 bg-blue-100 text-blue-700">
                    {topic.totalResponses} {topic.totalResponses === 1 ? 'response' : 'responses'}
                  </Badge>
                </div>
              </div>
            ))}
            {mediumPriorityTopics.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No medium priority topics identified</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lower Priority Topics */}
      {lowPriorityTopics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-700">Lower Priority Topics (Monitor)</CardTitle>
            <CardDescription>
              These topics have lower impact (both dimensions &lt; {highThreshold.toFixed(1)}/10). Monitor but no immediate action required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowPriorityTopics.map((topic: any) => (
                <div key={topic.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{topic.name}</h3>
                        <Badge variant="outline">{topic.category}</Badge>
                        <Badge variant="secondary">{topic.framework}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Business Impact</div>
                          <div className="flex items-center gap-2">
                            <Progress value={(topic.businessImpact / maxScore) * 100} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{topic.businessImpact.toFixed(1)}/10</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Sustainability Impact</div>
                          <div className="flex items-center gap-2">
                            <Progress value={(topic.sustainabilityImpact / maxScore) * 100} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{topic.sustainabilityImpact.toFixed(1)}/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge className="ml-4 bg-gray-100 text-gray-700">
                      {topic.totalResponses} {topic.totalResponses === 1 ? 'response' : 'responses'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StakeholderResultsView;