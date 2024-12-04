import React, { useState } from 'react';
import GroupModal from './GroupModal';
import Group from './Group';
import '../styles/CustomScrollbar.css';

const getDominantTeamColor = (groups) => {
  if (!groups || groups.length === 0) return "#1a1a1a";

  const typeCounts = groups.reduce((acc, group) => {
    acc[group.type] = (acc[group.type] || 0) + 1;
    return acc;
  }, {});

  const dominantType = Object.entries(typeCounts).sort(
    ([, a], [, b]) => b - a
  )[0][0];

  const GROUP_COLORS = {
    project: "rgba(255, 205, 210, 0.15)", // Light red
    department: "rgba(200, 230, 201, 0.15)", // Light green
    team: "rgba(227, 242, 253, 0.15)", // Light blue
  };

  return GROUP_COLORS[dominantType] || "#1a1a1a";
};

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
  onGroupDelete,
  isZoomedOut,
  onFloorDragStart,
  onFloorDrop,
  index
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const getCollabMarkerColor = (score) => {
    if (score > 10) return '#4CAF50';  // Green
    if (score >= 5) return '#FFC107';   // Yellow
    return '#F44336';                   // Red
  };

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

  const handleFloorDragStart = (e) => {
    if (!isZoomedOut) return;
    e.dataTransfer.setData('text/plain', index.toString());
    onFloorDragStart(id);
  };

  const handleFloorDrop = (e) => {
    if (!isZoomedOut) {
      handleDrop(e);
      return;
    }
    
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    onFloorDrop(fromIndex, index);
  };

  return (
    <div
      draggable={isZoomedOut}
      onDragStart={handleFloorDragStart}
      onDrop={handleFloorDrop}
      onDragOver={(e) => {
        e.preventDefault();
        if (isZoomedOut) {
          e.currentTarget.style.borderTop = '2px solid #f5e6d3';
        }
      }}
      onDragLeave={(e) => {
        if (isZoomedOut) {
          e.currentTarget.style.borderTop = 'none';
        }
      }}
      onDragEnd={(e) => {
        if (isZoomedOut) {
          e.currentTarget.style.borderTop = 'none';
        }
      }}
      style={{
        padding: '20px',
        borderRadius: '8px',
        position: 'relative',
        cursor: isZoomedOut ? 'grab' : 'pointer',
        minHeight: isZoomedOut ? 'auto' : '240px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: getDominantTeamColor(groups),
        ...style,
        opacity: 1,
      }}
    >
      <div 
        onClick={() => isZoomedOut && setIsExpanded(!isExpanded)}
        style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          cursor: isZoomedOut ? 'pointer' : 'default'
        }}
      >
        <div style={{ 
          color: '#f5e6d3', 
          fontSize: '1.2em',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          Floor {floorNumber} ({groups.length} groups)
          {groups.length > 0 && (
            <>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getCollabMarkerColor(collaborationScore),
                display: 'inline-block'
              }} />
              <span style={{
                fontSize: '0.9em',
                opacity: 0.8
              }}>
                Avg. Collaboration: {collaborationScore}
              </span>
            </>
          )}
          {isZoomedOut && (
            <span style={{ marginLeft: '10px', fontSize: '0.8em' }}>
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
        </div>
        
        {groups.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear(id);
            }}
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
        display: isZoomedOut && !isExpanded ? 'none' : 'flex',
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
            isZoomedOut={isZoomedOut}
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