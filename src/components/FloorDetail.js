import React from 'react';
import '../styles/CustomScrollbar.css';


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
      padding: '30px',
      borderRadius: '12px',
      width: '80%',
      height: '80vh',
      overflow: 'auto',
      overflowX: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24)',
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid rgba(245, 230, 211, 0.1)',
        paddingBottom: '20px'
      }}>
        <h2 style={{ 
          color: '#f5e6d3',
          margin: 0,
          fontSize: '1.4em'
        }}>
          Floor {floor.floor_id} ({floor.groups.length} groups)
          {floor.groups.length > 1 && (
            <span style={{
              marginLeft: '15px',
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
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                marginRight: '15px',
                fontSize: '0.9em',
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
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9em',
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        padding: '20px 0'
      }}>
        {floor.groups.map((group, index) => (
          <div
            key={`${group.header}-${index}`}
            onClick={() => onGroupSelect(group)}
            style={{
              backgroundColor: getGroupColor(group.avgScore),
              padding: '20px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <div style={{
              color: '#f5e6d3',
              fontWeight: 'bold',
              marginBottom: '10px',
              fontSize: '1.1em'
            }}>
              {group.header}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#f5e6d3',
              fontSize: '0.9em',
              opacity: 0.7
            }}>
              <span>People: {group.peopleCount}</span>
              <span>Score: {group.avgScore}</span>
              <span>Collaboration: {group.collaborationScore}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FloorDetail; 