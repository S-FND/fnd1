
import React from 'react';

const testimonials = [
  {
    id: 1,
    content: "Fandoro has transformed how we manage our sustainability initiatives. The platform is intuitive, comprehensive, and has saved us countless hours in reporting.",
  },
  {
    id: 2,
    content: "Fandoro has transformed how we manage our sustainability initiatives. The platform is intuitive, comprehensive, and has saved us countless hours in reporting.",
  },
  {
    id: 3,
    content: "Fandoro has transformed how we manage our sustainability initiatives. The platform is intuitive, comprehensive, and has saved us countless hours in reporting.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stories from companies transforming their sustainability journey with Fandoro
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="border rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-muted"></div>
                <div>
                  <div className="font-medium">Customer Name</div>
                  <div className="text-sm text-muted-foreground">Position, Company</div>
                </div>
              </div>
              <p className="text-muted-foreground">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
