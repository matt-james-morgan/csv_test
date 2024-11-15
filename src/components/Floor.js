import React from 'react';

function Floor({ id, floorNumber, employees, onDrop, onClick, style, isVerticalView }) {
  console.log(`Floor View in component ${floorNumber}:`, {
    isVerticalView,
    employeeCount: employees?.length,
    employees: employees
  });

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const employeeData = e.dataTransfer.getData('application/json');
      if (!employeeData) {
        console.error('No employee data found in drop event');
        return;
      }

      const employee = JSON.parse(employeeData);
      const nextDesk = employees.length + 1;
      const employeeWithDesk = {
        ...employee,
        desk: nextDesk
      };
      onDrop(employeeWithDesk, parseInt(id, 10));
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = 'rgba(245, 230, 211, 0.1)';
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '';
  };

  const getTeamColor = (team) => {
    const TEAM_COLORS = {
      marketing: 'rgba(255, 205, 210, 0.8)',
      sales: 'rgba(200, 230, 201, 0.8)',
      development: 'rgba(227, 242, 253, 0.8)'
    };
    return TEAM_COLORS[team] || 'rgba(189, 189, 189, 0.8)';
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={onClick}
      style={{
        padding: '20px',
        borderRadius: '8px',
        position: 'relative',
        ...style
      }}
    >
      <div style={{ 
        color: '#f5e6d3', 
        fontSize: isVerticalView ? '1.4em' : '1.2em',
        position: 'absolute',
        top: '10px',
        left: '20px',
        zIndex: 1,
        fontWeight: isVerticalView ? 'bold' : 'normal'
      }}>
        Floor {floorNumber} {isVerticalView && `(${employees.length} employees)`}
      </div>
      
      {isVerticalView ? (
        // Vertical view - list of employee names
        <div style={{
          marginTop: '50px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {employees.length > 0 ? (
            employees.map((employee, index) => (
              <div
                key={`${employee.name}-${index}`}
                style={{
                  padding: '10px',
                  backgroundColor: getTeamColor(employee.team),
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{
                  color: '#1a1a1a',
                  fontWeight: 'bold',
                  fontSize: '1em'
                }}>
                  {employee.name}
                </div>
                <div style={{
                  color: '#333',
                  fontSize: '0.9em'
                }}>
                  {employee.team}
                </div>
              </div>
            ))
          ) : (
            <div style={{
              color: '#f5e6d3',
              textAlign: 'center',
              opacity: 0.7,
              marginTop: '20px'
            }}>
              No employees assigned to this floor
            </div>
          )}
        </div>
      ) : (
        // Regular view - simple box
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {employees.length > 0 && (
            <div style={{
              color: '#f5e6d3',
              fontSize: '0.9em',
              opacity: 0.7
            }}>
              {employees.length} employees
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Floor; 