
import React from 'react';

const steps = [
  {
    step: 1,
    title: "Connect Data Sources",
    description: "Easily integrate with your existing business systems to import data"
  },
  {
    step: 2,
    title: "Analyze & Monitor",
    description: "Track progress and receive AI-powered recommendations for improvement"
  },
  {
    step: 3,
    title: "Report & Comply",
    description: "Generate ready-to-submit reports that align with global frameworks"
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple process to transform your sustainability management
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mb-6">
                {item.step}
              </div>
              <h3 className="text-xl font-medium mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
