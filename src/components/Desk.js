import React from 'react';

const TEAM_COLORS = {
  marketing: '#ffcdd2',  // Light red
  sales: '#c8e6c9',     // Light green
  development: '#e3f2fd' // Light blue
};

function Desk({ id, employees, onDrop, onClick }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedEmployee = JSON.parse(e.dataTransfer.getData('employee'));
    onDrop(id, droppedEmployee);
  };

  return (
    <div
      className="desk"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => onClick(id)}
      style={{
        border: '1px solid #333',
        padding: '8px',
        minHeight: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        backgroundColor: '#1a1a1a',
        color: 'white'
      }}
    >
      <div className="desk-id" style={{ 
        color: '#f5e6d3',  // Light cream color
        fontWeight: '500'  // Slightly bolder
      }}>
        {id}
      </div>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '4px',
        justifyContent: 'center'
      }}>
        {employees && employees.map((employee, index) => (
          <div 
            key={`${employee.name}-${index}`}
            className="employee-card"
            style={{
              backgroundColor: TEAM_COLORS[employee.team] || TEAM_COLORS.development,
              padding: '4px 8px',
              borderRadius: '3px',
              fontSize: '0.8em',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap',
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

export default Desk; 