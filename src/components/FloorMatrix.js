import React from 'react';

function FloorMatrix({ floorData, onClose, calculateGroupCollaborationScore }) {
  const calculateFloorCollabScore = (floor1, floor2) => {
    if (!floor1?.groups.length || !floor2?.groups.length) return 0;

    let totalScore = 0;
    let count = 0;

    floor1.groups.forEach(group1 => {
      floor2.groups.forEach(group2 => {
        const score = calculateGroupCollaborationScore(group1, group2);
        totalScore += score;
        count++;
      });
    });

    return count > 0 ? Number((totalScore / count).toFixed(2)) : 0;
  };

  const getScoreColor = (score) => {
    if (score > 10) return 'rgba(76, 175, 80, 0.3)';  // Green
    if (score >= 5) return 'rgba(255, 193, 7, 0.3)';   // Yellow
    return 'rgba(244, 67, 54, 0.3)';                   // Red
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#1a1a1a',
      padding: '30px',
      borderRadius: '12px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflow: 'auto',
      zIndex: 10,
      boxShadow: '0 0 20px rgba(0,0,0,0.5)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#f5e6d3', margin: 0 }}>Floor Collaboration Matrix</h2>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#f5e6d3',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          borderCollapse: 'separate',
          borderSpacing: '4px',
          color: '#f5e6d3'
        }}>
          <thead>
            <tr>
              <th style={{ padding: '10px' }}>Floor</th>
              {floorData.map(floor => (
                <th key={floor.floor_id} style={{ padding: '10px' }}>
                  Floor {floor.floor_id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {floorData.map(floor1 => (
              <tr key={floor1.floor_id}>
                <th style={{ padding: '10px' }}>Floor {floor1.floor_id}</th>
                {floorData.map(floor2 => (
                  <td
                    key={`${floor1.floor_id}-${floor2.floor_id}`}
                    style={{
                      padding: '15px',
                      textAlign: 'center',
                      backgroundColor: floor1 === floor2 ? 'transparent' : 
                        getScoreColor(calculateFloorCollabScore(floor1, floor2)),
                      borderRadius: '4px'
                    }}
                  >
                    {floor1 === floor2 ? '-' : calculateFloorCollabScore(floor1, floor2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FloorMatrix; 