import React from 'react';

const TEAM_COLORS = {
  marketing: '#ffcdd2',  // Light red
  sales: '#c8e6c9',     // Light green
  development: '#e3f2fd' // Light blue
};

function Floor({ id, employees, onDrop, onClick, style }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedEmployee = JSON.parse(e.dataTransfer.getData('employee'));
    onDrop(id, droppedEmployee);
  };

  return (
    <div
      className="floor"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => onClick(id)}
      style={{
        border: '1px solid #333',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundColor: '#1a1a1a',
        color: 'white',
        borderRadius: '8px',
        height: '100%',
        boxSizing: 'border-box',
        ...style
      }}
    >
      <div style={{ 
        color: '#f5e6d3',
        fontWeight: '500',
        fontSize: '1.4em',
        textAlign: 'center'
      }}>
        Floor {id}
      </div>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '10px',
        flex: 1,
        alignContent: 'flex-start'
      }}>
        {employees && employees.map((employee, index) => (
          <div 
            key={`${employee.name}-${index}`}
            className="employee-card"
            style={{
              backgroundColor: TEAM_COLORS[employee.team] || TEAM_COLORS.development,
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '0.9em',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              color: '#000'
            }}
          >
            {employee.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Floor; 