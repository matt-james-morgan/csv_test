import React, { useState } from 'react';
import GroupModal from './GroupModal';
import Group from './Group';
import '../styles/CustomScrollbar.css';

function Floor({ 
  id, 
  floorNumber, 
  groups = [], 
  collaborationScore,
  onDrop, 
  onClear,
  hoveredGroup,
  topCollaborators = [],
  style,
  onGroupDelete
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

  const isCollaborator = (group) => {
    if (!hoveredGroup || !topCollaborators) return false;
    return topCollaborators.some(collaborator => collaborator.header === group.header);
  };

  

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        padding: '20px',
        borderRadius: '8px',
        position: 'relative',
        cursor: 'pointer',
        minHeight: '240px',
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
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

      <div style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        flexGrow: 1,
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        gap: '8px',
        padding: '4px',
      }}>
        {groups.map((group) => (
          <Group 
            key={group.header} 
            {...group} 
            isHighlighted={isCollaborator(group)}
            isHovered={hoveredGroup?.header === group.header}
            onDelete={() => onGroupDelete(group.header)}
          />
        ))}
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