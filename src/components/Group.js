import React from 'react';

const Group = ({ 
  header, 
  peopleCount, 
  avgScore, 
  collaborationScore, 
  isHighlighted,
  isHovered,
  hoveredGroup 
}) => {
  const getGroupColor = (score) => {
    if (score >= 60) return 'rgba(76, 175, 80, 0.3)';
    if (score >= 40) return 'rgba(255, 193, 7, 0.3)';
    return 'rgba(244, 67, 54, 0.3)';
  };

  return (
    <div
      style={{
        backgroundColor: getGroupColor(avgScore),
        padding: '12px',
        margin: '4px',
        borderRadius: '6px',
        display: 'inline-block',
        color: '#f5e6d3',
        boxShadow: isHighlighted || isHovered 
          ? '0 0 0 2px #f5e6d3, 0 2px 4px rgba(0,0,0,0.2)'
          : '0 2px 4px rgba(0,0,0,0.2)',
        minWidth: '120px',
        transition: 'all 0.2s ease-in-out',
        opacity: hoveredGroup && !isHighlighted && !isHovered ? 0.3 : 1
      }}
    >
      <div style={{ fontWeight: 'bold' }}>{header}</div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        fontSize: '0.9em',
        opacity: 0.7
      }}>
        <span>People: {peopleCount}</span>
        <span>Score: {avgScore}</span>
      </div>
      {collaborationScore > 0 && (
        <div style={{ fontSize: '0.9em', opacity: 0.7 }}>
          Collab: {collaborationScore}
        </div>
      )}
    </div>
  );
};

export default Group; 