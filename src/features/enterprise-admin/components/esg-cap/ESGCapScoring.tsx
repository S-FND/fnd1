import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ESGCapItem } from '../../types/esgDD';
import { calculateESGScore } from "@/utils/esgScoring";

interface ESGCapScoringProps {
  items: ESGCapItem[];
}

export const ESGCapScoring: React.FC<ESGCapScoringProps> = ({ items }) => {

  // Priority weightages
  const { completionScore, timelinessScore, finalScore, actualScore, maxScore } =
    calculateESGScore(items);


  // useEffect(()=>{
  //   const { completionScore, timelinessScore, finalScore,actualScore,maxScore } =
  //   calculateESGScore(items);
  //   console.log('completionScore',completionScore)
  //   console.log('timelinessScore',timelinessScore)

  //   console.log('finalScore',finalScore)

  //   console.log('actualScore',actualScore)
  //   console.log('maxScore',maxScore)
  // },[])
  // Priority weightages - adjusted for actual priority values (capitalized)
  const priorityWeights = {
    High: 2,
    Medium: 1,
    Low: 0.5
  };

  const totalItems = items.length;
  const baseWeight = totalItems > 0 ? 100 / totalItems : 0;

  const totalWeightage = items.reduce((sum, item) => {
    const priority = item.priority || 'Medium';
    const weight = priorityWeights[priority] || priorityWeights.Medium;
    return sum + (baseWeight * weight);
  }, 0);

  // ✅ Use investorStatus "Closed" for completed items
  const completedWeightage = items
    .filter(item => item.investorStatus === 'Closed')
    .reduce((sum, item) => {
      const priority = item.priority || 'Medium';
      const weight = priorityWeights[priority] || priorityWeights.Medium;
      return sum + (baseWeight * weight);
    }, 0);

  const progressPercentage = totalWeightage > 0 ? (completedWeightage / totalWeightage) * 100 : 0;

  // ✅ Status breakdown using new company statuses
  const statusCounts = items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ✅ Count by new statuses
  const completedCount = items.filter(
    (item) => item.investorStatus === "Closed"
  ).length;

  const overdueCount = items.filter(
    (item) => item.status === "overdue"
  ).length;

  const dueSoonCount = items.filter(
    (item) => item.status === "due in <1 month"
  ).length;

  const upcomingCount = items.filter(
    (item) => item.status === "upcoming"
  ).length;

  const submittedCount = items.filter(
    (item) => item.status === "submitted"
  ).length;

  const resubmitCount = items.filter(
    (item) => item.status === "request to re-submit"
  ).length;

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">ESG CAP Progress</h3>
            <div className="text-2xl font-bold text-primary">
              {finalScore.toFixed(1)}%
            </div>
          </div>

          <Progress value={finalScore} className="w-full h-3" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-semibold text-lg">{totalItems}</div>
              <div className="text-muted-foreground">Total</div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-semibold text-lg text-green-700">
                {completedCount}
              </div>
              <div className="text-green-600">Closed</div>
            </div>

            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-lg text-blue-700">
                {submittedCount}
              </div>
              <div className="text-blue-600">Submitted</div>
            </div>

            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="font-semibold text-lg text-amber-700">{statusCounts.pending || 0}</div>
              <div className="text-amber-600">Pending</div>
            </div>
          </div>

          {/* <div className="flex justify-between text-sm text-muted-foreground">
            <span>Weighted Score: {completedWeightage.toFixed(1)} / {totalWeightage.toFixed(1)}</span>
            <span>Progress: {progressPercentage.toFixed(1)}% Complete</span>
          </div> */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Weighted Score: {actualScore.toFixed(1)} / {maxScore.toFixed(1)}</span>
            <span>Progress: {finalScore.toFixed(1)}% Complete</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};