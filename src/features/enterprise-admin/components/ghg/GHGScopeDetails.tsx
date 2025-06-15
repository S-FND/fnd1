
import React from 'react';

// Scope 1 Details content
export const Scope1Details: React.FC = () => (
  <div>
    <p>Scope 1 emissions are direct greenhouse gas emissions from sources owned or controlled by your organization, including:</p>
    <ul className="list-disc pl-6 pt-2 space-y-1">
      <li>Stationary combustion: Burning of fuels in boilers, furnaces, etc.</li>
      <li>Mobile combustion: Company-owned vehicles</li>
      <li>Process emissions: Manufacturing processes</li>
      <li>Fugitive emissions: Leaks from refrigeration, air conditioning, etc.</li>
    </ul>
  </div>
);

// Scope 2 Details content
export const Scope2Details: React.FC = () => (
  <div>
    <p>Scope 2 emissions are indirect greenhouse gas emissions from the consumption of purchased electricity, heat, steam, or cooling. These are generated at sources owned or controlled by another organization.</p>
    <div className="mt-4">
      <h4 className="font-medium">Calculation Methods:</h4>
      <ul className="list-disc pl-6 pt-2 space-y-1">
        <li><span className="font-medium">Location-based:</span> Reflects the average emissions intensity of grids where energy consumption occurs</li>
        <li><span className="font-medium">Market-based:</span> Reflects emissions from electricity that companies have purposefully chosen (or not)</li>
      </ul>
    </div>
  </div>
);

// Scope 3 Details content
export const Scope3Details: React.FC = () => (
  <div>
    <p>Scope 3 emissions are all indirect emissions (not included in scope 2) that occur in the value chain of the reporting company, including both upstream and downstream emissions.</p>
    <div className="mt-4">
      <h4 className="font-medium">Categories:</h4>
      <p>The GHG Protocol divides Scope 3 emissions into 15 distinct categories, of which 8 are most material to our operations and shown in the chart.</p>
    </div>
  </div>
);
