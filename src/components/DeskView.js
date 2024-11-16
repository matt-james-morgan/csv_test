import React, { useEffect } from 'react';

function DeskView({ floorName, employees, onClose }) {
  console.log('DeskView employees:', employees);

  const GRID_SIZE = 3;
  const TOTAL_DESKS = GRID_SIZE * GRID_SIZE;

  const getTeamColor = (team) => {
    const TEAM_COLORS = {
      marketing: 'rgba(255, 205, 210, 0.8)',
      sales: 'rgba(200, 230, 201, 0.8)',
      development: 'rgba(227, 242, 253, 0.8)'
    };
    return TEAM_COLORS[team] || 'rgba(189, 189, 189, 0.8)';
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#2a2a2a',
      padding: '30px',
      borderRadius: '12px',
      zIndex: 1000,
      width: '90%',
      maxWidth: '800px',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid rgba(245, 230, 211, 0.1)',
        paddingBottom: '15px'
      }}>
        <h2 style={{ color: '#f5e6d3', margin: 0 }}>{floorName} Desk Layout</h2>
        <button onClick={onClose} style={{
          background: 'none',
          border: 'none',
          color: '#f5e6d3',
          cursor: 'pointer',
          fontSize: '1.5em',
          padding: '5px'
        }}>×</button>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gap: '15px',
        padding: '20px'
      }}>
        {Array.from({ length: TOTAL_DESKS }).map((_, index) => {
          const deskNumber = index + 1;
          const deskEmployees = employees.filter(emp => emp.desk === deskNumber);
          
          return (
            <div
              key={`desk-${deskNumber}`}
              style={{
                aspectRatio: '1',
                backgroundColor: '#333',
                borderRadius: '8px',
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'relative',
                border: '1px solid rgba(245, 230, 211, 0.1)',
                overflow: 'auto'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                backgroundColor: '#1a1a1a',
                color: '#f5e6d3',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.8em',
                zIndex: 1
              }}>
                {deskNumber}
              </div>
              
              <div style={{
                marginTop: '25px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                overflow: 'auto'
              }}>
                {deskEmployees.length > 0 ? (
                  deskEmployees.map((employee, empIndex) => (
                    <div
                      key={`${employee.name}-${empIndex}`}
                      style={{
                        backgroundColor: getTeamColor(employee.team),
                        borderRadius: '4px',
                        padding: '8px',
                        minHeight: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <div style={{
                        color: '#1a1a1a',
                        fontWeight: 'bold',
                        fontSize: '0.9em',
                        wordBreak: 'break-word'
                      }}>
                        {employee.name}
                      </div>
                      <div style={{
                        color: '#333',
                        fontSize: '0.8em'
                      }}>
                        {employee.team}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    color: '#f5e6d3',
                    opacity: 0.5,
                    fontSize: '0.9em',
                    textAlign: 'center',
                    marginTop: '20px'
                  }}>
                    Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DeskView;
