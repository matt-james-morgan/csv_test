import React, { useState } from 'react';
import GroupModal from './GroupModal';

function Floor({ 
  id, 
  floorNumber, 
  groups = [], 
  collaborationScore,
  onDrop, 
  onClear,
  onShowDetail,
  style 
}) {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const groupData = e.dataTransfer.getData('application/json');
      if (!groupData) {
        console.error('No group data found in drop event');
        return;
      }

      const group = JSON.parse(groupData);
      onDrop(group, id);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          console.log('Enter pressed on floor:', id);
          onShowDetail(id);
        }
      }}
      tabIndex={0}
      style={{
        padding: '20px',
        borderRadius: '8px',
        position: 'relative',
        cursor: 'pointer',
        minHeight: '120px',
        outline: 'none',
        ...style
      }}
    >
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ 
          color: '#f5e6d3', 
          fontSize: '1.2em',
        }}>
          Floor {floorNumber} ({groups.length} groups)
          {groups.length > 1 && (
            <span style={{
              marginLeft: '10px',
              fontSize: '0.9em',
              opacity: 0.8
            }}>
              Avg. Collaboration: {collaborationScore}
            </span>
          )}
        </div>
        
        {groups.length > 0 && (
          <button
            onClick={() => onClear(id)}
            style={{
              background: 'rgba(244, 67, 54, 0.3)',
              border: 'none',
              color: '#f5e6d3',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8em',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(244, 67, 54, 0.5)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(244, 67, 54, 0.3)'}
          >
            Clear Floor
          </button>
        )}
      </div>

      {selectedGroup && (
        <GroupModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </div>
  );
}

export default Floor; 