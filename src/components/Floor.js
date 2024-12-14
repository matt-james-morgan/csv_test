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
  index,
  opacity = 1,
  floorCollabScores = {},
  floorData = [],
  onFloorHover,
  isHighlightedFloor,
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
      console.log('Drop event triggered on Floor');
      const groupData = e.dataTransfer.getData('application/json');
      console.log('Group data from drop:', groupData);
      
      if (!groupData) {
        console.error('No group data found in drop event');
        return;
      }

      const group = JSON.parse(groupData);
      console.log('Parsed group data:', group);
      console.log('Calling onDrop with:', { group, id });
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
    e.preventDefault();
    
    try {
      // Check for group data first
      const groupData = e.dataTransfer.getData('application/json');
      if (groupData) {
        console.log('Group drop detected');
        handleDrop(e);
        return;
      }

      // If no group data, check for floor index
      const floorIndex = e.dataTransfer.getData('text/plain');
      if (floorIndex && isZoomedOut) {
        console.log('Floor reorder detected');
        const fromIndex = parseInt(floorIndex);
        onFloorDrop(fromIndex, index);
        return;
      }
    } catch (error) {
      console.error('Error in handleFloorDrop:', error);
    }
  };

  const getScoreColor = (score) => {
    if (score > 10) return '#4CAF50';  // Green
    if (score >= 5) return '#FFC107';   // Yellow
    return '#F44336';                   // Red
  };

  const getGroupColor = (score) => {
    if (score >= 60) return 'rgba(76, 175, 80, 0.3)';  // Green
    if (score >= 40) return 'rgba(255, 193, 7, 0.3)';  // Yellow
    return 'rgba(244, 67, 54, 0.3)';                   // Red
  };

  return (
    <div
      draggable={isZoomedOut}
      onDragStart={handleFloorDragStart}
      onDrop={handleFloorDrop}
      onDragOver={(e) => e.preventDefault()}
      onMouseEnter={() => isZoomedOut && onFloorHover(id)}
      onMouseLeave={() => isZoomedOut && onFloorHover(null)}
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
        opacity,
        transition: 'all 0.3s ease',
        border: isHighlightedFloor ? '2px solid #FFFDD0' : 'none',
        boxShadow: isHighlightedFloor ? '0 0 15px rgba(255, 253, 208, 0.5)' : 'none',
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
          Floor {floorNumber} 
          {!isZoomedOut && !isExpanded && (
        <>
         {groups.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderLeft: '1px solid rgba(245, 230, 211, 0.2)',
            paddingLeft: '20px',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: getCollabMarkerColor(collaborationScore),
              display: 'inline-block'
            }} />
            <span>
              Avg. Collaboration: {collaborationScore}
            </span>
          </div>
        )}
        </>
      )}
          {groups.length > 0 && isZoomedOut && groups.map((group) => {
            return (
              <span 
                key={group.header} 
                style={{
                  fontSize: '0.8em', 
                  backgroundColor: getGroupColor(group.avgScore),
                  padding: '4px 8px', 
                  borderRadius: '25%',
                  border: isCollaborator(group) ? '2px solid #FFFDD0' : 'none',
                  transform: isCollaborator(group) ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                }}
              >
                {group.header.split(' ')[1]} {/* Just show the number */}
              </span>
            );
          })}
        </div>
        
          {isZoomedOut && (
            <span style={{ marginLeft: '10px', fontSize: '0.8em' , alignSelf: 'flex-end', color: '#f5e6d3'}}>
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
        
        
      </div>
      

      {isZoomedOut && isExpanded && (
        <div style={{
          marginTop: '10px',
          padding: '15px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '4px',
          color: '#f5e6d3',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '20px',
          fontSize: '0.9em',
        }}>
          {groups.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRight: '1px solid rgba(245, 230, 211, 0.2)',
              paddingRight: '20px',
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getCollabMarkerColor(collaborationScore),
                display: 'inline-block'
              }} />
              <span>
                Avg. Collaboration: {collaborationScore}
              </span>
            </div>
          )}
          
          {index > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRight: '1px solid rgba(245, 230, 211, 0.2)',
              paddingRight: '20px',
            }}>
              <span style={{ 
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getScoreColor(floorCollabScores[`${floorData[index-1].floor_id}-${id}`] || 0),
              }} />
              <span>
                Floor above ({floorData[index-1].floor_id}): {
                  floorCollabScores[`${floorData[index-1].floor_id}-${id}`] || 0
                }
              </span>
            </div>
          )}
          
          {index < floorData.length - 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRight: groups.length > 0 ? '1px solid rgba(245, 230, 211, 0.2)' : 'none',
              paddingRight: '20px',
            }}>
              <span style={{ 
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getScoreColor(floorCollabScores[`${id}-${floorData[index+1].floor_id}`] || 0),
              }} />
              <span>
                Floor below ({floorData[index+1].floor_id}): {
                  floorCollabScores[`${id}-${floorData[index+1].floor_id}`] || 0
                }
              </span>
            </div>
          )}

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
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9em',
                transition: 'background-color 0.2s',
                marginLeft: 'auto',
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(244, 67, 54, 0.5)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(244, 67, 54, 0.3)'}
            >
              Clear Floor
            </button>
          )}
        </div>
      )}

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