import React from 'react';

function FloorDetail({ floor, onClose, onGroupClick }) {
  if (!floor) return null;

  const getGroupColor = (type) => {
    const GROUP_COLORS = {
      project: 'rgba(255, 205, 210, 0.8)',
      department: 'rgba(200, 230, 201, 0.8)',
      team: 'rgba(227, 242, 253, 0.8)'
    };
    return GROUP_COLORS[type] || 'rgba(189, 189, 189, 0.8)';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#2a2a2a',
        borderRadius: '12px',
        padding: '30px',
        width: '80%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#f5e6d3',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>

        <h2 style={{ color: '#f5e6d3', marginBottom: '20px' }}>
          Floor {floor.floor_number} Details
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '15px',
          marginTop: '20px'
        }}>
          {floor.groups && floor.groups.length > 0 ? (
            floor.groups.map((group, index) => (
              <div
                key={`${group.name}-${index}`}
                onClick={() => onGroupClick(group)}
                style={{
                  padding: '15px',
                  backgroundColor: getGroupColor(group.type),
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  ':hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <div style={{
                  color: '#1a1a1a',
                  fontWeight: 'bold',
                  fontSize: '1.1em',
                  marginBottom: '5px'
                }}>
                  {group.name}
                </div>
                <div style={{
                  color: '#333',
                  fontSize: '0.9em'
                }}>
                  {group.type}
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: '#f5e6d3', opacity: 0.7 }}>
              No groups assigned to this floor
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FloorDetail; 