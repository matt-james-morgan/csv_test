import React, { useEffect } from 'react';

function DeskView({ floorName, employees, onClose }) {
  useEffect(() => {
    console.log(employees, "employees");
  });
  return (
    <div className="desk-view-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div className="desk-view-content" style={{
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        padding: '2rem',
        width: '90%',
        maxWidth: '1200px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 style={{ color: '#f5e6d3' }}>{floorName} Floor Plan</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#f5e6d3',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
        
        <div className="desk-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {employees.map((employee) => (
            <div 
              key={employee.id}
              className="desk-card"
              style={{
                backgroundColor: '#333',
                borderRadius: '6px',
                padding: '1rem',
                border: `2px solid ${getTeamColor(employee.team)}`
              }}
            >
              <div style={{ color: '#f5e6d3', marginBottom: '0.5rem' }}>
                Desk #{employee.desk}
              </div>
              <div style={{ color: '#fff', fontWeight: 'bold' }}>
                {employee.name}
              </div>
              <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
                {employee.team}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to get team colors (matching your existing color scheme)
const getTeamColor = (team) => {
  const TEAM_COLORS = {
    marketing: '#ffcdcd',  // Solid version of the marketing color
    sales: '#c8e6c9',     // Solid version of the sales color
    development: '#e3f2fd' // Solid version of the development color
  };
  return TEAM_COLORS[team] || '#666';
};

export default DeskView;
