
import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getMetricsByTopic, getDefaultMetricTracking, ESGMetricWithTracking } from '../../data/esgMetricsData';
import { getIRISMetricsByTopic, isStandardMaterialTopic, IRISMetric } from '../../data/irisMetricsDatabase';
import { toast } from 'sonner';
import TopicSelector from './TopicSelector';
import MetricsSelector from './MetricsSelector';
import SelectedMetricsList from './SelectedMetricsList';
import CustomMetricDialog from './CustomMetricDialog';
import ExcelUpload from './ExcelUpload';
import industryList from "../../data/industryBychatgtp.json";
import { httpClient } from '@/lib/httpClient';

interface MaterialTopic {
  id: string;
  name: string; // Add this property
  category: string;
  topic: string;
  esg: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
  framework?: string;
  industry?: string;
}

interface Metric {
  name: string;
  category: string;
  unit: string;
  code: string;
};

interface ESGMetricsManagerProps {
  materialTopics: MaterialTopic[];
  finalMetricsList: ESGMetricWithTracking[],
  customMetricsList: ESGMetricWithTracking[]
  getMaterialityData: () => void
}

const ESGMetricsManager: React.FC<ESGMetricsManagerProps> = ({ materialTopics, finalMetricsList, customMetricsList, getMaterialityData }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [availableMetrics, setAvailableMetrics] = useState<ESGMetricWithTracking[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<ESGMetricWithTracking[]>([]);
  const [savedMetrics, setSavedMetrics] = useState<ESGMetricWithTracking[]>([]);
  const [editingMetric, setEditingMetric] = useState<ESGMetricWithTracking | null>(null);
  const [editingSavedMetric, setEditingSavedMetric] = useState<ESGMetricWithTracking | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [customMetrics, setCustomMetrics] = useState<ESGMetricWithTracking[]>([]);
  const [isEditingConfig, setIsEditingConfig] = useState(false);

  const [standardMetrics, setStandardMetrics] = useState<ESGMetricWithTracking[]>([]);

  // Custom metric form state
  const [customMetricForm, setCustomMetricForm] = useState({
    name: '',
    description: '',
    unit: '',
    dataType: 'Numeric' as 'Numeric' | 'Percentage' | 'Text' | 'Boolean' | 'Dropdown' | 'Radio' | 'Table',
    collectionFrequency: 'Monthly' as 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Bi-Annually' | 'Annually',
    inputFormat: {
      options: [] as string[],
      tableColumns: [] as string[],
      tableRows: 1,
    },
    showOnDashboard: false,
  });

  useEffect(() => {

    setSavedMetrics(finalMetricsList.map((m) => {
      if (m.esg) {
        return m;
      }
      else {
        let esg = materialTopics.filter((mt) => mt.industry == m.industry && mt.topic == m.topic)
        if (esg && esg.length > 0) {
          return { ...m, esg: esg[0].esg }
        }
        else {
          return { ...m, esg: '' }
        }
      }
    }))
  }, [])



  // const getMaterialityData = async () => {
  //   try {
  //     let materilityDataResponse = await httpClient.get(`materiality/${JSON.parse(localStorage.getItem('fandoro-user')).entityId}`)
  //     if (materilityDataResponse['status'] == 200) {
  //       if (materilityDataResponse['data']) {
  //         if (materilityDataResponse['data']['industry']) {
  //           console.log("materialityData['data']['industry']", materilityDataResponse['data']['industry'])
  //           // setSelectedIndustries(materilityDataResponse['data']['industry'])
  //           // setTempSelectedIndustries(materilityDataResponse['data']['industry'])
  //         }
  //         if (materilityDataResponse['data']['customTopics']) {
  //           // setSavedCustomTopics(materilityDataResponse['data']['customTopics'])
  //         }
  //         if (materilityDataResponse['data']['finalizingMethod']) {
  //           // setFinalizationMethod(materilityDataResponse['data']['finalizingMethod'])
  //           // setFinalizationStep(materilityDataResponse['data']['finalizingMethod'])
  //         }

  //         if (materilityDataResponse['data']['selectedTopics']) {
  //           // setSelectedMaterialTopics(materilityDataResponse['data']['selectedTopics'])
  //           // setSelectedTopicsForEngagement(materilityDataResponse['data']['selectedTopics'])
  //         }

  //         if (materilityDataResponse['data']['finalTopics'] && materilityDataResponse['data']['finalTopics'].length > 0) {
  //           // setSelectedMaterialTopics(materilityDataResponse['data']['finalTopics'])
  //           // setSelectedTopicsForEngagement(materilityDataResponse['data']['selectedTopics'])
  //           if (materilityDataResponse['data']['selectedTopics']) {
  //             let finalMetricsSelected=materilityDataResponse['data']['selectedTopics'].map((t)=>{
  //               let filteredData=materilityDataResponse['data']['finalTopics'].filter((f)=> (t.topic == f.topic) && t.industry == f.industry)

  //               return {...t,finalized:(filteredData && filteredData.length>0)?true:false}
  //             })
  //             console.log(`materilityDataResponse['data']['selectedTopics']`,finalMetricsSelected)
  //             // setSelectedMaterialTopics(finalMetricsSelected)
  //             // setSelectedTopicsForEngagement(finalMetricsSelected)
  //           }
  //         }
  //       }
  //     }
  //     console.log('materilityDataResponse', materilityDataResponse)
  //   } catch (error) {
  //     console.log("error :: getMaterialityData => ", error)
  //   }
  // }

  // Load saved metrics and custom metrics from localStorage on component mount
  useEffect(() => {
    // const saved = localStorage.getItem('savedESGMetrics');
    // if (saved) {
    //   try {
    //     const parsedMetrics = JSON.parse(saved);
    //     setSavedMetrics(parsedMetrics);
    //   } catch (error) {
    //     console.error('Error loading saved metrics:', error);
    //   }
    // }

    // const savedCustomMetrics = localStorage.getItem('customESGMetrics');
    // if (savedCustomMetrics) {
    //   try {
    //     const customData = JSON.parse(savedCustomMetrics);
    //     setCustomMetrics(customData);
    //   } catch (error) {
    //     console.error('Error loading custom metrics:', error);
    //   }
    // }
    const remainingMetrics = [...customMetricsList, ...standardMetrics].filter(
      metric => !finalMetricsList.some(toRemove => toRemove.code === metric.code)
    );
    console.log('remainingMetrics', remainingMetrics)
    // setSelectedMetrics(remainingMetrics);
    finalMetricsList.map((m) => {
      if (m.esg) {
        return m;
      }
      else {
        let esg = materialTopics.filter((mt) => mt.industry == m.industry && mt.topic == m.topic)
        if (esg && esg.length > 0) {
          return { ...m, esg: esg[0].esg }
        }
        else {
          return { ...m, esg: '' }
        }
      }
    })
    setSavedMetrics(finalMetricsList)
  }, [customMetricsList, finalMetricsList, standardMetrics]);



  function getMetricsByIndustryAndTopic(
    data: any[],
    industryName: string,
    topicName: string,
    esg: string
  ): ESGMetricWithTracking[] {
    const industry = data.find(industry => industry.name === industryName);
    if (!industry) return [];

    const topic = industry.topics.find(topic => topic.name === topicName);
    if (!topic) return [];

    return topic.metrics.map((m) => { return { ...m, industry: industryName, topic: topicName, esg: esg } });
  }

  useEffect(() => {
    let preExistMetric = materialTopics.reduce((a, c) => {
      a = a.concat(...getMetricsByIndustryAndTopic(industryList, c.industry, c.topic, c.esg))
      return a
    }, [])
    // setSelectedMetrics(preExistMetric)
    setStandardMetrics(preExistMetric)
    // setAvailableMetrics(preExistMetric)
  }, [materialTopics, industryList])

  // Save metrics to localStorage whenever savedMetrics changes
  useEffect(() => {
    localStorage.setItem('savedESGMetrics', JSON.stringify(savedMetrics));
  }, [savedMetrics]);

  useEffect(() => {
    console.log(`selectedMetrics => `, selectedMetrics)
  }, [selectedMetrics]);

  // Load metrics when topic changes
  useEffect(() => {
    if (selectedTopicId && selectedTopicId !== 'all-topics') {
      console.log(`selectedTopicId ===> `, selectedTopicId)
      // Check if this is a standard material topic with IRIS+ metrics
      // if (isStandardMaterialTopic(selectedTopicId)) {
      //   // Get IRIS+ metrics for this topic
      //   const irisMetrics = getIRISMetricsByTopic(selectedTopicId);
      //   const convertedIrisMetrics: ESGMetricWithTracking[] = irisMetrics.map(metric => ({
      //     id: metric.id,
      //     name: metric.name,
      //     description: metric.description,
      //     unit: metric.unit,
      //     code: metric.id,
      //     source: 'IRIS+',
      //     framework: metric.framework,
      //     topic: selectedTopicId,
      //     category: metric.category,
      //     dataType: metric.dataType,
      //     inputFormat: {},
      //     collectionFrequency: metric.collectionFrequency,
      //     dataPoints: [],
      //     isSelected: false
      //   }));

      //   // Also get any existing topic-specific metrics
      //   const topicMetrics = getMetricsByTopic(selectedTopicId)
      //     .map(metric => {
      //       const defaultTracking = getDefaultMetricTracking(metric);
      //       return {
      //         ...defaultTracking,
      //         collectionFrequency: 'Monthly' as const
      //       };
      //     });

      //   // Combine IRIS+ metrics, topic-specific metrics, and custom metrics
      //   setAvailableMetrics([...convertedIrisMetrics, ...topicMetrics, ...customMetrics]);
      // } else {
      //   // For custom topics or topics without IRIS+ metrics, use existing logic
      //   const topicMetrics = getMetricsByTopic(selectedTopicId)
      //     .map(metric => {
      //       const defaultTracking = getDefaultMetricTracking(metric);
      //       return {
      //         ...defaultTracking,
      //         collectionFrequency: 'Monthly' as const
      //       };
      //     });
      //   setAvailableMetrics([...topicMetrics, ...customMetrics]);
      // }
      let topicData = materialTopics.filter((m) => m.id == selectedTopicId);
      let saveCustomMetric = [...customMetricsList].filter((cm) => cm.topic == topicData[0].topic && cm.industry == topicData[0].industry)

      let metricData = getMetricsByIndustryAndTopic(industryList, topicData[0].industry, topicData[0].topic, topicData[0].esg)
      console.log(`metricData => `, metricData)
      setAvailableMetrics([...metricData, ...customMetrics, ...saveCustomMetric])
    } else {
      // If no topic selected or "all-topics" selected, show all custom metrics as available
      setAvailableMetrics(customMetrics);
    }
  }, [selectedTopicId, customMetrics]);

  const handleSelectTopic = (topicId: string) => {
    console.log("handleSelectTopic :: setSelectedMetrics",)
    setSelectedTopicId(topicId);
    setSelectedMetrics([]);
  };

  // const handleAddMetric = (metricId: string) => {
  //   const metric = availableMetrics.find(m => m.code === metricId);
  //   if (metric && !selectedMetrics.find(sm => sm.code === metricId)) {
  //     setSelectedMetrics([...selectedMetrics, { ...metric, isSelected: true }]);
  //     toast.success('Metric added to your selection');
  //   }
  // };
  const handleAddMetric = (metricId: string) => {
    const separatorIndex = metricId.indexOf('::');
    const code = metricId.substring(0, separatorIndex);
    const name = metricId.substring(separatorIndex + 2);

    const existingIndex = selectedMetrics.findIndex(
      m => m.code === code && m.name === name
    );
    // console.log('existingIndex',existingIndex);
    if (existingIndex >= 0) {
      setSelectedMetrics(prev => prev.filter((_, index) => index !== existingIndex));
    } else {
      const metric = availableMetrics.find(m => m.code === code && m.name === name);
      if (metric) {
        setSelectedMetrics(prev => [...prev, metric]);
      } else {
        console.error('Metric not found:', { code, name });
      }
    }
  };

  const handleRemoveMetric = (metric:ESGMetricWithTracking) => {
    // console.log(`handleRemoveMetric :: handleRemoveMetric :: metric => `, metric)
    // console.log(`handleRemoveMetric :: handleRemoveMetric :: selectedMetrics => `, selectedMetrics)
    // console.log(`selectedMetrics.filter(m => m.code !== metricId)`,selectedMetrics.filter(m => m.code !== metric.code && metric.name !== metric.name))
    // setSelectedMetrics(selectedMetrics.filter(m => m.code !== metricId));
    let tempSelectedMetrics = [...selectedMetrics]
    const index = tempSelectedMetrics.findIndex(item =>
      Object.keys(metric).every(key => item[key] === metric[key])
    );
    console.log(`handleRemoveMetric :: index => `, index)
    if (index > -1) {
      tempSelectedMetrics.splice(index, 1); // remove it
    }
    setSelectedMetrics([...tempSelectedMetrics]);
    toast.success('Metric removed from selection');
  };

  const handleEditMetric = (metric: ESGMetricWithTracking) => {
    console.log(`handleEditMetric :: handleEditMetric :: metric => `, metric)
    setEditingMetric(metric);
    setCustomMetricForm({
      name: metric.name,
      description: metric.description,
      unit: metric.unit,
      dataType: metric.dataType,
      collectionFrequency: metric.collectionFrequency,
      inputFormat: {
        options: metric.inputFormat?.options || [],
        tableColumns: metric.inputFormat?.tableColumns || [],
        tableRows: metric.inputFormat?.tableRows || 1,
      },
      showOnDashboard: metric.showOnDashboard || false,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSavedMetric = (metric: ESGMetricWithTracking) => {
    setIsEditingConfig(true)
    setEditingMetric(metric);
    setCustomMetricForm({
      name: metric.name,
      description: metric.description,
      unit: metric.unit,
      dataType: metric.dataType,
      collectionFrequency: metric.collectionFrequency,
      inputFormat: {
        options: metric.inputFormat?.options || [],
        tableColumns: metric.inputFormat?.tableColumns || [],
        tableRows: metric.inputFormat?.tableRows || 1,
      },
      showOnDashboard: metric.showOnDashboard || false,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteSavedMetric = async (metricId: string) => {
    // setSavedMetrics(metrics => metrics.filter(m => m.id !== metricId));
    let final = savedMetrics
    let metricsToDeleteIndex = savedMetrics.findIndex((m) => m.code! == metricId)
    if (metricsToDeleteIndex >= 0) {
      final.splice(metricsToDeleteIndex, 1)
    }
    let updateResponse = await httpClient.post("materiality/v1", {
      entityId: JSON.parse(localStorage.getItem('fandoro-user')).entityId,
      finalMetrics: final
    })

    if (updateResponse.status === 201) {
      setSavedMetrics(prev => [
        ...prev,
        ...selectedMetrics.filter(
          metric => !prev.some(m => m.code === metric.code)
        )
      ]);

      setSelectedMetrics([]);
      toast.success(`${selectedMetrics.length} metrics saved successfully`);
      getMaterialityData()
    }
    toast.success('Metric deleted successfully');
  };

  const handleSaveEdit = async () => {
    console.log(`handleSaveEdit :: handleSaveEdit `)
    if (editingMetric) {
      const updatedMetric = {
        ...editingMetric,
        name: customMetricForm.name,
        description: customMetricForm.description,
        unit: customMetricForm.unit,
        dataType: customMetricForm.dataType,
        inputFormat: customMetricForm.inputFormat,
        collectionFrequency: customMetricForm.collectionFrequency,
      };
      console.log(`handleSaveEdit :: updatedMetric :: updatedMetric => `, updatedMetric)
      console.log(`handleSaveEdit :: updatedMetric :: selectedMetrics => `, selectedMetrics)

      const index = selectedMetrics.findIndex(item =>
        Object.keys(editingMetric).every(key => item[key] === editingMetric[key])
      );
      const tempSelectedMetrics = [...selectedMetrics];
      if(index >= 0) {
        tempSelectedMetrics.splice(index, 1,updatedMetric); // remove the old metric
      }
      // tempSelectedMetrics[index] = updatedMetric;
      // setSelectedMetrics(metrics =>
      //   metrics.map(m => m.code === editingMetric.code ? updatedMetric : m)
      // );
      setSelectedMetrics(tempSelectedMetrics);




      // Update in saved metrics if it exists there
      const indexSaved = savedMetrics.findIndex(item =>
        Object.keys(editingMetric).every(key => item[key] === editingMetric[key])
      );
      const tempSavedMetrics = [...savedMetrics];
      if(indexSaved >= 0) {
        tempSavedMetrics.splice(indexSaved, 1,updatedMetric); // remove the old metric
      }
      setSavedMetrics(tempSavedMetrics);
      let final=tempSavedMetrics;
      // setSavedMetrics(metrics =>
      //   metrics.map(m => m.code === editingMetric.code ? updatedMetric : m)
      // );
      // let final = savedMetrics.map(m => m.code === editingMetric.code ? updatedMetric : m)

      // Update in custom metrics if it's a custom metric
      if (editingMetric.source === 'Custom') {
        const updatedCustomMetrics = customMetrics.map(m =>
          m.id === editingMetric.id ? updatedMetric : m
        );
        setCustomMetrics(updatedCustomMetrics);
        // localStorage.setItem('customESGMetrics', JSON.stringify(updatedCustomMetrics));
      }
      if (isEditingConfig) {
        let updateResponse = await httpClient.post("materiality/v1", {
          entityId: JSON.parse(localStorage.getItem('fandoro-user')).entityId,
          finalMetrics: final
        })

        if (updateResponse.status === 201) {
          setSavedMetrics(prev => [
            ...prev,
            ...selectedMetrics.filter(
              metric => !prev.some(m => m.code === metric.code)
            )
          ]);

          setSelectedMetrics([]);
          toast.success(`${selectedMetrics.length} metrics saved successfully`);
          getMaterialityData()
        }
      }


      toast.success('Metric updated successfully');
      setIsEditDialogOpen(false);
      setEditingMetric(null);
      resetCustomMetricForm();
    }
  };

  const handleSaveEditConfiguration = async () => {
    debugger;
    console.log(`handleSaveEdit :: handleSaveEdit `)
    if (editingSavedMetric) {
      const updatedMetric = {
        ...editingMetric,
        name: customMetricForm.name,
        description: customMetricForm.description,
        unit: customMetricForm.unit,
        dataType: customMetricForm.dataType,
        inputFormat: customMetricForm.inputFormat,
        collectionFrequency: customMetricForm.collectionFrequency,
      };
      console.log(`handleSaveEdit :: updatedMetric :: updatedMetric => `, updatedMetric)
      console.log(`handleSaveEdit :: updatedMetric :: selectedMetrics => `, selectedMetrics)
      setSelectedMetrics(metrics =>
        metrics.map(m => m.code === editingMetric.code ? updatedMetric : m)
      );

      // Update in saved metrics if it exists there
      setSavedMetrics(metrics =>
        metrics.map(m => m.code === editingMetric.code ? updatedMetric : m)
      );
      let final = savedMetrics.map(m => m.code === editingMetric.code ? updatedMetric : m)

      // Update in custom metrics if it's a custom metric
      if (editingMetric.source === 'Custom') {
        const updatedCustomMetrics = customMetrics.map(m =>
          m.id === editingMetric.id ? updatedMetric : m
        );
        setCustomMetrics(updatedCustomMetrics);
        // localStorage.setItem('customESGMetrics', JSON.stringify(updatedCustomMetrics));
      }

      // let updateResponse = await httpClient.post("materiality/v1", {
      //   entityId: JSON.parse(localStorage.getItem('fandoro-user')).entityId,
      //   finalMetrics: final
      // })

      // if (updateResponse.status === 201) {
      //   setSavedMetrics(prev => [
      //     ...prev,
      //     ...selectedMetrics.filter(
      //       metric => !prev.some(m => m.code === metric.code)
      //     )
      //   ]);

      //   setSelectedMetrics([]);
      //   toast.success(`${selectedMetrics.length} metrics saved successfully`);
      //   getMaterialityData()
      // }

      toast.success('Metric updated successfully');
      setIsEditDialogOpen(false);
      setEditingMetric(null);
      resetCustomMetricForm();
    }
  };

  const handleAddCustomMetric = async () => {
    if (!customMetricForm.name.trim()) {
      toast.error('Please enter a metric name');
      return;
    }
    console.log("handleAddCustomMetric :: Entry")
    // Determine category based on selected topic or default
    let category: 'Environmental' | 'Social' | 'Governance' = 'Environmental';
    let selectedTopic: MaterialTopic = null;
    if (selectedTopicId) {
      selectedTopic = materialTopics.find(topic => topic.id === selectedTopicId);
      if (selectedTopic) {
        category = selectedTopic.esg === 'Environment'
          ? 'Environmental'
          : (selectedTopic.esg as 'Social' | 'Governance');
      }
    }

    const customMetric: ESGMetricWithTracking = {
      id: `custom_${Date.now()}`,
      code: `custom_${Date.now()}`,
      name: customMetricForm.name,
      description: customMetricForm.description || 'Custom metric',
      unit: customMetricForm.unit || 'N/A',
      source: 'Custom',
      framework: 'Custom',
      topic: selectedTopic ? selectedTopic.topic : 'all',
      industry: selectedTopic ? selectedTopic.industry : 'all',
      category,
      dataType: customMetricForm.dataType,
      inputFormat: customMetricForm.inputFormat,
      collectionFrequency: customMetricForm.collectionFrequency,
      dataPoints: [],
      isSelected: true,
      esg: selectedTopic ? selectedTopic.esg : '',
      showOnDashboard: customMetricForm.showOnDashboard || false,
    };

    // Add to custom metrics list and save to localStorage
    const updatedCustomMetrics = [...customMetrics, customMetric];
    setCustomMetrics(updatedCustomMetrics);
    // localStorage.setItem('customESGMetrics', JSON.stringify(updatedCustomMetrics));

    // Add to selected metrics
    let updatedSelectedMetrics = [...selectedMetrics, customMetric]

    try {
      let updateResponse = await httpClient.post("materiality/v1", {
        entityId: JSON.parse(localStorage.getItem('fandoro-user')).entityId,
        customMetrics: updatedCustomMetrics
      })
      console.log('updateResponse', updateResponse)
      setSelectedMetrics(updatedSelectedMetrics);
      setIsAddDialogOpen(false);
      resetCustomMetricForm();
      toast.success('Custom metric added and available for all topics');
    } catch (error) {
      console.log("error :: updateMatrixData => ", error)
    }

  };

  const handleSaveConfiguration = async () => {
    if (selectedMetrics.length === 0) {
      toast.error('Please select at least one metric to save');
      return;
    }

    let checkRequiredFieldsStatus = selectedMetrics.filter((m) => !m.dataType || !m.inputFormat || !m.collectionFrequency)
    if (checkRequiredFieldsStatus && checkRequiredFieldsStatus.length > 0) {
      toast.error('Please select all required field for configuration i.e. Data Type,Frequency');
      return;
    }

    // // Add selected metrics to saved metrics, avoiding duplicates
    // const newMetrics = selectedMetrics.filter(
    //   selectedMetric => !savedMetrics.find(saved => saved.id === selectedMetric.id)
    // );

    // setSavedMetrics(prev => [...prev, ...newMetrics]);
    // toast.success(`${selectedMetrics.length} metrics saved for data entry`);

    try {
      let final = [...selectedMetrics, ...finalMetricsList].filter((m) => m.dataType && m.inputFormat && m.collectionFrequency)
      let updateResponse = await httpClient.post("materiality/v1", {
        entityId: JSON.parse(localStorage.getItem('fandoro-user')).entityId,
        finalMetrics: final,
        selectedMetrics: [...selectedMetrics, ...finalMetricsList]
      })

      if (updateResponse.status === 201) {
        setSavedMetrics(prev => [
          ...prev,
          ...selectedMetrics.filter(
            metric => !prev.some(m => m.code === metric.code)
          )
        ]);
        // setSelectedTopicId(selectedTopicId)
        setSelectedMetrics([]);
        toast.success(`${selectedMetrics.length} metrics saved successfully`);
        getMaterialityData()
      }
    } catch (error) {
      console.log("error :: updateMatrixData => ", error)
    }
    setSelectedMetrics([]);
  };

  const resetCustomMetricForm = () => {
    setCustomMetricForm({
      name: '',
      description: '',
      unit: '',
      dataType: 'Numeric',
      collectionFrequency: 'Monthly',
      inputFormat: {
        options: [],
        tableColumns: [],
        tableRows: 1,
      },
      showOnDashboard: false,
    });
  };

  const selectedTopic = materialTopics.find(topic => topic.id === selectedTopicId);

  return (
    <div className="space-y-6">
      <ExcelUpload
        onMetricsImported={(metrics) => {
          setSavedMetrics(prev => [...prev, ...metrics]);
          toast.success(`${metrics.length} metrics imported and saved`);
        }}
        onDataImported={() => { }} // Data import handled in MetricsDataEntry
        materialTopics={materialTopics}
      />

      <TopicSelector
        materialTopics={materialTopics}
        selectedTopicId={selectedTopicId}
        onSelectTopic={handleSelectTopic}
      />

      {/* Always show metrics section - either topic-specific or all custom metrics */}
      <div className="space-y-6">
        {!selectedTopicId && (
          <Card>
            <CardHeader>
              <CardTitle>Custom Metrics Management</CardTitle>
              <CardDescription>
                Add and manage custom ESG metrics that can be used across all material topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {customMetrics.length} custom metrics available
                </p>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Metric
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <MetricsSelector
          selectedTopic={selectedTopic}
          availableMetrics={availableMetrics}
          selectedMetrics={selectedMetrics}
          onAddMetric={handleAddMetric}
          onOpenCustomDialog={() => setIsAddDialogOpen(true)}
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          savedMetrics={savedMetrics}
        >
          <CustomMetricDialog
            isEdit={false}
            selectedTopic={selectedTopic}
            customMetricForm={customMetricForm}
            setCustomMetricForm={setCustomMetricForm}
            onSave={handleAddCustomMetric}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </MetricsSelector>

        <SelectedMetricsList
          selectedMetrics={selectedMetrics}
          selectedTopic={selectedTopic}
          onEditMetric={handleEditMetric}
          onRemoveMetric={handleRemoveMetric}
          onSaveConfiguration={handleSaveConfiguration}
          savedMetrics={savedMetrics}
          onEditSavedMetric={handleEditSavedMetric}
          onDeleteSavedMetric={handleDeleteSavedMetric}
        />
      </div>

      {/* Edit Metric Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <CustomMetricDialog
          isEdit={true}
          selectedTopic={selectedTopic}
          customMetricForm={customMetricForm}
          setCustomMetricForm={setCustomMetricForm}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default ESGMetricsManager;
