import React from 'react';

export const StatCard = ({ icon: Icon, value, label, color = '#3a86ff' }) => {
  return (
    <div className="card stat-card">
      <div 
        className="stat-icon" 
        style={{ 
          background: `${color}20`, 
          color: color, 
          border: `1px solid ${color}40` 
        }}
      >
        <Icon size={24} />
      </div>
      <div>
        <div className="stat-val">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};
