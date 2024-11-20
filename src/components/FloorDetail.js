import React from 'react';


function FloorDetail({ floor, onClose, onClear, onGroupSelect }) {
  const getGroupColor = (score) => {
    if (score >= 60) return 'rgba(76, 175, 80, 0.3)';
    if (score >= 40) return 'rgba(255, 193, 7, 0.3)';
    return 'rgba(244, 67, 54, 0.3)';
  };

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#1a1a1a',
      padding: '20px',
      borderRadius: '8px',
      width: '60%',
      maxHeight: '70vh',
      overflow: 'auto',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          color: '#f5e6d3',
          margin: 0,
          fontSize: '1.2em'
        }}>
          Floor {floor.floor_id} ({floor.groups.length} groups)
          {floor.groups.length > 1 && (
            <span style={{
              marginLeft: '10px',
              fontSize: '0.8em',
              opacity: 0.8
            }}>
              Avg. Collaboration: {floor.collaborationScore}
            </span>
          )}
        </h2>
        <div>
          {floor.groups.length > 0 && (
            <button
              onClick={() => onClear(floor.floor_id)}
              style={{
                background: 'rgba(244, 67, 54, 0.3)',
                border: 'none',
                color: '#f5e6d3',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px',
                fontSize: '0.8em',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(244, 67, 54, 0.5)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(244, 67, 54, 0.3)'}
            >
              Clear Floor
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#f5e6d3',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8em',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            Back
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '15px',
        padding: '15px 0'
      }}>
        {floor.groups.map((group, index) => (
          <div
            key={`${group.header}-${index}`}
            onClick={() => onGroupSelect(group)}
            style={{
              backgroundColor: getGroupColor(group.avgScore),
              padding: '12px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              ':hover': {
                transform: 'scale(1.02)'
              }
            }}
          >
            <div style={{
              color: '#f5e6d3',
              fontWeight: 'bold',
              marginBottom: '6px',
              fontSize: '1em'
            }}>
              {group.header}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#f5e6d3',
              fontSize: '0.8em',
              opacity: 0.7
            }}>
              <span>People: {group.peopleCount}</span>
              <span>Score: {group.avgScore}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FloorDetail; 