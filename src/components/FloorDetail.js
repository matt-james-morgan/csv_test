import React from 'react';
import '../styles/CustomScrollbar.css';

function FloorDetail({ floor, onClose, onClear, onGroupSelect }) {
  const getGroupColor = (score) => {
    if (score >= 60) return 'rgba(76, 175, 80, 0.3)';
    if (score >= 40) return 'rgba(255, 193, 7, 0.3)';
    return 'rgba(244, 67, 54, 0.3)';
  };

  const getCollabMarkerColor = (score) => {
    if (score > 10) return '#4CAF50';  // Green
    if (score >= 5) return '#FFC107';   // Yellow
    return '#F44336';                   // Red
  };

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: '#1a1a1a',
      padding: '30px',
      borderRadius: '12px',
      width: '90%',
      height: '70vh',
      overflow: 'auto',
      overflowX: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24)',
      zIndex: 1,
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
          fontSize: '1.4em',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          Floor {floor.floor_id} Details - {floor.groups.length} Groups
          {floor.groups.length > 1 && (
            <>
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: getCollabMarkerColor(floor.collaborationScore),
                display: 'inline-block'
              }} />
              <span style={{
                fontSize: '0.8em',
                opacity: 0.8
              }}>
                Floor Collaboration Score: {floor.collaborationScore}
              </span>
            </>
          )}
        </h2>
        <div>
          <button onClick={onClose} style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#f5e6d3',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9em'
          }}>Close</button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '25px',
        padding: '20px 0'
      }}>
        {floor.groups.map((group, index) => (
          <div
            key={`${group.header}-${index}`}
            style={{
              backgroundColor: getGroupColor(group.avgScore),
              padding: '25px',
              borderRadius: '12px',
              color: '#f5e6d3'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.3em' }}>{group.header}</h3>
              <span style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.9em'
              }}>
                {group.type || 'Unknown Type'}
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              fontSize: '0.95em'
            }}>
              <div>
                <strong>People Count:</strong>
                <div>{group.peopleCount}</div>
              </div>
              
              <div>
                <strong>Collaboration Score:</strong>
                <div>{group.collaborationScore}</div>
              </div>

              <div>
                <strong>Average Score:</strong>
                <div>{group.avgScore}</div>
              </div>

              <div>
                <strong>Scores Above 10:</strong>
                <div>{group.scoresAbove10}</div>
              </div>

              {group.topCollaborators && group.topCollaborators.length > 0 && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Top Collaborators:</strong>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    marginTop: '8px'
                  }}>
                    {group.topCollaborators.map((collab, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '4px 8px',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: '4px'
                      }}>
                        <span>{collab.group.header}</span>
                        <span>Score: {collab.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <strong>Traffic Metrics:</strong>
                <div>Internal: {(group.internalTraffic || 0).toFixed(2)}</div>
                <div>Organizational: {(group.orgTraffic || 0).toFixed(2)}</div>
                <div>External: {(group.externalTraffic || 0).toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FloorDetail; 