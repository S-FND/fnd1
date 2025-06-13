
import React from 'react';

const ImpactRecommendations: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Environmental Improvements</h3>
          <ol className="list-decimal pl-6 mt-2">
            <li>Accelerate renewable energy transition at manufacturing facilities</li>
            <li>Implement water recycling systems at high-consumption sites</li>
            <li>Expand sustainable sourcing program to cover 85% of raw materials by 2025</li>
          </ol>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Social Enhancements</h3>
          <ol className="list-decimal pl-6 mt-2">
            <li>Scale up apprenticeship program to additional locations</li>
            <li>Develop supplier diversity program to support underrepresented businesses</li>
            <li>Establish quantifiable targets for community program outcomes</li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default ImpactRecommendations;
