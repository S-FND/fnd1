
import React from 'react';

const TrustedBySection = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-2xl font-medium mb-10">Trusted by leading companies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-12 w-32 bg-muted/50 rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground font-medium">Company {i}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
