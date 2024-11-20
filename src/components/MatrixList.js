import '../styles/MatrixList.css';
import { useState } from 'react';
import GroupModal from './GroupModal';

function MatrixList({ matrixData }) {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const getGroupColor = (score) => {
    if (score >= 60) return 'rgba(76, 175, 80, 0.3)';
    if (score >= 40) return 'rgba(255, 193, 7, 0.3)';
    return 'rgba(244, 67, 54, 0.3)';
  };

  return (
    <>
      <div className="matrix-list-container" style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100% - 40px)',
        backgroundColor: '#1a1a1a',
        width: '300px',
        position: 'relative',
        margin: '20px 0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#1a1a1a',
          padding: '20px 15px',
          borderBottom: '1px solid rgba(245, 230, 211, 0.1)',
          zIndex: 2,
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}>
          <h2 style={{
            color: '#f5e6d3',
            margin: 0,
            fontSize: '1.2em'
          }}>
            Teams
          </h2>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '15px',
          overflowY: 'auto',
          height: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          {matrixData.map((team) => (
            <div
              key={team.header}
              style={{
                backgroundColor: getGroupColor(team.avgScore),
                padding: '12px',
                borderRadius: '6px',
                cursor: 'grab'
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify(team));
              }}
              onClick={() => setSelectedGroup(team)}
            >
              <div style={{
                color: '#f5e6d3',
                fontWeight: 'bold',
                marginBottom: '4px'
              }}>
                {team.header}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#f5e6d3',
                fontSize: '0.9em',
                opacity: 0.7
              }}>
                <span>People: {team.peopleCount}</span>
                <span>Score: {team.avgScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedGroup && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              zIndex: 1000
            }}
            onClick={() => setSelectedGroup(null)}
          />
          <GroupModal
            group={selectedGroup}
            onClose={() => setSelectedGroup(null)}
          />
        </>
      )}
    </>
  );
}

export default MatrixList; 