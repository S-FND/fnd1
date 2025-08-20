
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { defaultMaterialTopics } from '../data/materiality';
import ESGMetricsManager from '../components/esg-metrics/ESGMetricsManager';
import MetricsDataEntry from '../components/esg-metrics/MetricsDataEntry';
import ESGDashboard from '../components/esg-metrics/ESGDashboard';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { httpClient } from '@/lib/httpClient';

interface MaterialTopic {
  id: string;
  topic: string;
  esg: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
  framework?: string;
}

const ESGMetricsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [finalizedTopics, setFinalizedTopics] = useState<MaterialTopic[]>([]);
  const [finalMetrics,setFinalMetrics]=useState();
  const [customMetrics,setCustomMetrics]=useState()

  const getMaterialityData = async () => {
    try {
      let materilityDataResponse = await httpClient.get(`materiality/${JSON.parse(localStorage.getItem('fandoro-user')).entityId}`)
      if (materilityDataResponse['status'] == 200) {
        if (materilityDataResponse['data']) {
          if(materilityDataResponse['data']['finalTopics']){
            setFinalizedTopics(materilityDataResponse['data']['finalTopics'])
          }
          if (materilityDataResponse['data']['finalMetrics']) {
            console.log("materialityData['data']['finalMetrics']", materilityDataResponse['data']['finalMetrics'])
            // setSelectedIndustries(materilityDataResponse['data']['industry'])
            // setTempSelectedIndustries(materilityDataResponse['data']['industry'])
            setFinalMetrics(materilityDataResponse['data']['finalMetrics'])
          }
          if (materilityDataResponse['data']['customMetrics']) {
            // setSavedCustomTopics(materilityDataResponse['data']['customTopics'])
            setCustomMetrics(materilityDataResponse['data']['customMetrics'])
          }
        }
      }
      console.log('materilityDataResponse', materilityDataResponse)
    } catch (error) {
      console.log("error :: getMaterialityData => ", error)
    }
  }

  // Load finalized topics from materiality assessment
  useEffect(() => {
    // const savedTopics = localStorage.getItem('finalizedMaterialTopics');
    // if (savedTopics) {
    //   try {
    //     const topics = JSON.parse(savedTopics);
    //     setFinalizedTopics(topics);
    //   } catch (error) {
    //     console.error('Error loading finalized topics:', error);
    //     // Fallback to high priority topics from default data
    //     const highPriorityTopics = defaultMaterialTopics.filter(
    //       topic => topic.businessImpact >= 7.0 && topic.sustainabilityImpact >= 7.0
    //     );
    //     setFinalizedTopics(highPriorityTopics);
    //   }
    // } else {
    //   // No finalized topics found, show message to complete materiality assessment
    //   setFinalizedTopics([]);
    // }
    getMaterialityData()
  }, []);

  useEffect(()=>{
    console.log("ESGMetricsPage :: selectedMetrics =====> ",customMetrics)
  },[customMetrics])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ESG Metrics Management</h1>
        <p className="text-muted-foreground">
          Configure and manage ESG metrics. You can upload metrics directly or link them to material topics from your materiality assessment
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Finalized Material Topics</CardTitle>
          <CardDescription>
            These topics were prioritized based on your materiality assessment results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {finalizedTopics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center p-3 border rounded-lg border-l-4"
                style={{ borderLeftColor: topic.color }}
              >
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{topic.topic}</h4>
                  <p className="text-xs text-muted-foreground">{topic.esg}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Business Impact:</span>
                      <div className="font-medium">{topic.businessImpact.toFixed(1)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sustainability Impact:</span>
                      <div className="font-medium">{topic.sustainabilityImpact.toFixed(1)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {finalizedTopics.length === 0 && (
            <div className="text-center py-8">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No Material Topics Finalized
                </h3>
                <p className="text-muted-foreground mb-4">
                  You can still upload and configure ESG metrics independently, or complete your materiality assessment to link metrics to specific topics.
                </p>
                <Button variant="outline" onClick={() => navigate('/materiality')}>
                  Go to Materiality Assessment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="configuration">Metrics Configuration</TabsTrigger>
          <TabsTrigger value="data-entry">Data Entry</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6 mt-4">
          <ESGDashboard materialTopics={finalizedTopics} />
        </TabsContent>
        
        <TabsContent value="configuration" className="space-y-6 mt-4">
          <ESGMetricsManager materialTopics={finalizedTopics} finalMetricsList={finalMetrics} customMetricsList={customMetrics} getMaterialityData={getMaterialityData} />
        </TabsContent>
        
        <TabsContent value="data-entry" className="space-y-6 mt-4">
          <MetricsDataEntry materialTopics={finalizedTopics} finalMetrics={finalMetrics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESGMetricsPage;
