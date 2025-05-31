
// This file is maintained for backward compatibility
// It re-exports all the ESG metrics data from the new modular structure

export type { ESGMetric, ESGMetricWithTracking } from './esg-metrics';
export { giinMetrics, griMetrics, getMetricsByTopic, getDefaultMetricTracking } from './esg-metrics';
