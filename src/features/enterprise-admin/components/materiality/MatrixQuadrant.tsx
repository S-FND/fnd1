
import React from 'react';

interface MatrixQuadrantProps {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
  label: string;
  className: string;
}

const MatrixQuadrant: React.FC<MatrixQuadrantProps> = ({ 
  x1, 
  y1, 
  x2, 
  y2, 
  label, 
  className 
}) => (
  <div 
    style={{ 
      position: 'absolute', 
      left: x1, 
      top: y1, 
      width: `calc(${x2} - ${x1})`, 
      height: `calc(${y2} - ${y1})`,
      padding: '10px',
    }}
    className={className}
  >
    <span className="text-xs font-medium">{label}</span>
  </div>
);

export default MatrixQuadrant;
