
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star } from "lucide-react";
import { sdgGoals } from "@/data";

const SDGPerformance = () => {
  // Get top 3 SDGs by progress
  const topSDGs = [...sdgGoals]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Top SDG Performance</CardTitle>
            <CardDescription>Most progress achieved in Sustainable Development Goals</CardDescription>
          </div>
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topSDGs.map((sdg, index) => (
            <div key={sdg.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-8 h-8 flex items-center justify-center p-0">
                    {sdg.number}
                  </Badge>
                  <div>
                    <p className="font-medium">{sdg.name}</p>
                    <p className="text-sm text-muted-foreground">Progress: {sdg.progress}%</p>
                  </div>
                </div>
                {index === 0 && (
                  <Star className="h-5 w-5 text-amber-500" fill="currentColor" />
                )}
              </div>
              <Progress value={sdg.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SDGPerformance;
