
import { ESGMetric, ESGMetricWithTracking } from './types';
import { giinMetrics } from './giinMetrics';
import { griMetrics } from './griMetrics';

// Helper function to get metrics by topic
export const getMetricsByTopic = (topicId: string): ESGMetric[] => {
  const relatedGiinMetrics = giinMetrics.filter(metric => metric.relatedTopic === topicId);
  const relatedGriMetrics = griMetrics.filter(metric => metric.relatedTopic === topicId);
  
  return [...relatedGiinMetrics, ...relatedGriMetrics];
};

// Helper function to get default metrics tracking data
export const getDefaultMetricTracking = (metric: ESGMetric): ESGMetricWithTracking => {
  return {
    ...metric,
    collectionFrequency: 'Monthly',
    dataPoints: [],
    isSelected: false
  };
};
