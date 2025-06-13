
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ZAxis,
  Cell
} from 'recharts';
import MatrixQuadrant from './MatrixQuadrant';
import CustomTooltip from './CustomTooltip';

// Define allowed framework types
type Framework = 'SASB' | 'GRI' | 'Custom';

interface MaterialityMatrixProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  materialityData: any[];
  activeFrameworks?: Framework[];
  setActiveFrameworks?: (frameworks: Framework[]) => void;
}

const MaterialityMatrix: React.FC<MaterialityMatrixProps> = ({ 
  selectedCategory,
  setSelectedCategory,
  materialityData,
  activeFrameworks = ['SASB', 'GRI', 'Custom'],
  setActiveFrameworks
}) => {
  const filteredData = materialityData.filter(item => {
    // Filter by category
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    
    // Filter by framework
    if (item.framework && !activeFrameworks.includes(item.framework as Framework)) {
      return false;
    }
    
    return true;
  });

  // Define category colors
  const categoryColors = {
    'Environment': '#16a34a', // green-600 for better visibility
    'Social': '#2563eb',     // blue-600
    'Governance': '#d97706'  // amber-600
  };

  // Custom dot component to render colored dots
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const color = categoryColors[payload.category as keyof typeof categoryColors] || '#94a3b8';
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={6} 
        fill={color} 
        stroke="#fff"
        strokeWidth={1}
      />
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Double Materiality Matrix</CardTitle>
        <CardDescription>Plotting of material topics based on business impact and sustainability impact</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-1">
            <h3 className="text-base font-medium mb-2">Filter by Category</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                  selectedCategory === "All" 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                }`}
              >
                All Categories
              </button>
              {['Environment', 'Social', 'Governance'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    selectedCategory === category 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {setActiveFrameworks && (
              <div className="mt-6">
                <h3 className="text-base font-medium mb-2">Filter by Framework</h3>
                <div className="space-y-2">
                  {(['SASB', 'GRI', 'Custom'] as Framework[]).map((framework) => (
                    <div key={framework} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={`framework-${framework}`}
                        checked={activeFrameworks.includes(framework)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setActiveFrameworks([...activeFrameworks, framework]);
                          } else {
                            setActiveFrameworks(activeFrameworks.filter(f => f !== framework));
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={`framework-${framework}`} className="text-sm cursor-pointer">
                        {framework}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8">
              <h3 className="text-base font-medium mb-3">Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0" 
                    style={{ backgroundColor: categoryColors.Environment }}
                  ></div>
                  <span className="text-sm">Environmental</span>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0" 
                    style={{ backgroundColor: categoryColors.Social }}
                  ></div>
                  <span className="text-sm">Social</span>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0" 
                    style={{ backgroundColor: categoryColors.Governance }}
                  ></div>
                  <span className="text-sm">Governance</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3 h-[500px] relative">
            {/* Quadrant labels */}
            <MatrixQuadrant 
              x1="0%" 
              y1="0%" 
              x2="50%" 
              y2="50%" 
              label="Monitor" 
              className="text-gray-500" 
            />
            <MatrixQuadrant 
              x1="50%" 
              y1="0%" 
              x2="100%" 
              y2="50%" 
              label="Manage" 
              className="text-blue-500" 
            />
            <MatrixQuadrant 
              x1="0%" 
              y1="50%" 
              x2="50%" 
              y2="100%" 
              label="Maintain" 
              className="text-amber-500" 
            />
            <MatrixQuadrant 
              x1="50%" 
              y1="50%" 
              x2="100%" 
              y2="100%" 
              label="Focus & Act" 
              className="text-green-600 font-medium" 
            />
            
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Business Impact" 
                  domain={[0, 10]} 
                  label={{ value: 'Business Impact', position: 'bottom' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Sustainability Impact" 
                  domain={[0, 10]} 
                  label={{ value: 'Sustainability Impact', angle: -90, position: 'left' }}
                />
                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                <Tooltip content={<CustomTooltip />} />
                {/* Reference lines for quadrants */}
                <CartesianGrid strokeDasharray="3 3" />
                {/* Scatter plot points with custom colored dots */}
                <Scatter 
                  name="Material Topics" 
                  data={filteredData} 
                  shape={<CustomDot />}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialityMatrix;
