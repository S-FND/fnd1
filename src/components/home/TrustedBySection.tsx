
import React from 'react';

const TrustedBySection = () => {
  const clients = [
    'Eggoz',
    'Snitch', 
    'Miko',
    'Celcius Logistics',
    'Gradright',
    'ICanHeal',
    'Dr. Reddy\'s Laboratories',
    'IvyCap Ventures',
    'NabVentures',
    'Mastek Foundation'
  ];

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-2xl font-medium mb-10">Trusted by leading companies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
          {clients.map((client, index) => (
            <div key={index} className="h-12 min-w-32 bg-muted/50 rounded-lg flex items-center justify-center px-4">
              <span className="text-muted-foreground font-medium text-sm text-center">{client}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
